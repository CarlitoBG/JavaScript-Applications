$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs')

        this.get('#/home', homeController.loadHomePage)
        this.get('#/about', homeController.loadAboutPage)

        this.get('#/login', accountController.loadLoginPage)
        this.post('#/login', accountController.loginUser)

        this.get('#/register', accountController.loadRegisterPage)
        this.post('#/register', accountController.registerUser)

        this.get('#/logout', accountController.logoutUser)

        this.get('#/catalog', teamController.loadCatalog)
        this.get('#/catalog/:id', teamController.loadTeamDetails)

        this.get('#/join/:id', teamController.joinTeam)
        this.get('#/leave', teamController.leaveTeam)

        this.get('#/create', teamController.loadCreatePage)
        this.post('#/create', teamController.createTeam)

        this.get('#/edit/:id', teamController.loadEditPage)
        this.post('#/edit/:id', teamController.editTeamInfo)
    })

    app.run()
})