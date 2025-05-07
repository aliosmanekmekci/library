const library = [];
function Book(title, author, pages, readStatus = false) {
  id = crypto.randomUUID();
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
function addBookToLibrary(title, author, pages, readStatus = false) {
  const newBook = new Book(title, author, pages, readStatus);
  library.push(newBook);
}

submitBtn.addEventListener("click", () => {
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const pages = document.querySelector("#pages").value;
  const readStatus = document.querySelector("#read-status").checked ? "Read" : "Not Read";

  console.log(readStatus);

  addBookToLibrary(title, author, pages, readStatus);
  addCard();
});

function addCard() {
  const currentBook = library[library.length - 1];

  const cardSection = document.querySelector(".card-section");
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("data-uuid", currentBook.uuid);

  const bookInfo = document.createElement("p");
  bookInfo.innerText = currentBook.info();

  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("type", "button");
  deleteBtn.textContent = "Delete";

  card.appendChild(bookInfo);
  card.appendChild(deleteBtn);
  cardSection.appendChild(card);
}
