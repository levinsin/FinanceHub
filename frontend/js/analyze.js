document.addEventListener('DOMContentLoaded', () => {

    const createExpenseBtn = document.getElementById('createExpenseBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const icon = document.getElementById('dashboardIcon');

    /*
    // Check if user is logged in
    const userId = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');

    if (!userId || !token) {
        // Not logged in, redirect to home
        window.location.href = '/html/index.html';
        return;
    }*/

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log("logout");
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token'); // added newly
            window.location.href = '/html/index.html';
        });
    }

    if (createExpenseBtn) {
        createExpenseBtn.addEventListener('click', () => {
            window.location.href = '/html/expenses.html';
        });
    }

    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
            window.location.reload();
        })
    }

    if (icon) {
        icon.addEventListener('click', () => {
            window.location.href = '/html/dashboard.html';
        })
    }

});