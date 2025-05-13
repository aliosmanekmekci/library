const library = [];

function Book(title, author, pages, readStatus = false) {
  const id = crypto.randomUUID();
  this.id = id;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.readStatus = readStatus;
  this.info = function () {
    return `Title: ${this.title}
Author: ${this.author}
Pages: ${this.pages}
Status: ${this.readStatus}`;
  };
}

function addBookToLibrary(title, author, pages, readStatus) {
  const newBook = new Book(title, author, pages, readStatus);
  library.push(newBook);
  return newBook;
}

// Find book in library by ID
function findBookById(id) {
  return library.findIndex((book) => book.id === id);
}

// Clear form inputs after submission
function clearForm() {
  document.querySelector("#title").value = "";
  document.querySelector("#author").value = "";
  document.querySelector("#pages").value = "";
  document.querySelector("#read-status").checked = false;
}

// Validate form inputs
function validateForm(title, author, pages) {
  if (!title || !author || !pages) {
    alert("Please fill in all fields");
    return false;
  }
  return true;
}

// Submit button event listener
const submitBtn = document.querySelector("#submitBtn");
submitBtn.addEventListener("click", () => {
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const pages = document.querySelector("#pages").value;
  const readStatus = document.querySelector("#read-status").checked ? "Read" : "Not Read";

  if (validateForm(title, author, pages)) {
    const newBook = addBookToLibrary(title, author, pages, readStatus);
    addCard(newBook);
    clearForm();
  }
});

// Create and add a new card to the display
function addCard(book) {
  const cardSection = document.querySelector(".card-section");
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("data-uuid", book.id);

  // Create elements for book information
  const bookInfo = document.createElement("div");
  bookInfo.classList.add("book-info");

  const titleElement = document.createElement("h3");
  titleElement.innerHTML = `<i class="fas fa-book"></i> ${book.title}`;

  const authorElement = document.createElement("p");
  authorElement.innerHTML = `<i class="fas fa-user"></i> <strong>Author:</strong> ${book.author}`;

  const pagesElement = document.createElement("p");
  pagesElement.innerHTML = `<i class="fas fa-file-alt"></i> <strong>Pages:</strong> ${book.pages}`;

  // Create read status toggle button
  const readStatusBtn = document.createElement("button");
  readStatusBtn.classList.add("status-button");
  readStatusBtn.innerHTML =
    book.readStatus === "Read"
      ? `<i class="fas fa-check-circle"></i> ${book.readStatus}`
      : `<i class="fas fa-times-circle"></i> ${book.readStatus}`;
  readStatusBtn.classList.add(book.readStatus === "Read" ? "read" : "not-read");

  // Create delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("type", "button");
  deleteBtn.classList.add("delete-button");
  deleteBtn.innerHTML = `<i class="fas fa-trash"></i> Delete`;

  // Append all elements to the card
  bookInfo.appendChild(titleElement);
  bookInfo.appendChild(authorElement);
  bookInfo.appendChild(pagesElement);
  card.appendChild(bookInfo);
  card.appendChild(readStatusBtn);
  card.appendChild(deleteBtn);
  cardSection.appendChild(card);

  // Delete button event listener
  deleteBtn.addEventListener("click", () => {
    const bookId = card.getAttribute("data-uuid");
    const bookIndex = findBookById(bookId);

    if (bookIndex !== -1) {
      library.splice(bookIndex, 1);
      card.remove();
    }
  });

  // Read status toggle event listener
  readStatusBtn.addEventListener("click", () => {
    const bookId = card.getAttribute("data-uuid");
    const bookIndex = findBookById(bookId);

    if (bookIndex !== -1) {
      const currentStatus = library[bookIndex].readStatus;
      const newStatus = currentStatus === "Read" ? "Not Read" : "Read";

      library[bookIndex].readStatus = newStatus;

      // Update button text and icon
      readStatusBtn.innerHTML =
        newStatus === "Read"
          ? `<i class="fas fa-check-circle"></i> ${newStatus}`
          : `<i class="fas fa-times-circle"></i> ${newStatus}`;

      // Update button class for styling
      readStatusBtn.classList.remove("read", "not-read");
      readStatusBtn.classList.add(newStatus === "Read" ? "read" : "not-read");
    }
  });
}

// Display all books in the library (useful for persistence later)
function displayLibrary() {
  const cardSection = document.querySelector(".card-section");
  cardSection.innerHTML = ""; // Clear existing cards

  library.forEach((book) => {
    addCard(book);
  });
}

// Add some sample books when the page loads (for testing)
function addSampleBooks() {
  addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295, "Not Read");
  addBookToLibrary("To Kill a Mockingbird", "Harper Lee", 281, "Read");
  displayLibrary();
}

// Uncomment this line to add sample books when the page loads
// window.onload = addSampleBooks;

// Save library to local storage
function saveToLocalStorage() {
  localStorage.setItem("library", JSON.stringify(library));
}

// Load library from local storage
function loadFromLocalStorage() {
  const storedLibrary = localStorage.getItem("library");
  if (storedLibrary) {
    // Parse the stored data
    const parsedLibrary = JSON.parse(storedLibrary);

    // Clear current library
    library.length = 0;

    // Rebuild library with proper Book prototypes
    parsedLibrary.forEach((book) => {
      // Create a new book with the constructor to ensure proper prototype methods
      const restoredBook = new Book(book.title, book.author, book.pages, book.readStatus);
      restoredBook.id = book.id; // Preserve the original ID
      library.push(restoredBook);
    });

    // Display the restored library
    displayLibrary();
  }
}

// Add event listeners for saving to local storage
submitBtn.addEventListener("click", saveToLocalStorage);
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-button") || e.target.classList.contains("status-button")) {
    // Wait a brief moment to ensure the library array is updated
    setTimeout(saveToLocalStorage, 100);
  }
});

// Load library from local storage when page loads
window.addEventListener("DOMContentLoaded", loadFromLocalStorage);
