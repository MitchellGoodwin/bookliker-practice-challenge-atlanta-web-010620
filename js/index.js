document.addEventListener("DOMContentLoaded", function() {
    const bookList = document.querySelector('#list')
    const showPanel = document.querySelector('#show-panel')

    fetch('http://localhost:3000/books')
    .then((response) => {
        return response.json();
    })
    .then((books) => {
        books.forEach(book => makeBookListItem(book))
    });



    function makeBookListItem(book) {
        const bookTitle = document.createElement('li')
        bookTitle.innerText = book.title 
        bookTitle.dataset.id = book.id 
        bookTitle.addEventListener('click', function(e) {
            
            fetch(`http://localhost:3000/books/${e.target.dataset.id}`)
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                showBook(myJson);
            });
        })
        bookList.appendChild(bookTitle)
    }


    function showBook(book) {
        showPanel.innerHTML = ''
        const bigBookTitle = document.createElement('h1')
        bigBookTitle.innerText = book.title
        const bookImg = document.createElement('img')
        bookImg.src = book.img_url
        const bookDesc = document.createElement('p')
        bookDesc.innerText = book.description
        showPanel.appendChild(bigBookTitle)
        showPanel.appendChild(bookImg)
        showPanel.appendChild(bookDesc)
        const userDiv = document.createElement('div')
        book.users.forEach( function(user) {
            const userName = document.createElement('strong')
            userName.innerText = user.username 
            userDiv.appendChild(userName)
            let br = document.createElement("br");
            userDiv.appendChild(br);
        })
        showPanel.appendChild(userDiv)
        const likeButton = document.createElement('button')
        likeButton.innerText = 'Read Book'
        likeButton.dataset.id = book.id
        likeButton.addEventListener('click', function(e) {
            readBook(e.target)
        })
        showPanel.appendChild(likeButton)
    }

    function readBook(button) {
        fetch(`http://localhost:3000/books/${button.dataset.id}`)
        .then((response) => {
            return response.json();
        })
        .then((myJson) => {
            if (myJson.users.slice().map(user => user.id).includes(1)) {
                let newUsers = myJson.users
                newUsers.pop()
                addSelf(newUsers, button.dataset.id)
            } else {
                let newUsers = [...myJson.users, {"id":1, "username":"pouros"}]
                addSelf(newUsers, button.dataset.id)
            };
        });
    }

    function addSelf(users, id) {
        console.log(users)

        let data = {'users': users}

        let dataObj = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }

        fetch(`http://localhost:3000/books/${id}`, dataObj)
        .then((response) => {
            return response.json();
        }).then((myJson) => {
            showBook(myJson)
        });

    }
});

