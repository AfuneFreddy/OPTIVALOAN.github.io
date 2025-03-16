import requests
import json
import base64
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)

# Replace with your actual Safaricom Daraja API Credentials
CONSUMER_KEY = "your_consumer_key"
CONSUMER_SECRET = "your_consumer_secret"
SHORTCODE = "your_shortcode"  # Your Paybill or Till Number
PASSKEY = "your_passkey"  # Get from Daraja Portal
CALLBACK_URL = "https://yourdomain.com/mpesa/callback"  # Set this as your callback URL

# Generate Safaricom Access Token
def get_access_token():
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    auth = (CONSUMER_KEY, CONSUMER_SECRET)
    
    response = requests.get(url, auth=auth)
    access_token = response.json().get("access_token")
    return access_token

# STK Push Request with 6% Loan Eligibility Charge
@app.route('/mpesa/stkpush', methods=['POST'])
def stk_push():
    try:
        data = request.json
        phone_number = data.get("phone_number")
        loan_amount = float(data.get("loan_amount", 0))  # Get loan amount from frontend

        if not phone_number or loan_amount <= 0:
            return jsonify({"status": "error", "message": "Invalid phone number or loan amount"}), 400

        # Calculate 6% of the loan amount
        amount_to_pay = round(loan_amount * 0.06)  # Round to nearest whole number

        # Format timestamp
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

        # Generate Lipa Na Mpesa Password
        password = base64.b64encode(f"{SHORTCODE}{PASSKEY}{timestamp}".encode()).decode()

        # Prepare STK Push request payload
        payload = {
            "BusinessShortCode": SHORTCODE,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount_to_pay,
            "PartyA": phone_number,
            "PartyB": SHORTCODE,
            "PhoneNumber": phone_number,
            "CallBackURL": CALLBACK_URL,
            "AccountReference": "LoanEligibility",
            "TransactionDesc": f"Loan Eligibility Check (Loan Amount: {loan_amount})"
        }

        # Send STK Push request
        access_token = get_access_token()
        stk_push_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
        
        response = requests.post(stk_push_url, json=payload, headers=headers)
        response_data = response.json()

        return jsonify(response_data)

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Handle Mpesa Callback Response
@app.route('/mpesa/callback', methods=['POST'])
def mpesa_callback():
    data = request.json
    print("MPESA CALLBACK RECEIVED:", json.dumps(data, indent=4))  # Debugging log

    try:
        result_code = data['Body']['stkCallback']['ResultCode']
        if result_code == 0:
            amount = data['Body']['stkCallback']['CallbackMetadata']['Item'][0]['Value']
            phone_number = data['Body']['stkCallback']['CallbackMetadata']['Item'][4]['Value']
            print(f"✅ Payment Received: {amount} KES from {phone_number}")
            return jsonify({"status": "success", "message": "Payment received."}), 200
        else:
            return jsonify({"status": "failed", "message": "Payment was not completed."}), 400
    except KeyError:
        return jsonify({"status": "error", "message": "Invalid callback data."}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
