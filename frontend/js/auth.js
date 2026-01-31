document.addEventListener('DOMContentLoaded', () => {
    const emailCheckForm = document.getElementById('emailCheckForm');
    const loginForm = document.getElementById('loginForm');
    const emailForm = document.getElementById('emailForm');
    const loginFormSubmit = document.getElementById('loginFormSubmit');
    const backToEmailBtn = document.getElementById('backToEmail');
    const loginError = document.getElementById('loginError');
    
    let currentEmail = '';

    // Handle email form submission
    emailForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        currentEmail = email;

        try {
            const response = await fetch('/api/auth/check-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (data.success) {
                if (data.exists) {
                    // Show login form
                    document.getElementById('loginEmail').textContent = email;
                    emailCheckForm.style.display = 'none';
                    loginForm.style.display = 'block';
                } else {
                    // Redirect to registration page with email
                    window.location.href = `/register?email=${encodeURIComponent(email)}`;
                }
            } else {
                alert('Error checking email. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error connecting to server. Please try again.');
        }
    });

    // Handle login form submission
    loginFormSubmit.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const password = document.getElementById('loginPassword').value;
        loginError.textContent = '';
        loginError.classList.remove('show');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    email: currentEmail,
                    password 
                })
            });

            const data = await response.json();

            if (data.success) {
                // Store user info in sessionStorage
                sessionStorage.setItem('user', JSON.stringify(data.user));
                alert(`Welcome back, ${data.user.name}!`);
                window.location.href = '/';
            } else {
                loginError.textContent = data.message || 'Login failed. Please try again.';
                loginError.classList.add('show');
            }
        } catch (error) {
            console.error('Error:', error);
            loginError.textContent = 'Error connecting to server. Please try again.';
            loginError.classList.add('show');
        }
    });

    // Handle back to email button
    backToEmailBtn.addEventListener('click', () => {
        loginForm.style.display = 'none';
        emailCheckForm.style.display = 'block';
        document.getElementById('loginPassword').value = '';
        loginError.textContent = '';
        loginError.classList.remove('show');
    });
});
