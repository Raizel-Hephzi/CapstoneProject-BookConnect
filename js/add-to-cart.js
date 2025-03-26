// Function to add a book to the cart
function addToCart(bookId, title, author, price, image) {
  // Get existing cart items from localStorage or initialize empty array
  const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []

  // Check if item already exists in cart
  const existingItemIndex = cartItems.findIndex((item) => item.id === bookId)

  if (existingItemIndex !== -1) {
    // Item exists, increment quantity
    cartItems[existingItemIndex].quantity += 1
  } else {
    // Item doesn't exist, add new item
    cartItems.push({
      id: bookId,
      title: title,
      author: author,
      price: Number.parseFloat(price),
      image: image,
      quantity: 1,
    })
  }

  // Save updated cart to localStorage
  localStorage.setItem("cartItems", JSON.stringify(cartItems))

  // Update cart count in header
  updateCartCount()

  // Show notification
  showNotification(`"${title}" has been added to your cart!`, "success")
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

// Initialize cart count on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount()

  // Add event listeners to all "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll(".btnhover2")
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault()

      // Get book details from parent elements
      const bookCard = this.closest(".dz-shop-card")
      if (!bookCard) return

      const bookId = bookCard.dataset.bookId || Math.random().toString(36).substr(2, 9)
      const title = bookCard.querySelector(".title a").textContent
      const authorElement = bookCard.querySelector(".dz-tags li a")
      const author = authorElement ? authorElement.textContent.replace(",", "") : "Unknown Author"
      const priceElement = bookCard.querySelector(".price-num")
      const price = priceElement ? priceElement.textContent.replace("₵", "") : "0.00"
      const imageElement = bookCard.querySelector(".dz-media img")
      const image = imageElement ? imageElement.src : "/placeholder.svg"

      addToCart(bookId, title, author, price, image)
    })
  })
})

