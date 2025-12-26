// Shared App Utilities

// Toast notifications
export function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
    <span class="icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span>${message}</span>
  `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Loading state helpers
export function showLoading(element) {
    element.dataset.originalContent = element.innerHTML;
    element.innerHTML = '<div class="skeleton" style="height: 100%; min-height: 100px;"></div>';
}

export function hideLoading(element) {
    if (element.dataset.originalContent) {
        element.innerHTML = element.dataset.originalContent;
        delete element.dataset.originalContent;
    }
}

// Modal helpers
export function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

export function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Initialize modal close handlers
export function initModals() {
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', () => {
            const overlay = btn.closest('.modal-overlay');
            if (overlay) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

// Current month/year state
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth() + 1;

export function getCurrentPeriod() {
    return { year: currentYear, month: currentMonth };
}

export function setCurrentPeriod(year, month) {
    currentYear = year;
    currentMonth = month;
    // Dispatch custom event for components to react
    window.dispatchEvent(new CustomEvent('periodchange', { detail: { year, month } }));
}

export function navigateMonth(delta) {
    let newMonth = currentMonth + delta;
    let newYear = currentYear;

    if (newMonth > 12) {
        newMonth = 1;
        newYear++;
    } else if (newMonth < 1) {
        newMonth = 12;
        newYear--;
    }

    setCurrentPeriod(newYear, newMonth);
}

// Month selector UI
export function initMonthSelector() {
    const selector = document.querySelector('.month-selector');
    if (!selector) return;

    const prevBtn = selector.querySelector('[data-action="prev"]');
    const nextBtn = selector.querySelector('[data-action="next"]');
    const display = selector.querySelector('.current-month');

    const updateDisplay = () => {
        const date = new Date(currentYear, currentMonth - 1, 1);
        display.textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    prevBtn?.addEventListener('click', () => navigateMonth(-1));
    nextBtn?.addEventListener('click', () => navigateMonth(1));

    window.addEventListener('periodchange', updateDisplay);
    updateDisplay();
}

// Category colors map (cached)
let categoryColorsMap = {};

export function setCategoryColors(categories) {
    categoryColorsMap = {};
    categories.forEach(c => {
        categoryColorsMap[c.id] = c.color;
    });
}

export function getCategoryColor(categoryId) {
    return categoryColorsMap[categoryId] || '#6366f1';
}

// Debounce utility
export function debounce(fn, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

// Format relative date
export function formatRelativeDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Store last used category for quick add
let lastUsedCategory = null;

export function setLastUsedCategory(categoryId) {
    lastUsedCategory = categoryId;
    localStorage.setItem('lastUsedCategory', categoryId);
}

export function getLastUsedCategory() {
    if (lastUsedCategory) return lastUsedCategory;
    return localStorage.getItem('lastUsedCategory');
}

// Initialize common functionality
export function initApp() {
    initModals();
    initMonthSelector();

    // Set initial period (check URL params or use current date)
    const params = new URLSearchParams(window.location.search);
    const urlYear = params.get('year');
    const urlMonth = params.get('month');

    if (urlYear && urlMonth) {
        currentYear = parseInt(urlYear);
        currentMonth = parseInt(urlMonth);
    }
}
