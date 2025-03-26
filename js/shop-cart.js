document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const cartItemsContainer = document.getElementById("cart-items")
  const cartTotalElement = document.getElementById("cart-total")
  const cartSubtotalElement = document.getElementById("cart-subtotal")
  const cartTaxElement = document.getElementById("cart-tax")
  const cartShippingElement = document.getElementById("cart-shipping")
  const emptyCartMessage = document.getElementById("empty-cart-message")
  const checkoutBtn = document.getElementById("proceed-to-checkout")
  const clearCartBtn = document.getElementById("clear-cart")

  // Load cart items
  loadCartItems()

  // Event listeners
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", (e) => {
      const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []

      if (cartItems.length === 0) {
        e.preventDefault()
        showNotification("Your cart is empty. Add some books first!", "error")
      } else {
        // Proceed to checkout
        window.location.href = "shop-checkout.html"
      }
    })
  }

  if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
      // Clear cart
      localStorage.removeItem("cartItems")

      // Reload cart items
      loadCartItems()

      // Show notification
      showNotification("Cart cleared successfully!", "success")
    })
  }

  // Functions
  function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []

    if (cartItemsContainer) {
      // Clear existing items
      cartItemsContainer.innerHTML = ""

      if (cartItems.length === 0) {
        // Show empty cart message
        if (emptyCartMessage) {
          emptyCartMessage.classList.remove("d-none")
        }

        // Disable checkout button
        if (checkoutBtn) {
          checkoutBtn.classList.add("disabled")
        }

        // Set totals to zero
        if (cartSubtotalElement) cartSubtotalElement.textContent = "₵0.00"
        if (cartTaxElement) cartTaxElement.textContent = "₵0.00"
        if (cartShippingElement) cartShippingElement.textContent = "₵0.00"
        if (cartTotalElement) cartTotalElement.textContent = "₵0.00"

        return
      }

      // Hide empty cart message
      if (emptyCartMessage) {
        emptyCartMessage.classList.add("d-none")
      }

      // Enable checkout button
      if (checkoutBtn) {
        checkoutBtn.classList.remove("disabled")
      }

      // Calculate totals
      let subtotal = 0

      // Add each item to cart
      cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity
        subtotal += itemTotal

        const cartItemElement = document.createElement("tr")
        cartItemElement.innerHTML = `
                    <td class="product-item-img">
                        <img src="${item.image}" alt="${item.title}">
                    </td>
                    <td class="product-item-name">
                        <a href="books-detail.html">${item.title}</a>
                        <p>${item.author || "Unknown Author"}</p>
                    </td>
                    <td class="product-item-price">₵${Number.parseFloat(item.price).toFixed(2)}</td>
                    <td class="product-item-quantity">
                        <div class="quantity btn-quantity style-1">
                            <button class="btn btn-minus decrease-quantity" data-index="${index}"></button>
                            <input type="text" class="quantity-input" value="${item.quantity}" name="demo_vertical2">
                            <button class="btn btn-plus increase-quantity" data-index="${index}"></button>
                        </div>
                    </td>
                    <td class="product-item-totle">₵${itemTotal.toFixed(2)}</td>
                    <td class="product-item-close">
                        <a href="javascript:void(0);" class="ti-close remove-item" data-index="${index}"></a>
                    </td>
                `

        cartItemsContainer.appendChild(cartItemElement)
      })

      // Add event listeners to quantity buttons and remove buttons
      addCartEventListeners()

      // Calculate tax and shipping
      const tax = subtotal * 0.05 // 5% tax
      const shipping = subtotal > 0 ? 5.0 : 0.0 // Flat shipping rate
      const total = subtotal + tax + shipping

      // Update totals
      if (cartSubtotalElement) cartSubtotalElement.textContent = `₵${subtotal.toFixed(2)}`
      if (cartTaxElement) cartTaxElement.textContent = `₵${tax.toFixed(2)}`
      if (cartShippingElement) cartShippingElement.textContent = `₵${shipping.toFixed(2)}`
      if (cartTotalElement) cartTotalElement.textContent = `₵${total.toFixed(2)}`
    }
  }

  function addCartEventListeners() {
    // Remove item buttons
    const removeButtons = document.querySelectorAll(".remove-item")
    removeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const index = Number.parseInt(this.getAttribute("data-index"))
        removeCartItem(index)
      })
    })

    // Increase quantity buttons
    const increaseButtons = document.querySelectorAll(".increase-quantity")
    increaseButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const index = Number.parseInt(this.getAttribute("data-index"))
        updateCartItemQuantity(index, 1)
      })
    })

    // Decrease quantity buttons
    const decreaseButtons = document.querySelectorAll(".decrease-quantity")
    decreaseButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const index = Number.parseInt(this.getAttribute("data-index"))
        updateCartItemQuantity(index, -1)
      })
    })
  }

  function removeCartItem(index) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []

    // Remove item at index
    cartItems.splice(index, 1)

    // Save updated cart
    localStorage.setItem("cartItems", JSON.stringify(cartItems))

    // Reload cart items
    loadCartItems()

    // Update cart count in header
    updateCartCount()

    // Show notification
    showNotification("Item removed from cart", "success")
  }

  function updateCartItemQuantity(index, change) {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []

    // Update quantity
    cartItems[index].quantity = Math.max(1, cartItems[index].quantity + change)

    // Save updated cart
    localStorage.setItem("cartItems", JSON.stringify(cartItems))

    // Reload cart items
    loadCartItems()
  }

  function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []
    const cartCountElements = document.querySelectorAll(".cart-count")

    cartCountElements.forEach((element) => {
      element.textContent = cartItems.length
    })
  }

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
})

