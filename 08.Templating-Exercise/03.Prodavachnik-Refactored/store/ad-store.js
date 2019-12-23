(function () {
    class Ad {
        constructor(title, publisher, description, price, datePublished) {
            this.Title = title
            this.Publisher = publisher
            this.Description = description
            this.Price = price
            this.Date = datePublished
        }
    }

    let ads = [
        new Ad('linkRegister', 'Register'),
    ]
    window.ads = ads
})()