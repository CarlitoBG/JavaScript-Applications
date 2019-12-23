(function () {
    const baseURL = 'https://baas.kinvey.com/appdata/kid_BJyVXshWH/students'
    const username = 'guest'
    const password = 'guest'
    const base64auth = btoa(username + ':' + password)
    const authHeaders = {
        'Authorization': 'Basic ' + base64auth,
        'Content-type': 'application/json'
    }

    let createBtn = $('#btnCreate')
    createBtn.click(createStudent)

    loadAllStudents()

    function createStudent() {
        let studentObj = {
            ID: +$('#studentId').val(),
            FirstName: $('#firstName').val(),
            LastName: $('#lastName').val(),
            FacultyNumber: $('#facultyNumber').val(),
            Grade: +$('#grade').val()
        }

        $.post({
            url: baseURL,
            headers: authHeaders,
            data: JSON.stringify(studentObj),
            success: loadAllStudents,
            error: handleError
        })
    }

    function loadAllStudents() {
        $.get({
            url: baseURL,
            headers: authHeaders,
            success: displayStudents,
            error: handleError
        })
    }

    function displayStudents(data) {
        let orderedStudents = data.sort((a, b) => a.ID - b.ID)

        let table = $('#results')
        table.find("tr").filter(row => row !== 0).remove()

        for (let student of orderedStudents) {
            let tableRow = $('<tr>')
            tableRow
                .append($('<th>').text(student.ID))
                .append($('<th>').text(student.FirstName))
                .append($('<th>').text(student.LastName))
                .append($('<th>').text(student.FacultyNumber))
                .append($('<th>').text(student.Grade))

            table.append(tableRow)
        }
    }

    function handleError() {
        $('#results').append($('<tr>').text('ERROR'))
    }
})()