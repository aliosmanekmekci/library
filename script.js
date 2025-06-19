const library = [];

class Book {
  constructor(title, author, pages, readStatus = false) {
    const id = crypto.randomUUID();
    this.id = id;
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readStatus = readStatus;
  }

  info() {
    return `
      Title: ${this.title}
      Author: ${this.author}
      Pages: ${this.pages}
      Status: ${this.readStatus}
      `;
  }

  toggleReadStatus() {
    this.readStatus = this.readStatus === "Read" ? "Not Read" : "Read";
  }
}

function addBookToLibrary(title, author, pages, readStatus) {
  const newBook = new Book(title, author, pages, readStatus);
  library.push(newBook);
  return newBook;
}

function findBookById(id) {
  return library.findIndex((book) => book.id === id);
}

function clearForm() {
  document.querySelector("#title").value = "";
  document.querySelector("#author").value = "";
  document.querySelector("#pages").value = "";
  document.querySelector("#read-status").checked = false;
}

function addCard(book) {
  const cardSection = document.querySelector(".card-section");

  const emptyMessage = document.querySelector(".empty-library");
  if (emptyMessage) {
    emptyMessage.remove();
  }

  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("data-uuid", book.id);

  const bookInfo = document.createElement("div");
  bookInfo.classList.add("book-info");

  const titleElement = document.createElement("h3");
  titleElement.innerHTML = `<i class="fas fa-book"></i> ${book.title}`;

  const authorElement = document.createElement("p");
  authorElement.innerHTML = `<i class="fas fa-user"></i> <strong>Author:</strong> ${book.author}`;

  const pagesElement = document.createElement("p");
  pagesElement.innerHTML = `<i class="fas fa-file-alt"></i> <strong>Pages:</strong> ${book.pages}`;

  const readStatusBtn = document.createElement("button");
  readStatusBtn.classList.add("status-button");
  readStatusBtn.innerHTML =
    book.readStatus === "Read"
      ? `<i class="fas fa-check-circle"></i> ${book.readStatus}`
      : `<i class="fas fa-times-circle"></i> ${book.readStatus}`;
  readStatusBtn.classList.add(book.readStatus === "Read" ? "read" : "not-read");

  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("type", "button");
  deleteBtn.classList.add("delete-button");
  deleteBtn.innerHTML = `<i class="fas fa-trash"></i> Delete`;

  bookInfo.appendChild(titleElement);
  bookInfo.appendChild(authorElement);
  bookInfo.appendChild(pagesElement);
  card.appendChild(bookInfo);
  card.appendChild(readStatusBtn);
  card.appendChild(deleteBtn);
  cardSection.appendChild(card);

  deleteBtn.addEventListener("click", () => {
    const bookId = card.getAttribute("data-uuid");
    const bookIndex = findBookById(bookId);

    if (bookIndex !== -1) {
      library.splice(bookIndex, 1);
      card.remove();
      saveToLocalStorage();

      if (library.length === 0) {
        showEmptyLibraryMessage();
      }
    }
  });

  readStatusBtn.addEventListener("click", () => {
    const bookId = card.getAttribute("data-uuid");
    const bookIndex = findBookById(bookId);

    if (bookIndex !== -1) {
      const newStatus = library[bookIndex].toggleReadStatus();

      library[bookIndex].readStatus = newStatus;

      readStatusBtn.innerHTML =
        newStatus === "Read"
          ? `<i class="fas fa-check-circle"></i> ${newStatus}`
          : `<i class="fas fa-times-circle"></i> ${newStatus}`;

      readStatusBtn.classList.remove("read", "not-read");
      readStatusBtn.classList.add(newStatus === "Read" ? "read" : "not-read");

      saveToLocalStorage();
    }
  });
}

function displayLibrary() {
  const cardSection = document.querySelector(".card-section");
  cardSection.innerHTML = ""; // Clear existing cards

  if (library.length === 0) {
    showEmptyLibraryMessage();
    return;
  }

  library.forEach((book) => {
    addCard(book);
  });
}

function showEmptyLibraryMessage() {
  const cardSection = document.querySelector(".card-section");
  const emptyMessage = document.createElement("div");
  emptyMessage.classList.add("empty-library");

  emptyMessage.innerHTML = `
    <i class="fas fa-book-open"></i>
    <h3>Your Library is Empty</h3>
    <p>Click the "Add New Book" button to start building your collection.</p>
  `;

  cardSection.appendChild(emptyMessage);
}

function addSampleBooks() {
  addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 295, "Not Read");
  addBookToLibrary("To Kill a Mockingbird", "Harper Lee", 281, "Read");
  displayLibrary();
  saveToLocalStorage();
}

function saveToLocalStorage() {
  localStorage.setItem("library", JSON.stringify(library));
}

function loadFromLocalStorage() {
  const storedLibrary = localStorage.getItem("library");
  if (storedLibrary) {
    const parsedLibrary = JSON.parse(storedLibrary);

    library.length = 0;

    parsedLibrary.forEach((book) => {
      const restoredBook = new Book(book.title, book.author, book.pages, book.readStatus);
      restoredBook.id = book.id;
      library.push(restoredBook);
    });

    displayLibrary();
  } else {
    showEmptyLibraryMessage();
  }
}

const bookDialog = document.getElementById("bookDialog");
const newBookBtn = document.getElementById("newBookBtn");
const bookForm = document.getElementById("bookForm");
const cancelBtn = document.getElementById("cancelBtn");

newBookBtn.addEventListener("click", () => {
  clearForm();
  bookDialog.showModal();
});

cancelBtn.addEventListener("click", () => {
  bookDialog.close();
});

// Close dialog when clicking on backdrop (outside dialog)
bookDialog.addEventListener("click", (e) => {
  const dialogDimensions = bookDialog.getBoundingClientRect();
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    bookDialog.close();
  }
});

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const pages = document.querySelector("#pages").value;
  const readStatus = document.querySelector("#read-status").checked ? "Read" : "Not Read";

  const newBook = addBookToLibrary(title, author, pages, readStatus);
  addCard(newBook);
  saveToLocalStorage();
  bookDialog.close();
});

// Initialize library from local storage when page loads
window.addEventListener("DOMContentLoaded", loadFromLocalStorage);

// Uncomment to add sample books on first load
// If you want to add sample books only if the library is empty:
// window.addEventListener('DOMContentLoaded', () => {
//   if (!localStorage.getItem('library') || JSON.parse(localStorage.getItem('library')).length === 0) {
//     addSampleBooks();
//   } else {
//     loadFromLocalStorage();
//   }
// });
