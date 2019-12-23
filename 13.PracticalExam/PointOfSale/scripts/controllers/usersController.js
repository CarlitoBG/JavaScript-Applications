let usersController = (() => {

    function postLogin(ctx) {
        let username = ctx.params['username-login'];
        let password = ctx.params['password-login'];

        if (username.length < 5) {
            notify.showError('Username should be at least 5 characters long.');
            return;
        }

        if(password === ''){
            notify.showError('Password can not be empty.');
            return;
        }

        auth.login(username, password)
            .then((userInfo) => {
                auth.saveSession(userInfo);
                notify.showInfo('Login successful.');
                ctx.redirect('#/home');
            }).catch(notify.handleError);

        $('#username-login').val('')
        $('#password-login').val('')
    }

    function postRegister(ctx) {
        let username = ctx.params['username-register'];
        let password = ctx.params['password-register'];
        let repeatPass = ctx.params['password-register-check'];

        if (username.length < 5) {
            notify.showError('Username should be at least 5 characters long.');
            return;
        }

        if(password === ''){
            notify.showError('Password can not be empty.');
            return;
        }

        if (password !== repeatPass) {
            notify.showError('Passwords must match!');
            return;
        }

        auth.register(username, password)
            .then((userInfo) => {
                auth.saveSession(userInfo);
                notify.showInfo('User registration successful.');
                ctx.redirect('#/home');
            }).catch(notify.handleError);

        $('#username-register').val('')
        $('#password-register').val('')
        $('#password-register-check').val('')
    }

    function logout(ctx) {
        auth.logout()
            .then(() => {
                sessionStorage.clear();
                notify.showInfo('Logout successful.');
                ctx.redirect('#/index');
            }).catch(notify.handleError);
    }

    return {
        postLogin,
        postRegister,
        logout,
    }
})();