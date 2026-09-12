// ===== 菜單數據 =====
const MENU_DATA = [
    // 主食
    {
        id: 1,
        name: '滷肉飯',
        category: '主食',
        emoji: '🍚',
        description: '香滷豬肉',
        price: 60,
        type: 'main'
    },
    {
        id: 2,
        name: '肉圓',
        category: '主食',
        emoji: '🥟',
        description: '傳統竹筍肉圓',
        price: 70,
        type: 'main'
    },
    {
        id: 3,
        name: '麵線',
        category: '主食',
        emoji: '🍜',
        description: '黑白麻油麵線',
        price: 50,
        type: 'main'
    },
    {
        id: 4,
        name: '豚骨湯麵',
        category: '主食',
        emoji: '🍲',
        description: '濃郁豚骨高湯',
        price: 80,
        type: 'main'
    },
    {
        id: 5,
        name: '蚵仔麵線',
        category: '主食',
        emoji: '🦪',
        description: '新鮮蚵仔',
        price: 75,
        type: 'main'
    },
    
    // 配菜
    {
        id: 6,
        name: '燙青菜',
        category: '配菜',
        emoji: '🥬',
        description: '時令新鮮蔬菜',
        price: 40,
        type: 'side',
        addon: true
    },
    {
        id: 7,
        name: '滷蛋',
        category: '配菜',
        emoji: '🥚',
        description: 'Q軟滷蛋',
        price: 15,
        type: 'side',
        addon: true
    },
    {
        id: 8,
        name: '豆干',
        category: '配菜',
        emoji: '🟫',
        description: '香滷豆干',
        price: 20,
        type: 'side',
        addon: true
    },
    
    // 飲料
    {
        id: 9,
        name: '冬瓜茶',
        category: '飲料',
        emoji: '🧊',
        description: '天然冬瓜茶',
        price: 35,
        type: 'drink'
    },
    {
        id: 10,
        name: '紅茶',
        category: '飲料',
        emoji: '🫖',
        description: '古早味紅茶',
        price: 30,
        type: 'drink'
    },
    {
        id: 11,
        name: '豆漿',
        category: '飲料',
        emoji: '🥛',
        description: '自製濃豆漿',
        price: 25,
        type: 'drink'
    },
    {
        id: 12,
        name: '柳橙汁',
        category: '飲料',
        emoji: '🧃',
        description: '新鮮現榨',
        price: 50,
        type: 'drink'
    },
    
    // 套餐
    {
        id: 13,
        name: 'A套餐',
        category: '套餐',
        emoji: '🍱',
        description: '主食 + 燙青菜 + 飲料',
        price: 30,
        type: 'combo',
        addon: true,
        includes: ['燙青菜', '飲料任選']
    },
    {
        id: 14,
        name: 'B套餐',
        category: '套餐',
        emoji: '🍛',
        description: '主食 + 滷蛋 + 豆干 + 飲料',
        price: 25,
        type: 'combo',
        addon: true,
        includes: ['滷蛋', '豆干', '飲料任選']
    },
    {
        id: 15,
        name: 'C套餐',
        category: '套餐',
        emoji: '🍖',
        description: '主食 + 燙青菜 + 滷蛋 + 紅茶',
        price: 35,
        type: 'combo',
        addon: true,
        includes: ['燙青菜', '滷蛋', '紅茶']
    }
];

// ===== 應用程序狀態 =====
const APP = {
    currentPage: 'qr',
    cart: [],
    eatInOption: null,
    paymentMethod: null,
    orderNumber: null,
    
    init() {
        this.setupEventListeners();
        this.showPage('qr');
    },
    
    setupEventListeners() {
        // 菜單頁面
        document.addEventListener('click', (e) => {
            if (e.target.closest('.menu-item-btn')) {
                const btn = e.target.closest('.menu-item-btn');
                const itemId = parseInt(btn.dataset.id);
                this.addToCart(itemId);
            }
            
            if (e.target.closest('.quantity-btn')) {
                const btn = e.target.closest('.quantity-btn');
                const action = btn.dataset.action;
                const itemId = parseInt(btn.dataset.id);
                if (action === 'minus') this.updateQuantity(itemId, -1);
                if (action === 'plus') this.updateQuantity(itemId, 1);
            }
            
            if (e.target.closest('.cart-btn')) {
                this.showPage('cart');
            }
            
            if (e.target.id === 'checkout-btn') {
                this.showPage('checkout');
            }
            
            if (e.target.id === 'continue-shopping-btn') {
                this.showPage('menu');
            }
            
            if (e.target.id === 'confirm-order-btn') {
                this.showPage('confirmation');
            }
            
            if (e.target.id === 'place-order-btn') {
                this.placeOrder();
            }
            
            if (e.target.id === 'back-to-menu-btn') {
                this.showPage('menu');
            }
            
            if (e.target.closest('.option-card[data-type="eatIn"]')) {
                this.eatInOption = e.target.closest('.option-card').dataset.value;
                this.updateOptionCards('eatIn', this.eatInOption);
            }
            
            if (e.target.closest('.option-card[data-type="payment"]')) {
                this.paymentMethod = e.target.closest('.option-card').dataset.value;
                this.updateOptionCards('payment', this.paymentMethod);
            }
            
            if (e.target.id === 'new-order-btn') {
                this.resetOrder();
                this.showPage('menu');
            }
        });
    },
    
    addToCart(itemId) {
        const item = MENU_DATA.find(m => m.id === itemId);
        if (!item) return;
        
        const existingItem = this.cart.find(c => c.id === itemId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...item,
                quantity: 1,
                addons: []
            });
        }
        
        this.updateCart();
    },
    
    updateQuantity(itemId, change) {
        const item = this.cart.find(c => c.id === itemId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.cart = this.cart.filter(c => c.id !== itemId);
            }
        }
        this.updateCart();
    },
    
    updateCart() {
        this.renderCart();
        this.updateCartButton();
    },
    
    renderCart() {
        const cartItemsHtml = this.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h3>${item.emoji} ${item.name}</h3>
                    <p class="cart-item-quantity">數量: ${item.quantity}</p>
                    <div class="quantity-selector" style="margin-top: 0.5rem;">
                        <button class="quantity-btn" data-action="minus" data-id="${item.id}">−</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" data-action="plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="cart-item-price">
                    <div class="cart-item-total">$${item.price * item.quantity}</div>
                    <div style="font-size: 0.9rem; color: var(--text-light);">單價 $${item.price}</div>
                </div>
            </div>
        `).join('');
        
        const cartItemsContainer = document.getElementById('cart-items-container');
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = cartItemsHtml || '<div class="empty-cart">購物車是空的</div>';
        }
    },
    
    updateCartButton() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const cartButton = document.querySelector('.cart-btn');
        if (cartButton) {
            cartButton.textContent = `🛒 查看購物車 (${totalItems})`;
        }
        
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = `${totalItems} 項商品`;
        }
        
        const cartTotal = document.getElementById('cart-total');
        if (cartTotal) {
            cartTotal.textContent = `$${totalPrice}`;
        }
    },
    
    updateOptionCards(type, value) {
        document.querySelectorAll(`.option-card[data-type="${type}"]`).forEach(card => {
            if (card.dataset.value === value) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });
    },
    
    showPage(pageName) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        const page = document.getElementById(`${pageName}-page`);
        if (page) {
            page.classList.add('active');
            this.currentPage = pageName;
            
            // 特殊頁面處理
            if (pageName === 'menu') {
                this.renderMenu();
                this.updateCartButton();
            }
            if (pageName === 'confirmation') {
                this.renderConfirmation();
            }
        }
    },
    
    renderMenu() {
        const menuGrid = document.getElementById('menu-items');
        if (!menuGrid) return;
        
        const html = MENU_DATA.map(item => {
            const quantityInfo = this.cart.find(c => c.id === item.id);
            const currentQty = quantityInfo ? quantityInfo.quantity : 0;
            
            return `
                <div class="menu-item">
                    <div class="menu-item-image">${item.emoji}</div>
                    <h3>${item.name}</h3>
                    <div class="menu-item-category">${item.category}</div>
                    <div class="menu-item-description">${item.description}</div>
                    <div class="menu-item-footer">
                        <span class="price">$${item.price}</span>
                        ${currentQty > 0 ? 
                            `<div class="quantity-selector">
                                <button class="quantity-btn" data-action="minus" data-id="${item.id}">−</button>
                                <span class="quantity-display">${currentQty}</span>
                                <button class="quantity-btn" data-action="plus" data-id="${item.id}">+</button>
                            </div>` 
                            : 
                            `<button class="btn btn-primary btn-small menu-item-btn" data-id="${item.id}">加入購物車</button>`
                        }
                    </div>
                </div>
            `;
        }).join('');
        
        menuGrid.innerHTML = html;
    },
    
    renderConfirmation() {
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        const items = this.cart.map(item => `
            <div class="confirmation-detail">
                <span class="confirmation-detail-label">${item.emoji} ${item.name} × ${item.quantity}</span>
                <span>$${item.price * item.quantity}</span>
            </div>
        `).join('');
        
        const confirmationContent = document.getElementById('confirmation-content');
        if (confirmationContent) {
            confirmationContent.innerHTML = `
                <div class="confirmation-section">
                    <h3>📋 訂購商品</h3>
                    ${items}
                </div>
                
                <div class="confirmation-section">
                    <h3>⚙️ 用餐選項</h3>
                    <div class="confirmation-detail">
                        <span class="confirmation-detail-label">用餐方式</span>
                        <span>${this.eatInOption === 'dine-in' ? '內用' : '外帶'}</span>
                    </div>
                </div>
                
                <div class="confirmation-section">
                    <h3>💳 支付方式</h3>
                    <div class="confirmation-detail">
                        <span class="confirmation-detail-label">選擇方式</span>
                        <span>${this.getPaymentMethodName(this.paymentMethod)}</span>
                    </div>
                </div>
                
                <div class="confirmation-section">
                    <h3>📊 訂單金額</h3>
                    <div class="confirmation-detail">
                        <span class="confirmation-detail-label">商品小計</span>
                        <span>$${total}</span>
                    </div>
                    <div class="confirmation-detail">
                        <span class="confirmation-detail-label">優惠/折扣</span>
                        <span>$0</span>
                    </div>
                    <div class="confirmation-detail" style="border: none; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 2px solid rgba(0,0,0,0.2); font-size: 1.3rem; font-weight: bold; color: var(--accent-color);">
                        <span>合計</span>
                        <span>$${total}</span>
                    </div>
                </div>
            `;
        }
    },
    
    getPaymentMethodName(method) {
        const methods = {
            'cash': '現金支付',
            'line-pay': 'LINE PAY',
            'apple-pay': 'Apple Pay',
            'visa': 'VISA'
        };
        return methods[method] || '未選擇';
    },
    
    placeOrder() {
        this.orderNumber = this.generateOrderNumber();
        this.showPage('success');
        this.startWaitingTimer();
    },
    
    generateOrderNumber() {
        return 'ORD' + Date.now().toString().slice(-8).toUpperCase();
    },
    
    startWaitingTimer() {
        const waitingTime = document.getElementById('waiting-time');
        let minutes = 10;
        let seconds = 0;
        
        const interval = setInterval(() => {
            seconds -= 1;
            if (seconds < 0) {
                minutes -= 1;
                seconds = 59;
            }
            
            if (minutes < 0) {
                clearInterval(interval);
                waitingTime.innerHTML = '✅ 餐點已準備完成，請前往取餐！';
                return;
            }
            
            waitingTime.innerHTML = `
                <span class="waiting-time-number">${String(minutes).padStart(2, '0')}</span>:
                <span class="waiting-time-number">${String(seconds).padStart(2, '0')}</span>
            `;
        }, 1000);
    },
    
    resetOrder() {
        this.cart = [];
        this.eatInOption = null;
        this.paymentMethod = null;
        this.orderNumber = null;
        this.updateCart();
    }
};

// ===== 初始化應用 =====
document.addEventListener('DOMContentLoaded', () => {
    APP.init();
});
