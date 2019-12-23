$(() => {
    let app = new Sammy('#container', function () {
        this.use('Handlebars', 'hbs')

        // Default page
        this.get('index.html', homeController.welcome)
        this.get('#/index', homeController.welcome)

        this.post('#/login', usersController.postLogin)

        this.post('#/register', usersController.postRegister)

        this.get('#/logout', usersController.logout)

        this.get('#/home', receiptController.getHomeScreen)

        this.post('#/createEntry', entryController.addNewEntry)

        this.get('#/deleteEntry/:entryId', entryController.removeEntry)

        this.post('#/checkout', receiptController.checkoutReceipt)

        this.get('#/overview', receiptController.getAllReceipts)

        this.get('#/receiptDetails/:receiptId', receiptController.getReceiptDetails)
    })

    app.run()
})