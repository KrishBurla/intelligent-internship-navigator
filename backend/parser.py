# parser.py

import pdfplumber
import docx

def extract_text_from_file(file_path: str) -> str:
    """
    Extracts raw text from a given file (PDF or DOCX).
    """
    text = ""
    try:
        if file_path.endswith('.pdf'):
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        elif file_path.endswith('.docx'):
            doc = docx.Document(file_path)
            for para in doc.paragraphs:
                text += para.text + "\n"
        else:
            print(f"Unsupported file type: {file_path}")
            return ""
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
        return ""
        
    return text
    