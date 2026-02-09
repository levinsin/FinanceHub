// Login page - email input functionality
document.addEventListener('DOMContentLoaded', () => {
    const emailForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    emailForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';

        const email = document.getElementById('email').value.trim();

        if (!email) {
            errorMessage.textContent = 'Please enter your email';
            return;
        }

        try {
            // Check if email exists in database
            const response = await fetch('/api/v1/users/check-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.exists) {
                // Email exists - go to password page
                sessionStorage.setItem('loginEmail', email);
                window.location.href = '/html/password.html';
            } else {
                // Email doesn't exist - go to registration page
                sessionStorage.setItem('registerEmail', email);
                window.location.href = '/html/register.html';
            }
        } catch (error) {
            errorMessage.textContent = 'An error occurred. Please try again.';
            console.error('Error:', error);
        }
    });
});
