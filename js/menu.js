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
    
    // Update button to show quantity controls
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
            // Change back to Add to cart button
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

// Navigation
function goToCart() {
    window.location.href = 'cart.html';
}

function navigateTo(page) {
    window.location.href = `${page}.html`;
}

// Hamburger menu toggle
document.getElementById('menu-btn').addEventListener('click', function () {
    const menu = document.getElementById('menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});



// Initialize page state
document.addEventListener('DOMContentLoaded', function() {
    // Update cart icon
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
});

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
    
    // Update button to show quantity controls
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
            // Change back to Add to cart button
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

// Navigation
function goToCart() {
    window.location.href = 'cart.html';
}

function navigateTo(page) {
    window.location.href = `${page}.html`;
}

// Initialize page state
document.addEventListener('DOMContentLoaded', function() {
    // Update cart icon
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
});

// Rest of your existing code for hamburger menu and WhatsApp functionality

// Add this after each localStorage update in menu.js:

// In addToCart function:
localStorage.setItem('cart', JSON.stringify(cart));
updateCartNotification();  // Add this line

// In incrementQuantity function:
localStorage.setItem('cart', JSON.stringify(cart));
updateCartNotification();  // Add this line

// In decrementQuantity function:
localStorage.setItem('cart', JSON.stringify(cart));
updateCartNotification();  // Add this line

// In the DOMContentLoaded event listener:
document.addEventListener('DOMContentLoaded', function() {
    updateCartNotification();  // Add this line
    // ... rest of the initialization code
});

function updateCartNotification() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const cartBtn = document.querySelector('.cart-btn');
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