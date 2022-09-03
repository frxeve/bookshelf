const books = [];
const searchbook = [];
const RENDER_EVENT = 'render-books';
const STORAGE_KEY = "BOOKS_APPS";
const SAVED_EVENT = "saved-books";

const search = document.getElementById('searchsubmit');

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted,
    };
}

function findBooks(id) {
    for (const BooksItem of books) {
        if (BooksItem.id === id) {
            return BooksItem;
        }
    }
    return null;
}

function searchBooksByTitle(title) {
    searchbook.length = 0;
    for (const BooksItem of books) {
        if (BooksItem.title === title) {
            searchbook.push(BooksItem);
        }
    }
}

function searchBooks() {
    const searchTitle = document.getElementById("searchbook-title").value;
    const searchResult = document.getElementById("searchsubmit");
    searchBooksByTitle(searchTitle);
    searchResult.innerHTML = "";
    for (const bookItem of searchbook) {
        const bookElement = showDataSearch(bookItem);
        searchResult.innerHTML += bookElement;
    }
}

function showDataSearch(bookObject) {
    const {
        title,
        author,
        year,
        isCompleted
    } = bookObject;

    let innerHTML = `
               <article class="book_item">
                  <h3>${title}</h3>
                  <p>Penulis: ${author}</p>
                  <p>Tahun: ${year}</p>
                  <p> Keterangan : ${
                    isCompleted ? "Sudah dibaca" : "Belum selesai dibaca"
                  }</p>
              </article>
          `;

    return innerHTML;
}

function showdata(bookObject) {
    const {
        id,
        title,
        author,
        year,
        isCompleted
    } = bookObject;

    const container = document.createElement('container'); //container kayak article
    container.classList.add('book_item');

    const textTitle = document.createElement('h3');
    textTitle.innerText = title;
    const textAuthor = document.createElement('p');
    textAuthor.innerText = author;
    const textYear = document.createElement('p');
    textYear.innerText = year;


    const btnGreen = document.createElement("button");
    btnGreen.classList.add("Hijau");
    const btnRed = document.createElement("button");
    btnRed.classList.add("Merah");
    btnRed.innerText = "Hapus buku";

    //textContainer sama kayak containerAction
    const textContainer = document.createElement('div');
    textContainer.classList.add('action');


    if (isCompleted) {
        btnGreen.addEventListener('click', function () {
            changeBooktoUnCompleted(id);
        });
        btnGreen.innerText = 'Belum selesai';

        btnRed.addEventListener('click', function () {
            removeBook(id); //sama kayak removebookfromcompeled
        });

        textContainer.append(btnGreen, btnRed);

        container.append(textTitle, textAuthor, textContainer);
        container.setAttribute('id', `book-${id}`);

    } else {
        btnGreen.addEventListener('click', function () {
            changeBooktoCompleted(id); // nama changebookuncompleted nya bebas
        });
        btnGreen.innerText = 'Selesai dibaca';

        btnRed.addEventListener('click', function () {
            removeBook(id); //sama kayak removebookfromcompeled
        });
        textContainer.append(btnGreen, btnRed);

        container.append(textTitle, textAuthor, textContainer);
        container.setAttribute('id', `book-${id}`);
    }
    return container;
}

function addbookshelf() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(
        generatedID, title, author, year, isCompleted, false);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}


function isStorageExist() {
    if (typeof Storage === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false;
    }
    return true;
}


function removeBook(bookId) {
    let confirmation = confirm('apakah ingin menghapus buku ini?');
    if (confirmation == true) {
        const oneBook = findBookIndex(bookId);

        if (oneBook === -1) return;

        books.splice(oneBook, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
}

function findBookIndex(id) {
    for (const index in books) {
        if (books[index].id === id) {
            return index;
        }
    }
    return -1;
}

function changeBooktoCompleted(bookId) {
    const oneBook = findBooks(bookId); //onebook sama kayak booktarget

    if (oneBook == null) return;

    oneBook.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

}

function changeBooktoUnCompleted(bookId) {
    const oneBook = findBooks(bookId); //onebook sama kayak booktarget

    if (oneBook == null) return;

    oneBook.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

}

search.addEventListener("click", function (event) {
    event.preventDefault();
    searchBooks();
});

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();

        addbookshelf();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById("incomplete-Bookshelf-list");
    const listCompleted = document.getElementById("complete-Bookshelf-list");

    uncompletedBookList.innerHTML = '';
    listCompleted.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = showdata(bookItem);
        if (bookItem.isCompleted) {
            listCompleted.append(bookElement);
        } else {
            uncompletedBookList.append(bookElement);
        }
    }
});