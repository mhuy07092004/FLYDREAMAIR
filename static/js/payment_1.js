// Payment page JavaScript functions
let cartData = [];
let seatData = [];

async function showCart() {
    const response = await fetch('/api/payment_data');
    const answer = await response.json();

    let displayHTML = '';
    let totalPrice = 0;

    cartData = answer['cart'][0];
    seatData = answer['seats'][0];

    for (let item of answer['cart']) {
        displayHTML += `
          <div class="cart-item">
            <span class="item-desc">${item[2]}</span>
            <span class="item-price">$${item[3]}</span>
          </div>`;
        totalPrice += item[3];
    }

    for (let seat of answer['seats']) {
        displayHTML += `
          <div class="cart-item">
            <span class="item-desc">${seat[3]} - ${seat[1]} ${seat[2]}</span>
            <span class="item-price">$${seat[4]}</span>
          </div>`;
        totalPrice += seat[4];
    }

    document.getElementById('display').innerHTML = displayHTML;
    document.getElementById('total').innerHTML = `
        <span class="total-label">Total:</span>
        <span class="total-amount">$${totalPrice.toFixed(2)}</span>`;
}

async function confirmCart() {
    await fetch('/api/confirm_cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cart: cartData,
            seats: seatData
        })
    });
    alert('Payment successfully');
    window.location.href = '/manage_booking';
}

// Initialize the page
window.onload = showCart; 