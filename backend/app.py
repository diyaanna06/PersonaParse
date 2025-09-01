import os,json
from flask import Flask, request, jsonify
from flask_cors import CORS   # allow frontend (React) to talk to Flask
import fitz
from sentence_transformers import SentenceTransformer, util
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)
app = Flask(__name__)
CORS(app)  # enables cross-origin requests (important for React <-> Flask)

# folder where PDFs will be stored
input_folder = "input"
output_folder= "output"
os.makedirs(input_folder, exist_ok=True)
os.makedirs(output_folder,exist_ok=True)


model = SentenceTransformer("./all-MiniLM-L6-v2")
@app.route("/upload", methods=["POST"])
def upload_files():
    job_role = request.form.get("jobRole")
    job_description = request.form.get("jobDescription")
    uploaded_files = request.files.getlist("files")

    saved_files = []

    for file in uploaded_files:
        if file and file.filename.endswith(".pdf"):
            filepath = os.path.join(input_folder, file.filename)
            file.save(filepath)
            saved_files.append(file.filename)

    # Build JSON structure
    documents = []
    for fname in saved_files:
        title = fname.rsplit(".", 1)[0]  # remove ".pdf"
        documents.append({
            "filename": fname,
            "title": title
        })

    json_data = {
        "documents": documents,
        "persona": {
            "role": job_role
        },
        "job_to_be_done": {
            "task": job_description
        }
    }

    # Save JSON file into uploads folder
    json_path = os.path.join(input_folder, "input.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(json_data, f, indent=4)

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

def get_score(txt, kw):
    if not txt.strip():
        return 0.0
    txt_emb = model.encode(txt, convert_to_tensor=True)
    kw_emb = model.encode(kw, convert_to_tensor=True)
    scores = util.cos_sim(txt_emb, kw_emb)[0]
    return float(scores.max().item())

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
                    txt = txt.strip()
                    if not txt:
                        continue
                    sc = get_score(txt, kw)
                    hd = is_heading(blk, txt)
                    all_blks.append({
                        "text": txt,
                        "page": pno + 1,
                        "score": sc,
                        "file": fname,
                        "is_heading": hd
                    })
    return all_blks

def top_headings(blks, n=5):
    hd_blks = [b for b in blks if b.get("is_heading")]
    hd_blks.sort(key=lambda x: x["score"], reverse=True)
    top = hd_blks[:n]
    return [{
        "document": b["file"],
        "section_title": b["text"],
        "importance_rank": i + 1,
        "page_number": b["page"]
    } for i, b in enumerate(top)]

def top_subsections(blks, n=5):
    nh_blks = [b for b in blks if not b.get("is_heading")]
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
        "extracted_sections": top_headings(blks, 5),
        "subsection_analysis": top_subsections(blks, 5)
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

@app.route("/process", methods=["POST"])
def process_files():
    in_dir = "./input"
    in_json = "./input/input.json"
    out_json = "./output/output.json"

    # load role + task
    role, task = load_input(in_json)
    keywords = role.split() + task.split()

    # process PDFs
    pdfs = sorted([f for f in os.listdir(in_dir) if f.endswith(".pdf")])
    blocks = get_blocks(in_dir, keywords)
    save_output(blocks, out_json, pdfs, role, task)

    # return the output.json contents
    with open(out_json, "r", encoding="utf-8") as f:
        output_data = json.load(f)

    return jsonify(output_data)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
