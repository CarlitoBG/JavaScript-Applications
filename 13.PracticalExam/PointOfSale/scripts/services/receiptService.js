let receiptService = (() => {
    async function getActiveReceipt(userId) {
        let endpoint = `receipts?query={"_acl.creator":"${userId}","active":"true"}`;

        let currentReceipt = await requester.get('appdata', endpoint, 'kinvey');
        if (currentReceipt.length === 0) {
            return await createReceipt();
        }

        return currentReceipt[0];
    }

    function createReceipt() {
        let receiptData = {
            active: true,
            productCount: 0,
            total: 0
        };

        return requester.post('appdata', 'receipts', 'kinvey', receiptData);
    }

    function getMyReceipts(userId) {
        let endpoint = `receipts?query={"_acl.creator":"${userId}","active":"false"}`;

        return requester.get('appdata', endpoint, 'kinvey');
    }

    function getReceiptDetails(receiptId) {
        let endpoint = `receipts/${receiptId}`;

        return requester.get('appdata', endpoint, 'kinvey');
    }

    function commitReceipt(receiptId, productCount, total) {
        let endpoint = `receipts/${receiptId}`;
        let data = {
            active: false,
            productCount,
            total
        };

        return requester.update('appdata', endpoint, 'kinvey', data)
    }

    return {
        getActiveReceipt,
        createReceipt,
        getMyReceipts,
        getReceiptDetails,
        commitReceipt
    }
})()