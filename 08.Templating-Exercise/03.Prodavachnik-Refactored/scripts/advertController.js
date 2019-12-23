async function handleAdRequest(type) {
    let targetForm = $('#form' + type)
    let Title = targetForm.find('input[name=title]').val()
    let Description = targetForm.find('textarea[name=description]').val()
    let Publisher = sessionStorage.getItem('username')
    let Date = targetForm.find('input[name=datePublished]').val()
    let Price = targetForm.find('input[name=price]').val()

    let adData = {
        Title,
        Description,
        Publisher,
        Date,
        Price
    }

    let headers = {
        Authorization: 'Kinvey ' + sessionStorage.getItem('authtoken')
    }

    let method = 'POST'
    let param = null
    if (type === 'EditAd') {
        method = 'PUT'
        param = '/' + targetForm.find('input[name=id]').val()
    }

    try {
        let ad = await webApi().sendRequest(method, 'Advert', headers, adData, param);
        targetForm.trigger('reset')
        loadAds()
        viewSection('Ads')
        showInfo('Added ad successfully: ' + ad.Title);
    } catch (error) {
        showError(error.message)
    }
}

async function loadAds() {
    let headers = {
        Authorization: 'Kinvey ' + sessionStorage.getItem('authtoken')
    }

    try {
        let allAds = await webApi().sendLoadRequest('GET', 'Advert', headers);
        console.log(allAds);
        fillTable(allAds)
        viewSection('Ads')
    } catch (error) {
        showError(error.message)
    }
}

async function fillTable(ads) {
    let source = await $.get('templates/view-ads.hbs')
    let compiled = Handlebars.compile(source)
    let template = compiled({ads})

    let viewAds = $('#viewAds')
    if (viewAds.length) {
        viewAds.append(template)
    } else
        $('#app').append(template)
}

function loadEditAd(ad) {
    let formEditAd = $('#formEditAd')
    formEditAd.find('input[name=id]').val(ad._id)
    formEditAd.find('input[name=publisher]').val(ad._acl.creator)
    formEditAd.find('input[name=title]').val(ad.Title)
    formEditAd.find('textarea[name=description]').val(ad.Description)
    formEditAd.find('input[name=datePublished]').val(ad.Date)
    formEditAd.find('input[name=price]').val(ad.Price)
    viewSection('EditAd')
}