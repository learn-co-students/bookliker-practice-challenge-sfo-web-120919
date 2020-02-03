
let allBooks = [];

document.addEventListener("DOMContentLoaded", function() {
    fetchBooks().then(books => {
        renderBooks(books);
        addBookslocally(books);
    });
    listenForBookTitleClick();
    addBookslocally();
    listenForLikeClick();
    
});

function addBookslocally(books) {
    allBooks = books
}

function listenForBookTitleClick() {
    let listUlTag = document.getElementById("list");
    listUlTag.addEventListener("click", function(event) {
        const bookLi = event.target
        const bookId = parseInt(bookLi.id)
        const bookData = allBooks.find(book => book.id === bookId);
        renderBookShowPanel(bookData)
    })
}

function renderBookShowPanel(book) {
    const showPanel = document.getElementById("show-panel");
    //debugger
    const bookHtml = `
    <div class="detail-book">
    <img src="${book.img_url}"/>
    <h1>${book.title}</h1>
    <p>${book.description}</p>
    <h3>users who like: ${createUsersString(book.users)}</h3>
    <button id="like ${book.id}">Like Book</button>
    </div>
    `
    showPanel.innerHTML = bookHtml;
}

function listenForLikeClick() {
    // const butt = document.getElementById("like");
    const showPanel = document.getElementById("show-panel");
    showPanel.addEventListener( "click", function(event){
        let element = event.target;
        let bookId= parseInt(element.id.split(" ")[1])
       
         if (element.tagName === "BUTTON"){
            const thisBook = allBooks.find(ele => bookId === ele.id)

            patchBook(thisBook);
            //optimisitic render
            renderBookShowPanel(thisBook)
         }
    })
    
}

function createUsersString(users) {
    let output = "";
    //    \/ can call it(user) anything you want
    for (user of users) [
        output += user.username + ", "
    ];
    return output;
}

function fetchBooks() {
    return fetch("http://localhost:3000/books")
    .then(resp => resp.json())
    //.catch(errors => console.log(errors));
}

function renderBooks(books){
    books.forEach(book => renderABook(book))
}

function renderABook(book) {
    let singleBookTitle = document.createElement("li");
    let listUlTag = document.getElementById("list");
    singleBookTitle.innerHTML = `${book.title}`;
    singleBookTitle.id = `${book.id}`;
    listUlTag.appendChild(singleBookTitle);
}

function patchBook(book) {
    let url = `http://localhost:3000/books/${book.id}`
    let configuration = {
        method:"PATCH",
        headers:{
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body:
            JSON.stringify({
                users: getBookLikeInfo(book.id)
            })
    
    }
    return fetch(url, configuration).then(res => res.json());
}

function getBookLikeInfo(bookId){
    const bookData = allBooks.find(book => book.id === bookId);
    const userId = 1;
    if (bookData.users.find(user => user.id === userId)) {
        for (var i = 0; i < bookData.users.length; i++) {
            if (bookData.users[i].id === userId){
              // remove stuff[i]
              bookData.users.splice(i, 1)
            }}
    } else {
        bookData.users.push({
            id: 1,
            username: "pouros"
        })
    }

    return bookData.users
}

