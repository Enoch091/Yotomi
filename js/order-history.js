document.addEventListener('DOMContentLoaded', function() {
    initializeOrderHistory();
});

function initializeOrderHistory() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const emptyState = document.getElementById('emptyState');
    const ordersList = document.getElementById('ordersList');

    if (orders.length === 0) {
        emptyState.style.display = 'block';
        ordersList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        ordersList.style.display = 'block';
        displayOrders(orders);
    }
}

function displayOrders(orders) {
    const ordersList = document.getElementById('ordersList');
    const template = document.getElementById('orderTemplate');
    
    // Sort orders by date, newest first
    orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    orders.forEach(order => {
        const orderElement = template.content.cloneNode(true);
        
        // Set order date
        const date = new Date(order.timestamp);
        orderElement.querySelector('.order-date').textContent = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        // Set order total
        orderElement.querySelector('.order-total').textContent = order.total;

        // Add items to the list
        const itemsList = orderElement.querySelector('.items-list');
        order.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <span>${item.name} × ${item.quantity}</span>
                <span>₦${(item.price * item.quantity).toLocaleString()}</span>
            `;
            itemsList.appendChild(itemElement);
        });

        // Store order data for reordering
        orderElement.querySelector('.reorder-btn').dataset.orderId = order.id;

        ordersList.appendChild(orderElement);
    });
}

function toggleOrderDetails(header) {
    const details = header.nextElementSibling;
    const isHidden = details.style.display === 'none';
    
    // Close all other open details first
    document.querySelectorAll('.order-details').forEach(detail => {
        if (detail !== details) {
            detail.style.display = 'none';
        }
    });

    // Toggle this detail
    details.style.display = isHidden ? 'block' : 'none';
}

function reorderItems(button) {
    const orderId = button.dataset.orderId;
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const order = orders.find(o => o.id === orderId);

    if (order) {
        // Get current cart or initialize new one
        const currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Add items from the order to the cart
        order.items.forEach(item => {
            currentCart.push({
                name: item.name,
                details: item.details,
                price: item.price,
                quantity: item.quantity
            });
        });

        // Save updated cart
        localStorage.setItem('cart', JSON.stringify(currentCart));

        // Show success message
        showReorderSuccess();

        // Navigate to cart
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1500);
    }
}

function showReorderSuccess() {
    const message = document.createElement('div');
    message.className = 'success-message';
    message.textContent = 'Items added to cart!';
    document.body.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 1500);
}

function startOrdering() {
    window.location.href = 'index.html';
}

function goBack() {
    window.history.back();
}


// Status display helper
function getStatusDisplay(order) {
    switch (order.status) {
        case 'pending':
            return {
                text: 'Payment Pending',
                class: 'pending'
            };
        case 'payment_confirmed':
            return {
                text: 'Processing Order',
                class: 'processing'
            };
        case 'successful':
            return {
                text: 'Order Delivered',
                class: 'successful'
            };
        case 'payment_failed':
            return {
                text: 'Payment Failed',
                class: 'failed'
            };
        default:
            return {
                text: 'Unknown Status',
                class: 'unknown'
            };
    }
}

function displayOrders(orders) {
    const ordersList = document.getElementById('ordersList');
    const template = document.getElementById('orderTemplate');
    
    // Sort orders by date, newest first
    orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    orders.forEach(order => {
        const orderElement = template.content.cloneNode(true);
        
        // Set order date
        const date = new Date(order.timestamp);
        orderElement.querySelector('.order-date').textContent = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        // Set status badge
        const status = getStatusDisplay(order);
        const statusBadge = orderElement.querySelector('.status-badge');
        statusBadge.textContent = status.text;
        statusBadge.className = `status-badge ${status.class}`;

        // Set order total
        orderElement.querySelector('.order-total').textContent = order.total;

        // Add items to the list
        const itemsList = orderElement.querySelector('.items-list');
        order.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <span>${item.name} × ${item.quantity}</span>
                <span>₦${(item.price * item.quantity).toLocaleString()}</span>
            `;
            itemsList.appendChild(itemElement);
        });

        // Show reorder button only for successful orders
        const reorderBtn = orderElement.querySelector('.reorder-btn');
        if (order.status === 'successful') {
            reorderBtn.dataset.orderId = order.id;
        } else {
            reorderBtn.style.display = 'none';
        }

        ordersList.appendChild(orderElement);
    });
}