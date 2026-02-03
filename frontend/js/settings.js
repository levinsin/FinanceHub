document.addEventListener('DOMContentLoaded', () => {
    const returntomain = document.getElementById('returntomain');
    
    if (returntomain) {
        returntomain.addEventListener('click', () => {
            window.location.href = '/html/dashboard.html';
        });
    }
});