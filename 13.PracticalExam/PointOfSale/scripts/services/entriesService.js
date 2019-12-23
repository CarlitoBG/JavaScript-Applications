let entriesService = (() => {
    function getEntriesByReceiptId(receiptId) {
        let endpoint = `entries?query={"receiptId":"${receiptId}"}`

        return requester.get('appdata', endpoint, 'kinvey');
    }

    function addEntry(type, qty, price, receiptId) {
        let entryData = {
            type,
            qty,
            price,
            receiptId
        };

        return requester.post('appdata', 'entries', 'kinvey', entryData);
    }

    function deleteEntry(entryId) {
        return requester.remove('appdata', `entries/${entryId}`, 'kinvey');
    }

    return {
        getEntriesByReceiptId,
        addEntry,
        deleteEntry
    }
})()