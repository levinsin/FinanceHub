document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const emailInput = document.getElementById('email');
    const registerError = document.getElementById('registerError');

    // Get email from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    
    if (email) {
        emailInput.value = email;
    } else {
        // If no email in URL, redirect back to auth page
        window.location.href = '/auth';
    }

    // Handle registration form submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        registerError.textContent = '';
        registerError.classList.remove('show');

        const formData = {
            email: emailInput.value,
            name: document.getElementById('name').value,
            birthday: document.getElementById('birthday').value,
            password: document.getElementById('password').value
        };

        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate passwords match
        if (formData.password !== confirmPassword) {
            registerError.textContent = 'Passwords do not match';
            registerError.classList.add('show');
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            registerError.textContent = 'Password must be at least 6 characters long';
            registerError.classList.add('show');
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // Store user info in sessionStorage
                sessionStorage.setItem('user', JSON.stringify(data.user));
                alert(`Welcome to FinanceHub, ${data.user.name}!`);
                window.location.href = '/';
            } else {
                registerError.textContent = data.message || 'Registration failed. Please try again.';
                registerError.classList.add('show');
            }
        } catch (error) {
            console.error('Error:', error);
            registerError.textContent = 'Error connecting to server. Please try again.';
            registerError.classList.add('show');
        }
    });
});
