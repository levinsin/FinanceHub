// Dashboard page functionality
document.addEventListener('DOMContentLoaded', () => {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const logoutBtn = document.getElementById('logoutBtn');

    // Check if user is logged in
    const userStr = sessionStorage.getItem('user');
    
    if (!userStr) {
        // Not logged in, redirect to home
        window.location.href = '/';
        return;
    }

    try {
        const user = JSON.parse(userStr);
        welcomeMessage.textContent = `Welcome, ${user.username || user.email}! You have successfully logged in.`;
    } catch (error) {
        console.error('Error parsing user data:', error);
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('user');
            window.location.href = '/';
        });
    }
});
