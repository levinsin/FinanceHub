// Password page - password input functionality
document.addEventListener('DOMContentLoaded', () => {
    const passwordForm = document.getElementById('passwordForm');
    const errorMessage = document.getElementById('errorMessage');
    const userEmailElement = document.getElementById('userEmail');

    // Get email from session storage
    const email = sessionStorage.getItem('loginEmail');

    if (!email) {
        // If no email in session, redirect to login
        window.location.href = '/html/login.html';
        return;
    }

    // Display the email
    userEmailElement.textContent = email;

    passwordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMessage.textContent = '';

        const password = document.getElementById('password').value;

        if (!password) {
            errorMessage.textContent = 'Please enter your password';
            return;
        }

        try {
            // Attempt to login
            const response = await fetch('/api/v1/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful
                sessionStorage.setItem('user', JSON.stringify(data.user));
                sessionStorage.setItem('token', data.token);
                sessionStorage.removeItem('loginEmail');
                window.location.href = '/html/dashboard.html';
            } else {
                // Login failed
                errorMessage.textContent = data.message || 'Invalid password';
            }
        } catch (error) {
            errorMessage.textContent = 'An error occurred. Please try again.';
            console.error('Error:', error);
        }
    });
});
