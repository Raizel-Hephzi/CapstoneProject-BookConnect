document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const paymentMethodTabs = document.querySelectorAll('.payment-method-tab');
  const paymentForms = document.querySelectorAll('.payment-form-container');
  const cardNumberInput = document.getElementById('cardNumber');
  const cardHolderInput = document.getElementById('cardHolder');
  const cardExpiryInput = document.getElementById('cardExpiry');
  const cardCvvInput = document.getElementById('cardCvv');
  const cardNumberPreview = document.getElementById('cardNumberPreview');
  const cardHolderPreview = document.getElementById('cardHolderName');
  const cardExpiryPreview = document.getElementById('cardExpiryDate');
  const cardTypeIcon = document.getElementById('cardTypeIcon');
  const payButton = document.getElementById('payButton');
  const backButton = document.getElementById('backButton');
  const paymentProcessing = document.getElementById('paymentProcessing');
  const paymentAmount = document.getElementById('paymentAmount');
  const mobileProviders = document.querySelectorAll('input[name="mobileProvider"]');
  const mobileNumberInput = document.getElementById('mobileNumber');
  const paypalButton = document.getElementById('paypalButton');
  
  // Get total amount from localStorage or set default
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  let subtotal = 0;
  cartItems.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  const tax = subtotal * 0.05; // 5% tax
  const shipping = subtotal > 0 ? 5.00 : 0.00; // $5 shipping fee
  const total = subtotal + tax + shipping;
  
  // Update payment amount on button
  if (paymentAmount) {
    paymentAmount.textContent = `₵${total.toFixed(2)}`;
  }
  
  // Tab switching
  paymentMethodTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and forms
      paymentMethodTabs.forEach(t => t.classList.remove('active'));
      paymentForms.forEach(f => f.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Show corresponding form
      const formId = tab.getAttribute('data-form');
      document.getElementById(formId).classList.add('active');
    });
  });
  
  // Credit Card Number Input Formatting and Validation
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      
      // Limit to 16 digits
      if (value.length > 16) {
        value = value.slice(0, 16);
      }
      
      // Format with spaces every 4 digits
      const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
      e.target.value = formattedValue;
      
      // Update card preview
      if (cardNumberPreview) {
        if (value.length > 0) {
          // Show only last 4 digits, mask the rest
          let maskedNumber = value.slice(0, -4).replace(/\d/g, '•');
          if (maskedNumber.length > 0) {
            maskedNumber = maskedNumber.replace(/(.{4})/g, '$1 ').trim();
            cardNumberPreview.textContent = maskedNumber + ' ' + value.slice(-4);
          } else {
            cardNumberPreview.textContent = value;
          }
        } else {
          cardNumberPreview.textContent = '•••• •••• •••• ••••';
        }
      }
      
      // Detect card type
      detectCardType(value);
      
      // Validate
      validateCardNumber(value);
    });
  }
  
  // Card Holder Input
  if (cardHolderInput) {
    cardHolderInput.addEventListener('input', (e) => {
      const value = e.target.value;
      
      // Update card preview
      if (cardHolderPreview) {
        if (value.length > 0) {
          cardHolderPreview.textContent = value.toUpperCase();
        } else {
          cardHolderPreview.textContent = 'YOUR NAME';
        }
      }
      
      // Validate
      validateCardHolder(value);
    });
  }
  
  // Card Expiry Input
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      
      // Limit to 4 digits
      if (value.length > 4) {
        value = value.slice(0, 4);
      }
      
      // Format as MM/YY
      if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
      
      e.target.value = value;
      
      // Update card preview
      if (cardExpiryPreview) {
        if (value.length > 0) {
          cardExpiryPreview.textContent = value;
        } else {
          cardExpiryPreview.textContent = 'MM/YY';
        }
      }
      
      // Validate
      validateCardExpiry(value);
    });
  }
  
  // Card CVV Input
  if (cardCvvInput) {
    cardCvvInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      
      // Limit to 3 or 4 digits
      if (value.length > 4) {
        value = value.slice(0, 4);
      }
      
      e.target.value = value;
      
      // Validate
      validateCardCvv(value);
    });
    
    // Add focus/blur effects for CVV
    cardCvvInput.addEventListener('focus', () => {
      document.querySelector('.card-preview').classList.add('flip');
    });
    
    cardCvvInput.addEventListener('blur', () => {
      document.querySelector('.card-preview').classList.remove('flip');
    });
  }
  
  // Mobile Number Input
  if (mobileNumberInput) {
    mobileNumberInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      
      // Format with spaces
      if (value.length > 3) {
        value = value.replace(/(\d{3})(?=\d)/g, '$1 ');
      }
      
      e.target.value = value;
      
      // Validate
      validateMobileNumber(value);
    });
  }
  
  // Mobile Provider Selection
  mobileProviders.forEach(provider => {
    provider.addEventListener('change', function() {
      // You can add specific logic based on provider selection
      const providerId = this.id;
      console.log(`Selected provider: ${providerId}`);
    });
  });
  
  // Pay Button Click
  if (payButton) {
    payButton.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Get active payment method
      const activeTab = document.querySelector('.payment-method-tab.active');
      const paymentMethod = activeTab.getAttribute('data-method');
      
      let isValid = true;
      
      // Validate based on payment method
      if (paymentMethod === 'card') {
        isValid = validateCreditCardForm();
      } else if (paymentMethod === 'momo') {
        isValid = validateMobileMoneyForm();
      } else if (paymentMethod === 'paypal') {
        // PayPal redirects to their site, so we don't need validation here
        isValid = true;
      }
      
      if (isValid) {
        // Show processing animation
        paymentProcessing.classList.add('active');
        
        // Simulate payment processing
        setTimeout(() => {
          paymentProcessing.classList.remove('active');
          
          // Clear cart
          localStorage.removeItem('cartItems');
          
          // Redirect to success page
          window.location.href = 'payment-success.html';
        }, 3000);
      }
    });
  }
  
  // PayPal Button Click
  if (paypalButton) {
    paypalButton.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Show processing animation
      paymentProcessing.classList.add('active');
      
      // Simulate PayPal redirect and return
      setTimeout(() => {
        paymentProcessing.classList.remove('active');
        
        // Clear cart
        localStorage.removeItem('cartItems');
        
        // Redirect to success page
        window.location.href = 'payment-success.html';
      }, 3000);
    });
  }
  
  // Back Button Click
  if (backButton) {
    backButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'shop-checkout.html';
    });
  }
  
  // Helper Functions
  function detectCardType(number) {
    // Remove spaces
    number = number.replace(/\s+/g, '');
    
    let cardType = '';
    let cardClass = '';
    
    // Visa
    if (/^4/.test(number)) {
      cardType = 'visa';
      cardClass = 'fab fa-cc-visa';
    }
    // Mastercard
    else if (/^5[1-5]/.test(number)) {
      cardType = 'mastercard';
      cardClass = 'fab fa-cc-mastercard';
    }
    // Amex
    else if (/^3[47]/.test(number)) {
      cardType = 'amex';
      cardClass = 'fab fa-cc-amex';
    }
    // Discover
    else if (/^6(?:011|5)/.test(number)) {
      cardType = 'discover';
      cardClass = 'fab fa-cc-discover';
    }
    
    // Update card type icon
    if (cardTypeIcon) {
      if (cardType) {
        cardTypeIcon.className = cardClass + ' card-type-icon visible';
        
        // Also update the card preview brand logo
        const cardBrandLogo = document.getElementById('cardBrandLogo');
        if (cardBrandLogo) {
          cardBrandLogo.className = cardClass + ' card-brand-logo';
        }
      } else {
        cardTypeIcon.className = 'far fa-credit-card card-type-icon';
        
        // Reset card preview brand logo
        const cardBrandLogo = document.getElementById('cardBrandLogo');
        if (cardBrandLogo) {
          cardBrandLogo.className = 'far fa-credit-card card-brand-logo';
        }
      }credit-card card-type-icon';
        \
        // Reset card preview brand logo
        const cardBrandLogo = document.getElementById('cardBrandLogo');
        if (cardBrandLogo) {
          cardBrandLogo.className = 'far fa-credit-card card-brand-logo';
        }
      }
    }
  }
  
  function validateCardNumber(number) {
    // Remove spaces
    number = number.replace(/\s+/g, '');
    
    const errorElement = document.getElementById('cardNumberError');
    
    if (number.length < 13 || number.length > 16) {
      if (errorElement) {
        errorElement.textContent = 'Card number must be between 13 and 16 digits';
        errorElement.classList.add('visible');
      }
      cardNumberInput.classList.add('error');
      return false;
    }
    
    // Luhn algorithm for card number validation
    let sum = 0;
    let shouldDouble = false;
    
    // Loop through values starting from the rightmost digit
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = Number.parseInt(number.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    const isValid = (sum % 10) === 0;
    
    if (!isValid) {
      if (errorElement) {
        errorElement.textContent = 'Invalid card number';
        errorElement.classList.add('visible');
      }
      cardNumberInput.classList.add('error');
      return false;
    }
    
    // Valid
    if (errorElement) {
      errorElement.classList.remove('visible');
    }
    cardNumberInput.classList.remove('error');
    return true;
  }
  
  function validateCardHolder(name) {
    const errorElement = document.getElementById('cardHolderError');
    
    if (name.length < 3) {
      if (errorElement) {
        errorElement.textContent = 'Please enter the cardholder name';
        errorElement.classList.add('visible');
      }
      cardHolderInput.classList.add('error');
      return false;
    }
    
    // Valid
    if (errorElement) {
      errorElement.classList.remove('visible');
    }
    cardHolderInput.classList.remove('error');
    return true;
  }
  
  function validateCardExpiry(expiry) {
    const errorElement = document.getElementById('cardExpiryError');
    
    // Check format
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      if (errorElement) {
        errorElement.textContent = 'Expiry date must be in MM/YY format';
        errorElement.classList.add('visible');
      }
      cardExpiryInput.classList.add('error');
      return false;
    }
    
    // Extract month and year
    const parts = expiry.split('/');
    const month = Number.parseInt(parts[0], 10);
    const year = Number.parseInt('20' + parts[1], 10); // Convert to 4-digit year
    
    // Create date objects for comparison
    const now = new Date();
    const expiryDate = new Date(year, month, 0); // Last day of the month
    
    // Check if month is valid
    if (month < 1 || month > 12) {
      if (errorElement) {
        errorElement.textContent = 'Month must be between 01 and 12';
        errorElement.classList.add('visible');
      }
      cardExpiryInput.classList.add('error');
      return false;
    }
    
    // Check if date is in the past
    if (expiryDate < now) {
      if (errorElement) {
        errorElement.textContent = 'Card has expired';
        errorElement.classList.add('visible');
      }
      cardExpiryInput.classList.add('error');
      return false;
    }
    
    // Valid
    if (errorElement) {
      errorElement.classList.remove('visible');
    }
    cardExpiryInput.classList.remove('error');
    return true;
  }
  
  function validateCardCvv(cvv) {
    const errorElement = document.getElementById('cardCvvError');
    
    if (cvv.length < 3) {
      if (errorElement) {
        errorElement.textContent = 'CVV must be at least 3 digits';
        errorElement.classList.add('visible');
      }
      cardCvvInput.classList.add('error');
      return false;
    }
    
    // Valid
    if (errorElement) {
      errorElement.classList.remove('visible');
    }
    cardCvvInput.classList.remove('error');
    return true;
  }
  
  function validateMobileNumber(number) {
    const errorElement = document.getElementById('mobileNumberError');
    
    // Remove spaces
    number = number.replace(/\s+/g, '');
    
    if (number.length < 10) {
      if (errorElement) {
        errorElement.textContent = 'Please enter a valid mobile number';
        errorElement.classList.add('visible');
      }
      mobileNumberInput.classList.add('error');
      return false;
    }
    
    // Valid
    if (errorElement) {
      errorElement.classList.remove('visible');
    }
    mobileNumberInput.classList.remove('error');
    return true;
  }
  
  function validateCreditCardForm() {
    const isCardNumberValid = validateCardNumber(cardNumberInput.value);
    const isCardHolderValid = validateCardHolder(cardHolderInput.value);
    const isCardExpiryValid = validateCardExpiry(cardExpiryInput.value);
    const isCardCvvValid = validateCardCvv(cardCvvInput.value);
    
    return isCardNumberValid && isCardHolderValid && isCardExpiryValid && isCardCvvValid;
  }
  
  function validateMobileMoneyForm() {
    // Check if a provider is selected
    const selectedProvider = document.querySelector('input[name="mobileProvider"]:checked');
    const providerErrorElement = document.getElementById('providerError');
    
    if (!selectedProvider) {
      if (providerErrorElement) {
        providerErrorElement.textContent = 'Please select a mobile money provider';
        providerErrorElement.classList.add('visible');
      }
      return false;
    } else if (providerErrorElement) {
      providerErrorElement.classList.remove('visible');
    }
    
    // Validate mobile number
    const isMobileNumberValid = validateMobileNumber(mobileNumberInput.value);
    
    return isMobileNumberValid;
  }
})

