function attachEvents() {
    const baseUrl = 'https://baas.kinvey.com/appdata/kid_rJbtUh4bB/biggestCatches'
    const username = 'guest'
    const password = 'guest'
    const base64auth = btoa(username + ':' + password)
    const authHeaders = {
        'Authorization': 'Basic ' + base64auth,
        'Content-type': 'application/json'
    }

    let mainDiv = $('#main')
    let loadBtn = $('#aside').find('.load')
    let addBtn = $('#addForm').find('.add')

    loadBtn.click(loadCatches)
    addBtn.click(addCatch)

    function loadCatches() {
        $.get({
            url: baseUrl,
            headers: authHeaders,
            success: handleSuccess
        })
    }

    function handleSuccess(catches) {
        let allCatches = $('<div id="catches">')

        for (let catchObj of catches) {
            allCatches
                .append($(`<div class="catch">`).attr('data-id', catchObj._id)
                    .append($('<label>').text('Angler'))
                    .append($(`<input type="text" class="angler" value="${catchObj.angler}"/>`))
                    .append($('<label>').text('Weight'))
                    .append($(`<input type="number" class="weight" value="${catchObj.weight}"/>`))
                    .append($('<label>').text('Species'))
                    .append($(`<input type="text" class="species" value="${catchObj.species}"/>`))
                    .append($('<label>').text('Location'))
                    .append($(`<input type="text" class="location" value="${catchObj.location}"/>`))
                    .append($('<label>').text('Bait'))
                    .append($(`<input type="text" class="bait" value="${catchObj.bait}"/>`))
                    .append($('<label>').text('Capture Time'))
                    .append($(`<input type="number" class="captureTime" value="${catchObj.captureTime}"/>`))
                    .append($('<button class="update">Update</button>').click(updateCatch.bind(catchObj)))
                    .append($('<button class="delete">Delete</button>').click(deleteCatch.bind(catchObj))))
        }

        mainDiv.empty()
        mainDiv.append(allCatches)
    }

    function addCatch() {
        let catchObj = getAllFields('#addForm')
        $.post({
            url: baseUrl,
            data: JSON.stringify(catchObj),
            headers: authHeaders,
            success: loadCatches
        })
    }

    function updateCatch(event) {
        let catchObj = getAllFields(event.target)

        $.ajax({
            method: 'PUT',
            url: baseUrl + '/' + this._id,
            data: JSON.stringify(catchObj),
            headers: authHeaders,
            success: loadCatches
        })
    }

    function deleteCatch(event) {
        $.ajax({
            method: 'DELETE',
            url: baseUrl + '/' + this._id,
            headers: authHeaders,
            success: handleDelete.bind(event)
        })
    }

    function handleDelete() {
        $(this.target).parent().remove()
    }

    function getAllFields(selector) {
        let catchObj = {}

        $(selector).parent().find('input').each((index, e) => {
            if (e.type === 'text') {
                catchObj[e.className] = e.value
            } else {
                catchObj[e.className] = Number(e.value)
            }
        })

        return catchObj
    }
}