// Cart functionality for BookConnect
document.addEventListener('DOMContentLoaded', function() {
  // Initialize cart from localStorage or create empty cart
  let cart = JSON.parse(localStorage.getItem('bookConnectCart')) || [];
  
  // Update cart count badge
  updateCartCount();
  
  // Load cart items on the cart page
  if (window.location.pathname.includes('shop-cart.html')) {
      displayCartItems();
      updateCartSummary();
      loadRelatedBooks();
  }
  
  // Add event listeners for "Add to Cart" buttons on the books grid page
  if (window.location.pathname.includes('books-grid-view.html')) {
      const addToCartButtons = document.querySelectorAll('.btn-secondary.box-btn');
      
      addToCartButtons.forEach(button => {
          button.addEventListener('click', function(e) {
              e.preventDefault();
              
              // Get book details from the parent card
              const bookCard = this.closest('.dz-shop-card');
              const bookTitle = bookCard.querySelector('.title a').textContent;
              const bookPrice = bookCard.querySelector('.price-num').textContent;
              const bookImage = bookCard.querySelector('.dz-media img').getAttribute('src');
              const bookAuthor = bookCard.querySelector('.dz-tags a').textContent;
              
              // Create book object
              const book = {
                  id: generateUniqueId(),
                  title: bookTitle,
                  price: parsePrice(bookPrice),
                  image: bookImage,
                  author: bookAuthor,
                  quantity: 1
              };
              
              // Add to cart with animation
              addToCart(book);
              
              // Show confirmation message
              showNotification(`<i class="fas fa-check-circle"></i> "${bookTitle}" has been added to your cart!`);
              
              // Animate the cart icon
              animateCartIcon();
          });
      });
  }
  
  // Function to add a book to the cart
  function addToCart(book) {
      // Check if the book is already in the cart
      const existingBookIndex = cart.findIndex(item => item.title === book.title);
      
      if (existingBookIndex !== -1) {
          // Book already exists, increase quantity
          cart[existingBookIndex].quantity += 1;
      } else {
          // Add new book to cart
          cart.push(book);
      }
      
      // Save cart to localStorage
      saveCart();
      
      // Update cart count
      updateCartCount();
      
      // Update dropdown cart preview
      updateCartPreview();
  }
  
  // Function to remove a book from the cart
  function removeFromCart(bookId) {
      cart = cart.filter(item => item.id !== bookId);
      saveCart();
      updateCartCount();
      
      // If on cart page, update display
      if (window.location.pathname.includes('shop-cart.html')) {
          displayCartItems();
          updateCartSummary();
      }
      
      // Update dropdown cart preview
      updateCartPreview();
  }
  
  // Function to update book quantity in cart
  function updateQuantity(bookId, newQuantity) {
      const bookIndex = cart.findIndex(item => item.id === bookId);
      
      if (bookIndex !== -1) {
          // Ensure quantity is at least 1
          newQuantity = Math.max(1, newQuantity);
          cart[bookIndex].quantity = newQuantity;
          saveCart();
          
          // If on cart page, update display
          if (window.location.pathname.includes('shop-cart.html')) {
              updateCartItemSubtotal(bookId);
              updateCartSummary();
          }
          
          // Update dropdown cart preview
          updateCartPreview();
      }
  }
  
  // Function to display cart items on the cart page
  function displayCartItems() {
      const cartItemsContainer = document.getElementById('cart-items');
      
      if (!cartItemsContainer) return;
      
      if (cart.length === 0) {
          // Display empty cart message
          cartItemsContainer.innerHTML = `
              <div class="cart-empty animate__animated animate__fadeIn">
                  <i class="fas fa-shopping-cart"></i>
                  <h3>Your cart is empty</h3>
                  <p>Looks like you haven't added any books to your cart yet. Explore our collection and find your next favorite read!</p>
                  <a href="books-grid-view.html" class="btn btn-primary mt-3">
                      <i class="fas fa-book me-2"></i> Browse Books
                  </a>
              </div>
          `;
          return;
      }
      
      // Display cart items
      let cartHTML = `
          <div class="table-responsive">
              <table class="table table-borderless">
                  <thead class="cart-table-header">
                      <tr>
                          <th scope="col" width="50%">Product</th>
                          <th scope="col" class="text-center">Price</th>
                          <th scope="col" class="text-center">Quantity</th>
                          <th scope="col" class="text-center">Subtotal</th>
                          <th scope="col" class="text-center">Action</th>
                      </tr>
                  </thead>
                  <tbody>
      `;
      
      cart.forEach((item, index) => {
          cartHTML += `
              <tr class="cart-item animate__animated animate__fadeIn" style="animation-delay: ${index * 0.1}s" data-id="${item.id}">
                  <td>
                      <div class="d-flex align-items-center">
                          <img src="${item.image}" alt="${item.title}" class="cart-item-image me-3">
                          <div class="cart-item-details">
                              <h6 class="mb-1">${item.title}</h6>
                              <p class="mb-0 cart-item-author">Author: ${item.author}</p>
                          </div>
                      </div>
                  </td>
                  <td class="text-center cart-item-price" data-title="Price">
                      <span class="cart-item-price">₵${item.price.toFixed(2)}</span>
                  </td>
                  <td class="text-center cart-item-quantity" data-title="Quantity">
                      <div class="quantity-control">
                          <button class="quantity-btn" data-action="decrease">-</button>
                          <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                          <button class="quantity-btn" data-action="increase">+</button>
                      </div>
                  </td>
                  <td class="text-center cart-item-subtotal" data-title="Subtotal">
                      <span class="item-subtotal">₵${(item.price * item.quantity).toFixed(2)}</span>
                  </td>
                  <td class="text-center cart-item-action">
                      <button class="remove-item" title="Remove item">
                          <i class="fas fa-trash-alt"></i>
                      </button>
                  </td>
              </tr>
          `;
      });
      
      cartHTML += `
                  </tbody>
              </table>
          </div>
          <div class="d-flex justify-content-between mt-4">
              <button id="clear-cart" class="btn btn-clear">
                  <i class="fas fa-trash me-2"></i> Clear Cart
              </button>
              <a href="books-grid-view.html" class="btn btn-continue">
                  <i class="fas fa-arrow-left me-2"></i> Continue Shopping
              </a>
          </div>
      `;
      
      cartItemsContainer.innerHTML = cartHTML;
      
      // Add event listeners for quantity buttons and remove buttons
      addCartEventListeners();
  }
  
  // Function to add event listeners to cart elements
  function addCartEventListeners() {
      // Quantity decrease buttons
      document.querySelectorAll('.quantity-btn[data-action="decrease"]').forEach(button => {
          button.addEventListener('click', function() {
              const row = this.closest('tr');
              const bookId = row.dataset.id;
              const quantityInput = row.querySelector('.quantity-input');
              const newQuantity = parseInt(quantityInput.value) - 1;
              
              if (newQuantity >= 1) {
                  quantityInput.value = newQuantity;
                  updateQuantity(bookId, newQuantity);
                  
                  // Add animation
                  row.classList.add('animate__animated', 'animate__pulse');
                  setTimeout(() => {
                      row.classList.remove('animate__animated', 'animate__pulse');
                  }, 500);
              }
          });
      });
      
      // Quantity increase buttons
      document.querySelectorAll('.quantity-btn[data-action="increase"]').forEach(button => {
          button.addEventListener('click', function() {
              const row = this.closest('tr');
              const bookId = row.dataset.id;
              const quantityInput = row.querySelector('.quantity-input');
              const newQuantity = parseInt(quantityInput.value) + 1;
              
              quantityInput.value = newQuantity;
              updateQuantity(bookId, newQuantity);
              
              // Add animation
              row.classList.add('animate__animated', 'animate__pulse');
              setTimeout(() => {
                  row.classList.remove('animate__animated', 'animate__pulse');
              }, 500);
          });
      });
      
      // Quantity input fields
      document.querySelectorAll('.quantity-input').forEach(input => {
          input.addEventListener('change', function() {
              const row = this.closest('tr');
              const bookId = row.dataset.id;
              const newQuantity = parseInt(this.value);
              
              if (newQuantity >= 1) {
                  updateQuantity(bookId, newQuantity);
              } else {
                  this.value = 1;
                  updateQuantity(bookId, 1);
              }
              
              // Add animation
              row.classList.add('animate__animated', 'animate__pulse');
              setTimeout(() => {
                  row.classList.remove('animate__animated', 'animate__pulse');
              }, 500);
          });
      });
      
      // Remove item buttons
      document.querySelectorAll('.remove-item').forEach(button => {
          button.addEventListener('click', function() {
              const row = this.closest('tr');
              const bookId = row.dataset.id;
              
              // Add animation before removal
              row.classList.add('animate__animated', 'animate__fadeOutRight');
              
              // Wait for animation to complete before removing
              setTimeout(() => {
                  removeFromCart(bookId);
              }, 500);
          });
      });
      
      // Clear cart button
      const clearCartButton = document.getElementById('clear-cart');
      if (clearCartButton) {
          clearCartButton.addEventListener('click', function() {
              if (confirm('Are you sure you want to clear your entire cart?')) {
                  // Add animation to all cart items
                  document.querySelectorAll('.cart-item').forEach((item, index) => {
                      item.style.animationDelay = `${index * 0.1}s`;
                      item.classList.add('animate__animated', 'animate__fadeOutUp');
                  });
                  
                  // Wait for animation to complete before clearing
                  setTimeout(() => {
                      clearCart();
                  }, 500);
              }
          });
      }
  }
  
  // Function to update the subtotal for a specific cart item
  function updateCartItemSubtotal(bookId) {
      const item = cart.find(item => item.id === bookId);
      if (!item) return;
      
      const row = document.querySelector(`tr[data-id="${bookId}"]`);
      if (row) {
          const subtotalCell = row.querySelector('.item-subtotal');
          subtotalCell.textContent = `₵${(item.price * item.quantity).toFixed(2)}`;
          
          // Add subtle animation to the updated subtotal
          subtotalCell.classList.add('animate__animated', 'animate__flash');
          setTimeout(() => {
              subtotalCell.classList.remove('animate__animated', 'animate__flash');
          }, 500);
      }
  }
  
  // Function to update the cart summary (subtotal, shipping, tax, total)
  function updateCartSummary() {
      const subtotalElement = document.getElementById('cart-subtotal');
      const shippingElement = document.getElementById('cart-shipping');
      const taxElement = document.getElementById('cart-tax');
      const totalElement = document.getElementById('cart-total');
      
      if (!subtotalElement || !shippingElement || !taxElement || !totalElement) return;
      
      // Calculate subtotal
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Calculate shipping (free for orders over ₵100, otherwise ₵10)
      const shipping = subtotal > 100 ? 0 : 10;
      
      // Calculate tax (7.5% of subtotal)
      const tax = subtotal * 0.075;
      
      // Calculate total
      const total = subtotal + shipping + tax;
      
      // Update elements with animation
      animateValue(subtotalElement, parseFloat(subtotalElement.textContent.replace('₵', '')), subtotal, 500, '₵');
      
      if (shipping === 0) {
          shippingElement.textContent = 'Free';
          shippingElement.classList.add('text-success');
      } else {
          shippingElement.classList.remove('text-success');
          animateValue(shippingElement, parseFloat(shippingElement.textContent.replace('₵', '') || 0), shipping, 500, '₵');
      }
      
      animateValue(taxElement, parseFloat(taxElement.textContent.replace('₵', '')), tax, 500, '₵');
      animateValue(totalElement, parseFloat(totalElement.textContent.replace('₵', '')), total, 500, '₵');
  }
  
  // Function to animate value changes
  function animateValue(element, start, end, duration, prefix = '') {
      let startTimestamp = null;
      const step = (timestamp) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const value = progress * (end - start) + start;
          element.textContent = `${prefix}${value.toFixed(2)}`;
          if (progress < 1) {
              window.requestAnimationFrame(step);
          }
      };
      window.requestAnimationFrame(step);
  }
  
  // Function to update the cart count badge
  function updateCartCount() {
      const cartCountElements = document.querySelectorAll('.cart-count');
      const itemCount = cart.reduce((count, item) => count + item.quantity, 0);
      
      cartCountElements.forEach(element => {
          // Animate the count change
          element.classList.add('animate__animated', 'animate__heartBeat');
          setTimeout(() => {
              element.textContent = itemCount;
              setTimeout(() => {
                  element.classList.remove('animate__animated', 'animate__heartBeat');
              }, 500);
          }, 100);
      });
  }
  
  // Function to animate the cart icon when adding items
  function animateCartIcon() {
      const cartButtons = document.querySelectorAll('.cart-btn');
      
      cartButtons.forEach(button => {
          button.classList.add('animate__animated', 'animate__rubberBand');
          setTimeout(() => {
              button.classList.remove('animate__animated', 'animate__rubberBand');
          }, 1000);
      });
  }
  
  // Function to update the dropdown cart preview
  function updateCartPreview() {
      const cartListElement = document.querySelector('.dropdown-menu.cart-list');
      if (!cartListElement) return;
      
      // Clear existing items
      cartListElement.innerHTML = '';
      
      // If cart is empty
      if (cart.length === 0) {
          cartListElement.innerHTML = `
              <li class="text-center py-4">
                  <i class="fas fa-shopping-cart mb-3" style="font-size: 2rem; color: #ddd;"></i>
                  <p>Your cart is empty</p>
              </li>
              <li class="text-center d-flex">
                  <a href="books-grid-view.html" class="btn btn-sm btn-primary btnhover w-100">Browse Books</a>
              </li>
          `;
          return;
      }
      
      // Display up to 3 items
      const itemsToShow = cart.slice(0, 3);
      
      // Add items to preview
      itemsToShow.forEach(item => {
          const listItem = document.createElement('li');
          listItem.className = 'cart-item animate__animated animate__fadeIn';
          listItem.innerHTML = `
              <div class="media">
                  <div class="media-left">
                      <a href="books-detail.html">
                          <img alt="${item.title}" class="media-object" src="${item.image}">
                      </a>
                  </div>
                  <div class="media-body">
                      <h6 class="dz-title"><a href="books-detail.html" class="media-heading">${item.title}</a></h6>
                      <span class="dz-price">₵${item.price.toFixed(2)} x ${item.quantity}</span>
                      <span class="item-close" data-id="${item.id}">&times;</span>
                  </div>
              </div>
          `;
          cartListElement.appendChild(listItem);
      });
      
      // Show "more items" message if there are more than 3 items
      if (cart.length > 3) {
          const moreItems = document.createElement('li');
          moreItems.className = 'text-center py-2';
          moreItems.innerHTML = `<p class="mb-0 text-muted">+ ${cart.length - 3} more item(s)</p>`;
          cartListElement.appendChild(moreItems);
      }
      
      // Add total
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const totalItem = document.createElement('li');
      totalItem.className = 'cart-item text-center';
      totalItem.innerHTML = `<h6 class="text-secondary">Total = ₵${total.toFixed(2)}</h6>`;
      cartListElement.appendChild(totalItem);
      
      // Add action buttons
      const actionsItem = document.createElement('li');
      actionsItem.className = 'text-center d-flex';
      actionsItem.innerHTML = `
          <a href="shop-cart.html" class="btn btn-sm btn-primary me-2 btnhover w-100">View Cart</a>
          <a href="shop-checkout.html" class="btn btn-sm btn-outline-primary btnhover w-100">Checkout</a>
      `;
      cartListElement.appendChild(actionsItem);
      
      // Add event listeners for remove buttons
      cartListElement.querySelectorAll('.item-close').forEach(button => {
          button.addEventListener('click', function(e) {
              e.preventDefault();
              e.stopPropagation();
              const bookId = this.dataset.id;
              const listItem = this.closest('.cart-item');
              
              // Add animation before removal
              listItem.classList.add('animate__animated', 'animate__fadeOutRight');
              
              // Wait for animation to complete before removing
              setTimeout(() => {
                  removeFromCart(bookId);
              }, 500);
          });
      });
  }
  
  // Function to clear the entire cart
  function clearCart() {
      cart = [];
      saveCart();
      updateCartCount();
      
      // If on cart page, update display
      if (window.location.pathname.includes('shop-cart.html')) {
          displayCartItems();
          updateCartSummary();
      }
      
      // Update dropdown cart preview
      updateCartPreview();
  }
  
  // Function to save cart to localStorage
  function saveCart() {
      localStorage.setItem('bookConnectCart', JSON.stringify(cart));
  }
  
  // Helper function to parse price from string (e.g., "₵60.09" to 60.09)
  function parsePrice(priceString) {
      return parseFloat(priceString.replace('₵', '').replace('Free', '0'));
  }
  
  // Helper function to generate a unique ID
  function generateUniqueId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  // Function to show notification
  function showNotification(message) {
      // Remove any existing notifications
      const existingNotifications = document.querySelectorAll('.cart-notification');
      existingNotifications.forEach(notification => {
          notification.remove();
      });
      
      // Create notification element
      const notification = document.createElement('div');
      notification.className = 'cart-notification animate__animated animate__fadeInRight';
      notification.innerHTML = message;
      
      // Add to document
      document.body.appendChild(notification);
      
      // Remove after 3 seconds
      setTimeout(() => {
          notification.classList.remove('animate__fadeInRight');
          notification.classList.add('animate__fadeOutRight');
          setTimeout(() => {
              notification.remove();
          }, 500);
      }, 3000);
  }
  
  // Function to load related books in the cart page
  function loadRelatedBooks() {
      const relatedBooksContainer = document.querySelector('.books-carousel .swiper-wrapper');
      if (!relatedBooksContainer) return;
      
      // Sample related books data - in a real app, this would come from an API
      const relatedBooks = [
          {
              id: 'related-1',
              title: 'The Great Gatsby',
              author: 'F. Scott Fitzgerald',
              price: 15.99,
              image: 'images/books/large/bigbook3.jpg'
          },
          {
              id: 'related-2',
              title: 'To Kill a Mockingbird',
              author: 'Harper Lee',
              price: 12.50,
              image: 'images/books/large/bigbook4.jpg'
          },
          {
              id: 'related-3',
              title: 'Pride and Prejudice',
              author: 'Jane Austen',
              price: 14.99,
              image: 'images/books/large/bigbook5.jpg'
          },
          {
              id: 'related-4',
              title: 'The Alchemist',
              author: 'Paulo Coelho',
              price: 18.75,
              image: 'images/books/large/bigbook6.jpg'
          },
          {
              id: 'related-5',
              title: 'Atomic Habits',
              author: 'James Clear',
              price: 22.99,
              image: 'images/books/large/bigbook7.jpg'
          }
      ];
      
      // Generate HTML for related books
      relatedBooks.forEach(book => {
          const bookElement = document.createElement('div');
          bookElement.className = 'swiper-slide';
          bookElement.innerHTML = `
              <div class="books-card style-1 wow fadeInUp">
                  <div class="dz-media">
                      <img src="${book.image}" alt="${book.title}">
                  </div>
                  <div class="dz-content">
                      <h5 class="title"><a href="books-detail.html">${book.title}</a></h5>
                      <p class="mb-0">${book.author}</p>
                      <div class="price">
                          <span class="price-num">₵${book.price.toFixed(2)}</span>
                      </div>
                      <a href="javascript:void(0);" class="btn btn-secondary box-btn btnhover add-to-cart-related" data-id="${book.id}" data-title="${book.title}" data-price="${book.price}" data-image="${book.image}" data-author="${book.author}">
                          <i class="flaticon-shopping-cart-1 m-r10"></i> Add to Cart
                      </a>
                  </div>
              </div>
          `;
          relatedBooksContainer.appendChild(bookElement);
      });
      
      // Initialize Swiper for related books
      let Swiper;
      if (typeof Swiper !== 'undefined') {
          Swiper = window.Swiper;
          new Swiper('.books-carousel', {
              slidesPerView: 1,
              spaceBetween: 30,
              pagination: {
                  el: '.swiper-pagination',
                  clickable: true,
              },
              breakpoints: {
                  640: {
                      slidesPerView: 2,
                  },
                  768: {
                      slidesPerView: 3,
                  },
                  1024: {
                      slidesPerView: 4,
                  },
              },
          });
      }
      
      // Add event listeners for "Add to Cart" buttons in related books
      document.querySelectorAll('.add-to-cart-related').forEach(button => {
          button.addEventListener('click', function() {
              const bookId = this.dataset.id;
              const bookTitle = this.dataset.title;
              const bookPrice = parseFloat(this.dataset.price);
              const bookImage = this.dataset.image;
              const bookAuthor = this.dataset.author;
              
              // Create book object
              const book = {
                  id: bookId,
                  title: bookTitle,
                  price: bookPrice,
                  image: bookImage,
                  author: bookAuthor,
                  quantity: 1
              };
              
              // Add to cart
              addToCart(book);
              
              // Show confirmation message
              showNotification(`<i class="fas fa-check-circle"></i> "${bookTitle}" has been added to your cart!`);
              
              // Animate the cart icon
              animateCartIcon();
              
              // Animate the button
              this.classList.add('animate__animated', 'animate__pulse');
              setTimeout(() => {
                  this.classList.remove('animate__animated', 'animate__pulse');
              }, 500);
          });
      });
  }
});
document.addEventListener("DOMContentLoaded", () => {
    // Load cart items
    loadCartItems()
  
    // Add event listener for "Clear Cart" button
    const clearCartBtn = document.getElementById("clear-cart")
    if (clearCartBtn) {
      clearCartBtn.addEventListener("click", () => {
        clearCart()
      })
    }
  
    // Initialize cart count
    updateCartCount()
  })
  
  // Function to load cart items
  function loadCartItems() {
    const cartItemsContainer = document.getElementById("cart-items")
    if (!cartItemsContainer) return
  
    // Get cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []
  
    // Check if cart is empty
    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = `
              <div class="cart-empty">
                  <i class="fas fa-shopping-cart"></i>
                  <h3>Your cart is empty</h3>
                  <p>Looks like you haven't added any books to your cart yet.</p>
                  <a href="books-grid-view.html" class="btn btn-primary">
                      <i class="fas fa-book me-2"></i> Browse Books
                  </a>
              </div>
          `
  
      // Hide totals and checkout button
      const cartSummary = document.querySelector(".cart-summary")
      if (cartSummary) {
        cartSummary.style.display = "none"
      }
  
      return
    }
  
    // Display cart items
    let cartHTML = ""
    let subtotal = 0
  
    cartItems.forEach((item, index) => {
      const itemTotal = item.price * item.quantity
      subtotal += itemTotal
  
      cartHTML += `
              <div class="cart-item d-flex align-items-center">
                  <div class="cart-item-image me-4">
                      <img src="${item.image}" alt="${item.title}" class="img-fluid">
                  </div>
                  <div class="cart-item-details flex-grow-1">
                      <h6>${item.title}</h6>
                      <p class="cart-item-author">${item.author}</p>
                      <div class="d-flex justify-content-between align-items-center">
                          <span class="cart-item-price">₵${item.price.toFixed(2)}</span>
                          <div class="quantity-control">
                              <button type="button" class="quantity-btn decrease-quantity" data-index="${index}">-</button>
                              <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                              <button type="button" class="quantity-btn increase-quantity" data-index="${index}">+</button>
                          </div>
                          <span class="cart-item-subtotal">₵${itemTotal.toFixed(2)}</span>
                          <button type="button" class="remove-item" data-index="${index}">
                              <i class="fas fa-times"></i>
                          </button>
                      </div>
                  </div>
              </div>
          `
    })
  
    cartItemsContainer.innerHTML = cartHTML
  
    // Calculate and display totals
    const tax = subtotal * 0.05 // 5% tax
    const shipping = subtotal > 0 ? 5.0 : 0.0 // $5 shipping fee
    const total = subtotal + tax + shipping
  
    // Update summary
    document.getElementById("cart-subtotal").textContent = `₵${subtotal.toFixed(2)}`
    document.getElementById("cart-tax").textContent = `₵${tax.toFixed(2)}`
    document.getElementById("cart-shipping").textContent = `₵${shipping.toFixed(2)}`
    document.getElementById("cart-total").textContent = `₵${total.toFixed(2)}`
  
    // Add event listeners for quantity buttons and remove buttons
    addCartEventListeners()
  }
  
  // Function to add event listeners to cart elements
  function addCartEventListeners() {
    // Quantity decrease buttons
    const decreaseButtons = document.querySelectorAll(".decrease-quantity")
    decreaseButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const index = Number.parseInt(this.dataset.index)
        updateItemQuantity(index, -1)
      })
    })
  
    // Quantity increase buttons
    const increaseButtons = document.querySelectorAll(".increase-quantity")
    increaseButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const index = Number.parseInt(this.dataset.index)
        updateItemQuantity(index, 1)
      })
    })
  
    // Remove item buttons
    const removeButtons = document.querySelectorAll(".remove-item")
    removeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const index = Number.parseInt(this.dataset.index)
        removeCartItem(index)
      })
    })
  }
  
  // Function to update item quantity
  function updateItemQuantity(index, change) {
    // Get cart items
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []
  
    // Update quantity
    cartItems[index].quantity += change
  
    // Remove item if quantity is 0 or less
    if (cartItems[index].quantity <= 0) {
      cartItems.splice(index, 1)
    }
  
    // Save updated cart
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  
    // Reload cart items
    loadCartItems()
  
    // Update cart count
    updateCartCount()
  }
  
  // Function to remove cart item
  function removeCartItem(index) {
    // Get cart items
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []
  
    // Remove item
    cartItems.splice(index, 1)
  
    // Save updated cart
    localStorage.setItem("cartItems", JSON.stringify(cartItems))
  
    // Reload cart items
    loadCartItems()
  
    // Update cart count
    updateCartCount()
  
    // Show notification
    showNotification("Item removed from cart", "success")
  }
  
  // Function to clear cart
  function clearCart() {
    // Clear cart in localStorage
    localStorage.removeItem("cartItems")
  
    // Reload cart items
    loadCartItems()
  
    // Update cart count
    updateCartCount()
  
    // Show notification
    showNotification("Cart has been cleared", "success")
  }
  
  // Function to update cart count in header
  function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)
  
    // Update all elements with class 'cart-count'
    const cartCountElements = document.querySelectorAll(".cart-count")
    cartCountElements.forEach((element) => {
      element.textContent = totalItems
    })
  }
  
  // Function to show notification
  function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement("div")
    notification.className = "cart-notification"
  
    if (type === "error") {
      notification.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`
      notification.style.background = "linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)"
    } else {
      notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`
    }
  
    // Add to body
    document.body.appendChild(notification)
  
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = "0"
      notification.style.transform = "translateX(100%)"
      setTimeout(() => {
        notification.remove()
      }, 300)
    }, 3000)
  }
  
  