function attachEvents() {
    $('#submit').click(submitMessage)
    $('#refresh').click(refreshMessages)
    
    function submitMessage() {
        let messageJSON = {
            'author': $('#author').val(),
            'content': $('#content').val(),
            'timestamp': Date.now()
        }

        let request = {
            method: 'POST',
            url: 'https://messenger-a179d.firebaseio.com/messenger.json',
            data: JSON.stringify(messageJSON),
            success: refreshMessages
        }

        $.ajax(request)
    }
    
    function refreshMessages() {
        $.get('https://messenger-a179d.firebaseio.com/messenger.json')
            .then(displayMessages)
    }
    
    function displayMessages(messages) {
        let messagesTextArea = $('#messages')
        let message = ''
        for (let key in messages) {
            message += `${messages[key]["author"]}: ${messages[key]["content"]}\n`
        }

        messagesTextArea.text(message)
    }
}