let homeController = (() => {
    function loadHomePage(ctx) {
        ctx.loggedIn = sessionStorage.getItem('authtoken') !== null
        ctx.username = sessionStorage.getItem('username')
        ctx.hasTeam = sessionStorage.getItem('teamId') !== "undefined"

        ctx.loadPartials({
            header: '../TeamManager/templates/common/header.hbs',
            footer: '../TeamManager/templates/common/footer.hbs'
        }).then(function () {
            this.partial('../TeamManager/templates/home/home.hbs')
        })
    }

    function loadAboutPage(ctx) {
        ctx.loggedIn = sessionStorage.getItem('authtoken') !== null
        ctx.username = sessionStorage.getItem('username')

        ctx.loadPartials({
            header: '../TeamManager/templates/common/header.hbs',
            footer: '../TeamManager/templates/common/footer.hbs'
        }).then(function () {
            this.partial('../TeamManager/templates/about/about.hbs')
        })
    }

    return{
        loadHomePage,
        loadAboutPage
    }
})()