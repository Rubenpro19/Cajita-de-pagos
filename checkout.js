// ===== CONFIGURACIÓN PAYPHONE =====
const PAYPHONE_CONFIG = {
    token: 'aPN-zz1uvTZSy9yZaiqVdccZhIOlulh8ECGRTM-fOtZlcSC9pcGOj7Gg4p4gpR0lZeZhKsvgY1JeApYF5VDjfgMm0pjbPcfCn0XwdiJGOFjqMJHGdgI-_HrDXMHRdu1eRm80KGzJJ69QsD7oTIoKjAR_sp_jLOJpXM7aub18CgY96MAMZL-M9KaUaqu7W72iNNRLZXfunk9tB7mA_S1bxtrJrhTVnCXBbUE65M_lUx-qvFRluKyGvujlyJ1yAaC3KRYgs3CnhYzzzEbDDnC5LDpiicVZ5J8bNtukUFi9qtxaJx-hvSzQ4FPVJm57MV10AkdGSw',
    storeId: '207d24a3-8903-407f-9daa-87fb3bbdbd5a',
    currency: 'USD'
};

let cart = [];

// ===== UTILIDADES =====
function generateTransactionId() {
    const now = new Date();
    const date = now.toISOString().slice(0, 10).replace(/-/g, '');
    const time = now.toTimeString().slice(0, 8).replace(/:/g, '');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TS-${date}-${time}-${random}`;
}

function calculateTotals() {
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

    return { subtotalWithoutTax, subtotalWithTax, tax, total };
}

// ===== RENDERIZADO =====
function renderOrderSummary() {
    const contentDiv = document.getElementById('checkout-content');
    const totals = calculateTotals();

    const itemsHTML = cart.map(item => `
        <div class="order-item">
            <div class="item-info">
                <div class="item-icon">${item.icon}</div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-quantity">Cantidad: ${item.quantity}</div>
                </div>
            </div>
            <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    contentDiv.innerHTML = `
        <div class="order-summary">
            <h2>📦 Resumen del Pedido</h2>
            ${itemsHTML}
            <div class="totals">
                <div class="total-row">
                    <span>Subtotal (Sin IVA):</span>
                    <span>$${totals.subtotalWithoutTax.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>Subtotal (Con IVA):</span>
                    <span>$${totals.subtotalWithTax.toFixed(2)}</span>
                </div>
                <div class="total-row">
                    <span>IVA (15%):</span>
                    <span>$${totals.tax.toFixed(2)}</span>
                </div>
                <div class="total-row final">
                    <span>TOTAL:</span>
                    <span>$${totals.total.toFixed(2)}</span>
                </div>
            </div>
        </div>
        <div id="pp-button"></div>
    `;
}

function showEmptyCart() {
    const contentDiv = document.getElementById('checkout-content');
    contentDiv.innerHTML = `
        <div class="empty-cart-page">
            <div class="empty-cart-icon">🛒</div>
            <h2>Tu carrito está vacío</h2>
            <p>Agrega productos desde nuestra tienda para continuar</p>
            <a href="index.html" class="btn-back">Ir a la tienda</a>
        </div>
    `;
}

// ===== PAGO PAYPHONE =====
function initializePaymentButton() {
    const totals = calculateTotals();
    const clientTransactionId = generateTransactionId();

    document.getElementById('transaction-id-display').textContent = clientTransactionId;

    const amountCents = Math.round(totals.total * 100);
    const amountWithoutTaxCents = Math.round(totals.subtotalWithoutTax * 100);
    const amountWithTaxCents = Math.round(totals.subtotalWithTax * 100);
    const taxCents = Math.round(totals.tax * 100);

    const itemsList = cart.map(item => `${item.name} x${item.quantity}`).join(', ');
    const reference = `TechStore - ${itemsList.substring(0, 80)}`;

    const ppb = new PPaymentButtonBox({
        token: PAYPHONE_CONFIG.token,
        clientTransactionId: clientTransactionId,
        amount: amountCents,
        amountWithoutTax: amountWithoutTaxCents,
        amountWithTax: amountWithTaxCents,
        tax: taxCents,
        currency: PAYPHONE_CONFIG.currency,
        storeId: PAYPHONE_CONFIG.storeId,
        reference: reference
    });

    ppb.render('pp-button');

    localStorage.setItem('lastTransactionId', clientTransactionId);
    localStorage.setItem('lastTransactionAmount', totals.total);
    localStorage.setItem('lastTransactionReference', reference);
    localStorage.setItem('lastTransactionDate', new Date().toISOString());
}

// ===== INICIALIZACIÓN =====
function initCheckout() {
    const savedCart = localStorage.getItem('checkoutCart');
    
    if (!savedCart) {
        showEmptyCart();
        return;
    }

    cart = JSON.parse(savedCart);

    if (cart.length === 0) {
        showEmptyCart();
        return;
    }

    renderOrderSummary();
    initializePaymentButton();
}

document.addEventListener('DOMContentLoaded', initCheckout);
