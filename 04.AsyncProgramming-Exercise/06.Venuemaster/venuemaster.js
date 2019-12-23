function attachEvents() {
    const getVenuesURL = 'https://baas.kinvey.com/rpc/kid_BJ_Ke8hZg/custom/calendar?query='
    const venueInfoURL = 'https://baas.kinvey.com/appdata/kid_BJ_Ke8hZg/venues/'
    const confirmPurchaseURL = 'https://baas.kinvey.com/rpc/kid_BJ_Ke8hZg/custom/purchase?venue='
    const username = 'guest'
    const password = 'pass'
    const base64auth = btoa(username + ":" + password)
    const authHeaders = {"Authorization": "Basic " + base64auth}

    let listVenuesBtn = $('#getVenues')
    let mainDiv = $("#venue-info")

    listVenuesBtn.click(getVenues)

    function getVenues() {
        let venueDate = $('#venueDate').val()
        if (!venueDate) {
            return
        }

        $.post({
            url: getVenuesURL + venueDate,
            headers: authHeaders
        }).then(loadVenuesIDs)
            .catch(displayError)
    }

    function loadVenuesIDs(arrayOfVenuesIDs) {
        mainDiv.empty()
        for (let venueID of arrayOfVenuesIDs) {
            obtainInfoForVenue(venueID)
        }

        function obtainInfoForVenue(venueID) {
            $.get({
                url: venueInfoURL + venueID,
                headers: authHeaders
            }).then(displayVenue)
                .catch(displayError)
        }
    }

    function displayVenue(venue) {
        let div = $('<div>').addClass("venue").attr('id', venue._id)
        let span = $('<span>').addClass("venue-name").text(venue.name)
        let moreInfoBtn = $('<input>').addClass("info").attr("type", "button").val("More info").click(showInfo.bind(div))
        let purchaseBtn = $('<input>').addClass("purchase").attr("type", "button").val("Purchase").click(purchase.bind(div))

        let hiddenDiv = $('<div>').addClass("venue-details").css("display", "none")
        let table = $('<table>')
            .append(`<tr><th>Ticket Price</th><th>Quantity</th><th></th></tr>`)
            .append($('<tr>')
                .append(`<td class="venue-price">${venue.price} lv</td>`)
                .append($(`<td>`)
                    .append($('<select>').addClass("quantity")
                        .append(`<option value="1">1</option>`)
                        .append(`<option value="2">2</option>`)
                        .append(`<option value="3">3</option>`)
                        .append(`<option value="4">4</option>`)
                        .append(`<option value="5">5</option>`)))
                .append($('<td>').append(purchaseBtn)))

        hiddenDiv.append(table)
        hiddenDiv
            .append(`<span class="head">Venue description:</span>`)
            .append(`<p class="description">${venue.description}</p>`)
            .append(`<p class="description">Starting time: ${venue.startingHour}</p>`)

        span.prepend(moreInfoBtn)
        div.append(span)
        div.append(hiddenDiv)
        mainDiv.append(div)
    }

    function showInfo() {
        let venueDetails = $(this).find('.venue-details')

        if (venueDetails.css('display') === 'none') {
            venueDetails.show()
        } else {
            venueDetails.hide()
        }
    }

    function purchase() {
        let name = $(this).find('.venue-name').text()
        let quantity = Number($(this).find('select.quantity').val())
        let price = Number($(this).find('.venue-price').text().slice(0, -3))

        let span = $(`<span>`).addClass("head").text(`Confirm purchase`)
        let confirmBtn = $('<input>').attr("type", "button").val("Confirm").click(confirmPurchase.bind(this))

        let purchaseInfo = $('<div>').addClass('purchase-info')
            .append(`<span>${name}</span>`)
            .append(`<span>${quantity} x ${price}</span>`)
            .append(`<span>Total: ${quantity * price} lv</span>`)
            .append(confirmBtn)

        mainDiv.empty()
        mainDiv.append(span).append(purchaseInfo)
    }

    function confirmPurchase() {
        let id = $(this).attr('id')
        let quantity = Number($(this).find('select.quantity').val())

        $.post({
            url: confirmPurchaseURL + id + '&qty=' + quantity,
            headers: authHeaders
        }).then(displayTicket)
            .catch(displayError)
    }
    
    function displayTicket(obj) {
        mainDiv.empty()
        mainDiv.append('You may print this page as your ticket.').append(obj.html)
    }

    function displayError(error) {
        let errorDiv = $('<div>').addClass('error').text(`Error ${error.status} : (${error.statusText})`)
        mainDiv.append(errorDiv)

        setTimeout(function () {
            $(errorDiv).fadeOut(function () {
                $(errorDiv).remove()
            })
        }, 2000)
    }
}