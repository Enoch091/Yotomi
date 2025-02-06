// Navigation Functions
function goToSoupMenu(soupType) {
    window.location.href = `menu-${soupType}.html`;
}

function goToCart() {
    window.location.href = 'cart.html';
}

function navigateTo(page) {
    window.location.href = `${page}.html`;
}

function openWhatsApp() {
    window.open('https://wa.me/+2348080161767', '_blank');
}

// Menu Toggle
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');

menuBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    menu.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    if (menu.classList.contains('active') && !menu.contains(event.target) && event.target !== menuBtn) {
        menu.classList.remove('active');
    }
});

// WhatsApp Button Dragging
const whatsappBtn = document.getElementById("whatsapp-btn");
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
        openWhatsApp();
    }
    isDragging = false;
});

// Touch support
whatsappBtn.addEventListener("touchstart", function(e) {
    const touch = e.touches[0];
    startX = touch.clientX - whatsappBtn.offsetLeft;
    startY = touch.clientY - whatsappBtn.offsetTop;
    isDragging = true;
    hasMoved = false;
});

document.addEventListener("touchmove", function(e) {
    if (isDragging) {
        hasMoved = true;
        e.preventDefault();
        const touch = e.touches[0];
        let left = touch.clientX - startX;
        let top = touch.clientY - startY;
        
        left = Math.min(Math.max(0, left), window.innerWidth - whatsappBtn.offsetWidth);
        top = Math.min(Math.max(0, top), window.innerHeight - whatsappBtn.offsetHeight);
        
        whatsappBtn.style.left = left + "px";
        whatsappBtn.style.top = top + "px";
    }
}, { passive: false });

document.addEventListener("touchend", function(e) {
    if (isDragging && !hasMoved) {
        openWhatsApp();
    }
    isDragging = false;
});


// Add this function to script.js
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

// Add this at the end of your existing DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing code ...
    
    // Add this line to update cart notification when page loads
    updateCartNotification();
});


// Toggle Hamburger Menu
document.getElementById('menu-btn').addEventListener('click', () => {
    const menu = document.getElementById('menu');
    menu.classList.toggle('open');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.getElementById('menu');
    if (!menu.contains(e.target) && e.target.id !== 'menu-btn') {
        menu.classList.remove('open');
    }
});


// Open About Us Modal
function openAboutUs() {
    document.getElementById('aboutModal').style.display = 'flex';
}

// Close Modal
function closeModal() {
    document.getElementById('aboutModal').style.display = 'none';
}
