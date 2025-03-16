document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ JavaScript Loaded Successfully!");

    const termsLink = document.getElementById('terms-link');
    const privacyLink = document.getElementById('privacy-link');
    const termsContent = document.getElementById('terms-content');
    const privacyContent = document.getElementById('privacy-content');
    const form = document.getElementById('loan-form');

    if (!form) {
        console.error("❌ ERROR: Form not found! Check if ID is correct.");
        return;
    }

    // ✅ Toggle Terms & Conditions
    if (termsLink) {
        termsLink.addEventListener('click', (e) => {
            e.preventDefault();
            termsContent.style.display = termsContent.style.display === 'block' ? 'none' : 'block';
            privacyContent.style.display = 'none';
        });
    }

    // ✅ Toggle Privacy Policy
    if (privacyLink) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            privacyContent.style.display = privacyContent.style.display === 'block' ? 'none' : 'block';
            termsContent.style.display = 'none';
        });
    }

    // ✅ Handle Form Submission with STK Push
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Stop default form submission

        const formData = new FormData(form);
        const phoneNumber = formData.get("phone_number");
        const loanAmount = parseFloat(formData.get("loan_amount"));

        if (!phoneNumber || isNaN(loanAmount) || loanAmount <= 0) {
            alert("⚠️ Please enter a valid phone number and loan amount.");
            return;
        }

        // Calculate the amount to be paid (6% of loan amount)
        const amountToPay = Math.round(loanAmount * 0.06);

        // Confirm payment with user
        if (!confirm(`You will be charged Ksh. ${amountToPay} for loan commission and eligibility check. Proceed?`)) {
            return;
        }

        // Call STK Push API to initiate payment
        try {
            // Step 1: First, get the access token using your API credentials
            const authResponse = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
                method: "GET",
                headers: {
                    "Authorization": "Basic " + btoa("your_shortcode:your_shortcode_secret") // Replace with actual credentials
                }
            });

            const authResult = await authResponse.json();
            const accessToken = authResult.access_token; // Access token from Safaricom

            // Step 2: Use the access token to call STK Push API
            const stkResponse = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + accessToken
                },
                body: JSON.stringify({
                    "BusinessShortcode": "174379",  // Your Business Shortcode
                    "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMTYwMjE2MTY1NjI3",  // Your Password (Base64 encoded)
                    "Timestamp": "20160216165627",  // Timestamp format YYYYMMDDHHMMSS
                    "TransactionType": "CustomerPayBillOnline",  // Transaction Type
                    "Amount": loanAmount,  // The loan amount entered by the user
                    "PartyA": phoneNumber,  // Customer's phone number
                    "PartyB": "174379",  // Your Business Shortcode
                    "PhoneNumber": phoneNumber,  // Customer's phone number
                    "CallBackURL": "https://mydomain.com/pat",  // Your callback URL
                    "AccountReference": "Test",  // Account Reference
                    "TransactionDesc": "Test"  // Transaction Description
                })
            });

            const result = await stkResponse.json();

            if (result.ResponseCode === "0") {
                alert(`✅ STK Push sent! Enter your Mpesa PIN to proceed.`);
            } else {
                alert("⚠️ STK Push Failed: " + result.errorMessage);
            }

        } catch (error) {
            console.error("❌ STK Push Error:", error);
            alert("⚠️ An error occurred. Please try again.");
        }
    });
});
