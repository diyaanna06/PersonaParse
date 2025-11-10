import os,json,fitz,shutil,warnings,re,unicodedata
from flask import Flask, request, jsonify
from flask_cors import CORS  
from sentence_transformers import SentenceTransformer, util

warnings.filterwarnings("ignore", category=FutureWarning)
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000","https://personaparse.vercel.app" ])
input_folder = "input"
output_folder= "output"
os.makedirs(input_folder, exist_ok=True)
os.makedirs(output_folder,exist_ok=True)

def clean_text(text: str) -> str:
    if not text:
        return ""
    text = unicodedata.normalize("NFKD", text)
    text = re.sub(r"http\S+|www\S+", "", text)
    text = re.sub(r"[\u2022•◦▪●]|Page\s*\d+|\d+\s*/\s*\d+", "", text)
    text = re.sub(r"[\r\n\t]+", " ", text)
    text = "".join(ch for ch in text if unicodedata.category(ch)[0] != "C")
    text = re.sub(r"[^a-zA-Z0-9.,;:!?()'\"/\-\s]", "", text)
    text = re.sub(r"\s+([.,;:!?])", r"\1", text)
    text = re.sub(r"\s{2,}", " ", text).strip()
    return text

def build_query(role: str, task: str) -> str:
    role = role.strip()
    task = task.strip()
    query = f"Identify the content in the documents that is most relevant for a {role} to accomplish the task: {task}."
    return query

def clear_in_out_folder():
    for f in os.listdir(input_folder):
        os.remove(os.path.join(input_folder, f))
    for f in os.listdir(output_folder):
        os.remove(os.path.join(output_folder, f))

def copy_predefined_pdfs(selected_set):
    predefined_folder = os.path.join("predefined", selected_set)
    if not os.path.exists(predefined_folder):
        return None, f"Predefined set '{selected_set}' not found"
    saved_files = []
    for file_name in os.listdir(predefined_folder):
        file_path = os.path.join(predefined_folder, file_name)
        if os.path.isfile(file_path) and file_name.endswith(".pdf"):
            shutil.copy(file_path, os.path.join(input_folder, file_name))
            saved_files.append(file_name)
    return saved_files, None

def save_uploaded_files(uploaded_files):
    saved_files = []
    for file in uploaded_files:
        if file and file.filename.endswith(".pdf"):
            filepath = os.path.join(input_folder, file.filename)
            file.save(filepath)
            saved_files.append(file.filename)
    return saved_files

def save_input_json(saved_files, job_role, job_description):
    documents = [{"filename": f, "title": f.rsplit(".", 1)[0]} for f in saved_files]
    json_data = {
        "documents": documents,
        "persona": {"role": job_role},
        "job_to_be_done": {"task": job_description}
    }
    json_path = os.path.join(input_folder, "input.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(json_data, f, indent=4)
    return json_path

@app.route("/upload", methods=["POST"])
def upload_files():
    job_role = request.form.get("jobRole")
    job_description = request.form.get("jobDescription")
    selected_set = request.form.get("selectedSet")  
    clear_in_out_folder()
    if selected_set:
        saved_files, error = copy_predefined_pdfs(selected_set)
        if error:
            return jsonify({"error": error}), 404
    else:
        uploaded_files = request.files.getlist("files")
        saved_files = save_uploaded_files(uploaded_files)
    json_path = save_input_json(saved_files, job_role, job_description)
    return jsonify({
        "status": "success",
        "jobRole": job_role,
        "jobDescription": job_description,
        "savedFiles": saved_files,
        "jsonFile": json_path
    })

def load_input(input_path):
    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    role = data.get("persona", {}).get("role", "").lower()
    task = data.get("job_to_be_done", {}).get("task", "")
    return role, task

model = None
def get_model():
    global model
    if model is None:
        model = SentenceTransformer("./all-MiniLM-L6-v2")
    return model

def get_score(txt, kw):
    if not txt.strip():
        return 0.0
    model = get_model()
    txt_emb = model.encode(txt, convert_to_tensor=True)
    kw_emb = model.encode(kw, convert_to_tensor=True)
    semantic_score = float(util.cos_sim(txt_emb, kw_emb)[0].max().item())
    length_factor = min(len(txt.split()) / 200, 1.0)
    final_score = 0.7 * semantic_score + 0.3 * length_factor
    return final_score

def is_heading(blk, txt):
    wc = len(txt.split())
    if wc > 10:
        return False
    for line in blk.get("lines", []):
        for span in line["spans"]:
            if span["size"] > 16 or "bold" in span["font"].lower():
                return True
    return False

def get_blocks(pdf_dir, kw):
    all_blks = []
    for fname in os.listdir(pdf_dir):
        if fname.endswith(".pdf"):
            path = os.path.join(pdf_dir, fname)
            doc = fitz.open(path)
            for pno in range(len(doc)):
                page = doc[pno]
                blocks = page.get_text("dict")["blocks"]
                for blk in blocks:
                    if "lines" not in blk:
                        continue
                    txt = ""
                    for line in blk["lines"]:
                        for span in line["spans"]:
                            txt += span["text"] + " "
                    txt = clean_text(txt.strip())
                    if not txt:
                        continue
                    txt_len = len(txt)
                    if txt_len < 15:  
                        continue
                    sc = get_score(txt, kw)
                    hd = is_heading(blk, txt)
                    if hd:
                        sc *= 1.1
                    all_blks.append({
                        "text": txt,
                        "page": pno + 1,
                        "score": sc,
                        "file": fname,
                        "is_heading": hd
                    })
    return all_blks

def top_headings(blks, n=3, min_score=0.1):
    hd_blks = [b for b in blks if b.get("is_heading") and b["score"] >= min_score]
    hd_blks.sort(key=lambda x: x["score"], reverse=True)
    top = hd_blks[:n]
    return [{
        "document": b["file"],
        "section_title": b["text"],
        "importance_rank": i + 1,
        "page_number": b["page"]
    } for i, b in enumerate(top)]

def top_subsections(blks, n=7, min_score=0.1):
    nh_blks = [b for b in blks if not b.get("is_heading") and b["score"] >= min_score]
    nh_blks.sort(key=lambda x: x["score"], reverse=True)
    top = nh_blks[:n]
    return [{
        "document": b["file"],
        "refined_text": b["text"],
        "page_number": b["page"]
    } for b in top]

def save_output(blks, out_path, docs, role, task):
    blks.sort(key=lambda x: x["score"], reverse=True)
    output = {
    "extracted_sections": top_headings(blks, 3, min_score=0.1),
    "subsection_analysis": top_subsections(blks, 7, min_score=0.1)}
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

@app.route("/process", methods=["POST"])
def process_files():
    in_dir = "./input"
    in_json = "./input/input.json"
    out_json = "./output/output.json"
    role, task = load_input(in_json)
    query_text = build_query(role, task)
    keywords = query_text 
    pdfs = sorted([f for f in os.listdir(in_dir) if f.endswith(".pdf")])
    blocks = get_blocks(in_dir, keywords)
    save_output(blocks, out_json, pdfs, role, task)
    with open(out_json, "r", encoding="utf-8") as f:
        output_data = json.load(f)
    return jsonify(output_data)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))