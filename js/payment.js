// Paystack public key
const PAYSTACK_PUBLIC_KEY = 'your_paystack_public_key';

document.addEventListener('DOMContentLoaded', function() {
    initializePayment();
});

async function initializePayment() {
    // Load order details from localStorage
    const currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
    if (!currentOrder) {
        window.location.href = 'cart.html';
        return;
    }

    // Update amount display
    document.getElementById('amountValue').textContent = currentOrder.total;
    
    // Initialize Paystack
    await generateDedicatedAccount(currentOrder);
}

async function generateDedicatedAccount(order) {
    const loadingState = document.getElementById('loadingState');
    const bankDetails = document.getElementById('bankDetails');
    
    try {
        // API call to your backend to generate dedicated account
        const response = await fetch('your_backend_url/generate-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: parseFloat(order.total.replace(/[^0-9.]/g, '')),
                email: order.email || 'customer@example.com', // You should collect email during checkout
                reference: order.id
            })
        });

        const data = await response.json();

        if (data.status) {
            // Store payment reference
            localStorage.setItem('paymentReference', data.data.reference);
            
            // Update UI with account details
            document.getElementById('bankName').textContent = data.data.bank;
            document.getElementById('accountNumber').textContent = data.data.account_number;
            document.getElementById('accountName').textContent = data.data.account_name;
            
            // Show bank details
            loadingState.style.display = 'none';
            bankDetails.style.display = 'block';

            // Start polling for payment status
            startPaymentStatusCheck(data.data.reference);
        } else {
            throw new Error('Failed to generate account');
        }
    } catch (error) {
        console.error('Error generating account:', error);
        showError('Unable to generate bank account. Please try again.');
    }
}

function startPaymentStatusCheck(reference) {
    const pollInterval = 10000; // Check every 10 seconds
    
    const checkStatus = async () => {
        try {
            const response = await fetch(`your_backend_url/verify-payment/${reference}`);
            const data = await response.json();

            if (data.status === 'success') {
                showSuccessState();
                return; // Stop polling
            } else if (data.status === 'failed') {
                showError('Payment failed. Please try again.');
                return; // Stop polling
            }

            // Continue polling if payment is still pending
            setTimeout(checkStatus, pollInterval);
        } catch (error) {
            console.error('Error checking payment status:', error);
        }
    };

    // Start polling
    setTimeout(checkStatus, pollInterval);
}

// Copy to Clipboard functionality
function copyToClipboard(elementId, type) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    // Remove currency symbol and commas for amount
    const cleanText = type === 'Amount' ? text.replace(/[^0-9]/g, '') : text;

    navigator.clipboard.writeText(cleanText).then(() => {
        showCopyFeedback(elementId, type);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function showCopyFeedback(elementId, type) {
    const button = document.querySelector(`button[onclick="copyToClipboard('${elementId}', '${type}')"]`);
    const originalHtml = button.innerHTML;

    button.classList.add('copied');
    button.innerHTML = `
        <img src="assets/icons/check.png" alt="Copied">
        <span>Copied!</span>
    `;

    setTimeout(() => {
        button.classList.remove('copied');
        button.innerHTML = originalHtml;
    }, 2000);
}

function showSuccessState() {
    const container = document.querySelector('.payment-container');
    container.innerHTML = `
        <div class="success-state">
            <img src="assets/icons/success.png" alt="Success">
            <h2>Payment Successful!</h2>
            <p>Your order has been confirmed.</p>
            <button onclick="window.location.href='order-confirmation.html'" class="success-btn">View Order</button>
        </div>
    `;

    // Clear payment data
    localStorage.removeItem('paymentReference');
}

function showError(message) {
    const statusMessage = document.getElementById('paymentStatus');
    statusMessage.textContent = message;
    statusMessage.classList.add('error');
}

function goBack() {
    window.history.back();
}


// In your payment.js
function verifyPayment(reference) {
    if (paymentSuccessful) {
        window.location.href = 'payment-status.html?status=success';
    } else {
        window.location.href = 'payment-status.html?status=failed';
    }
}



function processOrder() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderData = {
        id: Date.now().toString(),
        items: cart,
        status: 'pending', // Initial status
        timestamp: new Date().toISOString(),
        total: document.getElementById('total').textContent,
        paymentStatus: 'pending',
        deliveryStatus: 'pending'
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.setItem('currentOrder', JSON.stringify(orderData));

    // Clear cart
    localStorage.removeItem('cart');

    // Here you'll verify payment with Paystack
    verifyPaymentStatus(orderData.id);
}

function verifyPaymentStatus(orderId) {
    // Here you'll integrate with Paystack's verification
    // For now, we'll simulate payment verification
    const verificationResult = true; // This would come from Paystack

    if (verificationResult) {
        updateOrderStatus(orderId, 'payment_confirmed');
        showPaymentSuccess();
    } else {
        updateOrderStatus(orderId, 'payment_failed');
        showPaymentFailed();
    }
}

function updateOrderStatus(orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderIndex = orders.findIndex(order => order.id === orderId);

    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        
        // Update specific status fields
        switch (newStatus) {
            case 'payment_confirmed':
                orders[orderIndex].paymentStatus = 'completed';
                orders[orderIndex].deliveryStatus = 'processing';
                break;
            case 'delivered':
                orders[orderIndex].deliveryStatus = 'completed';
                orders[orderIndex].status = 'successful';
                break;
            case 'payment_failed':
                orders[orderIndex].paymentStatus = 'failed';
                break;
        }

        localStorage.setItem('orders', JSON.stringify(orders));
    }
}


function showPaymentSuccess() {
    // Clear cart only after successful payment
    localStorage.removeItem('cart');
    
    // Update order status
    const currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
    if (currentOrder) {
        updateOrderStatus(currentOrder.id, 'payment_confirmed');
    }

    // Show success message and redirect
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.innerHTML = `
        <div class="success-state">
            <div class="status-icon success">✓</div>
            <h2>Payment Successful!</h2>
            <p>Your order has been confirmed.</p>
            <button onclick="window.location.href='index.html'" class="success-btn">Go to Home</button>
        </div>
    `;
    document.body.appendChild(messageDiv);

    // Redirect after delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

function showPaymentFailed() {
    // Don't clear cart, so user can try again
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.innerHTML = `
        <div class="failed-state">
            <div class="status-icon failed">✕</div>
            <h2>Payment Failed!</h2>
            <button onclick="retryPayment()" class="retry-btn">Try Again</button>
            <button onclick="goBack()" class="close-btn">✕</button>
        </div>
    `;
    document.body.appendChild(messageDiv);
}