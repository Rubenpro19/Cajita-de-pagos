// ===== CATÁLOGO DE PRODUCTOS =====
const products = [
    { id: 1, name: 'Laptop Gaming', description: 'Intel Core i7, 16GB RAM, RTX 3060', price: 850.00, icon: '💻', taxable: true },
    { id: 2, name: 'Mouse Gamer RGB', description: '16000 DPI, 7 botones programables', price: 35.00, icon: '🖱️', taxable: true },
    { id: 3, name: 'Teclado Mecánico', description: 'Switches Blue, RGB, Anti-ghosting', price: 65.00, icon: '⌨️', taxable: true },
    { id: 4, name: 'Monitor 27" 144Hz', description: 'Full HD, Panel IPS, 1ms', price: 250.00, icon: '🖥️', taxable: true },
    { id: 5, name: 'Auriculares Gaming', description: 'Sonido 7.1, Micrófono extraíble', price: 55.00, icon: '🎧', taxable: true },
    { id: 6, name: 'Webcam 4K', description: 'Autofocus, Micrófono integrado', price: 95.00, icon: '📷', taxable: true },
    { id: 7, name: 'SSD 1TB NVMe', description: 'Velocidad 3500MB/s lectura', price: 85.00, icon: '💾', taxable: true },
    { id: 8, name: 'Router WiFi 6', description: 'Dual Band, 1200Mbps', price: 70.00, icon: '📡', taxable: true },
    { id: 9, name: 'Mousepad XXL', description: 'Base antideslizante, 90x40cm', price: 20.00, icon: '🎯', taxable: false },
    { id: 10, name: 'Soporte para Laptop', description: 'Ajustable, Aluminio', price: 30.00, icon: '🛠️', taxable: false },
    { id: 11, name: 'Cámara de Seguridad', description: '1080p, Visión Nocturna', price: 120.00, icon: '📹', taxable: true },
];

let cart = [];

// ===== INICIALIZACIÓN =====
function initStore() {
    renderProducts();
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
    updateCartUI();
}

// ===== RENDERIZADO DE PRODUCTOS =====
function renderProducts() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-image">${p.icon}</div>
            <div class="product-info">
                <h3 class="product-name">${p.name}</h3>
                <p class="product-description">${p.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${p.price.toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${p.id})">Agregar</button>
                </div>
            </div>
        </div>
    `).join('');
}

// ===== GESTIÓN DEL CARRITO =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showNotification(`${product.name} agregado al carrito`);
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

// ===== ACTUALIZACIÓN DE UI =====
function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;

    const cartItemsContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        document.getElementById('checkout-btn').disabled = true;
    } else {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-icon">${item.icon}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Eliminar</button>
                </div>
            </div>
        `).join('');
        
        document.getElementById('checkout-btn').disabled = false;
    }

    updateCartTotals();
}

function updateCartTotals() {
    let subtotalWithTax = 0;
    let subtotalWithoutTax = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        if (item.taxable) {
            subtotalWithTax += itemTotal;
        } else {
            subtotalWithoutTax += itemTotal;
        }
    });

    const tax = subtotalWithTax * 0.15;
    const total = subtotalWithoutTax + subtotalWithTax + tax;

    document.getElementById('subtotal-without-tax').textContent = `$${subtotalWithoutTax.toFixed(2)}`;
    document.getElementById('subtotal-with-tax').textContent = `$${subtotalWithTax.toFixed(2)}`;
    document.getElementById('tax-amount').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total-amount').textContent = `$${total.toFixed(2)}`;
}

// ===== NAVEGACIÓN =====
function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
    document.getElementById('cart-overlay').classList.toggle('active');
}

function goToCheckout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    localStorage.setItem('checkoutCart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
}

// ===== NOTIFICACIONES =====
function showNotification(message) {
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed; top: 80px; right: 20px;
            background: #4caf50; color: white;
            padding: 15px 25px; border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000; animation: slideIn 0.3s;
        `;
        document.body.appendChild(notification);
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(400px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(400px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    notification.textContent = message;
    notification.style.display = 'block';
    notification.style.animation = 'slideIn 0.3s';

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s';
        setTimeout(() => notification.style.display = 'none', 300);
    }, 2000);
}

document.addEventListener('DOMContentLoaded', initStore);
