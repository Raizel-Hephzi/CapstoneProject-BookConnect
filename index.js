// This script updates all book links to point to the book detail page with the appropriate ID
// and handles the search functionality

document.addEventListener('DOMContentLoaded', function() {
  console.log("BookConnect script initialized");
  
  // Book data - in a real application, this would come from a database or API
  const books = [
    {
      id: "book-1",
      title: "Programming Textbook",
      author: "Jan Newmarch",
      category: "ACADEMICS",
      rating: 6.8,
      price: 12.0,
      image: "images/books/grid/book17.jpg",
      isFree: true,
      description: "A comprehensive guide to programming fundamentals covering multiple languages and paradigms. This textbook is perfect for beginners and intermediate programmers looking to expand their knowledge. It includes practical examples, exercises, and real-world applications to help students master programming concepts."
    },
    {
      id: "book-2",
      title: "Computer Science Textbook",
      author: "Micro A Manucci",
      category: "COMPUTING",
      rating: 8.9,
      price: 56.0,
      image: "images/books/grid/book27.jpg",
      isFree: true,
      description: "An in-depth exploration of computer science principles, algorithms, data structures, and computational theory. This comprehensive textbook covers everything from basic computing concepts to advanced topics in artificial intelligence and machine learning. Ideal for undergraduate and graduate students in computer science programs."
    },
    {
      id: "book-3",
      title: "English Past Questions",
      author: "Passco",
      category: "ACADEMICS",
      rating: 4.8,
      price: 8.0,
      image: "images/books/grid/book22.jpg",
      isFree: true,
      description: "A collection of past examination questions for English language and literature students. This compilation includes questions from various standardized tests and examinations, complete with model answers and explanatory notes. An essential resource for students preparing for English exams at secondary and tertiary levels."
    },
    {
      id: "book-4",
      title: "Machine Learning",
      author: "Springer",
      category: "ACADEMICS",
      rating: 6.8,
      price: 12.0,
      image: "images/books/grid/book20.jpg",
      isFree: true,
      description: "A modern approach to machine learning concepts, algorithms, and applications. This textbook covers supervised and unsupervised learning, neural networks, deep learning, and reinforcement learning. It includes Python code examples and case studies from real-world applications in various industries."
    },
    {
      id: "book-5",
      title: "Medicine Past Questions",
      author: "Passco",
      category: "ACADEMICS",
      rating: 7.8,
      price: 12.0,
      image: "images/books/grid/book23.jpg",
      isFree: true,
      description: "A comprehensive collection of past examination questions for medical students. This compilation covers anatomy, physiology, biochemistry, pathology, pharmacology, and clinical sciences. Each question is accompanied by detailed explanations and references to standard medical textbooks."
    },
    {
      id: "book-6",
      title: "Undergraduate Topology",
      author: "Oxford",
      category: "ACADEMICS",
      rating: 6.8,
      price: 12.0,
      image: "images/books/grid/book24.jpg",
      isFree: true,
      description: "An introduction to topology for undergraduate mathematics students. This textbook covers point-set topology, algebraic topology, and differential topology with a focus on building intuition and problem-solving skills. Includes numerous exercises and examples to reinforce concepts."
    },
    {
      id: "book-7",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      category: "Classic Literature",
      rating: 9.2,
      price: 60.0,
      image: "images/books/large/bigbook3.jpg",
      isFree: false,
      description: "Set in the summer of 1922, the novel follows the life of a young and mysterious millionaire, Jay Gatsby, and his obsessive love for the beautiful former debutante Daisy Buchanan. As the story unfolds, Gatsby's dark secrets and the corrupt reality of the American dream during the Jazz Age are revealed. The narrative is a critique of the hedonistic excess and moral decay of the era, ultimately leading to tragic consequences."
    },
    {
      id: "book-8",
      title: "Ulysses",
      author: "James Joyce",
      category: "Modernist Fiction",
      rating: 8.5,
      price: 50.0,
      image: "images/books/large/bigbook4.jpg",
      isFree: false,
      description: "Set in Dublin on June 16, 1904, the novel follows a day in the life of Leopold Bloom, an advertising salesman, as he navigates the city. The narrative, heavily influenced by Homer's Odyssey, explores themes of identity, heroism, and the complexities of everyday life. It is renowned for its stream-of-consciousness style and complex structure, making it a challenging but rewarding read for those interested in modernist literature."
    },
    {
      id: "book-9",
      title: "War and Peace",
      author: "Leo Tolstoy",
      category: "Classic Literature",
      rating: 9.0,
      price: 100.0,
      image: "images/books/large/bigbook5.jpg",
      isFree: false,
      description: "Set against the backdrop of the Napoleonic era, the novel presents a panorama of Russian society and its descent into the chaos of war. It follows the interconnected lives of five aristocratic families, their struggles, romances, and personal journeys through this tumultuous period of history. The narrative explores themes of love, war, and the meaning of life, as it weaves together historical events with the personal stories of its characters."
    },
    {
      id: "book-10",
      title: "Rich Dad Poor Dad",
      author: "Robert T. Kiyosaki",
      category: "Personal Finance",
      rating: 8.7,
      price: 50.0,
      image: "images/books/large/bigbook6.jpg",
      isFree: false,
      description: "A memoir that contrasts the financial philosophies of the author's two fathers. The 'rich dad' is his best friend's father, who accumulated wealth through entrepreneurship and investing, while the 'poor dad' is Kiyosaki's own father, who worked hard but never achieved financial security. Through this comparison, Kiyosaki outlines six key lessons about money, investing, and building wealth that challenge conventional wisdom about work and finances."
    },
    {
      id: "book-11",
      title: "Atomic Habits",
      author: "James Clear",
      category: "Self-Help",
      rating: 9.3,
      price: 100.0,
      image: "images/books/large/bigbook7.jpg",
      isFree: false,
      description: "A comprehensive guide to habit formation and change. The book provides a framework for understanding how habits work and offers practical strategies to form good habits, break bad ones, and achieve remarkable results. Clear explains how tiny changes in behavior can lead to remarkable results over time, using insights from biology, psychology, and neuroscience to create an easy-to-understand guide for making good habits inevitable and bad habits impossible."
    },
    {
      id: "book-12",
      title: "Think Like a Monk",
      author: "Jay Shetty",
      category: "Personal Development",
      rating: 8.6,
      price: 10.0,
      image: "images/books/large/bigbook8.jpg",
      isFree: false,
      description: "Drawing on his experience as a monk in the Vedic tradition, Jay Shetty shares the timeless wisdom he learned during his time in an ashram. The book reveals how to overcome negative thoughts and habits to find peace and purpose in everyday life. Combining ancient wisdom with his own rich experiences in the ashram, Shetty provides practical steps anyone can take every day to live a less anxious, more meaningful life."
    }
  ];
  
  // Map book titles to IDs for easy lookup
  const bookTitleToId = {};
  books.forEach(book => {
    bookTitleToId[book.title] = book.id;
  });
  
  // Function to get book by ID - this will be used by book-detail.html
  window.getBookById = function(bookId) {
    return books.find(book => book.id === bookId) || null;
  };
  
  // Function to search books - this will be used by the search functionality
  window.searchBooks = function(query) {
    query = query.toLowerCase();
    return books.filter(book => 
      book.title.toLowerCase().includes(query) || 
      book.author.toLowerCase().includes(query)
    );
  };
  
  console.log("Starting to update book links");
  
  // ===== FIX FOR FEATURED PRODUCTS =====
  // First, let's add debug information to see what's on the page
  const trendingBooks = document.querySelectorAll('.swiper-container.books-wrapper-3 .swiper-wrapper .books-card');
  console.log(`Found ${trendingBooks.length} trending books`);
  
  const featuredBooks = document.querySelectorAll('.swiper-container.books-wrapper-2 .swiper-wrapper .books-card');
  console.log(`Found ${featuredBooks.length} featured books`);
  
  // 1. Update all book links in the trending swaps section
  console.log("Updating trending book links");
  updateBookLinks('.swiper-container.books-wrapper-3 .swiper-wrapper .books-card .dz-content .title a');
  
  // 2. Update all book links in the featured products section
  // The featured products might have a different structure, so let's try multiple selectors
  console.log("Updating featured book links");
  updateBookLinks('.swiper-container.books-wrapper-2 .swiper-wrapper .books-card .dz-content .title a');
  updateBookLinks('.swiper-container.books-wrapper-2 .swiper-wrapper .books-card .dz-content h2.title');
  
  // 3. Update all "See Details" buttons
  console.log("Updating 'See Details' buttons");
  updateBookLinks('.books-card .bookcard-footer a.btn-outline-secondary');
  
  // 4. DIRECT FIX: Manually update featured product links
  console.log("Applying direct fix for featured books");
  const featuredTitles = document.querySelectorAll('.books-card .dz-content h2.title');
  featuredTitles.forEach(titleElement => {
    const bookTitle = titleElement.textContent.trim();
    const bookId = bookTitleToId[bookTitle];
    
    if (bookId) {
      console.log(`Found featured book: "${bookTitle}" with ID: ${bookId}`);
      
      // Look for all links in this book card
      const bookCard = titleElement.closest('.books-card');
      if (bookCard) {
        const allLinks = bookCard.querySelectorAll('a');
        allLinks.forEach(link => {
          // Update link to point to book detail
          link.href = `book-detail.html?id=${bookId}`;
          console.log(`Updated link in featured book card for "${bookTitle}"`);
        });
        
        // Also make the title itself clickable if it's not already a link
        if (titleElement.tagName.toLowerCase() !== 'a') {
          titleElement.style.cursor = 'pointer';
          titleElement.addEventListener('click', function() {
            window.location.href = `book-detail.html?id=${bookId}`;
          });
          console.log(`Made title clickable for "${bookTitle}"`);
        }
      }
    }
  });
  
  // 5. DIRECT FIX: Add click events to all book cards
  console.log("Adding click events to all book cards");
  document.querySelectorAll('.books-card').forEach(card => {
    card.style.cursor = 'pointer';
    
    // Get the book title
    const titleElement = card.querySelector('.title a') || card.querySelector('.title') || card.querySelector('h2.title');
    if (titleElement) {
      const bookTitle = titleElement.textContent.trim();
      const bookId = bookTitleToId[bookTitle];
      
      if (bookId) {
        console.log(`Adding click event to book card for "${bookTitle}"`);
        
        // Add click event listener
        card.addEventListener('click', function(e) {
          // Only navigate if the click wasn't directly on a link or button
          if (!e.target.closest('a') && !e.target.closest('button')) {
            console.log(`Card clicked for "${bookTitle}", navigating to book-detail.html?id=${bookId}`);
            window.location.href = `book-detail.html?id=${bookId}`;
          }
        });
      }
    }
  });
  
  // Function to update book links
  function updateBookLinks(selector) {
    const bookLinks = document.querySelectorAll(selector);
    console.log(`Found ${bookLinks.length} links with selector: ${selector}`);
    
    bookLinks.forEach(link => {
      const bookTitle = link.textContent.trim();
      const bookId = bookTitleToId[bookTitle];
      
      if (bookId) {
        // Update the href to point to the book detail page with the book ID
        link.href = `book-detail.html?id=${bookId}`;
        console.log(`Updated link for "${bookTitle}" to ID: ${bookId}`);
      } else {
        console.log(`No book ID found for title: "${bookTitle}"`);
      }
    });
  }
  
  // Initialize search functionality
  initializeSearch();
  
  function initializeSearch() {
    const searchForms = document.querySelectorAll('.header-item-search, .search-input, .search.style-1');
    console.log(`Found ${searchForms.length} search forms`);
    
    searchForms.forEach(form => {
      const searchInput = form.querySelector('input[type="text"]');
      const categorySelect = form.querySelector('select');
      const searchButton = form.querySelector('button');
      
      if (searchButton) {
        searchButton.addEventListener('click', function(e) {
          e.preventDefault();
          performSearch(searchInput, categorySelect);
        });
      }
      
      if (searchInput) {
        // Optional: Real-time search as user types (with debounce)
        let debounceTimer;
        searchInput.addEventListener('input', function() {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            performSearch(searchInput, categorySelect);
          }, 500); // Wait 500ms after user stops typing
        });
      }
      
      if (categorySelect) {
        categorySelect.addEventListener('change', function() {
          performSearch(searchInput, categorySelect);
        });
      }
      
      // Handle form submission
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        performSearch(searchInput, categorySelect);
      });
    });
  }
  
  // Function to perform the search
  function performSearch(searchInput, categorySelect) {
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedCategory = categorySelect ? categorySelect.value : 'Category';
    
    console.log(`Performing search: term="${searchTerm}", category="${selectedCategory}"`);
    
    // Filter books based on search criteria
    let filteredBooks = books;
    
    // Filter by search term
    if (searchTerm) {
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by category if a specific category is selected
    if (selectedCategory && selectedCategory !== 'Category') {
      filteredBooks = filteredBooks.filter(book => 
        book.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    console.log(`Found ${filteredBooks.length} books matching criteria`);
    
    // Display the filtered books
    displayBooks(filteredBooks);
    
    // Update the section title to show search results
    const sectionTitle = document.querySelector('.section-head.book-align .title.mb-0');
    if (sectionTitle) {
      if (searchTerm || (selectedCategory && selectedCategory !== 'Category')) {
        sectionTitle.textContent = `Search Results (${filteredBooks.length} books found)`;
      } else {
        sectionTitle.textContent = 'Trending Swaps This Week';
      }
    }
  }
  
  // Function to display books in the container
  function displayBooks(booksToDisplay) {
    const booksContainer = document.querySelector('.swiper-container.books-wrapper-3 .swiper-wrapper');
    if (!booksContainer) {
      console.log('Books container not found');
      return;
    }
    
    // Clear current books
    booksContainer.innerHTML = '';
    
    if (booksToDisplay.length === 0) {
      // Display no results message
      booksContainer.innerHTML = `
        <div class="swiper-slide">
          <div class="text-center py-5">
            <h3 class="text-xl font-semibold">No books found</h3>
            <p class="mt-2">Try adjusting your search or category filter</p>
          </div>
        </div>
      `;
      return;
    }
    
    // Create HTML for each book
    booksToDisplay.forEach(book => {
      const bookHTML = `
        <div class="swiper-slide">
          <div class="books-card style-3 wow fadeInUp">
            <div class="dz-media">
              <img src="${book.image}" alt="${book.title}">
              <br><br>
            </div>
            <div class="dz-content">
              <h5 class="title"><a href="book-detail.html?id=${book.id}">${book.title}</a></h5>
              <ul class="dz-tags">
                <li><a href="javascript:void(0);">${book.author}</a></li>
                <li><a href="javascript:void(0);">${book.category}</a></li>
              </ul>
              <div class="book-footer">
                <div class="rate">
                  <i class="flaticon-star"></i> ${book.rating}
                </div>
                <div class="price">
                  <span class="price-num">${book.isFree ? 'Free' : '₵' + book.price.toFixed(2)}</span>
                  ${book.isFree ? `<del>₵${book.price.toFixed(2)}</del>` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      
      booksContainer.innerHTML += bookHTML;
    });
    
    // Reinitialize Swiper if it exists
    let swiperInstance;
    if (typeof Swiper !== 'undefined' && document.querySelector('.swiper-four')) {
      try {
        swiperInstance = new Swiper('.swiper-four', {
          slidesPerView: 4,
          spaceBetween: 30,
          pagination: {
            el: '.swiper-pagination-two',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          breakpoints: {
            1200: { slidesPerView: 4 },
            991: { slidesPerView: 3 },
            768: { slidesPerView: 2 },
            320: { slidesPerView: 1 }
          }
        });
      } catch (error) {
        console.error("Error initializing Swiper:", error);
      }
    }
  }
  
  // Initialize with all books
  const booksContainer = document.querySelector('.swiper-container.books-wrapper-3 .swiper-wrapper');
  if (booksContainer) {
    displayBooks(books);
  }
  
  // Add test links at the bottom of the page for all books
  addTestLinks();
  
  function addTestLinks() {
    const footer = document.querySelector('.footer-bottom');
    if (footer) {
      const testLinks = document.createElement('div');
      testLinks.className = 'container text-center py-3';
      testLinks.innerHTML = `
        <h4>Book Detail Test Links</h4>
        <p>Click any link below to directly view book details:</p>
        <div class="row">
          ${books.map(book => `
            <div class="col-md-3 col-sm-6 mb-3">
              <a href="book-detail.html?id=${book.id}" class="btn btn-sm btn-outline-primary d-block">
                ${book.title}
              </a>
            </div>
          `).join('')}
        </div>
      `;
      footer.parentNode.insertBefore(testLinks, footer);
      console.log("Added test links for all books");
    }
  }
});