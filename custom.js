document.addEventListener('DOMContentLoaded', () => {
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
                // Log for debugging
                console.log("Success: ", result.message);
                
                // Show a success message before redirect
                alert('Loan application received successfully.');
                
                // Redirect to a new page
                window.location.href = "/thank-you.html";  // Replace with your desired URL
            } else {
                // Show error message
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
