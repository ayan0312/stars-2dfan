var LOCALHOST = 'http://localhost:3000'

function getSubjects(page, callback) {
    $.ajax({
        url: `${LOCALHOST}/subjects/${page}`,
        dataType: 'json',
        success: function (result) {
            callback(result)
        }
    })
}

function getRemarkSubjects(page, callback) {
    $.ajax({
        url: `${LOCALHOST}/remark/${page}`,
        dataType: 'json',
        success: function (result) {
            callback(result)
        }
    })
}

function getTopic(_id, callback) {
    $.ajax({
        type: 'GET',
        url: `${LOCALHOST}/topic/subject`,
        data: {
            id: _id
        },
        dataType: 'json',
        success: function (result) {
            callback(result)
        }
    })
}

function preLoadTopic(id) {
    getTopic(id, function (data) {
        var topic = $(document).data(`topic_${id}`)
        if (!topic) {
            $(document).data(`topic_${id}`, data.data)
            console.log(`topic preload success(_id):${id.substr(0, 9)}`)
        }
    })
}

function updateRemark(msg, _id, callback) {
    $.ajax({
        type: 'POST',
        url: `${LOCALHOST}/update/remark`,
        data: {
            message: msg,
            id: _id
        },
        dataType: 'json',
        success: function (result) {
            callback(result)
        }
    })
}

function getAllpage(callback) {
    $.ajax({
        url: `${LOCALHOST}/allpage`,
        dataType: 'json',
        success: function (result) {
            callback(result)
        }
    })
}

function findTypes(type, callback) {
    $.ajax({
        url: `${LOCALHOST}/find/search`,
        data: type,
        dataType: 'json',
        success: function (result) {
            callback(result)
        }
    })
}

function collectQuery(URL, remark, callback) {
    $.ajax({
        type: 'POST',
        url: `${LOCALHOST}/collect/query`,
        data: {
            URL,
            remark
        },
        dataType: 'json',
        success: function (result) {
            callback(result)
        }
    })
}

function collectInsert(data, callback) {
    $.ajax({
        type: 'POST',
        url: `${LOCALHOST}/collect/insert`,
        data:{
            data:data
        },
        dataType: 'json',
        success: function (result) {
            callback(result)
        }
    })
}