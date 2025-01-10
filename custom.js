document.addEventListener('DOMContentLoaded', () => {
    // Get elements for links and content
    const termsLink = document.getElementById('terms-link');
    const privacyLink = document.getElementById('privacy-link');
    const termsContent = document.getElementById('terms-content');
    const privacyContent = document.getElementById('privacy-content');

    // Toggle Terms and Conditions
    termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        termsContent.style.display = termsContent.style.display === 'none' || termsContent.style.display === '' ? 'block' : 'none';
        privacyContent.style.display = 'none'; // Hide privacy content if open
    });

    // Toggle Privacy Policy
    privacyLink.addEventListener('click', (e) => {
        e.preventDefault();
        privacyContent.style.display = privacyContent.style.display === 'none' || privacyContent.style.display === '' ? 'block' : 'none';
        termsContent.style.display = 'none'; // Hide terms content if open
    });
});
