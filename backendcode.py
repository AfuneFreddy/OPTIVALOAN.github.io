from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/submit-loan', methods=['POST'])
def submit_loan():
    # Retrieve form data
    data = request.form
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    phone_number = data.get('phone_number')
    id_number = data.get('id_number')
    loan_type = data.get('loan_type')

    # Print data for debugging (optional)
    print(f"First Name: {first_name}, Last Name: {last_name}")
    print(f"Phone Number: {phone_number}, ID Number: {id_number}, Loan Type: {loan_type}")

    # Process the form data (e.g., store in database, calculate eligibility)
    # Example response
    return jsonify({
        'message': 'Form submitted successfully!',
        'status': 'success',
        'data': {
            'first_name': first_name,
            'last_name': last_name,
            'phone_number': phone_number,
            'id_number': id_number,
            'loan_type': loan_type
        }
    })

if __name__ == '__main__':
    app.run(debug=True)
