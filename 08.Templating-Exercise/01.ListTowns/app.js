function attachEvents() {
    $('#btnLoadTowns').on('click', function () {
        let towns = $('#towns').val()
            .split(', ')
            .map(town => ({name: town}))
            .filter(town => town.name !== '')

        loadTowns(towns)
    })

    async function loadTowns(towns) {
        let source = await $.get('./towns-template.hbs')
        let template = Handlebars.compile(source)
        let resultHtml = template({towns})

        $('#root').append(resultHtml)
    }
}