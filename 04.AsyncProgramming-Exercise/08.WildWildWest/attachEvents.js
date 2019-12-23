function attachEvents() {
    const baseURL = 'https://baas.kinvey.com/appdata/kid_Hk1YbzDzH/players/'
    const username = 'guest'
    const password = 'guest'
    const base64auth = btoa(username + ":" + password)
    const authHeaders = {
        'Authorization': 'Basic ' + base64auth,
        'Content-Type': 'application/json'
    }

    let playersDiv = $('#players')
    let saveBtn = $('#save')
    let reloadBtn = $('#reload')
    let addPlayerBtn = $('#addPlayer')

    let allPlayersFromDatabase
    let currentPlayer

    loadPlayers()
    addPlayerBtn.click(addPlayer)
    saveBtn.click(savePlayerProgress)
    reloadBtn.click(reloadPlayerGun)

    async function loadPlayers() {
        let players = await $.get({
            url: baseURL,
            headers: authHeaders
        })

        displayPlayers(players)
    }
    
    function displayPlayers(players) {
        allPlayersFromDatabase = players

        playersDiv.empty()
        for (let player of players) {
            let btnPlay = $('<button>').addClass('play').text('Play')
            let btnDelete = $('<button>').addClass('delete').text('Delete')

            playersDiv
                .append($("<div>").addClass('player').attr('data-id', player._id)
                .append($("<div>").addClass('row')
                    .append(`<label>Name: </label>`)
                    .append(`<label class="name">${player.name}</label>`))
                .append($("<div>").addClass('row')
                    .append(`<label>Money: </label>`)
                    .append(`<label class="money">${player.money}</label>`))
                .append($("<div>").addClass('row')
                    .append(`<label>Bullets: </label>`)
                    .append(`<label class="bullets">${player.bullets}</label>`))
                .append(btnPlay.click(playGame))
                .append(btnDelete.click(deletePlayer.bind(playersDiv))))
        }
    }
    
    async function playGame(event) {
        await savePlayerProgress()

        $(canvas).show()
        saveBtn.show()
        reloadBtn.show()

        let playerID = $(event.target).parent().attr('data-id')
        currentPlayer = allPlayersFromDatabase.find(player => player._id === playerID)

        loadCanvas(currentPlayer)
    }
    
    async function deletePlayer(event) {
        let currentPlayerID = $(event.target).parent().attr('data-id')

        await $.ajax({
            method: 'DELETE',
            url: baseURL + currentPlayerID,
            headers: authHeaders
        })

        $(this).find(`[data-id='${currentPlayerID}']`).remove()  // or loadPlayers()
    }

    async function addPlayer() {
        let inputName = $('#addName')
        if(!inputName.val()){
            return
        }

        await $.post({
            url: baseURL,
            headers: authHeaders,
            data: JSON.stringify({name: inputName.val(), money: 500, bullets: 6})
        })

        loadPlayers()

        inputName.val('')
    }
    
    async function savePlayerProgress() {
        if (currentPlayer){
            $(canvas).hide()
            saveBtn.hide()
            reloadBtn.hide()

            await $.ajax({
                method: 'PUT',
                url: baseURL + currentPlayer._id,
                headers: authHeaders,
                data: JSON.stringify(currentPlayer)
            })

            clearInterval(canvas.intervalId)
            currentPlayer = undefined
            loadPlayers()
        }
    }

    function reloadPlayerGun() {
        if (currentPlayer.money >= 60) {
            currentPlayer.money -= 60
            currentPlayer.bullets = 6
        }
    }
}