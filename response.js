// ===== CONFIGURACIÓN =====
const PAYPHONE_TOKEN = 'aPN-zz1uvTZSy9yZaiqVdccZhIOlulh8ECGRTM-fOtZlcSC9pcGOj7Gg4p4gpR0lZeZhKsvgY1JeApYF5VDjfgMm0pjbPcfCn0XwdiJGOFjqMJHGdgI-_HrDXMHRdu1eRm80KGzJJ69QsD7oTIoKjAR_sp_jLOJpXM7aub18CgY96MAMZL-M9KaUaqu7W72iNNRLZXfunk9tB7mA_S1bxtrJrhTVnCXBbUE65M_lUx-qvFRluKyGvujlyJ1yAaC3KRYgs3CnhYzzzEbDDnC5LDpiicVZ5J8bNtukUFi9qtxaJx-hvSzQ4FPVJm57MV10AkdGSw';

// ===== UTILIDADES =====
function getUrlParameters() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const pairs = queryString.split('&');
    
    for (let pair of pairs) {
        const [key, value] = pair.split('=');
        if (key) {
            params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
    }
    
    return params;
}

function formatCurrency(amount, currency = 'USD') {
    const symbols = { 'USD': '$', 'EUR': '€', 'GBP': '£' };
    const symbol = symbols[currency] || currency;
    return `${symbol}${parseFloat(amount).toFixed(2)}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

// ===== PROCESAMIENTO DE RESPUESTA =====
function processResponse(data, isFromAPI = false) {
    const statusCode = data.statusCode?.toString() || data.status || data.transactionStatus || 'Unknown';
    
    let statusType = 'pending';
    let statusText = 'Estado Desconocido';
    
    if (statusCode === '3' || statusCode === 'Approved') {
        statusType = 'success';
        statusText = 'Pago Aprobado';
    } else if (statusCode === '5' || statusCode === 'Rejected') {
        statusType = 'error';
        statusText = 'Pago Rechazado';
    } else if (statusCode === '9' || statusCode === '2' || statusCode === 'Cancelled') {
        statusType = 'cancelled';
        statusText = 'Pago Cancelado';
    } else if (statusCode === '1' || statusCode === 'Pending') {
        statusType = 'pending';
        statusText = 'Pago Pendiente';
    }

    return {
        clientTransactionId: data.clientTransactionId || data.clientTxId || 'N/A',
        transactionId: data.transactionId?.toString() || data.id || 'N/A',
        status: statusCode,
        statusType: statusType,
        statusText: statusText,
        amount: isFromAPI ? (data.amount || 0) / 100 : (data.amount || 0),
        currency: data.currency || 'USD',
        reference: data.reference || 'Sin referencia',
        authorizationCode: data.authorizationCode || null,
        phoneNumber: data.phoneNumber || null,
        email: data.email || null,
        message: data.message || data.responseText || statusText,
        date: data.date || new Date().toISOString(),
        rawResponse: data
    };
}

// ===== CONFIRMACIÓN CON API =====
async function confirmTransaction(id, clientTxId) {
    try {
        const response = await fetch('https://pay.payphonetodoesposible.com/api/button/V2/Confirm', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${PAYPHONE_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: parseInt(id),
                clientTxId: clientTxId
            })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        return processResponse(data, true);
    } catch (error) {
        console.error('Error al confirmar transacción:', error);
        return null;
    }
}

// ===== INTERFAZ DE USUARIO =====
function displayTransactionStatus(response) {
    document.getElementById('loading-section').style.display = 'none';
    document.getElementById('response-content').style.display = 'block';
    
    const icons = { success: '✅', error: '❌', pending: '⏳', cancelled: '🚫' };
    const alertMessages = {
        success: '¡Pago procesado exitosamente! La transacción ha sido aprobada.',
        error: 'El pago fue rechazado. Por favor, intenta con otro método de pago.',
        pending: 'El pago está siendo procesado. Te notificaremos cuando se complete.',
        cancelled: 'El pago fue cancelado por el usuario.'
    };
    
    document.getElementById('status-icon').textContent = icons[response.statusType];
    document.getElementById('status-icon').className = 'status-icon ' + response.statusType;
    document.getElementById('status-title').textContent = response.statusText;
    
    const alertElement = document.getElementById('status-alert');
    alertElement.className = 'alert ' + response.statusType;
    alertElement.querySelector('#alert-icon').textContent = icons[response.statusType];
    alertElement.querySelector('#alert-message').textContent = alertMessages[response.statusType];
    
    document.getElementById('status-badge').textContent = response.statusText;
    document.getElementById('status-badge').className = 'badge ' + response.statusType;
    
    document.getElementById('transaction-id').textContent = response.clientTransactionId;
    document.getElementById('amount').textContent = formatCurrency(response.amount, response.currency);
    document.getElementById('reference').textContent = response.reference;
    document.getElementById('date').textContent = formatDate(response.date);
    
    if (response.transactionId && response.transactionId !== 'N/A') {
        document.getElementById('payphone-id-row').style.display = 'flex';
        document.getElementById('payphone-id').textContent = response.transactionId;
    }
    
    if (response.authorizationCode) {
        document.getElementById('authorization-row').style.display = 'flex';
        document.getElementById('authorization-code').textContent = response.authorizationCode;
    }
    
    document.getElementById('json-response').textContent = JSON.stringify(response, null, 2);
}

// ===== INICIALIZACIÓN =====
async function initializeResponsePage() {
    const urlParams = getUrlParameters();
    
    if (urlParams.id && urlParams.clientTransactionId) {
        const response = await confirmTransaction(urlParams.id, urlParams.clientTransactionId);
        
        if (response) {
            displayTransactionStatus(response);
            localStorage.setItem('lastTransactionResponse', JSON.stringify(response));
            
            if (response.statusType === 'success') {
                localStorage.removeItem('cart');
                localStorage.removeItem('checkoutCart');
            }
            return;
        }
    }
    
    // Fallback: usar parámetros de URL directamente
    const lastTransaction = localStorage.getItem('lastTransactionId');
    if (lastTransaction) {
        urlParams.clientTransactionId = urlParams.clientTransactionId || lastTransaction;
        urlParams.amount = urlParams.amount || localStorage.getItem('lastTransactionAmount') || '0';
        urlParams.reference = urlParams.reference || localStorage.getItem('lastTransactionReference') || 'Sin referencia';
        urlParams.date = urlParams.date || localStorage.getItem('lastTransactionDate') || new Date().toISOString();
    }
    
    const response = processResponse(urlParams);
    displayTransactionStatus(response);
    localStorage.setItem('lastTransactionResponse', JSON.stringify(response));
}

window.addEventListener('DOMContentLoaded', initializeResponsePage);
