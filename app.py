from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
CORS(app)  # Allows frontend requests

# Database Configuration (SQLite)
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(BASE_DIR, 'database.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Define Loan Application Model
class LoanApplication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    phone_number = db.Column(db.String(15), nullable=False, unique=True)
    id_number = db.Column(db.String(20), nullable=False, unique=True)
    loan_type_id = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

# Create Database Tables
with app.app_context():
    db.create_all()

@app.route('/loan-application/save', methods=['POST'])
def save_loan_application():
    try:
        data = request.form
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        phone_number = data.get('phone_number')
        id_number = data.get('id_number')
        loan_type_id = data.get('loan_type_id')

        if not all([first_name, last_name, phone_number, id_number, loan_type_id]):
            return jsonify({"status": "error", "message": "Missing required fields"}), 400

        existing_user = LoanApplication.query.filter_by(phone_number=phone_number).first()
        if existing_user:
            return jsonify({"status": "error", "message": "This phone number has already applied for a loan."}), 400

        new_application = LoanApplication(
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
            id_number=id_number,
            loan_type_id=int(loan_type_id)
        )
        db.session.add(new_application)
        db.session.commit()

        print(f"Loan application received: {first_name} {last_name}, Phone: {phone_number}")  # Debugging log

        return jsonify({"status": "success", "message": "Loan application successfully submitted."}), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"status": "error", "message": "An error occurred while processing your application."}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
