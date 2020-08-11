let addContainer = document.querySelector(".add-container");
let plusContainer = document.querySelector(".plus-container");
let addForm = document.getElementById("add-form");
let cardsContainer = document.querySelector(".cards-container");
let books = JSON.parse(localStorage.getItem("books")) || [];
let alertBg = document.querySelector(".alert-bg");
let cancel = document.querySelector(".cancel");
let deleteBtn = document.querySelector(".delete-btn");
let deleteThisBook;

function togglePanel() {
	addContainer.classList.toggle("open");
	plusContainer.classList.toggle("closed");
	addForm.reset();
}

function closeDelete() {
	alertBg.classList.remove("active");
	deleteThisBook = undefined;
}

function Book (tittle, author, pages, status){
    this.tittle = tittle;
    this.author = author;
    this.pages = pages;
    this.status = status;
}

Book.prototype.writtenBy = function(){
  	return `Written by: ${this.author}`
}

Book.prototype.info = function(){
  	return `${this.tittle} was written by ${this.author}, and it has ${this.pages} amount of pages and ${this.status === true ? "it was read" : "it was not read"}`
}

function addBookToLibrary(event){
    event.preventDefault();

	let tittle = addForm[0].value;
	let author = addForm[1].value;
	let pages = addForm[2].value;
	let status = addForm[3].checked;
    
    let book = new Book(tittle, author, pages, status);
  	books.push(book)
  	render(books, cardsContainer);
  	localStorage.setItem("books", JSON.stringify(books))
  	togglePanel();
}

function render(cards = [], cardslist) {
	cardsMap = cards.map((card, index) =>{
		return ` 
		<div class="card">
			<div class="delete-container">
				<div class="delete" data-key=${index} id="card${index}">
					<i data-key=${index} class="fas fa-trash-alt"></i>
				</div>
				<div class="read">
					<h1 data-index=${index}>${card.status === true ? "read" : "not read"}</h1>
				</div>
			</div>
			<div class="description">
				<h1 class="book-tittle">${card.tittle}</h1>
				<h1 class="book-author">Written by: ${card.author}</h1>
				<h1 class="npages">${card.pages} pages</h1>
			</div>		
		</div>
		`
		}).join("");

	cardslist.innerHTML = cardsMap;
}

function bookToDelete(event) {
	if(!event.target.dataset.hasOwnProperty("key")) return false;
	let {key} = event.target.dataset;
	alertBg.classList.add("active");
	deleteThisBook = key;
}

function deleteBook() {
	books.splice(deleteThisBook, 1);
    localStorage.setItem("books", JSON.stringify(books))
    render(books, cardsContainer);
    closeDelete();
}

function toggleStatus(event) {
	if(!event.target.dataset.hasOwnProperty("index")) return false;
	let {index} = event.target.dataset;
	books[index].status = !books[index].status;
	localStorage.setItem("books", JSON.stringify(books))
	render(books, cardsContainer);
}

plusContainer.addEventListener("click", togglePanel);
deleteBtn.addEventListener("click", deleteBook)
cancel.addEventListener("click", closeDelete)
cardsContainer.addEventListener("click", toggleStatus)
cardsContainer.addEventListener("click", bookToDelete)
addForm.addEventListener("submit", addBookToLibrary);

render(books, cardsContainer);