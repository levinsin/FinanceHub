document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    const createExpenseBtn = document.getElementById('createExpenseBtn');
    const analyticsBtn = document.getElementById('analyzeBtn');

    // Settings modal elements
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsModal = document.getElementById('closeSettingsModal');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');

    // Check if user is logged in
    const userId = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    
    if (!userId || !token) {
        // Not logged in, redirect to home
        window.parent.location.href = '/html/index.html';
        return;
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token'); // added newly
            window.parent.location.href = '/html/index.html';
        });
    }

    if (createExpenseBtn) {
        createExpenseBtn.addEventListener('click', () => {
            window.parent.location.href = '/html/expenses.html';
        });
    }

    if (analyticsBtn) {
        analyticsBtn.addEventListener('click', () => {
            window.parent.location.href = '/html/analyze.html';
        });
    }

    // Settings Modal Functionality
    const openSettingsModal = async () => {
        try {
            // Fetch current settings from backend
            const response = await fetch('/api/v1/settings', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const settings = await response.json();
                currencySelect.value = settings.currency || 'EUR';
            } else {
                console.error('Failed to fetch settings');
                currencySelect.value = 'EUR'; // Default
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            currencySelect.value = 'EUR'; // Default
        }

        settingsModal.style.display = 'flex';
        settingsModal.setAttribute('aria-hidden', 'false');
    };

    const closeSettings = () => {
        settingsModal.style.display = 'none';
        settingsModal.setAttribute('aria-hidden', 'true');
        // Reload dashboard data
        loadCategories(token);
        displayPieChart(token);
        displayOverview(token);
    };

    const saveSettings = async () => {
        try {
            const response = await fetch('/api/v1/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currency: currencySelect.value
                })
            });

            if (response.ok) {
                const updatedSettings = await response.json();
                alert('Settings saved successfully!');
                closeSettings();
            } else {
                const error = await response.json();
                alert(`Failed to save settings: ${error.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error saving settings:', error.message);
            alert('Error saving settings. Please try again.' + error.message);
        }
    };

    // Event listeners for settings modal
    if (settingsBtn) {
        settingsBtn.addEventListener('click', openSettingsModal);
    }

    if (closeSettingsModal) {
        closeSettingsModal.addEventListener('click', closeSettings);
    }

    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', saveSettings);
    }

});