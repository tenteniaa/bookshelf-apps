const bookShelf = [];
const RENDER_EVENT = 'render-book';

function generateId() {
    return +new Date();
}

function generateTodoObect(id, judul, penulis, tahun, isCompleted) {
    return {
        id,
        judul,
        penulis,
        tahun,
        isCompleted
    }
}

function findTodo(todoId) {
    for (todoItem of bookShelf) {
      if (todoItem.id === todoId) {
        return todoItem;
      }
    }
    return null;
}
  
function findTodoIndex(todoId) {
    for (index in bookShelf) {
      if (bookShelf[index].id === todoId) {
        return index;
      }
    }
    return -1;
}

function makeBook(todoObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = todoObject.judul;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = todoObject.penulis;

    const textYear = document.createElement('p');
    textYear.innerText = todoObject.tahun;

    const textContainer = document.createElement('div');
    textContainer.classList.add('book_item');
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement('div');
    container.classList.add('book_shelf', 'shadow');
    container.append(textContainer);
    container.setAttribute('id',`book-${todoObject.id}`);

    //button
    if (todoObject.isCompleted) {
        const undoButton = document.createElement('check-button');
        undoButton.classList.add('check-button');
        undoButton.innerText = "Belum Selesai";
 
        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(todoObject.id);
        });

        const trashButton = document.createElement('delete-button');
        trashButton.classList.add('delete-button');
        trashButton.innerText = "Hapus";

        trashButton.addEventListener('click', function() {
            removeBookFromCompleted(todoObject.id);
        });

        container.append(undoButton, trashButton);
    }
    else {
        const checkButton = document.createElement('check-button');
        checkButton.classList.add('check-button');
        checkButton.innerText = "Selesai";

        checkButton.addEventListener('click', function() {
            addBookToCompleted(todoObject.id);
        });

        const trashButton = document.createElement('delete-button');
        trashButton.classList.add('delete-button');
        trashButton.innerText = "Hapus";

        trashButton.addEventListener('click', function() {
            removeBookFromCompleted(todoObject.id);
        });

        container.append(checkButton, trashButton);
    }

    return container;
}

function addBook() {
    const inputTitle = document.getElementById('inputBookTitle').value;
    const inputAuthor = document.getElementById('inputBookAuthor').value;
    const inputYear = document.getElementById('inputBookYear').value;
    const isCompleted = document.getElementById('inputBookIsComplete').checked;

    const generatedID = generateId();
    const todoObject = generateTodoObect(generatedID, inputTitle, inputAuthor, inputYear, isCompleted);
    bookShelf.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}   

function addBookToCompleted(todoId) {
    const todoTarget = findTodo(todoId);
   
    if (todoTarget == null) return;
   
    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBookFromCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);
   
    if (todoTarget === -1) return;
   
    bookShelf.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
} 
   
function undoBookFromCompleted(todoId) {
    const todoTarget = findTodo(todoId);
   
    if (todoTarget == null) return;
   
    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookShelfList = document.getElementById('incompleteBookshelfList');
    uncompletedBookShelfList.innerHTML = '';
 
    const completedBookShelfList = document.getElementById('completeBookshelfList');
    completedBookShelfList.innerHTML = '';
 
    for (const todoItem of bookShelf) {
        const todoElement = makeBook(todoItem);
        if (!todoItem.isCompleted)
            uncompletedBookShelfList.append(todoElement);
        else
            completedBookShelfList.append(todoElement);
    }
});

document.getElementById('searchBook').addEventListener('click', function (event) {
    event.preventDefault();
    const searchBook = document.getElementById('searchBookTitle').value.toLowerCase();
    const listBook = document.querySelectorAll('.book_item > h2');
    for (let book of listBook) {
      if (book.innerText.toLowerCase().includes(searchBook)) {
        book.parentElement.parentElement.style.display = "block";
      } else {
        book.parentElement.parentElement.style.display = "none";
      }
    }
});

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_SHELF';

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(bookShelf);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const todo of data) {
        bookShelf.push(todo);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});