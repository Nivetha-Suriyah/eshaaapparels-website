import os
import sqlite3
import smtplib
from email.mime.text import MIMEText
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from flask import Flask, jsonify, render_template, request
import os
import requests
import base64
from dotenv import load_dotenv
load_dotenv()   # <-- ADD THIS LINE
# app = Flask(__name__)
app = Flask(
    __name__,
    template_folder="../",   # look for index.html, about.html, etc. in project root
    static_folder="../",     # serve css/, js/, assets/ also from project root
    static_url_path=""       # so URLs like /css/style.css still work
)

# -----------------------------
# Paths & folders
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads", "resumes")
DB_PATH = os.path.join(DATA_DIR, "forms.db")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

# -----------------------------
# Email config (FILL THESE)
# -----------------------------
SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = int(os.getenv("SMTP_PORT"))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL")
FROM_EMAIL = os.getenv("FROM_EMAIL")
                  # sender address
BREVO_API_KEY = os.getenv("BREVO_API_KEY")



# -----------------------------
# DB setup
# -----------------------------
def init_db():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Contact table
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS contact (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT,
            name TEXT,
            email TEXT,
            subject TEXT,
            message TEXT
        );
        """
    )

    # Career table
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS career (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT,
            name TEXT,
            email TEXT,
            phone TEXT,
            resume_path TEXT
        );
        """
    )

    conn.commit()
    conn.close()


# -----------------------------
# Email helper
# -----------------------------
def send_email(to_address, subject, body, attachment_path=None):
    url = "https://api.brevo.com/v3/smtp/email"

    if not BREVO_API_KEY:
        print("BREVO_API_KEY not set, cannot send email.")
        return

    data = {
        "sender": {"email": FROM_EMAIL, "name": "Eshaa Apparels"},
        "to": [{"email": to_address}],
        "subject": subject,
        "textContent": body,
    }

    if attachment_path and os.path.isfile(attachment_path):
        try:
            with open(attachment_path, "rb") as f:
                encoded = base64.b64encode(f.read()).decode("utf-8")
            data["attachment"] = [{
                "content": encoded,
                "name": os.path.basename(attachment_path),
            }]
        except Exception as e:
            print("Error attaching file:", e)

    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
    }

    try:
        resp = requests.post(url, json=data, headers=headers, timeout=10)
        print("Brevo email response:", resp.status_code, resp.text)
    except Exception as e:
        print(f"Error sending email via Brevo to {to_address}:", e)
init_db()
# -----------------------------
# Routes
# -----------------------------
@app.route("/")
def health():
    return render_template("index.html")


# ---- Contact form: /api/contact ----
@app.route("/api/contact", methods=["POST"])
def api_contact():
    name = (request.form.get("name") or "").strip()
    email = (request.form.get("email") or "").strip()
    subject = (request.form.get("subject") or "").strip()
    message = (request.form.get("message") or "").strip()
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

       # ---------- CAPTCHA VERIFICATION ----------
    # captcha_response = request.form.get("g-recaptcha-response")
    # captcha_secret = os.getenv("RECAPTCHA_SECRET_KEY")

    # verify_url = "https://www.google.com/recaptcha/api/siteverify"
    # payload = {"secret": captcha_secret, "response": captcha_response}

    # captcha_verify = requests.post(verify_url, data=payload).json()
    # print("Captcha verify result:", captcha_verify)  # <-- add this for debugging

    # if not captcha_verify.get("success"):
    #     return jsonify({
    #         "status": "error",
    #         "message": "Captcha validation failed. Please refresh the page and try again."
    #     }), 400

    missing = []
    if not name:
        missing.append("name")
    if not email:
        missing.append("email")
    if not subject:
        missing.append("subject")
    if not message:
        missing.append("message")

    print("CONTACT FORM DATA:", request.form.to_dict())  # debug

    if missing:
       return jsonify({
            "status": "error",
            "message": f"Missing required fields: {', '.join(missing)}"
        }), 400

    # Save to DB
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO contact (created_at, name, email, subject, message)
        VALUES (?, ?, ?, ?, ?)
        """,
        (created_at, name, email, subject, message),
    )
    conn.commit()
    conn.close()

    # Email to admin
    admin_subject = f"[Contact] {subject} – from {name}"
    admin_body = (
        f"Time: {created_at}\n"
        f"Name: {name}\n"
        f"Email: {email}\n\n"
        f"Message:\n{message}"
    )
    try:
        send_email(ADMIN_EMAIL, admin_subject, admin_body)
    except Exception as e:
        print("Error sending admin email (contact):", e)

    # Auto reply to user
    user_subject = "Thank you for contacting Eshaa Apparels"
    user_body = (
        f"Dear {name},\n\n"
        "Thank you for reaching out to Eshaa Apparels.\n"
        "We have received your message and will get back to you soon.\n\n"
        "Best regards,\n"
        "Eshaa Apparels Team"
    )
    try:
        send_email(email, user_subject, user_body)
    except Exception as e:
        print("Error sending auto-reply (contact):", e)

    # Simple response (you can change to redirect later)
    # return "Thank you for your message. We will contact you soon."
    return jsonify({"status": "ok"})

# ---- Career form: /api/careers ----
# @app.route("/api/careers", methods=["POST"])
@app.route("/api/careers", methods=["POST"])
def api_careers():
    name = (request.form.get("name") or "").strip()
    email = (request.form.get("email") or "").strip()
    phone = (request.form.get("phone") or "").strip()
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # ---------- CAPTCHA VERIFICATION ----------
    # ---------- CAPTCHA VERIFICATION ----------
    captcha_response = request.form.get("g-recaptcha-response")
    captcha_secret = os.getenv("RECAPTCHA_SECRET_KEY")

    verify_url = "https://www.google.com/recaptcha/api/siteverify"
    payload = {"secret": captcha_secret, "response": captcha_response}

    captcha_verify = requests.post(verify_url, data=payload).json()
    print("Captcha verify result:", captcha_verify)  # <-- add this for debugging

    if not captcha_verify.get("success"):
        return jsonify({
            "status": "error",
            "message": "Captcha validation failed. Please refresh the page and try again."
        }), 400

    missing = []
    if not name:
        missing.append("name")
    if not email:
        missing.append("email")
    if not phone:
        missing.append("phone")

    # if missing:
        if missing:
            return jsonify({
                "status": "error",
                "message": f"Missing required fields: {', '.join(missing)}"
            }), 400

    # -----------------------------------------
    # Handle resume upload
    # -----------------------------------------
    resume_file = request.files.get("resume")
    resume_rel_path = None       # path stored in DB
    save_path = None             # full path used for attachment

    if resume_file and resume_file.filename:
        # Safe filename
        safe_name = "".join(c if c.isalnum() else "_" for c in name)
        ext = os.path.splitext(resume_file.filename)[1]
        filename = f"{safe_name}_{int(datetime.now().timestamp())}{ext}"

        # Full path where file is saved
        save_path = os.path.join(UPLOAD_DIR, filename)

        # Save file
        resume_file.save(save_path)

        # Relative path for DB (not used for attachment)
        resume_rel_path = os.path.join("uploads", "resumes", filename)

    # -----------------------------------------
    # Save to DB
    # -----------------------------------------
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO career (created_at, name, email, phone, resume_path)
        VALUES (?, ?, ?, ?, ?)
        """,
        (created_at, name, email, phone, resume_rel_path),
    )
    conn.commit()
    conn.close()

    # -----------------------------------------
    # Email to admin WITH attachment
    # -----------------------------------------
    admin_subject = f"[CAREER] New application from {name}"
    admin_body = f"""
    New career application from Eshaa Apparels website

    --------------------------------------------------
    Submitted on : {created_at}
    Form type    : CAREER
    --------------------------------------------------
    Name         : {name}
    Email        : {email}
    Phone        : {phone}
    Resume saved : {resume_rel_path or 'No file provided'}
    --------------------------------------------------
        """.strip()

    try:
        # If save_path exists, attach the file
        send_email(
            ADMIN_EMAIL,
            admin_subject,
            admin_body,
            attachment_path=save_path if save_path else None
        )
    except Exception as e:
        print("Error sending admin email (career):", e)

    # -----------------------------------------
    # Auto reply (NO attachment)
    # -----------------------------------------
    user_subject = "Your application at Eshaa Apparels"
    user_body = f"""
    Dear {name},

    Thank you for submitting your job application to Eshaa Apparels.

    We have received your details and our HR team will review your resume.
    If your profile matches our requirement, we will get in touch with you.

    Best regards,
    Eshaa Apparels HR Team
        """.strip()

    try:
        send_email(email, user_subject, user_body)
    except Exception as e:
        print("Error sending auto-reply (career):", e)

    # return "Thank you for your application! Our team will contact you soon."
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    
    app.run(debug=True)
