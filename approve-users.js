// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded, initializing scripts...");
  
  // Debug function to check if elements exist
  function debugElement(element, name) {
    if (element) {
      console.log(`✅ Found ${name}`);
    } else {
      console.error(`❌ Could not find ${name}`);
    }
  }
  
  // Simple notification function
  function showNotification(message, type) {
    console.log(`Notification (${type}): ${message}`);
    alert(`${message}`);
  }
  
  // ===== DELETE FUNCTIONALITY =====
  const deleteButtons = document.querySelectorAll(".reject-btn");
  debugElement(deleteButtons, "delete buttons");
  console.log(`Found ${deleteButtons.length} delete buttons`);
  
  const confirmationModal = document.getElementById("confirmation-modal");
  debugElement(confirmationModal, "confirmation modal");
  
  const confirmationMessage = document.getElementById("confirmation-message");
  debugElement(confirmationMessage, "confirmation message");
  
  const confirmActionBtn = document.getElementById("confirm-action-btn");
  debugElement(confirmActionBtn, "confirm action button");
  
  const cancelActionBtn = document.getElementById("cancel-action-btn");
  debugElement(cancelActionBtn, "cancel action button");
  
  // Store the current row to be deleted
  let currentRowToDelete = null;
  
  // Add click event to each delete button
  deleteButtons.forEach((button, index) => {
    console.log(`Setting up delete button ${index + 1}`);
    
    button.addEventListener("click", function(e) {
      console.log("Delete button clicked");
      e.preventDefault();
      
      const row = this.closest("tr");
      if (!row) {
        console.error("Could not find parent row");
        return;
      }
      
      const userNameCell = row.querySelector("td:nth-child(3)");
      if (!userNameCell) {
        console.error("Could not find username cell");
        return;
      }
      
      const userName = userNameCell.textContent;
      console.log(`Deleting user: ${userName}`);
      
      // Store the row for later deletion
      currentRowToDelete = row;
      
      // Show confirmation modal
      if (confirmationModal && confirmationMessage) {
        confirmationMessage.textContent = `Are you sure you want to delete ${userName}?`;
        confirmationModal.style.display = "flex";
        console.log("Showing confirmation modal");
      } else {
        console.error("Confirmation modal elements not found");
      }
    });
  });
  
  // Confirm delete action
  if (confirmActionBtn) {
    confirmActionBtn.addEventListener("click", function() {
      console.log("Confirm delete clicked");
      
      if (currentRowToDelete) {
        const userName = currentRowToDelete.querySelector("td:nth-child(3)").textContent;
        
        // Remove the row from the table
        currentRowToDelete.remove();
        console.log(`Removed row for ${userName}`);
        
        // Show notification
        showNotification(`${userName} has been deleted.`, "success");
        
        // Reset current row
        currentRowToDelete = null;
      }
      
      // Hide modal
      if (confirmationModal) {
        confirmationModal.style.display = "none";
        console.log("Hiding confirmation modal");
      }
    });
  }
  
  // Cancel delete action
  if (cancelActionBtn) {
    cancelActionBtn.addEventListener("click", function() {
      console.log("Cancel delete clicked");
      
      // Reset current row
      currentRowToDelete = null;
      
      // Hide modal
      if (confirmationModal) {
        confirmationModal.style.display = "none";
        console.log("Hiding confirmation modal");
      }
    });
  }
  
  // ===== MESSAGE FUNCTIONALITY =====
  const messageButtons = document.querySelectorAll(".message-btn");
  debugElement(messageButtons, "message buttons");
  console.log(`Found ${messageButtons.length} message buttons`);
  
  const messageModal = document.getElementById("message-modal");
  debugElement(messageModal, "message modal");
  
  const messageUserName = document.getElementById("message-user-name");
  debugElement(messageUserName, "message user name");
  
  const messageUserEmail = document.getElementById("message-user-email");
  debugElement(messageUserEmail, "message user email");
  
  const messageUserAvatar = document.getElementById("message-user-avatar");
  debugElement(messageUserAvatar, "message user avatar");
  
  const cancelMessageBtn = document.getElementById("cancel-message-btn");
  debugElement(cancelMessageBtn, "cancel message button");
  
  const sendMessageBtn = document.getElementById("send-message-btn");
  debugElement(sendMessageBtn, "send message button");
  
  // Add click event to each message button
  messageButtons.forEach((button, index) => {
    console.log(`Setting up message button ${index + 1}`);
    
    button.addEventListener("click", function(e) {
      console.log("Message button clicked");
      e.preventDefault();
      
      const row = this.closest("tr");
      if (!row) {
        console.error("Could not find parent row");
        return;
      }
      
      const userNameCell = row.querySelector("td:nth-child(3)");
      if (!userNameCell) {
        console.error("Could not find username cell");
        return;
      }
      
      const userName = userNameCell.textContent;
      console.log(`Messaging user: ${userName}`);
      
      const userEmailCell = row.querySelector("td:nth-child(4)");
      const userEmail = userEmailCell ? userEmailCell.textContent : "";
      
      const userAvatarImg = row.querySelector(".user-avatar img");
      const userAvatar = userAvatarImg ? userAvatarImg.src : "";
      
      // Set user details in the modal
      if (messageUserName) messageUserName.textContent = userName;
      if (messageUserEmail) messageUserEmail.textContent = userEmail;
      if (messageUserAvatar) messageUserAvatar.src = userAvatar;
      
      // Clear previous message
      const subjectInput = document.getElementById("message-subject");
      const contentInput = document.getElementById("message-content");
      
      if (subjectInput) subjectInput.value = "";
      if (contentInput) contentInput.value = "";
      
      // Show the modal
      if (messageModal) {
        messageModal.style.display = "flex";
        console.log("Showing message modal");
      } else {
        console.error("Message modal not found");
      }
    });
  });
  
  // Cancel message
  if (cancelMessageBtn) {
    cancelMessageBtn.addEventListener("click", function() {
      console.log("Cancel message clicked");
      
      // Hide modal
      if (messageModal) {
        messageModal.style.display = "none";
        console.log("Hiding message modal");
      }
    });
  }
  
  // Send message
  if (sendMessageBtn) {
    sendMessageBtn.addEventListener("click", function() {
      console.log("Send message clicked");
      
      const userName = messageUserName ? messageUserName.textContent : "";
      
      const subjectInput = document.getElementById("message-subject");
      const contentInput = document.getElementById("message-content");
      
      const subject = subjectInput ? subjectInput.value : "";
      const content = contentInput ? contentInput.value : "";
      
      if (!subject || !content) {
        showNotification("Please fill in all fields.", "error");
        return;
      }
      
      console.log(`Sending message to ${userName}: ${subject}`);
      
      // In a real application, you would send the message to the server here
      
      // Hide modal
      if (messageModal) {
        messageModal.style.display = "none";
        console.log("Hiding message modal");
      }
      
      // Show success notification
      showNotification(`Message sent to ${userName} successfully.`, "success");
    });
  }
  
  // ===== CLOSE MODAL BUTTONS =====
  const closeModalBtns = document.querySelectorAll(".close-modal-btn");
  debugElement(closeModalBtns, "close modal buttons");
  console.log(`Found ${closeModalBtns.length} close modal buttons`);
  
  closeModalBtns.forEach((btn, index) => {
    console.log(`Setting up close button ${index + 1}`);
    
    btn.addEventListener("click", function() {
      console.log("Close button clicked");
      
      const modal = this.closest(".modal");
      if (modal) {
        modal.style.display = "none";
        console.log("Hiding modal");
      } else {
        console.error("Could not find parent modal");
      }
    });
  });
  
  // Close modals when clicking outside content
  document.addEventListener("click", function(e) {
    if (e.target.classList.contains("modal")) {
      console.log("Clicked outside modal content");
      e.target.style.display = "none";
    }
  });
  
  console.log("Script initialization complete");
});