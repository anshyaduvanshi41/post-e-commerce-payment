const PRODUCT_DATA = {
    id: 'ORD-2026-001234',
    date: 'Jan 6, 2026',
    time: '10:30 AM',
    items: [
        {
            id: 1,
            name: 'Premium Wireless Headphones',
            sku: 'WH-1000XM4',
            price: 12999
        },
        {
            id: 2,
            name: 'Protective Carrying Case',
            sku: 'CASE-002',
            price: 2499
        }
    ],
    subtotal: 15498,
    shipping: 0,
    tax: 2790,
    total: 18288
};

const OFFERINGS_DATA = {
    warranty: { title: 'Complete Device Protection', price: 1999 },
    support: { title: 'VIP Support Package', price: 999 },
    insurance: { title: 'Accident Guard Plan', price: 2499 },
    accessory: { title: 'Premium Audio Bundle', price: 799 }
};

let cartState = { items: [], total: 18288 };
let analyticsEvents = [];

function logAnalyticsEvent(eventName, data) {
    analyticsEvents.push({
        eventName: eventName,
        data: data,
        timestamp: new Date().toISOString()
    });
    console.log(`📊 Event: ${eventName}`, data);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function hideToast() {
    document.getElementById('toast').classList.remove('show');
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function handleAddToCart(event) {
    const button = event.target;
    const offeringId = button.getAttribute('data-offering');
    const offering = OFFERINGS_DATA[offeringId];

    if (cartState.items.find(item => item.id === offeringId)) {
        showToast('📦 This item is already in your cart!');
        return;
    }

    cartState.items.push({ id: offeringId, title: offering.title, price: offering.price });
    cartState.total = 18288 + cartState.items.reduce((sum, item) => sum + item.price, 0);

    button.classList.add('added');
    button.innerHTML = '✓ Added to Cart';
    button.disabled = true;

    document.getElementById(`offering-${offeringId}`).classList.add('added');
    showToast(`✅ ${offering.title} added!`);

    logAnalyticsEvent('item_added_to_cart', {
        offering_id: offeringId,
        offering_title: offering.title,
        offering_price: offering.price
    });
}

function updateCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = '<div style="padding: 16px; background: var(--primary-light); border-radius: 8px; margin-bottom: 16px;"><strong>Base Items (2)</strong><p style="margin: 8px 0; font-size: 13px;">Premium Wireless Headphones (₹12,999)</p><p style="margin: 8px 0; font-size: 13px;">Protective Carrying Case (₹2,499)</p></div>';

    if (cartState.items.length > 0) {
        document.getElementById('addedItemsRow').style.display = 'block';
        cartItemsContainer.innerHTML += '<div style="padding: 16px; background: var(--bg-light); border-radius: 8px; margin-bottom: 16px;"><strong>Added Protections</strong>';
        cartState.items.forEach(item => {
            cartItemsContainer.innerHTML += `<p style="margin: 8px 0; font-size: 13px;">• ${item.title} (₹${item.price})</p>`;
        });
        cartItemsContainer.innerHTML += '</div>';
        document.getElementById('addedItemsPrice').textContent = '₹' + cartState.items.reduce((sum, item) => sum + item.price, 0);
    }

    document.getElementById('finalTotal').innerHTML = `<span>Total:</span><span>₹${cartState.total}</span>`;
    document.getElementById('checkoutTotal').textContent = '₹' + cartState.total;
}

// Event Listeners
document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', handleAddToCart);
});

document.getElementById('checkout-btn').addEventListener('click', () => {
    updateCart();
    openModal('cartModal');
    logAnalyticsEvent('cart_modal_opened', { items_count: cartState.items.length });
});

document.getElementById('closeModal').addEventListener('click', () => closeModal('cartModal'));
document.getElementById('continueShopping').addEventListener('click', () => closeModal('cartModal'));
document.getElementById('toastClose').addEventListener('click', hideToast);

document.getElementById('confirmCheckout').addEventListener('click', () => {
    closeModal('cartModal');
    openModal('checkoutModal');
    logAnalyticsEvent('checkout_completed', { total_value: cartState.total });
});

document.getElementById('closeCheckout').addEventListener('click', () => closeModal('checkoutModal'));
document.getElementById('backHome').addEventListener('click', () => {
    closeModal('checkoutModal');
    cartState = { items: [], total: 18288 };
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.classList.remove('added');
        btn.innerHTML = 'Add to Cart';
        btn.disabled = false;
    });
    document.querySelectorAll('.offering-card').forEach(card => {
        card.classList.remove('added');
    });
    showToast('🏠 Ready for your next order!');
});

document.getElementById('continue-shopping').addEventListener('click', () => {
    showToast('🔄 Redirecting to shopping...');
});

window.addEventListener('click', (e) => {
    if (e.target.id === 'cartModal') closeModal('cartModal');
    if (e.target.id === 'checkoutModal') closeModal('checkoutModal');
});

// Initialize analytics
document.addEventListener('DOMContentLoaded', () => {
    logAnalyticsEvent('page_load', { orderId: PRODUCT_DATA.id });
    console.log('%c💰 MONETISATION DASHBOARD', 'font-size: 16px; font-weight: bold; color: #FF6B35;');
    console.log('Events:', analyticsEvents);
});