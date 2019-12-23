let accountController = (() => {
    function loadLoginPage(ctx) {
        ctx.loadPartials({
            header: '../TeamManager/templates/common/header.hbs',
            footer: '../TeamManager/templates/common/footer.hbs',
            loginForm: '../TeamManager/templates/login/loginForm.hbs'
        }).then(function () {
            this.partial('../TeamManager/templates/login/loginPage.hbs');
        })
    }

    function loginUser(ctx) {
        let username = ctx.params.username
        let password = ctx.params.password

        auth.login(username, password)
            .then(function (userInfo) {
                auth.showInfo('Successfully logged in!')
                auth.saveSession(userInfo)
                ctx.redirect('#/home')
                //homeController.loadHomePage(ctx)
            })
            .catch(auth.handleError)
    }

    function loadRegisterPage(ctx) {
        ctx.loadPartials({
            header: '../TeamManager/templates/common/header.hbs',
            footer: '../TeamManager/templates/common/footer.hbs',
            registerForm: '../TeamManager/templates/register/registerForm.hbs'
        }).then(function () {
            this.partial('../TeamManager/templates/register/registerPage.hbs');
        })
    }

    function registerUser(ctx) {
        let username = ctx.params.username
        let password = ctx.params.password
        let repeatPassword = ctx.params.repeatPassword

        if (password !== repeatPassword){
            auth.showError('Passwords must match!')
        }else {
            auth.register(username, password, repeatPassword)
                .then(function (userInfo) {
                    auth.saveSession(userInfo)
                    auth.showInfo('Successfully registered!')
                    ctx.redirect('#/home')
                    //homeController.loadHomePage(ctx)
                })
                .catch(auth.handleError)
        }
    }

    function logoutUser(ctx) {
        auth.logout()
            .then(function () {
                sessionStorage.clear()
                auth.showInfo('Logged out successfully!')
                ctx.redirect('#/home')
                //homeController.loadHomePage(ctx)
            })
            .catch(auth.handleError)
    }

    return {
        loadLoginPage,
        loginUser,
        loadRegisterPage,
        registerUser,
        logoutUser
    }
})()