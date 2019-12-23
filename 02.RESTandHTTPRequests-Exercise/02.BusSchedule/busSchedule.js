let result = (function solve() {
    let currentStop = 'depot'
    let arrivalStop = ''

    function depart() {
        let request = {
            method: 'GET',
            url: `https://judgetests.firebaseio.com/schedule/${currentStop}.json`,
            success: displayBusStop,
            error: showError
        }

        $.ajax(request)

        $('#depart').attr('disabled', true)
        $('#arrive').removeAttr('disabled')
    }
    
    function arrive() {
        $('span.info').text(`Arriving at ${arrivalStop}`)
        $('#arrive').attr('disabled', true)
        $('#depart').removeAttr('disabled')
    }

    function displayBusStop(busStop) {
        $('span.info').text(`Next stop ${busStop['name']}`)
        currentStop = busStop['next']
        arrivalStop = busStop['name']
    }

    function showError() {
        $('span.info').text('Error')
    }

    return {
        depart,
        arrive
    }
})()