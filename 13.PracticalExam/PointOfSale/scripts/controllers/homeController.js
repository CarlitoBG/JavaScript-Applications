let homeController = (() => {
    function welcome(ctx) {
        if(auth.isAuth()){
            ctx.redirect('#/home');
        } else {
            ctx.loadPartials({
                welcome: 'templates/common/welcome.hbs',
                loginForm: 'templates/login/loginForm.hbs',
                loginPage: 'templates/login/loginPage.hbs',
                registerForm: 'templates/register/registerForm.hbs',
                registerPage: 'templates/register/registerPage.hbs',
                footer: 'templates/common/footer.hbs',
            }).then(function () {
                this.partial('templates/common/indexPage.hbs');
            });
        }
    }

    return {
        welcome
    }
})();