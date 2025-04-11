document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const bookListDiv = document.getElementById('book-list');
    const loginError = document.getElementById('login-error');
    const showCartBtn = document.getElementById('show-cart-btn');
    const cartItemsDiv = document.getElementById('cart-items');
    const baseURL = 'http://127.0.0.1:8000'; // Define the base URL

    // Function to handle login
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            fetch(`${baseURL}/api/auth/login/`, { // Updated URL based on your code
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username, password: password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.access) {
                    localStorage.setItem('accessToken', data.access);
                    localStorage.setItem('refreshToken', data.refresh);
                    window.location.href = 'index.html'; // Redirect to book list
                } else if (data.detail) {
                    loginError.textContent = data.detail;
                } else {
                    loginError.textContent = 'Login failed.';
                }
            })
            .catch(error => {
                console.error('Error during login:', error);
                loginError.textContent = 'An error occurred during login.';
            });
        });
    }

    // Function to fetch and display books
    function fetchBooks() {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            window.location.href = 'login.html';
            return;
        }

        fetch(`${baseURL}/api/bookstore/books/`, { // Updated URL based on your code
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    // Handle token refresh logic here if needed
                    console.error('Unauthorized');
                    window.location.href = 'login.html';
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(books => {
            bookListDiv.innerHTML = ''; // Clear previous book list
            books.forEach(book => {
                const bookDiv = document.createElement('div');
                bookDiv.classList.add('book-item');
                bookDiv.innerHTML = `
                    <h3>${book.bookname}</h3>
                    <p>Author: ${book.author}</p>
                    <p>Price: $${book.price}</p>
                    <button class="add-to-cart-btn" data-book-id="${book.id}">Add to Cart</button>
                `;
                bookListDiv.appendChild(bookDiv);
            });

            // Add event listeners for "Add to Cart" buttons
            const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const bookId = this.dataset.bookId;
                    addToCart(bookId);
                });
            });
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            bookListDiv.textContent = 'Failed to load books.';
        });
    }

    // Function to add a book to the cart
    function addToCart(bookId) {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            window.location.href = 'login.html';
            return;
        }

        fetch(`${baseURL}/api/bookstore/cart/add/`, { // Updated URL based on your code
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ book_id: bookId })
        })
        .then(response => response.json())
        .then(data => {
            alert(`${data.book.bookname} added to cart!`);
            // Optionally update the UI or cart display
        })
        .catch(error => {
            console.error('Error adding to cart:', error);
            alert('Failed to add to cart.');
        });
    }

    // Event listener for the "Show Cart" button
    if (showCartBtn) {
        showCartBtn.addEventListener('click', function() {
            window.location.href = 'cart.html';
        });
    }

    // Function to fetch cart items (called on cart.html)
    function fetchCartItems() {
        if (!cartItemsDiv) {
            return; // Only execute if on the cart page
        }
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            window.location.href = 'login.html';
            return;
        }

        fetch(`http://127.0.0.1:8000/api/bookstore/cart/user/1/items`, { // This is the API endpoint you'll need to create in Django
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    console.error('Unauthorized');
                    window.location.href = 'login.html';
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(cartItems => {
            cartItemsDiv.innerHTML = ''; // Clear previous cart items
            if (cartItems.length === 0) {
                cartItemsDiv.textContent = 'Your cart is empty.';
                return;
            }
            cartItems.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <h3>${item.book.bookname}</h3>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: $${item.book.price}</p>
                    `;
                cartItemsDiv.appendChild(cartItemDiv);
            });
        })
        .catch(error => {
            console.error('Error fetching cart items:', error);
            cartItemsDiv.textContent = 'Failed to load cart items.';
        });
    }

    // Load books if on the index page
    if (window.location.pathname.endsWith('index.html')) {
        fetchBooks();
    }

    // Fetch cart items if on the cart page
    if (window.location.pathname.endsWith('cart.html')) {
        fetchCartItems();
    }
});