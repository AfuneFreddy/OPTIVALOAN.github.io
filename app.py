from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows frontend requests

@app.route('/loan-application/save', methods=['POST'])
def save_loan_application():
    data = request.form
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    phone_number = data.get('phone_number')
    id_number = data.get('id_number')
    loan_type_id = data.get('loan_type_id')

    # Simulate backend processing
    if not first_name or not last_name or not phone_number or not id_number or not loan_type_id:
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    # Dummy response to simulate loan processing
    return jsonify({"status": "success", "message": "Loan application received"}), 200

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
