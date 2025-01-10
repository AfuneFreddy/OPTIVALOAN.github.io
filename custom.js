document.addEventListener('DOMContentLoaded', () => {
    // Form validation
    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        const phoneInput = form.querySelector('input[name="phone_number"]');
        const idInput = form.querySelector('input[name="id_number"]');

        if (!phoneInput.value.match(/^07[0-9]{8}$/)) {
            alert("Please enter a valid MPESA phone number (e.g., 0712345678).");
            e.preventDefault();
            return false;
        }

        if (idInput.value.length < 7 || idInput.value.length > 8) {
            alert("Please enter a valid National ID Number.");
            e.preventDefault();
            return false;
        }

        alert("Form submitted successfully!");
    });

    // Modal toggle
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.btn-close');
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    });
});
