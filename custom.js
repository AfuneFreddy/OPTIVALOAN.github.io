document.addEventListener('DOMContentLoaded', () => {
    // Get elements for links and content
    const termsLink = document.getElementById('terms-link');
    const privacyLink = document.getElementById('privacy-link');
    const termsContent = document.getElementById('terms-content');
    const privacyContent = document.getElementById('privacy-content');

    // Toggle Terms and Conditions
    termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        termsContent.style.display = termsContent.style.display === 'block' ? 'none' : 'block';
        privacyContent.style.display = 'none'; // Hide privacy content if open
    });

    // Toggle Privacy Policy
    privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        privacyContent.style.display = privacyContent.style.display === 'block' ? 'none' : 'block';
        termsContent.style.display = 'none'; // Hide terms content if open
    });

    // Handle Form Submission
    const form = document.getElementById('loan-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();  // Prevent default form submission

        // Show loading state (optional)
        const submitButton = form.querySelector('.btn-submit');
        submitButton.disabled = true;
        submitButton.innerText = "Submitting...";

        const formData = new FormData(form);
        
        try {
            // Send data to the backend using fetch
            const response = await fetch(form.action, {
                method: form.method,
                body: formData,
                headers: {
                    'Accept': 'application/json', // Tells server to return JSON response
                }
            });

            const result = await response.json();  // Parse JSON response

            if (result.status === 'success') {
                // Redirect to a new page after success
                window.location.href = "/thank-you.html";  // Replace with your desired URL

                // Clear the form fields
                form.reset();
            } else {
                // Handle error response
                alert('Error: ' + result.message);
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Error during form submission:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            // Reset the button after request
            submitButton.disabled = false;
            submitButton.innerText = "Find Your Loan Eligibility";
        }
    });
});
