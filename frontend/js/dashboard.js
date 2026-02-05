// Dashboard page functionality
const capitalize = (str) => {
    if (!str) return str;
    const s = str.trim();
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

document.addEventListener('DOMContentLoaded', () => {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const logoutBtn = document.getElementById('logoutBtn');
    const hero = document.getElementById('hero');
    const heroTitle = document.getElementById('heroTitle');
    const dashboardContent = document.getElementById('dashboardContent');
    const openSettingsBtn = document.getElementById("UserBtn");
    const settingsArea = document.getElementById("settings-card");
    // Check if user is logged in
    const userStr = sessionStorage.getItem('user');
    
    if (!userStr) {
        // Not logged in, redirect to home
        window.location.href = '/html/index.html';
        return;
    }

    try {
        const user = JSON.parse(userStr);
        const name = (capitalize(user.surname) || '');
        welcomeMessage.textContent = `Welcome, ${name.trim() || user.email}! You have successfully logged in.`;
        // Optionally personalize hero title while keeping initial phrasing
        // heroTitle.textContent = `Welcome to your dashboard`;
    } catch (error) {
        console.error('Error parsing user data:', error);
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('user');
            window.location.href = '/html/index.html';
        });
    }

    /*
    // user settings
    if (UserBtn) {
        UserBtn.addEventListener('click', () => {
            sessionStorage.removeItem('user');
            window.location.href = '/html/settings.html';
        });
    }
        */


    // Trigger hero animation: shrink and move to top
    if (hero) {
        // small delay so the page feels intentional
        setTimeout(() => {
            hero.classList.add('shrink');
        }, 600);

        // After the transition, swap the text and reveal dashboard content
        const onTransitionEnd = (e) => {
            // Only run once when top/transform finished
            if (e.propertyName !== 'top' && e.propertyName !== 'transform') return;
            heroTitle.textContent = 'Your finance Dashboard';
            if (dashboardContent) dashboardContent.classList.add('visible');
            hero.removeEventListener('transitionend', onTransitionEnd);
        };

        hero.addEventListener('transitionend', onTransitionEnd);
    }
     openSettingsBtn.addEventListener("click", () => {
        settingsArea.classList.add("visible");
     });
});
