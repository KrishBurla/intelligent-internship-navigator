# backend/app.py

from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
import json
import time
import os
from main import analyze_resume # <-- New import

app = Flask(__name__)
CORS(app)

# --- New: Configuration for file uploads ---
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# --- MySQL DATABASE CONFIGURATION ---
db_config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': 'root',
    'database': 'internship_navigator_db'
}

def get_db_connection():
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except mysql.connector.Error as err:
        print(f"Error connecting to MySQL: {err}")
        return None

# --- AUTHENTICATION ENDPOINTS (No changes) ---
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data or not all(k in data for k in ('name', 'email', 'password')):
        return jsonify({"error": "Missing required fields"}), 400
    password_hash = generate_password_hash(data['password'])
    conn = get_db_connection()
    if not conn: return jsonify({"error": "Database connection failed"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute(
            'INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)',
            (data['name'], data['email'], password_hash)
        )
        conn.commit()
    except mysql.connector.IntegrityError:
        return jsonify({"error": "User with this email already exists"}), 409
    finally:
        cursor.close()
        conn.close()
    return jsonify({"message": "User created successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not all(k in data for k in ('email', 'password')):
        return jsonify({"error": "Missing email or password"}), 400
    conn = get_db_connection()
    if not conn: return jsonify({"error": "Database connection failed"}), 500
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT * FROM users WHERE email = %s', (data['email'],))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if user and check_password_hash(user['password_hash'], data['password']):
        token = str(uuid.uuid4())
        return jsonify({
            "message": "Login successful",
            "token": token,
            "name": user['name'],
            "profile_complete": user['profile_complete'],
            "quiz_taken": bool(user['internship_mode'])
        }), 200
    return jsonify({"error": "Invalid credentials"}), 401

# --- ONBOARDING & QUIZ SUBMISSION (No changes) ---
@app.route('/api/onboarding', methods=['POST'])
def complete_onboarding():
    return submit_quiz()

@app.route('/api/quiz/submit', methods=['POST'])
def submit_quiz():
    auth_header = request.headers.get('Authorization')
    if not auth_header: return jsonify({"error": "Authorization token is missing"}), 401
    data = request.get_json()
    user_email = data.pop('email', None)
    if not user_email: return jsonify({"error": "User email is missing"}), 400
    columns, values = [], []
    for key, value in data.items():
        columns.append(f"{key} = %s")
        values.append(", ".join(value) if isinstance(value, list) else value)
    columns.append("profile_complete = TRUE")
    values.append(user_email)
    sql_query = f"UPDATE users SET {', '.join(columns)} WHERE email = %s"
    conn = get_db_connection()
    if not conn: return jsonify({"error": "Database connection failed"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute(sql_query, tuple(values))
        conn.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
    return jsonify({"message": "Profile updated successfully!"}), 200

# --- PROFILE ENDPOINTS (No changes) ---
@app.route('/api/profile', methods=['GET'])
def get_profile():
    auth_header = request.headers.get('Authorization')
    if not auth_header: return jsonify({"error": "Authorization token missing"}), 401
    user_email = request.args.get('email')
    if not user_email: return jsonify({"error": "User email is required"}), 400
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT name, email, skills, highest_qualification, field_of_study, work_experience, work_experience_details, internet_access, languages, internship_mode, commitment, preferred_industries, preferred_tasks, stipend_requirement, stay_away, relocation, special_support, document_readiness, contact_consent FROM users WHERE email = %s', (user_email,))
    profile = cursor.fetchone()
    cursor.close()
    conn.close()
    if profile:
        preference_tags = []
        if profile.get('internship_mode'): preference_tags.append(profile['internship_mode'].replace('_', '-'))
        if profile.get('commitment'): preference_tags.append(profile['commitment'].replace('_', '-'))
        if profile.get('preferred_industries'): preference_tags.extend([tag.strip().replace('_', '-') for tag in profile['preferred_industries'].split(',')])
        if profile.get('preferred_tasks'): preference_tags.extend([tag.strip().replace('_', '-') for tag in profile['preferred_tasks'].split(',')])
        if profile.get('stipend_requirement'): preference_tags.append(profile['stipend_requirement'].replace('_', '-'))
        if profile.get('relocation'): preference_tags.append(profile['relocation'].replace('_', '-'))
        profile['preference_tags'] = ", ".join(filter(None, preference_tags))
        return jsonify(profile), 200
    return jsonify({"error": "User not found"}), 404

@app.route('/api/profile', methods=['PUT'])
def update_profile():
    auth_header = request.headers.get('Authorization')
    if not auth_header: return jsonify({"error": "Authorization token missing"}), 401
    data = request.get_json()
    user_email = data.get('email')
    columns, values = [], []
    for key, value in data.items():
        if key not in ['email', 'preference_tags']:
             columns.append(f"{key} = %s")
             values.append(value)
    if not columns: return jsonify({"message": "No fields to update"}), 200
    values.append(user_email)
    sql_query = f"UPDATE users SET {', '.join(columns)} WHERE email = %s"
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(sql_query, tuple(values))
        conn.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
    return jsonify({"message": "Profile updated successfully"}), 200

# --- NEW: REAL RESUME ANALYSIS ENDPOINT ---
@app.route('/api/resume/upload', methods=['POST'])
def upload_and_analyze_resume():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return jsonify({"error": "Authorization token is missing"}), 401
        
    if 'resume' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
        
    file = request.files['resume']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    if file:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        
        try:
            # Call your actual analysis function
            data = analyze_resume(filepath)
        except Exception as e:
            # Provide more specific error details if in debug mode
            return jsonify({"error": "An error occurred during analysis.", "details": str(e)}), 500
        finally:
            # Ensure the temporary file is always removed
            if os.path.exists(filepath):
                os.remove(filepath)
        
        return jsonify(data)

    return jsonify({"error": "An unexpected error occurred."}), 500

# --- INTERNSHIPS ENDPOINT (No changes) ---
@app.route('/api/internships')
def get_internships():
    auth_header = request.headers.get('Authorization')
    if not auth_header: return jsonify({"error": "Authorization token is missing"}), 401
    try:
        with open('internships.json', 'r', encoding='utf-8') as f:
            internships_data = json.load(f)
        return jsonify(internships_data)
    except FileNotFoundError:
        return jsonify({"error": "Internships data not found"}), 404
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)