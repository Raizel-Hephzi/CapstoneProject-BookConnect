document.addEventListener("DOMContentLoaded", () => {
  // Get elements
  const sameAsBillingCheckbox = document.getElementById("sameAsBilling")
  const billingAddressContainer = document.getElementById("billing-address-container")
  const proceedToPaymentBtn = document.getElementById("proceed-to-payment")
  const backToShippingBtn = document.getElementById("back-to-shipping")
  const placeOrderBtn = document.getElementById("place-order")
  const shippingContainer = document.querySelector(
    ".checkout-container:not(.payment-container):not(.order-success-container)",
  )
  const paymentContainer = document.querySelector(".payment-container")
  const successContainer = document.querySelector(".order-success-container")
  const promoToggle = document.getElementById("promo-toggle")
  const promoForm = document.getElementById("promo-form")
  const applyPromoBtn = document.getElementById("apply-promo")
  const discountItem = document.querySelector(".discount-item")
  const summaryDiscount = document.getElementById("summary-discount")
  const summaryTotal = document.getElementById("summary-total")
  const summaryItems = document.getElementById("summary-items")
  const summaryItemCount = document.getElementById("summary-item-count")
  const summarySubtotal = document.getElementById("summary-subtotal")
  const summaryShipping = document.getElementById("summary-shipping")
  const summaryTax = document.getElementById("summary-tax")
  const deliveryOptions = document.querySelectorAll('input[name="deliveryMethod"]')
  const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]')
  const creditCardForm = document.getElementById("creditCardForm")
  const momoForm = document.getElementById("momoForm")
  const paypalForm = document.getElementById("paypalForm")
  const orderDate = document.getElementById("order-date")
  const orderEmail = document.getElementById("order-email")

  // Set current date for order confirmation
  if (orderDate) {
    const today = new Date()
    const options = { year: "numeric", month: "long", day: "numeric" }
    orderDate.textContent = today.toLocaleDateString("en-US", options)
  }

  // Load cart items from localStorage
  loadCartItems()

  // Event Listeners
  if (sameAsBillingCheckbox) {
    sameAsBillingCheckbox.addEventListener("change", function () {
      if (this.checked) {
        billingAddressContainer.classList.add("d-none")
      } else {
        billingAddressContainer.classList.remove("d-none")
      }
    })
  }

  if (proceedToPaymentBtn) {
    proceedToPaymentBtn.addEventListener("click", () => {
      // Validate shipping form
      const form = document.getElementById("checkout-form")
      if (form.checkValidity()) {
        // Update progress steps
        updateProgressSteps(2)

        // Hide shipping container, show payment container
        shippingContainer.classList.add("d-none")
        paymentContainer.classList.remove("d-none")

        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" })
      } else {
        form.reportValidity()
      }
    })
  }

  if (backToShippingBtn) {
    backToShippingBtn.addEventListener("click", () => {
      // Update progress steps
      updateProgressSteps(1)

      // Hide payment container, show shipping container
      paymentContainer.classList.add("d-none")
      shippingContainer.classList.remove("d-none")

      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" })
    })
  }

  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", () => {
      // Validate payment form
      let isValid = true
      const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value

      if (selectedPaymentMethod === "creditCard") {
        const cardName = document.getElementById("cardName")
        const cardNumber = document.getElementById("cardNumber")
        const expiryDate = document.getElementById("expiryDate")
        const cvv = document.getElementById("cvv")

        if (!cardName.value || !cardNumber.value || !expiryDate.value || !cvv.value) {
          isValid = false
          showNotification("Please fill in all credit card details", "error")
        }
      } else if (selectedPaymentMethod === "momo") {
        const momoProvider = document.getElementById("momoProvider")
        const momoNumber = document.getElementById("momoNumber")

        if (!momoProvider.value || !momoNumber.value) {
          isValid = false
          showNotification("Please fill in all mobile money details", "error")
        }
      }

      if (isValid) {
        // Update progress steps
        updateProgressSteps(3)

        // Generate order number
        const orderNumber = "BC-" + Math.floor(100000 + Math.random() * 900000)
        document.getElementById("order-number").textContent = orderNumber

        // Set order email
        if (orderEmail) {
          const emailInput = document.getElementById("email")
          if (emailInput) {
            orderEmail.textContent = emailInput.value
          }
        }

        // Hide payment container, show success container
        paymentContainer.classList.add("d-none")
        successContainer.classList.remove("d-none")

        // Clear cart
        localStorage.removeItem("cartItems")

        // Scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    })
  }

  if (promoToggle) {
    promoToggle.addEventListener("click", () => {
      promoForm.classList.toggle("d-none")
    })
  }

  if (applyPromoBtn) {
    applyPromoBtn.addEventListener("click", () => {
      const promoCode = document.getElementById("promo-code").value
      if (promoCode && promoCode.toUpperCase() === "BOOKCONNECT10") {
        // Apply 10% discount
        const subtotal = Number.parseFloat(summarySubtotal.textContent.replace("₵", ""))
        const discount = subtotal * 0.1

        // Show discount in summary
        discountItem.classList.remove("d-none")
        summaryDiscount.textContent = `-₵${discount.toFixed(2)}`

        // Update total
        updateOrderTotal()

        // Show success message
        showNotification("Promo code applied successfully!", "success")
      } else {
        showNotification("Invalid promo code. Please try again.", "error")
      }
    })
  }

  // Delivery method change event
  deliveryOptions.forEach((option) => {
    option.addEventListener("change", function () {
      const value = this.value
      let shippingCost = 0

      switch (value) {
        case "standard":
          shippingCost = 5.0
          break
        case "express":
          shippingCost = 15.0
          break
        case "pickup":
          shippingCost = 0.0
          break
      }

      // Update shipping cost in summary
      summaryShipping.textContent = `₵${shippingCost.toFixed(2)}`

      // Update total
      updateOrderTotal()
    })
  })

  // Payment method change event
  paymentMethods.forEach((method) => {
    method.addEventListener("change", function () {
      const value = this.value

      // Hide all payment forms
      creditCardForm.classList.add("d-none")
      momoForm.classList.add("d-none")
      paypalForm.classList.add("d-none")

      // Show selected payment form
      switch (value) {
        case "creditCard":
          creditCardForm.classList.remove("d-none")
          break
        case "momo":
          momoForm.classList.remove("d-none")
          break
        case "paypal":
          paypalForm.classList.remove("d-none")
          break
      }
    })
  })

  // Functions
  function loadCartItems() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || []

    if (cartItems.length === 0) {
      // If cart is empty, redirect to cart page
      window.location.href = "shop-cart.html"
      return
    }

    // Display the cart items in the checkout summary
    displayOrderSummary(cartItems)
  }

  function displayOrderSummary(items) {
    // Clear existing items
    summaryItems.innerHTML = ""

    // Calculate subtotal
    let subtotal = 0

    // Add each item to summary
    items.forEach((item) => {
      const itemTotal = item.price * item.quantity
      subtotal += itemTotal

      const itemElement = document.createElement("div")
      itemElement.className = "summary-product"
      itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="summary-product-image">
        <div class="summary-product-details">
          <span class="summary-product-title">${item.title}</span>
          <span class="summary-product-author">${item.author || "Unknown Author"}</span>
          <span class="summary-product-price">₵${Number.parseFloat(item.price).toFixed(2)}</span>
          <span class="summary-product-quantity">Qty: ${item.quantity}</span>
        </div>
      `

      summaryItems.appendChild(itemElement)
    })

    // Update summary information
    summaryItemCount.textContent = `${items.length} item${items.length !== 1 ? "s" : ""}`
    summarySubtotal.textContent = `₵${subtotal.toFixed(2)}`

    // Calculate tax (5% of subtotal)
    const tax = subtotal * 0.05
    summaryTax.textContent = `₵${tax.toFixed(2)}`

    // Update total
    updateOrderTotal()
  }

  function updateOrderTotal() {
    const subtotal = Number.parseFloat(summarySubtotal.textContent.replace("₵", ""))
    const shipping = Number.parseFloat(summaryShipping.textContent.replace("₵", ""))
    const tax = Number.parseFloat(summaryTax.textContent.replace("₵", ""))
    let discount = 0

    if (!discountItem.classList.contains("d-none")) {
      discount = Number.parseFloat(summaryDiscount.textContent.replace("-₵", ""))
    }

    const total = subtotal + shipping + tax - discount
    summaryTotal.textContent = `₵${total.toFixed(2)}`
  }

  function updateProgressSteps(step) {
    const steps = document.querySelectorAll(".progress-step")
    const lines = document.querySelectorAll(".progress-line")

    steps.forEach((s, index) => {
      if (index < step) {
        s.classList.add("active")
      } else {
        s.classList.remove("active")
      }
    })

    lines.forEach((line, index) => {
      if (index < step - 1) {
        line.classList.add("active")
      } else {
        line.classList.remove("active")
      }
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

  // Format credit card input
  const cardNumberInput = document.getElementById("cardNumber")
  if (cardNumberInput) {
    cardNumberInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length > 16) {
        value = value.slice(0, 16)
      }

      // Add spaces every 4 digits
      const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ")
      e.target.value = formattedValue
    })
  }

  // Format expiry date input
  const expiryDateInput = document.getElementById("expiryDate")
  if (expiryDateInput) {
    expiryDateInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length > 4) {
        value = value.slice(0, 4)
      }

      if (value.length > 2) {
        value = value.slice(0, 2) + "/" + value.slice(2)
      }

      e.target.value = value
    })
  }

  // Format CVV input
  const cvvInput = document.getElementById("cvv")
  if (cvvInput) {
    cvvInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "")
      if (value.length > 3) {
        value = value.slice(0, 3)
      }

      e.target.value = value
    })
  }

  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))

  // Declare bootstrap variable
  const bootstrap = window.bootstrap

  tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))
})

