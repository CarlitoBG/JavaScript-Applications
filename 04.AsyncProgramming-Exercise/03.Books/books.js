function attachEvents() {
    const baseURL = 'https://baas.kinvey.com/appdata/kid_Sy00ygqbS/booksService'
    const username = 'guest'
    const password = 'guest'
    const base64auth = btoa(username + ':' + password)
    const authHeaders = {
        'Authorization': 'Basic ' + base64auth,
        'Content-Type': 'application/json'
    }

    let loadBtn = $('#aside').find('.load')
    let createBtn = $('#addForm').find('.create')

    loadBtn.click(loadBooks)
    createBtn.click(createBook)

    function loadBooks() {
        $.get({
            url: baseURL,
            headers: authHeaders,
            success: displayAllBooks,
            error: handleError
        })
    }

    function displayAllBooks(books) {
        let booksList = $('#books')
        booksList.empty()

        for (let book of books) {
            booksList
                .append($(`<div class="book" data-id="${book['_id']}">`)
                    .append($('<label>').text('Title'))
                    .append($(`<input type="text" class="title" value="${book['title']}">`))
                    .append($('<label>').text('Author'))
                    .append($(`<input type="text" class="author" value="${book['author']}">`))
                    .append($('<label>').text('Isbn'))
                    .append($(`<input type="text" class="isbn" value="${book['isbn']}">`))
                    .append($('<button>[Edit]</button>').click(editBook.bind(book)))
                    .append($('<button>[Delete]</button>').click(deleteBook.bind(book))))
        }
    }

    function createBook() {
        let title = $('#title')
        let author = $('#author')
        let isbn = $('#isbn')

        let bookObj = {
            title: title.val(),
            author: author.val(),
            isbn: isbn.val(),
        }

        $.post({
            url: baseURL,
            headers: authHeaders,
            data: JSON.stringify(bookObj),
            success: loadBooks,
            error: handleError
        })

        title.val('')
        author.val('')
        isbn.val('')
    }

    function editBook(event) {
        let bookObj = {
            title: $(event.target).parent().find('.title').val(),
            author: $(event.target).parent().find('.author').val(),
            isbn: $(event.target).parent().find('.isbn').val()
        }

        $.ajax({
            method: 'PUT',
            url: baseURL + '/' + this._id,
            data: JSON.stringify(bookObj),
            headers: authHeaders,
            success: loadBooks
        })
    }

    function deleteBook(event) {
        $.ajax({
            method: 'DELETE',
            url: baseURL + '/' + this._id,
            headers: authHeaders,
            success: handleDelete.bind(event)
        })
    }

    function handleDelete() {
        $(this.target).parent().remove()
    }

    function handleError(err) {
        $('#books').text(err.statusText)
    }
}