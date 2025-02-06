document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart functionality
    initializeCheckout();
    updateCartIcon();
    
    // Check if any items are in cart and update their display
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length > 0) {
        document.querySelectorAll('.menu-text').forEach(menuItem => {
            const name = menuItem.querySelector('h2').textContent;
            const details = menuItem.querySelector('p').textContent;
            const cartItem = cart.find(item => item.name === name && item.details === details);
            
            if (cartItem) {
                const priceAction = menuItem.querySelector('.price-action');
                const price = priceAction.querySelector('.price').textContent;
                priceAction.innerHTML = `
                    <span class="price">${price}</span>
                    <div class="quantity-control">
                        <button class="minus" onclick="decrementQuantity(this)">-</button>
                        <span class="quantity">${cartItem.quantity}</span>
                        <button class="plus" onclick="incrementQuantity(this)">+</button>
                    </div>
                `;
            }
        });
    }

    // Hamburger menu toggle
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            const menu = document.getElementById('menu');
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
    }

    // WhatsApp Button Dragging
    const whatsappBtn = document.getElementById("whatsapp-btn");
    if (whatsappBtn) {
        let isDragging = false;
        let startX, startY;
        let hasMoved = false;

        document.addEventListener("mousedown", function(e) {
            if (e.target === whatsappBtn) {
                isDragging = true;
                hasMoved = false;
                startX = e.clientX - whatsappBtn.offsetLeft;
                startY = e.clientY - whatsappBtn.offsetTop;
            }
        });

        document.addEventListener("mousemove", function(e) {
            if (isDragging) {
                hasMoved = true;
                e.preventDefault();
                let left = e.clientX - startX;
                let top = e.clientY - startY;
                
                left = Math.min(Math.max(0, left), window.innerWidth - whatsappBtn.offsetWidth);
                top = Math.min(Math.max(0, top), window.innerHeight - whatsappBtn.offsetHeight);
                
                whatsappBtn.style.left = left + "px";
                whatsappBtn.style.top = top + "px";
            }
        });

        document.addEventListener("mouseup", function(e) {
            if (isDragging && !hasMoved && e.target === whatsappBtn) {
                makePhoneCall();
            }
            isDragging = false;
        });
    }
});

function initializeCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    loadOrderSummary(cart);
    initializeForm();
    initializePhoneAndPin();
}

function initializePhoneAndPin() {
    const phoneInput = document.getElementById('phone');
    const pinInputs = document.querySelectorAll('.pin-input');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let phoneNumber = e.target.value.replace(/\D/g, '');
            
            if (phoneNumber) {
                if (phoneNumber.startsWith('0')) {
                    phoneNumber = '234' + phoneNumber.substring(1);
                }
                else if (!phoneNumber.startsWith('234')) {
                    phoneNumber = '234' + phoneNumber;
                }
                
                phoneNumber = phoneNumber.slice(0, 13);
                const formatted = phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '+$1 $2 $3');
                e.target.value = formatted;
                
                const lastFiveDigits = phoneNumber.slice(-5);
                updatePinInputs(lastFiveDigits);
            }
        });
    }

    if (pinInputs.length) {
        pinInputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '').slice(0, 1);
                
                if (e.target.value && index < pinInputs.length - 1) {
                    pinInputs[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !e.target.value && index > 0) {
                    pinInputs[index - 1].focus();
                }
            });
        });
    }
}

// Cart functionality
function addToCart(button) {
    const menuItem = button.closest('.menu-text');
    const name = menuItem.querySelector('h2').textContent;
    const details = menuItem.querySelector('p').textContent;
    const price = parseInt(menuItem.querySelector('.price').textContent.replace(/[^0-9]/g, ''));
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.name === name && item.details === details);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            details: details,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    const priceAction = button.closest('.price-action');
    priceAction.innerHTML = `
        <span class="price">N${price}</span>
        <div class="quantity-control">
            <button class="minus" onclick="decrementQuantity(this)">-</button>
            <span class="quantity">1</span>
            <button class="plus" onclick="incrementQuantity(this)">+</button>
        </div>
    `;
    
    updateCartIcon();
}

function incrementQuantity(button) {
    const controls = button.closest('.quantity-control');
    const quantitySpan = controls.querySelector('.quantity');
    const menuItem = button.closest('.menu-text');
    const name = menuItem.querySelector('h2').textContent;
    const details = menuItem.querySelector('p').textContent;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const item = cart.find(item => item.name === name && item.details === details);
    if (item) {
        item.quantity++;
        quantitySpan.textContent = item.quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartIcon();
    }
}

function decrementQuantity(button) {
    const controls = button.closest('.quantity-control');
    const quantitySpan = controls.querySelector('.quantity');
    const menuItem = button.closest('.menu-text');
    const name = menuItem.querySelector('h2').textContent;
    const details = menuItem.querySelector('p').textContent;
    const price = menuItem.querySelector('.price').textContent;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const itemIndex = cart.findIndex(item => item.name === name && item.details === details);
    if (itemIndex > -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity--;
            quantitySpan.textContent = cart[itemIndex].quantity;
        } else {
            cart.splice(itemIndex, 1);
            const priceAction = button.closest('.price-action');
            priceAction.innerHTML = `
                <span class="price">${price}</span>
                <button class="add-to-cart" onclick="addToCart(this)">Add to cart</button>
            `;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartIcon();
    }
}

function updateCartIcon() {
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

function updatePinInputs(digits) {
    const pinInputs = document.querySelectorAll('.pin-input');
    digits = digits.padStart(5, '0');
    
    pinInputs.forEach((input, index) => {
        input.value = digits[index];
    });
}

function loadOrderSummary(cart) {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 0;
    const total = subtotal + deliveryFee;
    
    const subtotalElement = document.getElementById('subtotal');
    const deliveryFeeElement = document.getElementById('deliveryFee');
    const totalElement = document.getElementById('total');

    if (subtotalElement) subtotalElement.textContent = `₦${subtotal.toLocaleString()}`;
    if (deliveryFeeElement) deliveryFeeElement.textContent = `₦${deliveryFee.toLocaleString()}`;
    if (totalElement) totalElement.textContent = `₦${total.toLocaleString()}`;
}

function initializeForm() {
    const form = document.getElementById('checkoutForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm()) {
                sendToWhatsApp();
            }
        });
    }
}

function validateForm() {
    const phone = document.getElementById('phone').value.replace(/\D/g, '');
    const address = document.getElementById('address').value;
    const pinInputs = document.querySelectorAll('.pin-input');
    const enteredPin = Array.from(pinInputs).map(input => input.value).join('');
    const lastFiveDigits = phone.slice(-5);

    if (phone.length < 11) {
        showError('Please enter a valid phone number');
        return false;
    }

    if (!address || address.trim().length < 10) {
        showError('Please enter a valid delivery address (minimum 10 characters)');
        return false;
    }

    if (enteredPin !== lastFiveDigits) {
        showError('PIN must match the last 5 digits of your phone number');
        return false;
    }

    return true;
}

function showError(message) {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <div class="error-content">
            <img src="assets/icons/error-icon.png" alt="Error">
            <span>${message}</span>
        </div>
    `;
    
    const form = document.querySelector('form');
    if (form) {
        form.insertBefore(errorDiv, form.querySelector('.action-buttons'));

        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

function sendToWhatsApp() {
    showLoadingMessage();

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const total = document.getElementById('total').textContent;
    
    const orderPin = phone.replace(/\D/g, '').slice(-5);

    let message = "🛍️ *New Order*\n";
    message += `*Order PIN*: ${orderPin}\n`;
    message += "──────────\n\n";
   
    message += "\n📋 *Order Details*\n";
    cart.forEach(item => {
        message += `•  ${item.name} x ${item.quantity} = ₦${(item.price * item.quantity).toLocaleString()}\n`;
        if (item.details) {
          message += `${item.details}\n`;
        }
    });

    message += "\n🏡 *Delivery Address:*\n";
    message += `${address}\n\n`;
    message += `📱 ${phone}\n\n`;


    message += " 🚚 *Delivery Fee:* Free\n";
    message += " 💰 *Order Total:*\n";
    message += `₦${total.replace('₦', '').trim()}\n`;

    saveOrderToHistory(cart, phone, address, total, orderPin);

    const whatsappNumber = "2348080161767";
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

    localStorage.removeItem('cart');

    setTimeout(() => {
        window.location.href = whatsappUrl;
    }, 1500);
}

function showLoadingMessage() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-message';
    loadingDiv.innerHTML = `
        <div class="spinner"></div>
        <p>Processing your order...</p>
    `;
    document.body.appendChild(loadingDiv);
}

function saveOrderToHistory(cart, phone, address, total, orderPin) {
    const order = {
        id: Date.now().toString(),
        items: cart,
        phone: phone,
        address: address,
        total: total,
        orderPin: orderPin,
        status: 'pending',
        timestamp: new Date().toISOString()
    };

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}

function togglePinVisibility() {
    const pinInputs = document.querySelectorAll('.pin-input');
    const eyeIcon = document.querySelector('.eye-icon');
    
    if (pinInputs.length && eyeIcon) {
        pinInputs.forEach(input => {
            if (input.type === 'password') {
                input.type = 'text';
                eyeIcon.src = 'assets/icons/eye-off.png';
            } else {
                input.type = 'password';
                eyeIcon.src = 'assets/icons/eye.png';
            }
        });
    }
}

// Navigation functions
function goToCart() {
    window.location.href = 'cart.html';
}

function navigateTo(page) {
    window.location.href = `${page}.html`;
}

function goBack() {
    window.history.back();
}

function makePhoneCall() {
    window.location.href = 'tel:+2348080161767';
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    updateCartIcon();
});