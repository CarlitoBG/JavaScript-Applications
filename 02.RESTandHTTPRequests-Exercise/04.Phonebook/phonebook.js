function attachEvents() {
    const URL = 'https://phonebook-nakov.firebaseio.com/phonebook'
    const phoneBook = $('#phonebook')
    const personInput = $('#person')
    const phoneInput = $('#phone')

    $('#btnLoad').on('click', loadPhonebook)
    $('#btnCreate').on('click', createPhone)

    function createPhone() {
        let phonebookJSON = {
            person: personInput.val(),
            phone:  phoneInput.val()
        }

        personInput.val('')
        phoneInput.val('')

        let createRequest = {
            url: URL + '.json',
            method: 'POST',
            data: JSON.stringify(phonebookJSON),
            success: loadPhonebook,
            error: showError
        }

        $.ajax(createRequest)
    }

    function loadPhonebook() {
        let loadRequest = {
            method: 'GET',
            url: URL + '.json',
            success: displayPhones,
            error: showError
        }

        $.ajax(loadRequest)
    }

    function displayPhones(phones) {

        phoneBook.empty()

        for(let key in phones) {
            let person = phones[key]['person']
            let phone = phones[key]['phone']
            let btnDelete = $('<button>[Delete]</button>')
                .on('click', deleteItem.bind(this, key))

            let liItem = $('<li>')
                .text(`${person}: ${phone} `)
                .append(btnDelete)

            phoneBook.append(liItem)
        }
    }

    function showError() {
        phoneBook.append($('<li>').text('ERROR'))
    }

    function deleteItem(key) {
        let deleteRequest = {
            method: 'DELETE',
            url: URL + '/' + key + '.json',
            success: loadPhonebook,
            error: showError
        }

        $.ajax(deleteRequest)
    }
}