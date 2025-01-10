from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/submit-loan', methods=['POST'])
def submit_loan():
    data = request.form
    print('Form Data:', data)
    # Process form data (e.g., store in database)
    return jsonify({'message': 'Form submitted successfully!'})

if __name__ == '__main__':
    app.run(debug=True)
