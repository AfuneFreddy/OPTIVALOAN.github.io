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

    // ✅ Handle Form Submission with AJAX & Redirect
    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Stop default form submission

        const formData = new FormData(form);

        try {
            const response = await fetch("http://127.0.0.1:5000/loan-application/save", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.status === "success") {
                window.location.href = "thank-you.html"; // ✅ Redirect on success
            } else {
                alert("⚠️ " + result.message); // Show error message
            }
        } catch (error) {
            console.error("❌ Error submitting form:", error);
            alert("⚠️ An error occurred. Please try again.");
        }
    });
});
