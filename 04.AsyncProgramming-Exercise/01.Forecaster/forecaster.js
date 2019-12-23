function attachEvents() {
    const baseUrl = `https://judgetests.firebaseio.com/`

    $('#submit').click(getWeather)

    function getWeather() {
        $.get({
            url: baseUrl + 'locations.json',
        }).then(displayForecast)
            .catch(handleError)
    }

    function displayForecast(locations) {
        let location = $('#location').val()
        let locationCode = locations.filter(l => l['name'] === location).map(l => l['code'])[0]

        if (!locationCode) {
            handleError()
        }

        let currentWeatherRequest = $.get({
            url: baseUrl + `forecast/today/${locationCode}.json`,
        })

        let threeDaysRequest = $.get({
            url: baseUrl + `forecast/upcoming/${locationCode}.json`,
        })

        Promise.all([currentWeatherRequest, threeDaysRequest])
            .then(displayWeather)
            .catch(handleError)
    }

    function displayWeather([currentCondition, upcomingCondition]) {
        $('#forecast').css('display', 'block')

        let weatherSymbols = {
            'Sunny': '&#x2600;',
            'Partly sunny': '&#x26C5;',
            'Overcast': '&#x2601;',
            'Rain': '&#x2614;'
        }

        appendCurrentWeather(currentCondition, weatherSymbols)

        appendUpcomingWeather(upcomingCondition, weatherSymbols)
    }

    function appendCurrentWeather(currentCondition, weatherSymbols) {
        let current = $('#current')
        current.empty()

        let condition = currentCondition['forecast']['condition']
        let name = currentCondition['name']
        let low = currentCondition['forecast']['low']
        let high = currentCondition['forecast']['high']

        current.append($('<div class="label">Current conditions</div>'))
            .append($('<span>').addClass('condition symbol').html(weatherSymbols[condition]))
            .append($('<span>').addClass('condition')
                .append($('<span>').addClass('forecast-data').text(name))
                .append($('<span>').addClass('forecast-data').html(`${low}&#176;/${high}&#176;`))
                .append($('<span>').addClass('forecast-data').text(condition)))
    }

    function appendUpcomingWeather(upcomingCondition, weatherSymbols) {
        let upcoming = $('#upcoming')
        upcoming.empty()

        upcoming.append($('<div class="label">Three-day forecast</div>'))

        for (let forecast of upcomingCondition['forecast']) {
            let condition = forecast['condition']
            let low = forecast['low']
            let high = forecast['high']

            upcoming
                .append($('<span>').addClass('upcoming')
                    .append($('<span>').addClass('symbol').html(weatherSymbols[condition]))
                    .append($('<span>').addClass('forecast-data').html(`${low}&#176;/${high}&#176;`))
                    .append($('<span>').addClass('forecast-data').text(condition)))
        }
    }

    function handleError() {
        $('#forecast').css('display', 'block').text('Error')
    }
}