$(() => {
    renderCatTemplate()

    async function renderCatTemplate() {
        let template = await $.get('./cat-template.hbs')
        let compiledTemplate = Handlebars.compile(template)
        let result = compiledTemplate({cats: window.cats})

        $('body').html(result)

        $('.btn-primary').on('click', (ev) => {
            let currentButton = $(ev.target)
            if (currentButton.text() === 'Show status code'){
                currentButton.text('Hide status code')
            }else {
                currentButton.text('Show status code')
            }

            currentButton.next('div').toggle()
        })
    }
})