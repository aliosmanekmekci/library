const library = [];
function Book(title, author, pages, readStatus = false) {
  id = crypto.randomUUID();
  this.id = id;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.readStatus = readStatus;
}
function addBookToLibrary(title, author, pages, readStatus = false) {
  const newBook = new Book(title, author, pages, readStatus);
  library.push(newBook);
}

