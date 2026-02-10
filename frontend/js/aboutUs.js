document.addEventListener('DOMContentLoaded', () => {
    const returnToMainBtn = document.getElementById('returnToMain');
    
    if (returnToMainBtn) {
        returnToMainBtn.addEventListener('click', () => window.history.back());
    }
});
