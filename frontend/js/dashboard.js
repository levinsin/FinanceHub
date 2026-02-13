// Dashboard page functionality
const capitalize = (str) => {
    if (!str) return str;
    const s = str.trim();
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    const createExpenseBtn = document.getElementById('createExpenseBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');

    // Settings modal elements
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsModal = document.getElementById('closeSettingsModal');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const currencySelect = document.getElementById('currencySelect');

    // Check if user is logged in
    const userId = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');

    if (!userId || !token) {
        // Not logged in, redirect to home
        window.location.href = '/html/index.html';
        return;
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
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

    // Dark Mode Toggle
    const initDarkMode = () => {
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
            if (darkModeToggle) {
                darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        }
    };

    if (darkModeToggle) {
        console.log('Dark mode toggle found, initializing event listener');
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDarkMode);
            darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        });
    }
    initDarkMode();

    // Settings Modal Functionality
    const openSettingsModal = async() => {
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

    const saveSettings = async() => {
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

    // Load dashboard data
    loadCategories(token);
    displayPieChart(token);
    displayOverview(token);
});

async function getCurrency(token) {
    try {
        // Fetch current settings from backend for currency
        const response = await fetch('/api/v1/settings', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const settings = await response.json();
            curr = settings.currency;
            if (curr === 'EUR') curr = "€";
            if (curr === 'USD') curr = "$";
            if (curr === 'GBP') curr = "£";
            return curr;
        } else {
            console.error('Failed to fetch settings');
            curr = "";
            return curr;
        }
    } catch (error) {
        console.error('Error fetching settings:', error);
        curr = '';
        return curr;
    }
}

async function displayOverview(token) {
    let overview;
    try {
        const overviewResponse = await fetch('/api/v1/dashboard/overview', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        overview = await overviewResponse.json();
    } catch (error) {
        console.error('Error fetching settings:', error);
    }
    const curr = await getCurrency(token);

    document.getElementById('incomeValue').textContent = `${overview.income.toFixed(2)} ${curr}`;
    document.getElementById('expensesValue').textContent = `${overview.expenses.toFixed(2)} ${curr}`;
    document.getElementById('savingsValue').textContent = `${overview.savings.toFixed(2)} ${curr}`;
    document.getElementById('availableValue').textContent = `${overview.available.toFixed(2)} ${curr}`;
}

async function displayPieChart(token) {
    let categoryData;
    try {
        const categoryResponse = await fetch('/api/v1/dashboard/category-breakdown', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (categoryResponse.ok) {
            categoryData = await categoryResponse.json();
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }

    const checkedIds = Array.from(
        document.querySelectorAll('#categorySidebar input[type="checkbox"]:checked')
    ).map(cb => cb.value);

    const categories = categoryData.categories
        .filter(cat => checkedIds.includes(cat.categoryId))
        .sort((a, b) => a.categoryName.localeCompare(b.categoryName));

    const canvas = document.getElementById('categoryPieChart');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const legendContainer = document.getElementById('categoryLegend');

    if (!categories || categories.length === 0) {
        ctx.fillStyle = '#999';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No expense data available', canvas.width / 2, canvas.height / 2);
        return;
    }

    // Generate colors
    const colors = generateColors(categories.length);

    // Calculate total for percentages
    const total = categories.reduce((sum, cat) => sum + cat.spent, 0);

    // Draw pie chart
    let currentAngle = -Math.PI / 2; // Start at top
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    categories.forEach((category, index) => {
        const sliceAngle = (category.spent / total) * 2 * Math.PI;

        // Draw slice
        ctx.fillStyle = colors[index];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();

        // Draw border
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        currentAngle += sliceAngle;
    });
    const curr = await getCurrency(token);

    // Create legend
    legendContainer.innerHTML = '';
    categories.forEach((category, index) => {
        const percentage = ((category.spent / total) * 100).toFixed(1);

        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';

        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = colors[index];

        const info = document.createElement('div');
        info.className = 'legend-info';

        const name = document.createElement('div');
        name.className = 'legend-name';
        name.textContent = `${category.categoryName} (${percentage}%)`;

        const amount = document.createElement('div');
        amount.className = 'legend-amount';
        amount.textContent = `${category.spent.toFixed(2)}${curr}`;

        if (category.budget) {
            const status = document.createElement('div');
            status.className = `legend-status ${category.status === 'under-budget' ? 'under' : 'over'}`;
            status.style.display = 'inline-block';
            status.style.backgroundColor = category.status === 'under-budget' ? 'rgba(67, 233, 123, 0.2)' : 'rgba(250, 112, 154, 0.2)';
            status.style.padding = '2px 6px';
            status.style.borderRadius = '3px';
            status.style.marginTop = '4px';

            if (category.status === 'under-budget') {
                status.textContent = `Budget: ${category.remaining.toFixed(2)}${curr} left`;
            } else if (category.status === 'over-budget') {
                status.textContent = `Over budget: ${category.remaining.toFixed(2)}${curr}`;
            }

            amount.appendChild(status);
        }

        info.appendChild(name);
        info.appendChild(amount);
        legendItem.appendChild(colorBox);
        legendItem.appendChild(info);
        legendContainer.appendChild(legendItem);
    });
}

function generateColors(count) {
    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#4facfe',
        '#43e97b', '#fa709a', '#fee140', '#30cfd0',
        '#a8edea', '#fed6e3', '#c471ed', '#12c2e9'
    ];
    return colors;
}

async function loadCategories(token) {
    try {
        const categoriesResponse = await fetch('/api/v1/categories', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (categoriesResponse.ok) {
            const categories = await categoriesResponse.json();

            const sidebar = document.getElementById("categorySidebar")

            sidebar.innerHTML = ''
            categories.forEach(cat => {
                const listItem = document.createElement('div')
                listItem.className = 'category-filter-item'
                const checkbox = document.createElement('input')
                checkbox.type = 'checkbox'
                checkbox.id = `category-${cat._id}`
                checkbox.value = cat._id
                checkbox.checked = true // Default: alle Kategorien ausgewählt
                checkbox.addEventListener('change', () => displayPieChart(token));
                const label = document.createElement('label')
                label.htmlFor = `category-${cat._id}`
                label.textContent = cat.name

                listItem.appendChild(checkbox)
                listItem.appendChild(label)
                sidebar.appendChild(listItem)
            });
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}