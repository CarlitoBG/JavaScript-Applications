(function () {
    const baseURL = 'https://baas.kinvey.com/appdata/kid_BJXTsSi-e'
    const username = 'guest'
    const password = 'guest'
    const base64auth = btoa(username + ":" + password)
    const authHeaders = {
        'Authorization': 'Basic ' + base64auth,
        'Content-type': 'application/json'
    }

    let message = 'Knock Knock.'
    let loadNextMessageBtn = $('#btnLoad')
    let messagesUL = $('#messages')

    loadNextMessageBtn.click(loadMessage)
    
    function loadMessage() {
        $.get({
            url: baseURL + `/knock?query=${message}`,
            headers: authHeaders
        }).then(displayMessage)
    }
    
    function displayMessage(data) {
        message = data['message']
        let answer = data['answer']
        messagesUL.append($('<li>').text(`MESSAGE: ${message} ANSWER: ${answer}`))
    }
})()