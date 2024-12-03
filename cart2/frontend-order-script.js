// Add this to your existing script.js
//this folder is directly integrated to the index.html
// Get checkout button
const checkOutButton = document.querySelector('.checkOut');

checkOutButton.addEventListener('click', () => {
    // Prepare order data
    const orderData = {
        cart: cart.map(item => ({
            product_id: item.product_id,
            quantity: item.quantity
        }))
    };

    // Send order to backend
    fetch('http://localhost:5000/api/orders/create-order', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        // Handle successful order
        alert('Order placed successfully!');
        
        // Clear cart
        cart = [];
        addCartToHTML();
        addCartToMemory();
        
        // Close cart
        body.classList.remove('showCart');
    })
    .catch(error => {
        console.error('Order error:', error);
        alert('Failed to place order. Please try again.');
    });
});
