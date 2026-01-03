// Product Data
const products = [
    {
        id: 1,
        name: "Premium Wireless Headphones",
        description: "High-quality audio with noise cancellation",
        price: 299.99,
        image: "IMG/1.webp",
        rating: 4.8,
        reviews: [
            { author: "Sarah M.", rating: 5, text: "Absolutely love these headphones! The sound quality is incredible and they're so comfortable." },
            { author: "James K.", rating: 4, text: "Great product, battery life could be better but overall very satisfied." }
        ]
    },
    {
        id: 2,
        name: "Smart Watch Pro",
        description: "Track your fitness and stay connected",
        price: 399.99,
        image: "IMG/2.webp",
        rating: 4.6,
        reviews: [
            { author: "Emily R.", rating: 5, text: "Best smartwatch I've ever owned. The health tracking features are amazing!" },
            { author: "Michael B.", rating: 4, text: "Very good watch, but the app could use some improvements." }
        ]
    },
    {
        id: 3,
        name: "Minimalist Leather Bag",
        description: "Elegant design for everyday carry",
        price: 189.99,
        image: "IMG/3.webp",
        rating: 4.9,
        reviews: [
            { author: "David L.", rating: 5, text: "The quality is outstanding. This bag will last for years!" },
            { author: "Lisa P.", rating: 5, text: "Perfect size and beautiful craftsmanship. Highly recommend!" }
        ]
    },
    {
        id: 4,
        name: "Portable Bluetooth Speaker",
        description: "Powerful sound in a compact design",
        price: 129.99,
        image: "IMG/4.webp",
        rating: 4.7,
        reviews: [
            { author: "Tom W.", rating: 5, text: "Great sound for the size. Perfect for outdoor activities!" },
            { author: "Rachel S.", rating: 4, text: "Good speaker, battery lasts a long time." }
        ]
    },
    {
        id: 5,
        name: "Ergonomic Office Chair",
        description: "Comfort and support for long work hours",
        price: 449.99,
        image: "IMG/5.webp",
        rating: 4.8,
        reviews: [
            { author: "Karen H.", rating: 5, text: "My back pain has significantly reduced since using this chair!" },
            { author: "Robert J.", rating: 5, text: "Worth every penny. So comfortable and adjustable." }
        ]
    },
    {
        id: 6,
        name: "Stainless Steel Water Bottle",
        description: "Keep drinks cold for 24 hours",
        price: 34.99,
        image: "IMG/6.webp",
        rating: 4.9,
        reviews: [
            { author: "Jessica T.", rating: 5, text: "Keeps my water ice cold all day. Love it!" },
            { author: "Mark D.", rating: 5, text: "Great quality and the perfect size for my gym bag." }
        ]
    },
    {
        id: 7,
        name: "Wireless Charging Pad",
        description: "Fast charging for all compatible devices",
        price: 49.99,
        image: "IMG/7.webp",
        rating: 4.5,
        reviews: [
            { author: "Amy C.", rating: 4, text: "Works well, but wish it was a bit faster." },
            { author: "Chris M.", rating: 5, text: "Sleek design and charges my phone quickly!" }
        ]
    },
    {
        id: 8,
        name: "Organic Cotton T-Shirt",
        description: "Sustainable and super comfortable",
        price: 29.99,
        image: "IMG/8.webp",
        rating: 4.7,
        reviews: [
            { author: "Nicole F.", rating: 5, text: "So soft and comfortable! Will definitely buy more." },
            { author: "Brian L.", rating: 4, text: "Good quality shirt, fits well." }
        ]
    }
];

// Cart state
let cart = [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    setupEventListeners();
    loadCartFromStorage();
});

// Render products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" onclick="openProductModal(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    <span class="stars">${generateStars(product.rating)}</span>
                    <span class="rating-count">(${product.rating})</span>
                </div>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Generate star rating
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + 
           (halfStar ? '☆' : '') + 
           '☆'.repeat(emptyStars);
}

// Setup event listeners
function setupEventListeners() {
    // Cart button
    document.getElementById('cartBtn').addEventListener('click', toggleCart);
    document.getElementById('closeCart').addEventListener('click', toggleCart);
    
    // Modal
    document.getElementById('modalClose').addEventListener('click', closeProductModal);
    document.getElementById('productModal').addEventListener('click', (e) => {
        if (e.target.id === 'productModal') closeProductModal();
    });
    
    // Quantity controls in modal
    document.getElementById('decreaseQty').addEventListener('click', () => {
        const input = document.getElementById('modalQuantity');
        if (input.value > 1) input.value = parseInt(input.value) - 1;
    });
    
    document.getElementById('increaseQty').addEventListener('click', () => {
        const input = document.getElementById('modalQuantity');
        if (input.value < 10) input.value = parseInt(input.value) + 1;
    });
    
    // Add to cart from modal
    document.getElementById('modalAddToCart').addEventListener('click', () => {
        const productId = parseInt(document.getElementById('modalAddToCart').dataset.productId);
        const quantity = parseInt(document.getElementById('modalQuantity').value);
        addToCart(productId, quantity);
        closeProductModal();
    });
    
    // Checkout button
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
    
    // Menu toggle
    document.getElementById('menuToggle').addEventListener('click', () => {
        const menu = document.getElementById('navMenu');
        menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    });
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    cartSidebar.classList.toggle('active');
    renderCart();
}

// Add to cart
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }
    
    updateCartCount();
    saveCartToStorage();
    
    // Show feedback
    showNotification('Item added to cart!');
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
    saveCartToStorage();
}

// Update cart item quantity
function updateCartQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            renderCart();
            saveCartToStorage();
        }
    }
}

// Render cart
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        updateCartSummary();
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-controls">
                    <button class="cart-qty-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="cart-qty-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
    
    updateCartSummary();
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.10; // 10% tax
    const shipping = cart.length > 0 ? 5.00 : 0;
    const total = subtotal + tax + shipping;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// Update cart count badge
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

// Open product modal
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById('productModal');
    
    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductImage').alt = product.name;
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalProductPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('modalProductRating').innerHTML = `
        <span class="stars">${generateStars(product.rating)}</span>
        <span class="rating-count">(${product.rating})</span>
    `;
    document.getElementById('modalProductDescription').textContent = product.description;
    
    // Render reviews
    const reviewsHTML = product.reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <span class="review-author">${review.author}</span>
                <span class="review-stars">${generateStars(review.rating)}</span>
            </div>
            <p class="review-text">${review.text}</p>
        </div>
    `).join('');
    document.getElementById('modalProductReviews').innerHTML = reviewsHTML;
    
    document.getElementById('modalQuantity').value = 1;
    document.getElementById('modalAddToCart').dataset.productId = productId;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close product modal
function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.10;
    const shipping = 5.00;
    const total = subtotal + tax + shipping;
    
    const orderSummary = `
Order Summary:
${cart.map(item => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Subtotal: $${subtotal.toFixed(2)}
Tax (10%): $${tax.toFixed(2)}
Shipping: $${shipping.toFixed(2)}
Total: $${total.toFixed(2)}

Thank you for your order!
    `;
    
    alert(orderSummary);
    
    // Clear cart
    cart = [];
    updateCartCount();
    renderCart();
    saveCartToStorage();
    toggleCart();
}

// Show notification
function showNotification(message) {
    // Simple alert for now - can be enhanced with a toast notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--success);
        color: white;
        padding: 1rem 2rem;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Storage functions
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);