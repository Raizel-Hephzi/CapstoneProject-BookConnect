// Simulated backend API for book details
const bookDatabase = {
  // Trending Books
  "book-1": {
    id: "book-1",
    title: "Programming Textbook",
    author: "Jan Newmarch",
    category: "ACADEMICS",
    rating: 6.8,
    price: 12.0,
    isFree: true,
    image: "images/books/grid/book17.jpg",
    description: "A comprehensive guide to programming fundamentals covering multiple languages and paradigms. This textbook is perfect for beginners and intermediate programmers looking to expand their knowledge. It includes practical examples, exercises, and real-world applications to help students master programming concepts.",
    pages: 456,
    language: "English",
    publisher: "Tech Education Press",
    publishDate: "2021-05-15",
    isbn: "978-1234567890",
    availability: "In Stock",
    relatedBooks: ["book-2", "book-4"],
    reviews: [
      { user: "CodeMaster", rating: 5, comment: "Excellent resource for learning programming!" },
      { user: "TechStudent", rating: 4, comment: "Very helpful but some examples are outdated." }
    ]
  },
  "book-2": {
    id: "book-2",
    title: "Computer Science Textbook",
    author: "Micro A Manucci",
    category: "COMPUTING",
    rating: 8.9,
    price: 56.0,
    isFree: true,
    image: "images/books/grid/book27.jpg",
    description: "An in-depth exploration of computer science principles, algorithms, data structures, and computational theory. This comprehensive textbook covers everything from basic computing concepts to advanced topics in artificial intelligence and machine learning. Ideal for undergraduate and graduate students in computer science programs.",
    pages: 782,
    language: "English",
    publisher: "Academic Computing Press",
    publishDate: "2022-01-10",
    isbn: "978-0987654321",
    availability: "In Stock",
    relatedBooks: ["book-1", "book-4"],
    reviews: [
      { user: "CSProfessor", rating: 5, comment: "The most comprehensive CS textbook I've used." },
      { user: "GradStudent", rating: 5, comment: "Excellent explanations of complex concepts." },
      { user: "Undergrad101", rating: 4, comment: "Very thorough but can be dense at times." }
    ]
  },
  "book-3": {
    id: "book-3",
    title: "English Past Questions",
    author: "Passco",
    category: "ACADEMICS",
    rating: 4.8,
    price: 8.0,
    isFree: true,
    image: "images/books/grid/book22.jpg",
    description: "A collection of past examination questions for English language and literature students. This compilation includes questions from various standardized tests and examinations, complete with model answers and explanatory notes. An essential resource for students preparing for English exams at secondary and tertiary levels.",
    pages: 320,
    language: "English",
    publisher: "Passco Educational Resources",
    publishDate: "2020-08-22",
    isbn: "978-5678901234",
    availability: "In Stock",
    relatedBooks: ["book-5"],
    reviews: [
      { user: "EnglishTeacher", rating: 4, comment: "Good collection of questions, helpful for exam prep." },
      { user: "StudentPrep", rating: 3, comment: "Some answers could be more detailed." }
    ]
  },
  "book-4": {
    id: "book-4",
    title: "Machine Learning",
    author: "Springer",
    category: "ACADEMICS",
    rating: 6.8,
    price: 12.0,
    isFree: true,
    image: "images/books/grid/book20.jpg",
    description: "A modern approach to machine learning concepts, algorithms, and applications. This textbook covers supervised and unsupervised learning, neural networks, deep learning, and reinforcement learning. It includes Python code examples and case studies from real-world applications in various industries.",
    pages: 550,
    language: "English",
    publisher: "Springer Academic",
    publishDate: "2021-11-05",
    isbn: "978-2345678901",
    availability: "In Stock",
    relatedBooks: ["book-1", "book-2"],
    reviews: [
      { user: "DataScientist", rating: 5, comment: "Excellent balance of theory and practical examples." },
      { user: "AIResearcher", rating: 4, comment: "Great resource for both beginners and advanced practitioners." },
      { user: "PythonDev", rating: 4, comment: "The code examples are very helpful." }
    ]
  },
  "book-5": {
    id: "book-5",
    title: "Medicine Past Questions",
    author: "Passco",
    category: "ACADEMICS",
    rating: 7.8,
    price: 12.0,
    isFree: true,
    image: "images/books/grid/book23.jpg",
    description: "A comprehensive collection of past examination questions for medical students. This compilation covers anatomy, physiology, biochemistry, pathology, pharmacology, and clinical sciences. Each question is accompanied by detailed explanations and references to standard medical textbooks.",
    pages: 480,
    language: "English",
    publisher: "Passco Medical Education",
    publishDate: "2022-03-15",
    isbn: "978-3456789012",
    availability: "In Stock",
    relatedBooks: ["book-3"],
    reviews: [
      { user: "MedStudent", rating: 5, comment: "Invaluable resource for exam preparation." },
      { user: "DocInTraining", rating: 4, comment: "Very comprehensive coverage of topics." },
      { user: "AnatomyProf", rating: 5, comment: "Excellent questions that test understanding, not just memorization." }
    ]
  },
  "book-6": {
    id: "book-6",
    title: "Undergraduate Topology",
    author: "Oxford",
    category: "ACADEMICS",
    rating: 6.8,
    price: 12.0,
    isFree: true,
    image: "images/books/grid/book24.jpg",
    description: "An introduction to topology for undergraduate mathematics students. This textbook covers point-set topology, algebraic topology, and differential topology with a focus on building intuition and problem-solving skills. Includes numerous exercises and examples to reinforce concepts.",
    pages: 410,
    language: "English",
    publisher: "Oxford University Press",
    publishDate: "2020-06-30",
    isbn: "978-4567890123",
    availability: "In Stock",
    relatedBooks: [],
    reviews: [
      { user: "MathProfessor", rating: 5, comment: "Excellent introduction to topology for undergraduates." },
      { user: "MathMajor", rating: 4, comment: "Clear explanations of complex concepts." },
      { user: "GradStudent", rating: 4, comment: "Good balance of rigor and accessibility." }
    ]
  },
  
  // Featured Books
  "book-7": {
    id: "book-7",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Classic Literature",
    rating: 9.2,
    price: 60.0,
    isFree: false,
    image: "images/books/large/bigbook3.jpg",
    description: "Set in the summer of 1922, the novel follows the life of a young and mysterious millionaire, Jay Gatsby, and his obsessive love for the beautiful former debutante Daisy Buchanan. As the story unfolds, Gatsby's dark secrets and the corrupt reality of the American dream during the Jazz Age are revealed. The narrative is a critique of the hedonistic excess and moral decay of the era, ultimately leading to tragic consequences.",
    pages: 180,
    language: "English",
    publisher: "Scribner",
    publishDate: "1925-04-10",
    isbn: "978-0743273565",
    availability: "In Stock",
    relatedBooks: ["book-8", "book-9"],
    reviews: [
      { user: "ClassicLover", rating: 5, comment: "A timeless masterpiece of American literature." },
      { user: "BookwormJane", rating: 5, comment: "Fitzgerald's prose is simply magical." },
      { user: "LitStudent", rating: 4, comment: "A perfect portrayal of the Jazz Age and its excesses." }
    ]
  },
  "book-8": {
    id: "book-8",
    title: "Ulysses",
    author: "James Joyce",
    category: "Modernist Fiction",
    rating: 8.5,
    price: 50.0,
    isFree: false,
    image: "images/books/large/bigbook4.jpg",
    description: "Set in Dublin on June 16, 1904, the novel follows a day in the life of Leopold Bloom, an advertising salesman, as he navigates the city. The narrative, heavily influenced by Homer's Odyssey, explores themes of identity, heroism, and the complexities of everyday life. It is renowned for its stream-of-consciousness style and complex structure, making it a challenging but rewarding read for those interested in modernist literature.",
    pages: 732,
    language: "English",
    publisher: "Shakespeare and Company",
    publishDate: "1922-02-02",
    isbn: "978-0679722762",
    availability: "In Stock",
    relatedBooks: ["book-7", "book-9"],
    reviews: [
      { user: "ModernistFan", rating: 5, comment: "The pinnacle of modernist literature." },
      { user: "LiteraryScholar", rating: 5, comment: "A challenging but immensely rewarding read." },
      { user: "IrishReader", rating: 4, comment: "Joyce's Dublin comes alive in these pages." }
    ]
  },
  "book-9": {
    id: "book-9",
    title: "War and Peace",
    author: "Leo Tolstoy",
    category: "Classic Literature",
    rating: 9.0,
    price: 100.0,
    isFree: false,
    image: "images/books/large/bigbook5.jpg",
    description: "Set against the backdrop of the Napoleonic era, the novel presents a panorama of Russian society and its descent into the chaos of war. It follows the interconnected lives of five aristocratic families, their struggles, romances, and personal journeys through this tumultuous period of history. The narrative explores themes of love, war, and the meaning of life, as it weaves together historical events with the personal stories of its characters.",
    pages: 1225,
    language: "English (translated from Russian)",
    publisher: "The Russian Messenger",
    publishDate: "1869-01-01",
    isbn: "978-0143039990",
    availability: "In Stock",
    relatedBooks: ["book-7", "book-8"],
    reviews: [
      { user: "RussianLitFan", rating: 5, comment: "Tolstoy's masterpiece is unparalleled in scope and depth." },
      { user: "HistoryBuff", rating: 5, comment: "An incredible blend of historical events and personal narratives." },
      { user: "BookwormElite", rating: 4, comment: "A long but incredibly rewarding journey." }
    ]
  },
  "book-10": {
    id: "book-10",
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    category: "Personal Finance",
    rating: 8.7,
    price: 50.0,
    isFree: false,
    image: "images/books/large/bigbook6.jpg",
    description: "A memoir that contrasts the financial philosophies of the author's two fathers. The 'rich dad' is his best friend's father, who accumulated wealth through entrepreneurship and investing, while the 'poor dad' is Kiyosaki's own father, who worked hard but never achieved financial security. Through this comparison, Kiyosaki outlines six key lessons about money, investing, and building wealth that challenge conventional wisdom about work and finances.",
    pages: 336,
    language: "English",
    publisher: "Warner Books",
    publishDate: "1997-04-01",
    isbn: "978-1612680194",
    availability: "In Stock",
    relatedBooks: ["book-11", "book-12"],
    reviews: [
      { user: "FinanceFreedom", rating: 5, comment: "Changed my perspective on money and investing." },
      { user: "EntrepreneurMind", rating: 4, comment: "Essential reading for financial literacy." },
      { user: "InvestorNewbie", rating: 5, comment: "Simple but powerful concepts that anyone can apply." }
    ]
  },
  "book-11": {
    id: "book-11",
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self-Help",
    rating: 9.3,
    price: 100.0,
    isFree: false,
    image: "images/books/large/bigbook7.jpg",
    description: "A comprehensive guide to habit formation and change. The book provides a framework for understanding how habits work and offers practical strategies to form good habits, break bad ones, and achieve remarkable results. Clear explains how tiny changes in behavior can lead to remarkable results over time, using insights from biology, psychology, and neuroscience to create an easy-to-understand guide for making good habits inevitable and bad habits impossible.",
    pages: 320,
    language: "English",
    publisher: "Avery",
    publishDate: "2018-10-16",
    isbn: "978-0735211292",
    availability: "In Stock",
    relatedBooks: ["book-10", "book-12"],
    reviews: [
      { user: "ProductivityGuru", rating: 5, comment: "The most practical book on habit formation I've ever read." },
      { user: "SelfImprover", rating: 5, comment: "Clear's 1% better every day philosophy is transformative." },
      { user: "LifeHacker", rating: 5, comment: "Simple, science-backed strategies that actually work." }
    ]
  },
  "book-12": {
    id: "book-12",
    title: "Think Like a Monk",
    author: "Jay Shetty",
    category: "Personal Development",
    rating: 8.6,
    price: 10.0,
    isFree: false,
    image: "images/books/large/bigbook8.jpg",
    description: "Drawing on his experience as a monk in the Vedic tradition, Jay Shetty shares the timeless wisdom he learned during his time in an ashram. The book reveals how to overcome negative thoughts and habits to find peace and purpose in everyday life. Combining ancient wisdom with his own rich experiences in the ashram, Shetty provides practical steps anyone can take every day to live a less anxious, more meaningful life.",
    pages: 352,
    language: "English",
    publisher: "Simon & Schuster",
    publishDate: "2020-09-08",
    isbn: "978-1982134488",
    availability: "In Stock",
    relatedBooks: ["book-10", "book-11"],
    reviews: [
      { user: "MindfulnessSeeker", rating: 5, comment: "A beautiful blend of ancient wisdom and modern application." },
      { user: "StressedStudent", rating: 4, comment: "Helped me find calm in the chaos of college life." },
      { user: "SpiritualGrowth", rating: 5, comment: "Practical wisdom that anyone can apply to their daily life." }
    ]
  }
};

// Function to get book details by ID
function getBookById(bookId) {
  return bookDatabase[bookId] || null;
}

// Function to get all books
function getAllBooks() {
  return Object.values(bookDatabase);
}

// Function to search books by title or author
function searchBooks(query) {
  query = query.toLowerCase();
  return Object.values(bookDatabase).filter(book => 
    book.title.toLowerCase().includes(query) || 
    book.author.toLowerCase().includes(query)
  );
}

// Function to get books by category
function getBooksByCategory(category) {
  return Object.values(bookDatabase).filter(book => 
    book.category.toLowerCase() === category.toLowerCase()
  );
}

// Function to get related books
function getRelatedBooks(bookId) {
  const book = bookDatabase[bookId];
  if (!book || !book.relatedBooks || book.relatedBooks.length === 0) {
    return [];
  }
  
  return book.relatedBooks.map(relatedId => bookDatabase[relatedId]).filter(Boolean);
}