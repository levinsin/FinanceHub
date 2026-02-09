// Main landing page functionality
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = '/html/login.html';
        });
    }
});