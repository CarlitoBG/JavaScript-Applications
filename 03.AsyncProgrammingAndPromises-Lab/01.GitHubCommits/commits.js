function loadCommits() {
    let commitsList = $('#commits')
    let username = $('#username').val()
    let repo = $('#repo').val()
    let url = `https://api.github.com/repos/${username}/${repo}/commits`

    commitsList.empty()

    $.get(url)
        .then(displayCommits)
        .catch(handleError)
    
    function displayCommits(commits) {
        for (let obj of commits) {
            let li = $('<li>').text(`${obj.commit.author.name}: ${obj.commit.message}`)
            commitsList.append(li)
        }
    }
    
    function handleError(err) {
        let li = $('<li>').text(`Error: ${err.status} (${err.statusText})`)
        commitsList.append(li)
    }
}