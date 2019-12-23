async function handleAuthenticateRequest(type) {
    let targetForm = $('#form' + type)
    let username = targetForm.find('input[name=username]').val()
    let password = targetForm.find('input[name=password]').val()

    let userData = {
        username,
        password
    }

    try {
        let user = await webApi().sendRequest('POST', type, null, userData, null);
        targetForm.trigger('reset')
        sessionStorage.setItem('username', user.username)
        sessionStorage.setItem('id', user._id)
        sessionStorage.setItem('authtoken', user._kmd.authtoken)
        showHideLinks()
        viewSection('Home')
        showInfo('Successfully ' + type.toLowerCase() + '!')
    } catch (error) {
        showError(error.responseJSON.description);
    }
}