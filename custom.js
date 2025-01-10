// Add custom JavaScript for form validation and interactivity
document.addEventListener('DOMContentLoaded', () => {
    // Form validation
    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        const phoneNumber = form.querySelector('input[name="phone_number"]');
        if (!phoneNumber.value.match(/^07[0-9]{8}$/)) {
            alert("Please enter a valid MPESA phone number (e.g., 0712345678).");
            e.preventDefault();
        }
    });

    // Modal close events (optional)
    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => {
        const closeButton = modal.querySelector('.btn-close');
        closeButton.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    });
});
