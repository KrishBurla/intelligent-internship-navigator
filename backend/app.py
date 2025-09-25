from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
import json
import time

app = Flask(__name__)
CORS(app)

# --- MySQL DATABASE CONFIGURATION ---
# IMPORTANT: Change the password to your actual MySQL root password
db_config = {
    'host': '127.0.0.1',
    'user': 'root',
    'password': 'root', # <-- CHANGE THIS
    'database': 'internship_navigator_db'
}

def get_db_connection():
    """Establishes a connection to the MySQL database."""
    try:
        conn = mysql.connector.connect(**db_config)
        return conn
    except mysql.connector.Error as err:
        print(f"Error connecting to MySQL: {err}")
        return None

# --- AUTHENTICATION ENDPOINTS ---
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
        
        # --- NEW LOGIC ---
        # Check if the preference_tags field is filled
        quiz_taken = bool(user['preference_tags']) 

        return jsonify({
            "message": "Login successful",
            "token": token,
            "name": user['name'],
            "profile_complete": user['profile_complete'],
            "quiz_taken": quiz_taken # Return the quiz status
        }), 200
        
    return jsonify({"error": "Invalid credentials"}), 401

# --- ONBOARDING ENDPOINT ---
@app.route('/api/onboarding', methods=['POST'])
def complete_onboarding():
    auth_header = request.headers.get('Authorization')
    if not auth_header: return jsonify({"error": "Authorization token is missing"}), 401
    
    data = request.get_json()
    if not data or not all(k in data for k in ('education', 'field_of_study', 'skills', 'email')):
        return jsonify({"error": "Missing onboarding data"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            UPDATE users SET education=%s, field_of_study=%s, skills=%s, profile_complete=TRUE
            WHERE email=%s
            """,
            (data['education'], data['field_of_study'], data['skills'], data['email'])
        )
        conn.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
        
    return jsonify({"message": "Profile updated successfully"}), 200

# --- PROFILE ENDPOINTS (Updated GET to include preference_tags) ---
@app.route('/api/profile', methods=['GET'])
def get_profile():
    auth_header = request.headers.get('Authorization')
    if not auth_header: return jsonify({"error": "Authorization token missing"}), 401
    
    user_email = request.args.get('email')
    if not user_email: return jsonify({"error": "User email parameter is required"}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT name, email, education, field_of_study, skills, preference_tags FROM users WHERE email = %s', (user_email,))
    profile = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if profile:
        return jsonify(profile), 200
    return jsonify({"error": "User not found"}), 404

@app.route('/api/profile', methods=['PUT'])
def update_profile():
    auth_header = request.headers.get('Authorization')
    if not auth_header: return jsonify({"error": "Authorization token missing"}), 401
    data = request.get_json()
    if not data or not all(k in data for k in ('name', 'email', 'education', 'field_of_study', 'skills')):
        return jsonify({"error": "Missing fields for profile update"}), 400
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE users SET name=%s, education=%s, field_of_study=%s, skills=%s WHERE email=%s",
            (data['name'], data['education'], data['field_of_study'], data['skills'], data['email'])
        )
        conn.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
    return jsonify({"message": "Profile updated successfully"}), 200

# --- RESUME ANALYSIS ENDPOINT ---
@app.route('/api/resume/upload', methods=['POST'])
def upload_resume():
    auth_header = request.headers.get('Authorization')
    if not auth_header: return jsonify({"error": "Authorization token is missing"}), 401

    if 'resume' not in request.files:
        return jsonify({"error": "No resume file found"}), 400
    
    time.sleep(2) # Simulate AI model processing time
    
    return jsonify({
        "message": "Resume analyzed successfully",
        "extracted_skills": ["Python", "React", "Node.js", "SQL", "Project Management"]
    }), 200

# --- QUIZ SUBMISSION ENDPOINT (UPDATED) ---
@app.route('/api/quiz/submit', methods=['POST'])
def submit_quiz():
    auth_header = request.headers.get('Authorization')
    if not auth_header: return jsonify({"error": "Authorization token missing"}), 401
    
    data = request.get_json()
    if not data or not data.get('email') or not data.get('answers'):
        return jsonify({"error": "Missing user email or answers"}), 400

    user_email = data['email']
    response_tags = ",".join(data['answers'])
    
    conn = get_db_connection()
    if not conn: return jsonify({"error": "Database connection failed"}), 500
    cursor = conn.cursor()
    try:
        # Update the user's profile directly with the preference tags
        cursor.execute(
            "UPDATE users SET preference_tags = %s WHERE email = %s",
            (response_tags, user_email)
        )
        conn.commit()
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()
    return jsonify({"message": "Quiz results saved successfully!"}), 200

# --- INTERNSHIPS ENDPOINT ---
@app.route('/api/internships')
def get_internships():
    auth_header = request.headers.get('Authorization')
    if not auth_header: return jsonify({"error": "Authorization token is missing"}), 401
    with open('internships.json', 'r') as f:
        internships_data = json.load(f)
    return jsonify(internships_data)

if __name__ == '__main__':
    app.run(debug=True)