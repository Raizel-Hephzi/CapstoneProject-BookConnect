document.addEventListener("DOMContentLoaded", () => {
  const bookUploadForm = document.querySelector(".book-upload-form")

  if (bookUploadForm) {
    bookUploadForm.addEventListener("submit", handleBookUpload)
  }

  // Initialize preview for image upload
  const imageUpload = document.getElementById("image-upload")
  if (imageUpload) {
    imageUpload.addEventListener("change", previewImage)
  }
})

/**
 * Handles the book upload form submission
 * @param {Event} event - The form submission event
 */
function handleBookUpload(event) {
  event.preventDefault()

  // Get form values
  const title = document.getElementById("book-title").value
  const author = document.getElementById("book-author").value
  const description = document.getElementById("book-description").value
  const category = document.getElementById("category").value
  const type = document.getElementById("type").value

  // Get image file
  const imageFile = document.getElementById("image-upload").files[0]
  let imageUrl = ""

  // Create a book ID (timestamp + random number)
  const bookId = Date.now() + "-" + Math.floor(Math.random() * 1000)

  // Process image (in a real app, this would upload to a server)
  if (imageFile) {
    // For demo purposes, create a local object URL
    // In a real application, you would upload this to a server
    imageUrl = URL.createObjectURL(imageFile)
  } else {
    // Use a placeholder image if no image was selected
    imageUrl = "/placeholder.svg?height=400&width=300"
  }

  // Create book object
  const book = {
    id: bookId,
    title: title,
    author: author,
    description: description,
    category: category,
    type: type,
    imageUrl: imageUrl,
    price: generateRandomPrice(),
    rating: generateRandomRating(),
    uploadDate: new Date().toISOString(),
  }

  // Save to localStorage (in a real app, this would be sent to a server)
  saveBookToLocalStorage(book)

  // Show success message
  showNotification("Book uploaded successfully!")

  // Reset form
  const bookUploadForm = document.querySelector(".book-upload-form") // Declare bookUploadForm here
  bookUploadForm.reset()

  // Redirect to browse books page after a short delay
  setTimeout(() => {
    window.location.href = "books-grid-view.html"
  }, 2000)
}

/**
 * Saves a book to localStorage
 * @param {Object} book - The book object to save
 */
function saveBookToLocalStorage(book) {
  // Get existing books from localStorage
  const books = JSON.parse(localStorage.getItem("books")) || []

  // Add new book
  books.push(book)

  // Save back to localStorage
  localStorage.setItem("books", JSON.stringify(books))
}

/**
 * Generates a random price between $10 and $50
 * @returns {number} A random price
 */
function generateRandomPrice() {
  return (Math.floor(Math.random() * 40) + 10).toFixed(2)
}

/**
 * Generates a random rating between 3 and 5
 * @returns {number} A random rating
 */
function generateRandomRating() {
  return (Math.floor(Math.random() * 20) + 30) / 10 // Between 3.0 and 5.0
}

/**
 * Shows a preview of the uploaded image
 * @param {Event} event - The change event from the file input
 */
function previewImage(event) {
  const file = event.target.files[0]
  if (file) {
    // Create preview element if it doesn't exist
    let previewContainer = document.getElementById("image-preview-container")
    if (!previewContainer) {
      previewContainer = document.createElement("div")
      previewContainer.id = "image-preview-container"
      previewContainer.style.marginTop = "10px"
      event.target.parentNode.appendChild(previewContainer)
    }

    // Clear previous preview
    previewContainer.innerHTML = ""

    // Create image element
    const img = document.createElement("img")
    img.src = URL.createObjectURL(file)
    img.style.maxWidth = "200px"
    img.style.maxHeight = "200px"
    img.style.border = "1px solid #ddd"
    img.style.borderRadius = "4px"
    img.style.padding = "5px"

    // Add image to preview container
    previewContainer.appendChild(img)
  }
}

/**
 * Shows a notification message
 * @param {string} message - The message to display
 */
function showNotification(message) {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = "notification"
  notification.textContent = message

  // Style the notification
  notification.style.position = "fixed"
  notification.style.top = "20px"
  notification.style.right = "20px"
  notification.style.backgroundColor = "#4CAF50"
  notification.style.color = "white"
  notification.style.padding = "15px"
  notification.style.borderRadius = "5px"
  notification.style.zIndex = "1000"
  notification.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)"

  // Add to document
  document.body.appendChild(notification)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0"
    notification.style.transition = "opacity 0.5s"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 500)
  }, 3000)
}

