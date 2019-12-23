function webApi() {
    const appKey = 'kid_H17k37pSr'
    const appSecret = 'c99bdf9d09e7459eb4fda25bfbe5951d'
    const baseUrl = 'https://baas.kinvey.com'
    const authHeaders = {
        Authorization: 'Basic ' + btoa(appKey + ':' + appSecret)
    }
    const actions = {
        Login: baseUrl + '/user/' + appKey + '/login',
        Register: baseUrl + '/user/' + appKey,
        Advert: baseUrl + '/appdata/' + appKey + '/ads',
    }

    function sendRequest(method, action, headers, data, params) {
        headers = headers === null ? authHeaders : headers
        let url = params === null ? actions[action] : actions[action] + params

        return $.ajax({
            method,
            url: url,
            headers,
            data,
        });
    }

    function sendLoadRequest(method, action, headers) {
        headers = headers === null ? authHeaders : headers
        let url = actions[action]

        return $.ajax({
            method,
            url: url,
            headers,
        });
    }

    return {
        sendRequest,
        sendLoadRequest
    }
}