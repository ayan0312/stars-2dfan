$(document).ready(function () {
    function getPath() {
        $.ajax({
            url: 'http://localhost:3000/path',
            type: 'GET',
            success: function (result) {
                setPath(result.path)
            }
        })
    }

    if (localStorage.getItem('path')) {
        setPath(localStorage.getItem('path'))
    }

    getPath()

    function setPath(path) {
        $('#pathDiv')
            .removeClass('is-empty')
            .addClass('is-focused')
        localStorage.setItem('path', path)
        $('#localPath').val(path)
    }

    function getFormValue() {
        var web2dfan = $('#web2dfan').val() || ''
        var saveType = $('#saveType').val() || ''
        var isSaveTopic = $('#isSaveTopic').is(':checked')
        var remarks = $('#remarks').val() || ''
        var localPath = $('#localPath').val() || ''
        return {
            url: web2dfan,
            saveType: saveType,
            saveTopic: isSaveTopic,
            remark: remarks,
            path: localPath
        }
    }


    function verify(data) {
        if (data.url === '') {
            alert('请填写URL')
            return false
        } else if (data.saveType === '') {
            alert('请填写保存类型')
            return false
        } else if (data.path === '') {
            alert('本地存储位置不能为空')
            return false
        }
        return true
    }

    var submit = $('#submit')

    submit.click(function () {
        var data = getFormValue()
        if (!verify(data)) return
        localStorage.setItem('path', data.path)
        submit.attr('disabled', 'disabled')
        $.ajax({
            url: 'http://localhost:3000/stars',
            type: 'GET',
            data: data,
            success: function (result) {
                console.log(result)
                submit.removeAttr("disabled")
                $('#searchImage').attr('src', result.image.path + result.image.filename)
            }
        })
    })

    $("p").click(function () {
        $(this).hide()
    })

})