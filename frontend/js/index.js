// Main landing page functionality
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const aboutUsBtn = document.getElementById('aboutUs');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = '/html/login.html';
        });
    }

    if (aboutUsBtn) {
        aboutUsBtn.addEventListener('click', () => {
            window.location.href = '/html/aboutUs.html';
        });
    }
});