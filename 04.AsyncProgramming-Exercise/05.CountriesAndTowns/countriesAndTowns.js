(function() {
    const baseURL = 'https://baas.kinvey.com/appdata/kid_Hkzm8g0ZB'
    const username = "guest"
    const password = "guest"
    const base64auth = btoa(username + ":" + password)
    const authHeaders = {
        'Authorization': 'Basic ' + base64auth,
        'Content-type': 'application/json'
    }

    let loadCountriesBtn = $("#btnLoadCountries")
    let viewTownsBtn = $("#btnViewTowns")
    let addCountryBtn = $("#btnAddCountry")
    let deleteCountryBtn = $("#btnDeleteCountry")
    let editCountryBtn = $("#btnEditCountry")
    let countriesSelectDropDown = $("#countries")
    let editCountryInputField = $("#editCountry")

    loadCountriesBtn.click(loadCountries)
    viewTownsBtn.click(loadTowns)
    addCountryBtn.click(addCountry)
    deleteCountryBtn.click(deleteCountry)
    editCountryBtn.click(editCountry)

    function loadCountries() {
        let request = {
            url: baseURL + '/countries',
            headers: authHeaders
        }

        $.get(request)
            .then(loadCountriesDropDown)
            .catch(displayError)

        countriesSelectDropDown.show()
        editCountryInputField.hide()
        editCountryBtn.hide()
        deleteCountryBtn.hide()
    }

    function loadCountriesDropDown(countries) {
        countriesSelectDropDown.empty()

        for (let country of countries) {
            countriesSelectDropDown.append($("<option>").text(country.name).val(country._id))
        }
    }

    function addCountry() {
        let addCountryInputField = $('#addCountry')
        if (!addCountryInputField.val()){
            return
        }

        let request = {
            url: baseURL + '/countries',
            headers: authHeaders,
            data: JSON.stringify({name: addCountryInputField.val()})
        }

        $.post(request)
            .then(loadTowns)
            .catch(displayError)

        addCountryInputField.val('')
    }

    function editCountry() {
        let request = {
            method: 'PUT',
            url: baseURL + '/countries/' + countriesSelectDropDown.val(),
            headers: authHeaders,
            data: JSON.stringify({name: editCountryInputField.val()})
        }

        $.ajax(request)
            .then(loadTowns)
            .catch(displayError)

        editCountryInputField.val('')
    }

    function loadTowns() {
        if (!countriesSelectDropDown.val()){
            return
        }

        let countryRequest = $.ajax({
            url: baseURL + '/countries/' + countriesSelectDropDown.val(),
            headers: authHeaders
        })

        let townsRequest = $.ajax({
            url: baseURL + `/towns/?query={"country":"${countriesSelectDropDown.find(':selected').text()}"}`,
            headers: authHeaders
        })

        Promise.all([countryRequest, townsRequest]).then(displayTowns).catch(displayError)
    }

    function displayTowns([country, towns]) {
        $(document.body).find('.new-town').remove()
        $(document.body).find('.edit-town').remove()
        $(document.body).find('.add-town').remove()
        $("#towns").text(country.name).show()
        countriesSelectDropDown.hide()

        let townsList = $('#townsList')
        townsList.empty()

        if (towns.length === 0) {
            townsList.append($("<li>").text('No towns found.'))
        }

        for (let town of towns) {
            let li = $("<li>").text(town.name).val(town._id).append(' ')
                .append($("<button>Delete</button>").click(deleteTown.bind(town._id))).append(' ')
                .append($("<input>").addClass('edit-town').attr('placeholder','Edit town name')).append(' ')
                .append($("<button>Edit</button>").click(editTown.bind(town._id)))

            townsList.append(li)
        }

        editCountryBtn.show()
        deleteCountryBtn.show()
        editCountryInputField.show()

        $(document.body)
            .append($("<input>").addClass('new-town').attr('placeholder','Add new town')).append(' ')
            .append($("<button class='add-town'>").text('Add town'))

        $('.add-town').click(addTown)
    }

    function editTown(event) {
        let editTownInputField = $(event.target).parent().find('.edit-town')
        if (!editTownInputField.val()){
            return
        }

        let request = {
            method: 'PUT',
            url: baseURL + '/towns/' + this,
            headers: authHeaders,
            data: JSON.stringify({name: editTownInputField.val(), country: countriesSelectDropDown.find(':selected').text()})
        }

        $.ajax(request)
            .then(loadTowns)
            .catch(displayError)

        editTownInputField.val('')
    }

    function addTown() {
        let addTownInputField = $('.new-town')
        if (!addTownInputField.val()){
            return
        }

        let request = {
            url: baseURL + '/towns',
            headers: authHeaders,
            data: JSON.stringify({name: addTownInputField.val(), country: countriesSelectDropDown.find(':selected').text()})
        }

        $.post(request)
            .then(loadTowns)
            .catch(displayError)

        addTownInputField.val('')
    }

    function deleteCountry() {
        let request = {
            method: 'DELETE',
            url: baseURL + '/countries/' + countriesSelectDropDown.val(),
            headers: authHeaders
        }

        $.ajax(request)
            .then(function () {
                location.reload()
            })
            .catch(displayError)
    }

    function deleteTown() {
        let request = {
            method: 'DELETE',
            url: baseURL + '/towns/' + this,
            headers: authHeaders
        }

        $.ajax(request)
            .then(loadTowns)
            .catch(displayError)
    }

    function displayError(error) {
        let errDiv = $("<div>").text(`Error ${error.status} : (${error.statusText})`)
        $(document.body).prepend(errDiv)

        setTimeout(function () {
            $(errDiv).fadeOut(function () {
                $(errDiv).remove()
            })
        }, 3000)
    }
})()