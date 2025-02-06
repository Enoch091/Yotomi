document.addEventListener('DOMContentLoaded', function() {
    const emptyCartSection = document.getElementById('emptyCart');
    const cartItemsSection = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    
    updateCartDisplay();

    function updateCartDisplay() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cart.length === 0) {
            emptyCartSection.style.display = 'block';
            cartItemsSection.style.display = 'none';
            cartFooter.style.display = 'none';
        } else {
            emptyCartSection.style.display = 'none';
            cartItemsSection.style.display = 'block';
            cartFooter.style.display = 'flex';
            
            // Clear existing items
            cartItemsSection.innerHTML = '';
            
            // Add each item
            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <div class="item-header">
                        <div>
                            <h3>${item.name}</h3>
                            <p>${item.details}</p>
                            <span class="price">₦${(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                        <button class="delete-btn" onclick="removeItem(${index})">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="item-actions">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                        </div>
                        <button class="duplicate-btn" onclick="duplicateItem(${index})">Duplicate pack</button>
                    </div>
                `;
                cartItemsSection.appendChild(itemElement);
            });

            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            cartFooter.innerHTML = `
                <button class="call-btn" onclick="makePhoneCall()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                </button>
                <button class="checkout-btn" onclick="proceedToCheckout()">CHECK OUT (₦${totalPrice.toLocaleString()})</button>
            `;
        }
        updateCartNotification();
    }

    window.updateQuantity = function(index, change) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (index >= 0 && index < cart.length) {
            if (change === -1 && cart[index].quantity === 1) {
                cart.splice(index, 1);
            } else {
                cart[index].quantity += change;
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
    };

    window.duplicateItem = function(index) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (index >= 0 && index < cart.length) {
            const itemToDuplicate = {...cart[index]};
            cart.push(itemToDuplicate);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
    };

    window.removeItem = function(index) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (index >= 0 && index < cart.length) {
            cart.splice(index, 1);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
    };

    window.proceedToCheckout = function() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        window.location.href = 'checkout.html?type=delivery';
    };

    window.openWhatsApp = function() {
        window.open('https://wa.me/2348038701309', '_blank');
    };
});

function updateCartNotification() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        let notification = cartBtn.querySelector('.cart-notification');
        if (totalItems > 0) {
            if (!notification) {
                notification = document.createElement('span');
                notification.className = 'cart-notification';
                cartBtn.appendChild(notification);
            }
            notification.textContent = totalItems;
        } else if (notification) {
            notification.remove();
        }
    }
}

function startOrdering() {
    window.location.href = 'index.html';
}

function goBack() {
    window.history.back();
}

function makePhoneCall() {
    window.location.href = 'tel:+2348080161767';
}