// Registration page functionality
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const errorMessage = document.getElementById('errorMessage');
    const emailInput = document.getElementById('email');
    const birthdayInput = document.getElementById('birthday');

    // Set max date for birthday to today
    const today = new Date().toISOString().split('T')[0];
    birthdayInput.setAttribute('max', today);

    // Get email from session storage
    const email = sessionStorage.getItem('registerEmail');

    if (!email) {
        // If no email in session, redirect to login
        window.location.href = '/html/login.html';
        return;
    }

    // Pre-fill the email
    emailInput.value = email;

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';

        const fullName = document.getElementById('fullName').value.trim();
        const birthday = document.getElementById('birthday').value;
        const password = document.getElementById('password').value;

        if (!fullName || !birthday || !password) {
            errorMessage.textContent = 'Please fill in all fields';
            return;
        }

        if (password.length < 6) {
            errorMessage.textContent = 'Password must be at least 6 characters long';
            return;
        }

        // Generate username from email (part before @)
        const username = email.split('@')[0];

        try {
            // Register user
            const response = await fetch('/api/v1/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email, 
                    username, 
                    fullName, 
                    birthday, 
                    password 
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Registration successful
                sessionStorage.setItem('user', JSON.stringify(data.user));
                sessionStorage.removeItem('registerEmail');
                window.location.href = '/html/dashboard.html';
            } else {
                // Registration failed
                errorMessage.textContent = data.message || 'Registration failed';
            }
        } catch (error) {
            errorMessage.textContent = 'An error occurred. Please try again.';
            console.error('Error:', error);
        }
    });
});
