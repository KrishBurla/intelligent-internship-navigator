# main.py

import json
from parser import extract_text_from_file
from extractor import (
    extract_email,
    extract_phone,
    extract_name,
    extract_skills_with_spacy,
    extract_education
)

def analyze_resume(file_path: str) -> dict:
    text = extract_text_from_file(file_path)
    if not text:
        return {"error": "Failed to extract text from the file."}
        
    name = extract_name(text)
    email = extract_email(text)
    phone = extract_phone(text)
    skills = extract_skills_with_spacy(text)
    education_orgs = extract_education(text)
    
    resume_data = {
        "name": name,
        "contact": {
            "email": email,
            "phone": phone
        },
        "education": [
            {"university": org, "degree": None, "major": None} for org in education_orgs
        ],
        "skills": skills
    }
    
    return resume_data