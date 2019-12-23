const BASE_URL = "https://baas.kinvey.com/"
const APP_KEY = "kid_H17k37pSr"
const APP_SECRET = "c99bdf9d09e7459eb4fda25bfbe5951d"
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)}

function loginUser() {
    let username = $('#formLogin').find('input[name=username]').val()
    let password = $('#formLogin').find('input[name=passwd]').val()

    $.ajax({
        method: "POST",
        url: BASE_URL + "user/" + APP_KEY + "/login",
        headers: AUTH_HEADERS,
        data: {username, password},
        success: loginSuccess,
        error: handleAjaxError
    })

    function loginSuccess(userInfo) {
        saveAuthInSession(userInfo)
        showHideMenuLinks()
        listAds()
        showInfo('Login successful.')
    }
}

function registerUser() {
    let username = $('#formRegister').find('input[name=username]').val()
    let password = $('#formRegister').find('input[name=passwd]').val()

    $.ajax({
        method: "POST",
        url: BASE_URL + "user/" + APP_KEY + "/",
        headers: AUTH_HEADERS,
        data: {username, password},
        success: registerSuccess,
        error: handleAjaxError
    })

    function registerSuccess(userInfo) {
        saveAuthInSession(userInfo)
        showHideMenuLinks()
        listAds()
        showInfo('User registration successful.')
    }
}

function logoutUser() {
    sessionStorage.clear()
    showHideMenuLinks()
    showHomeView()
    showInfo('Logout successful.')
}

function listAds() {
    $('#ads').empty()
    showView('viewAds')

    $.ajax({
        method: "GET",
        url: BASE_URL + "appdata/" + APP_KEY + "/ads",
        headers: getUserAuthToken(),
        success: loadAdsSuccess,
        error: handleAjaxError
    })

    function loadAdsSuccess(ads) {
        showInfo('Advertisements loaded.')

        if (ads.length === 0) {
            $('#ads').text('No advertisements available.')
        } else {
            let adsTable = $('<table>')
                .append($('<tr>').append(
                    '<th>Title</th>',
                    '<th>Description</th>',
                    '<th>Publisher</th>',
                    '<th>Price</th>',
                    '<th>Date Published</th>',
                    '<th>Actions</th>'))

            let sortedAdverts = ads.sort((a, b) => b.View - a.View)
            for (let ad of sortedAdverts) {
                let readMoreLink = $(`<a href="#">[Read More]</a>`).click(function () {displayAdvert(ad)})
                let links = [readMoreLink]

                if (ad._acl.creator === sessionStorage['userId']) {
                    let deleteLink = $('<a href="#">[Delete]</a>').click(function () {deleteAd(ad)})
                    let editLink = $('<a href="#">[Edit]</a>').click(function () {loadAdForEdit(ad)})
                    links = [readMoreLink, ' ', deleteLink, ' ', editLink]
                }

                adsTable.append($('<tr>').append(
                    $('<td>').text(ad.Title),
                    $('<td>').text(ad.Description),
                    $('<td>').text(ad.Publisher),
                    $('<td>').text(ad.Price),
                    $('<td>').text(ad.Date),
                    $('<td>').append(links)
                ))
            }

            $('#ads').append(adsTable)
        }
    }
}

function getUserAuthToken() {
    return {'Authorization': "Kinvey " + sessionStorage.getItem('authToken')}
}

function createAdd() {
    let advertInfo = JSON.stringify({
        Publisher: sessionStorage.getItem('username'),
        Title: $('#formCreateAd').find('input[name=title]').val(),
        Description: $('#formCreateAd').find('textarea[name=description]').val(),
        Date: $('#formCreateAd').find('input[name=datePublished]').val(),
        Price: $('#formCreateAd').find('input[name=price]').val(),
        Image: $('#formCreateAd').find('input[name=image]').val(),
        View: 0
    })

    $.ajax({
        method: "POST",
        url: BASE_URL + "appdata/" + APP_KEY + "/ads",
        headers: getUserAuthToken(),
        data: advertInfo,
        contentType: "application/json",
        dataType: 'json',
        success: createAdSuccess,
        error: handleAjaxError
    })

    function createAdSuccess() {
        listAds()
        showInfo('Advertisement created.')
    }
}

function loadAdForEdit(ad) {
    $.ajax({
        method: "GET",
        url: BASE_URL + "appdata/" + APP_KEY + "/ads/" + ad._id,
        headers: getUserAuthToken(),
        success: loadAdForEditSuccess,
        error: handleAjaxError
    })

    function loadAdForEditSuccess(ad) {
        $('#formEditAd').find('input[name=id]').val(ad._id)
        $('#formEditAd').find('input[name=title]').val(ad.Title)
        $('#formEditAd').find('textarea[name=description]').val(ad.Description)
        $('#formEditAd').find('input[name=datePublished]').val(ad.Date)
        $('#formEditAd').find('input[name=price]').val(ad.Price)
        $('#formEditAd').find('input[name=image]').val(ad.Image)
        $('#formEditAd').find('input[name=views]').val(ad.View)

        showView('viewEditAd')
    }
}

function editAd() {
    let advertInfo = JSON.stringify({
        Title: $('#formEditAd').find('input[name=title]').val(),
        Description: $('#formEditAd').find('textarea[name=description]').val(),
        Publisher: sessionStorage.getItem('username'),
        Date: $('#formEditAd').find('input[name=datePublished]').val(),
        Price: Number($('#formEditAd').find('input[name=price]').val()),
        Image: $('#formEditAd').find('input[name=image]').val(),
        View: Number($('#formEditAd').find('input[name=views]').val())
    })

    $.ajax({
        method: "PUT",
        url: BASE_URL + "appdata/" + APP_KEY + "/ads/" + $('#formEditAd').find('input[name=id]').val(),
        headers: getUserAuthToken(),
        data: advertInfo,
        contentType: "application/json",
        dataType: 'json',
        success: editAdSuccess,
        error: handleAjaxError
    })

    function editAdSuccess() {
        listAds()
        showInfo('Advertisement edited.')
    }
}

function deleteAd(ad) {
    $.ajax({
        method: "DELETE",
        url: BASE_URL + "appdata/" + APP_KEY + "/ads/" + ad._id,
        headers: getUserAuthToken(),
        success: deleteAdSuccess,
        error: handleAjaxError
    })

    function deleteAdSuccess() {
        listAds()
        showInfo('Advert deleted.')
    }
}

function displayAdvert(advert) {
    advert.View++
    let advertInfo = JSON.stringify({
        Title: advert.Title,
        Description: advert.Description,
        Publisher: advert.Publisher,
        Date: advert.Date,
        Price: Number(advert.Price),
        Image: advert.Image,
        View: advert.View
    })

    $.ajax({
        method: "PUT",
        url: BASE_URL + "appdata/" + APP_KEY + "/ads/" + advert._id,
        headers: getUserAuthToken(),
        data: advertInfo,
        contentType: "application/json",
        dataType: 'json',
        success: displayReadMoreView,
        error: handleAjaxError
    })

    function displayReadMoreView() {
        $('#viewDetailsAd').empty()

        let advertInfo = $('<div>').append(
            $('<img>').attr("src", advert.Image),
            $('<br>'),
            $('<label>').text('Title:'),
            $('<h1>').text(advert.Title),
            $('<label>').text('Description:'),
            $('<p>').text(advert.Description),
            $('<label>').text('Publisher:'),
            $('<div>').text(advert.Publisher),
            $('<label>').text('Date:'),
            $('<div>').text(advert.Date),
            $('<label>').text('Views:'),
            $('<div>').text(advert.View))

        $('#viewDetailsAd').append(advertInfo)

        showView('viewDetailsAd')
    }
}

function saveAuthInSession(userInfo) {
    sessionStorage.setItem('authToken', userInfo._kmd.authtoken)
    sessionStorage.setItem('userId', userInfo._id)
    sessionStorage.setItem('username', userInfo.username)
}

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response)
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error."
    if (response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description
    showError(errorMsg)
}