let receiptController = (() => {

    function getHomeScreen(ctx) {
        if (!auth.isAuth()){
            ctx.redirect('#/index')
            return
        }

        let userId = sessionStorage.getItem('userId')
        let username = sessionStorage.getItem('username')

        receiptService.getActiveReceipt(userId)
            .then((receipt) => {
                entriesService.getEntriesByReceiptId(receipt._id)
                    .then((entries) => {
                        let totalSum = 0
                        for (let entry of entries) {
                            let sum = Number(entry.qty) * Number(entry.price)
                            entry.price = Number(entry.price).toFixed(2)
                            entry.totalPrice = sum.toFixed(2)
                            totalSum += sum
                        }

                        ctx.username = username
                        ctx.receiptId = receipt._id
                        ctx.entries = entries
                        ctx.totalSum = totalSum.toFixed(2)
                        ctx.productCount = entries.length

                        ctx.loadPartials({
                            header: './templates/common/header.hbs',
                            footer: './templates/common/footer.hbs',
                            navbar: './templates/common/navbar.hbs',
                            activeEntry: './templates/create/activeEntry.hbs',
                            createForm: './templates/create/createForm.hbs',
                            checkoutForm: './templates/create/checkoutForm.hbs',
                        }).then(function () {
                            this.partial('./templates/create/createReceipt.hbs')
                        })
                    })
                    .catch(notify.handleError)
            })
            .catch(notify.handleError)
    }

    function checkoutReceipt(ctx) {
        if (!auth.isAuth()){
            ctx.redirect('#/index')
            return
        }

        ctx.username = sessionStorage.getItem('username')

        let receiptId = ctx.params.receiptId
        let productCount = ctx.params.productCount
        let total = ctx.params.total

        if (productCount === '0'){
            notify.showError('Can not checkout an empty receipt!')
        }else {
            receiptService.commitReceipt(receiptId, productCount, total)
                .then(() => {
                    notify.showInfo('Receipt checked out')
                    ctx.redirect('#/home')
                }).catch(notify.handleError)
        }
    }

    function getAllReceipts(ctx) {
        if (!auth.isAuth()){
            ctx.redirect('#/index')
            return
        }

        ctx.username = sessionStorage.getItem('username')
        let userId = sessionStorage.getItem('userId')

        receiptService.getMyReceipts(userId)
            .then((allReceipts) => {
                allReceipts.forEach(r => {
                    let date = new Date(r._kmd.lmt)
                    let hours = ('0' + date.getHours()).slice(-2)
                    let minutes = ('0' + date.getMinutes()).slice(-2)
                    r.date = `${date.toJSON().slice(0, 10)} ${hours}:${minutes}`
                })
                ctx.receipts = allReceipts
                ctx.totalSum = (allReceipts.map(r => +r.total).reduce((a, b) => a + b)).toFixed(2)

                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    navbar: './templates/common/navbar.hbs',
                    receipt:'./templates/receipts/receipt.hbs',
                    receiptsTotal:'./templates/receipts/receiptsTotal.hbs'
                }).then(function () {
                    this.partial('./templates/receipts/receiptsList.hbs')
                })
            }).catch(notify.handleError)
    }

    function getReceiptDetails(ctx) {
        if (!auth.isAuth()){
            ctx.redirect('#/index')
            return
        }

        let receiptId = ctx.params.receiptId
        entriesService.getEntriesByReceiptId(receiptId)
            .then((entries) => {
                entries.forEach(e => {
                    e.price = Number(e.price).toFixed(2)
                    e.totalPrice = (Number(e.qty) * Number(e.price)).toFixed(2)
                })

                ctx.username = sessionStorage.getItem('username')
                ctx.entries = entries

                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    navbar: './templates/common/navbar.hbs',
                    productDetails:'./templates/details/productDetails.hbs'
                }).then(function () {
                    this.partial('./templates/details/receiptDetails.hbs')
                })
            })
            .catch(notify.handleError)
    }

    return {
        getHomeScreen,
        checkoutReceipt,
        getAllReceipts,
        getReceiptDetails
    }
})();