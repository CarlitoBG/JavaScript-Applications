let teamController = (() => {
    function loadCatalog(ctx) {
        teamsService.loadTeams()
            .then(function (data) {
                ctx.loggedIn = sessionStorage.getItem('authtoken') !== null
                ctx.username = sessionStorage.getItem('username')
                ctx.hasTeam = sessionStorage.getItem('teamId') !== 'undefined'
                ctx.hasNoTeam = sessionStorage.getItem('teamId') === 'undefined'
                ctx.teams = data

                ctx.loadPartials({
                    header: '../TeamManager/templates/common/header.hbs',
                    footer: '../TeamManager/templates/common/footer.hbs',
                    team: '../TeamManager/templates/catalog/team.hbs'
                }).then(function () {
                    this.partial('../TeamManager/templates/catalog/teamCatalog.hbs')
                })
            })
    }

    function loadTeamDetails(ctx) {
        let teamId = this.params.id.substr(1)
        teamsService.loadTeamDetails(teamId)
            .then(function (teamInfo) {
                auth.getAllUsers()
                    .then(function (users) {
                        ctx.loggedIn = sessionStorage.getItem('authtoken') !== null
                        ctx.username = sessionStorage.getItem('username')
                        ctx.name = teamInfo.name
                        ctx.comment = teamInfo.comment
                        ctx.teamId = teamId
                        ctx.isAuthor = teamInfo._acl.creator === sessionStorage.getItem('userId')
                        ctx.isOnTeam = teamInfo._id === sessionStorage.getItem('teamId')
                        ctx.members = users.filter(a => a.teamId === teamInfo._id)

                        ctx.loadPartials({
                            header: '../TeamManager/templates/common/header.hbs',
                            footer: '../TeamManager/templates/common/footer.hbs',
                            teamMember: '../TeamManager/templates/catalog/teamMember.hbs',
                            teamControls: '../TeamManager/templates/catalog/teamControls.hbs'
                        }).then(function () {
                            ctx.partials = this.partials
                            ctx.partial('../TeamManager/templates/catalog/details.hbs')
                        })
                    }).catch(auth.handleError)
            }).catch(auth.handleError)
    }

    function joinTeam(ctx) {
        let teamId = this.params.id.substr(1)
        teamsService.joinTeam(teamId)
            .then((data) => {
                auth.saveSession(data)
                auth.showInfo('Team has been joined!')
                ctx.redirect('#/catalog')
                //loadCatalog(ctx)
            })
    }

    function leaveTeam(ctx) {
        teamsService.leaveTeam()
            .then(function (data) {
                auth.saveSession(data)
                auth.showInfo('Team has been left!')
                ctx.redirect('#/catalog')
                //loadCatalog(ctx)
            })
    }

    function loadCreatePage(ctx) {
        ctx.loggedIn = sessionStorage.getItem('authtoken') !== null
        ctx.username = sessionStorage.getItem('username')

        ctx.loadPartials({
            header: '../TeamManager/templates/common/header.hbs',
            footer: '../TeamManager/templates/common/footer.hbs',
            createForm: '../TeamManager/templates/create/createForm.hbs'
        }).then(function () {
            this.partial('../TeamManager/templates/create/createPage.hbs')
        })
    }

    function createTeam(ctx) {
        let teamName = ctx.params.name
        let teamComment = ctx.params.comment

        teamsService.createTeam(teamName, teamComment)
            .then(function (data) {
                teamsService.joinTeam(data._id)
                    .then((info) => {
                        auth.saveSession(info)
                        auth.showInfo('Team has been created!')
                        ctx.redirect('#/catalog')
                        //loadCatalog(ctx)
                    })
            })
    }

    function loadEditPage(ctx) {
        ctx.loggedIn = sessionStorage.getItem('authtoken') !== null
        ctx.username = sessionStorage.getItem('username')
        ctx.teamId = ctx.params.id.substr(1)

        teamsService.loadTeamDetails(ctx.teamId)
            .then((teamInfo) => {
                ctx.name = teamInfo.name
                ctx.comment = teamInfo.comment

                ctx.loadPartials({
                    header: '../TeamManager/templates/common/header.hbs',
                    footer: '../TeamManager/templates/common/footer.hbs',
                    editForm: '../TeamManager/templates/edit/editForm.hbs'
                }).then(function () {
                    this.partial('../TeamManager/templates/edit/editPage.hbs')
                })
            })
    }

    function editTeamInfo(ctx) {
        let teamId = ctx.params.id.substr(1)
        let teamName = ctx.params.name
        let teamComment = ctx.params.comment

        teamsService.edit(teamId, teamName, teamComment)
            .then(function () {
                auth.showInfo(`Team ${teamName} edited!`)
                ctx.redirect('#/catalog')
                //loadCatalog(ctx)
            })
    }

    return {
        loadCatalog,
        loadTeamDetails,
        joinTeam,
        leaveTeam,
        loadCreatePage,
        createTeam,
        loadEditPage,
        editTeamInfo
    }
})()