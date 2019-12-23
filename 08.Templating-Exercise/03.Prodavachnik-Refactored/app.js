function startApp() {
    showHideLinks()
}

async function showHideLinks() {
    let authtoken = sessionStorage.getItem('authtoken')
    let headers = window.headers.unauthHeaders
    if (authtoken) {
        headers = window.headers.authHeaders
    }
    let source = await $.get('./templates/header-template.hbs')
    let compiled = Handlebars.compile(source)
    let template = compiled({
        headers
    })
    let menu = $('#menu')
    if (menu.length) {
        menu.html(template)
    } else
        $('#app').append(template)

    attachEventsToLinks()
}

function attachEventsToLinks() {
    // $('#buttonLoginUser').on('click', () => handleAuthenticateRequest('Login'));
    // $('#buttonRegisterUser').on('click', () => handleAuthenticateRequest('Register'));
    // $('#buttonCreateAd').on('click', () => handeAdRequest('CreateAd'));
    // $('#buttonEditAd').on('click', () => handeAdRequest('EditAd'));
    $('#linkHome').on('click', () => viewSection('Home'));
    $('#linkLogin').on('click', () => viewSection('Login'));
    $('#linkRegister').on('click', () => viewSection('Register'));
    $('#linkListAds').on('click', () => {
        loadAds()
        viewSection('Ads')
    });
    $('#linkCreateAd').on('click', () => viewSection('CreateAd'));
    $('#linkLogout').on('click', () => {
        sessionStorage.clear();
        showHideLinks();
        viewSection('Home');
    });
}

function viewSection(sectionSelector) {
    $('main > section').hide()
    $('#view' + sectionSelector).show()
}

function showInfo(message) {
    showPopup(message, true)
}

function showError(message) {
    showPopup(message, false)
}

function showPopup(message, isInfo) {
    let selector = isInfo ? 'info' : 'error'
    let targetPopup = $('#' + selector + 'Box')
    targetPopup.text(message);
    targetPopup.show();
    targetPopup.on('click', () => targetPopup.fadeOut())

    if (isInfo)
        setTimeout(() => {
            targetPopup.fadeOut();
        }, 3000)
}