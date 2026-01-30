// ==========================================
// INITIALIZE LUCIDE ICONS
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Update time immediately
    updateTime();

    // Initialize animations
    initAnimations();

    // Render Gold Prices
    initGoldPrices();
});

// ==========================================
// REAL-TIME CLOCK UPDATE
// ==========================================

function updateTime() {
    const now = new Date();

    // Format time (HH:MM:SS)
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    // Format date (Vietnamese style)
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const dayName = days[now.getDay()];
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const dateString = `${dayName}, ${day}/${month}/${year}`;

    // Update DOM elements
    const timeElement = document.getElementById('currentTime');
    const dateElement = document.getElementById('currentDate');
    const updateTimeElement = document.getElementById('updateTime');

    if (timeElement) timeElement.textContent = timeString;
    if (dateElement) dateElement.textContent = dateString;
    if (updateTimeElement) updateTimeElement.textContent = timeString;
}

// Update time every second
setInterval(updateTime, 1000);

// ==========================================
// GOLD PRICE RENDERING LOGIC
// ==========================================

let currentUnit = 'chi';
const UNIT_CONFIG = {
    chi: { multiplier: 1, label: '1 Chỉ (3.75g)', shortLabel: '/chỉ', gramWeight: 3.75 },
    luong: { multiplier: 10, label: '1 Lượng (37.5g)', shortLabel: '/lượng', gramWeight: 37.5 },
    gram: { multiplier: 1 / 3.75, label: '1 Gram', shortLabel: '/gram', gramWeight: 1 }
};

function convertPrice(p, u) { return Math.round(p * UNIT_CONFIG[u].multiplier); }
function formatPrice(p) { return p.toLocaleString('vi-VN'); }

function renderPriceTable(id, key) {
    const c = document.getElementById(id);
    if (!c || typeof GOLD_PRICES === 'undefined' || !GOLD_PRICES[key]) return;

    const shop = GOLD_PRICES[key];
    c.innerHTML = '';

    shop.products.forEach((item, index) => {
        const row = document.createElement('tr');
        row.className = "price-row " + (index === 0 ? 'highlight' : '') + (item.name.includes('SJC') ? ' sjc-row' : '');
        row.innerHTML = `
            <td class="product-info">
                <div class="product-name-main">${item.name.toUpperCase()}</div>
                <div class="product-desc">${item.desc}</div>
            </td>
            <td class="purity">
                <span class="purity-value">${item.purity}</span>
                <span class="purity-label">(${item.purityLabel})</span>
            </td>
            <td class="price buy-price">
                <span class="price-value">${formatPrice(convertPrice(item.buy, currentUnit))}</span>
            </td>
            <td class="price sell-price">
                <span class="price-value">${formatPrice(convertPrice(item.sell, currentUnit))}</span>
            </td>`;
        c.appendChild(row);
    });
}

function renderAllTables() {
    ['quyTung', 'kimTin', 'btmc', 'sjc', 'pnj', 'doji'].forEach(k => renderPriceTable(k + 'Prices', k));
}

function updateUnitLabels() {
    const config = UNIT_CONFIG[currentUnit];
    const ud = document.getElementById('unitDescription');
    if (ud) ud.textContent = "Giá theo " + config.label;
    document.querySelectorAll('.price-table th .unit').forEach(el => el.textContent = config.shortLabel);
}

function updateLastUpdateTime() {
    const el = document.getElementById('lastUpdate');
    if (el && typeof LAST_UPDATE !== 'undefined') el.textContent = LAST_UPDATE;
}

function initGoldPrices() {
    if (typeof GOLD_PRICES === 'undefined') {
        console.error('⚠️ GOLD_PRICES not loaded!');
        return;
    }

    // Unit Switcher logic
    document.querySelectorAll('.unit-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.unit-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentUnit = this.dataset.unit;
            renderAllTables();
            updateUnitLabels();
        });
    });

    renderAllTables();
    updateUnitLabels();
    updateLastUpdateTime();
}

// ==========================================
// PAGE ANIMATIONS
// ==========================================

function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 50);
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.price-section, .info-card, .brand-card').forEach(el => {
        el.classList.add('animate-ready');
        observer.observe(el);
    });
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-ready {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// ==========================================
// PRICE ROW HOVER EFFECTS
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
    // Use event delegation for dynamic content
    document.body.addEventListener('mouseenter', function (e) {
        if (e.target.closest('.price-row')) {
            e.target.closest('.price-row').style.transition = 'all 0.2s ease';
        }
    }, true);
});

// ==========================================
// SMOOTH SCROLL
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// CONSOLE BRANDING
// ==========================================

console.log('%c🏆 Giá Vàng Quý Tùng 🏆', 'color: #FFD700; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px #8B0000;');
console.log('%cWebsite đang hoạt động tốt!', 'color: #22c55e; font-size: 14px;');
console.log('%cCập nhật giá vàng chính xác và uy tín', 'color: #fcd34d; font-size: 12px;');
