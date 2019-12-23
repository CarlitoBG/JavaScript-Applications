function getInfo() {
    const URL = 'https://judgetests.firebaseio.com/businfo/'
    let stopID = $('#stopId').val()
    let stopNameDiv =  $('#stopName')
    let busList = $('#buses')

    busList.empty()

    let request = {
        method: 'GET',
        url: URL + stopID + '.json',
        success: getBusInfo,
        error: showError
    }
    
    $.ajax(request)
    
    function getBusInfo(busInfo) {
        let stopName = busInfo['name']
        let buses = busInfo['buses']

        stopNameDiv.text(stopName)
        for (let busId in buses) {
            busList.append($(`<li>Bus ${busId} arrives in ${buses[busId]} minutes</li>`))
        }
    }
    
    function showError() {
        stopNameDiv.text('Error')
    }
}