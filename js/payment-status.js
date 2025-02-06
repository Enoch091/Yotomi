// Function to show payment success
function showPaymentSuccess() {
    // Hide loading state if present
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }

    // Show success state
    const successState = document.querySelector('.success-state');
    const failedState = document.querySelector('.failed-state');

    failedState.classList.remove('active');
    successState.classList.add('active');

    // After showing success, reset cart
    localStorage.removeItem('cart');
}

// Function to show payment failure
function showPaymentFailed() {
    // Hide loading state if present
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }

    // Show failed state
    const successState = document.querySelector('.success-state');
    const failedState = document.querySelector('.failed-state');

    successState.classList.remove('active');
    failedState.classList.add('active');
}

// Handle try again button
document.querySelector('.try-again-btn')?.addEventListener('click', () => {
    // Redirect back to payment page
    window.location.href = 'payment.html';
});

// Handle close button
document.querySelector('.close-btn')?.addEventListener('click', () => {
    // Go back to cart
    window.location.href = 'cart.html';
});

// Handle complete button
document.querySelector('.complete-btn')?.addEventListener('click', () => {
    // Redirect to order confirmation or home
    window.location.href = 'order-confirmation.html';
});

// Function to download receipt
function downloadReceipt() {
    const currentOrder = JSON.parse(localStorage.getItem('currentOrder'));
    if (!currentOrder) return;

    // Here you would implement receipt generation and download
    // For now, we'll just log the action
    console.log('Downloading receipt for order:', currentOrder.id);
}

// Initialize status based on URL parameter
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');

    if (status === 'success') {
        showPaymentSuccess();
    } else if (status === 'failed') {
        showPaymentFailed();
    }
});