let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

const addDataToHTML = () => {
    // Remove existing products from HTML
    listProductHTML.innerHTML = '';

    // Add new products
    if (products.length > 0) { // If data exists
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>
                <button class="addCart">Add To Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
};

listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('addCart')) {
        let id_product = positionClick.parentElement.dataset.id;
        addToCart(id_product);
    }
});

const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if (cart.length <= 0) {
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if (positionThisProductInCart < 0) {
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
};

const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if (cart.length > 0) {
        cart.forEach(item => {
            totalQuantity += item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            newItem.innerHTML = `
            <div class="image">
                <img src="${info.image}">
            </div>
            <div class="name">${info.name}</div>
            <div class="totalPrice">$${info.price * item.quantity}</div>
            <div class="quantity">
                <span class="minus"><</span>
                <span>${item.quantity}</span>
                <span class="plus">></span>
            </div>`;
            listCartHTML.appendChild(newItem);
        });
    }
    iconCartSpan.innerText = totalQuantity;
};

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantityCart(product_id, type);
    }
});

const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        let info = cart[positionItemInCart];
        if (type === 'plus') {
            cart[positionItemInCart].quantity += 1;
        } else {
            let changeQuantity = cart[positionItemInCart].quantity - 1;
            if (changeQuantity > 0) {
                cart[positionItemInCart].quantity = changeQuantity;
            } else {
                cart.splice(positionItemInCart, 1);
            }
        }
    }
    addCartToHTML();
    addCartToMemory();
};

const initApp = () => {
    // Use recycledProducts as data source
    const recycledProducts = [
        {
            "id": 1,
            "name": "Recycled Paper Notebook",
            "price": 10,
            "image": "image/1.png"
        },
        {
            "id": 2,
            "name": "Upcycled Glass Vase",
            "price": 15,
            "image": "image/2.png"
        },
        {
            "id": 3,
            "name": "Reclaimed Wood Coasters",
            "price": 12,
            "image": "image/3.png"
        },
        {
            "id": 4,
            "name": "Recycled Plastic Tote Bag",
            "price": 18,
            "image": "image/4.png"
        },
        {
            "id": 5,
            "name": "Eco-Friendly Bamboo Straw Set",
            "price": 8,
            "image": "image/5.png"
        },
        {
            "id": 6,
            "name": "Recycled Cotton T-Shirt",
            "price": 20,
            "image": "image/6.png"
        },
        {
            "id": 7,
            "name": "Repurposed Denim Backpack",
            "price": 30,
            "image": "image/7.png"
        },
        {
            "id": 8,
            "name": "Recycled Paper Wall Art",
            "price": 25,
            "image": "image/8.png"
        },
        {
            "id": 9,
            "name": "Upcycled Wine Bottle Lamp",
            "price": 35,
            "image": "image/9.png"
        },
        {
            "id": 10,
            "name": "Recycled Rubber Doormat",
            "price": 22,
            "image": "image/10.png"
        },
        {
            "id": 11,
            "name": "Reclaimed Wood Plant Stand",
            "price": 40,
            "image": "image/11.png"
        },
        {
            "id": 12,
            "name": "Recycled Fabric Cushion Cover",
            "price": 16,
            "image": "image/12.png"
        },
        {
            "id": 13,
            "name": "Upcycled Tin Can Planters",
            "price": 10,
            "image": "image/13.png"
        },
        {
            "id": 14,
            "name": "Recycled Glass Jewelry",
            "price": 28,
            "image": "image/14.png"
        },
        {
            "id": 15,
            "name": "Recycled Paper Gift Wrap",
            "price": 5,
            "image": "image/15.png"
        }
    ];

    products = recycledProducts;
    addDataToHTML();

    // Get cart data from memory
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        addCartToHTML();
    }
};

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

initApp();
