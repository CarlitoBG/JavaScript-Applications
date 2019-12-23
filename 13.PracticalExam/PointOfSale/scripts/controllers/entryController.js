let entryController = (() => {

    function addNewEntry(ctx) {
        if (!auth.isAuth()){
            ctx.redirect('#/index')
            return
        }

        ctx.username = sessionStorage.getItem('username')
        let type = ctx.params.type
        let qty = ctx.params.qty
        let price = ctx.params.price
        let receiptId = ctx.params.receiptId

        if(type === ''){
            notify.showError('Type can not be empty!')
        }else if(isNaN(Number(qty)) || qty.length === 0){
            notify.showError('Quantity must be a number!')
        }else if(isNaN(Number(price)) || price.length === 0) {
            notify.showError('Price must be a number!')
        }else {
            entriesService.addEntry(type, qty, price, receiptId)
                .then(() => {
                    notify.showInfo('Entry added')
                    ctx.redirect('#/home')
                }).catch(notify.handleError)
        }

        $('input[name=type]').val('')
        $('input[name=qty]').val('')
        $('input[name=price]').val('')
    }

    function removeEntry(ctx) {
        if (!auth.isAuth()){
            ctx.redirect('#/index')
            return
        }

        ctx.username = sessionStorage.getItem('username')

        let entryId = ctx.params.entryId
        entriesService.deleteEntry(entryId)
            .then(() => {
                notify.showInfo('Entry removed')
                ctx.redirect('#/home')
            }).catch(notify.handleError)
    }

    return {
        addNewEntry,
        removeEntry
    }
})();