$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 
    template.defaults.imports.dataFormnat = function(data) {
        const dt = new Date(data)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + '-' + ' ' + hh + ':' + mm + ':' + ss
    }

    // 
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 id
        state: '' // 文章的状态
    }

    initTable()
    initCate()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                    // 
                renderPage(res.total)
            }
        })
    }

    // 
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 
                var htmlStr = template('tpl-cate', res)
                console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            // 
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 
        q.cate_id = cate_id
        q.state = state
            // 
        initTable()
    })

    // 
    function renderPage(total) {
        // 
        laypage.render({
            elem: 'pageBox', //
            count: total, //
            limit: q.pagesize, //
            curr: q.pagenum, // 
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 
            // 
            // 
            // 
            jump: function(obj, frist) {
                // 
                // 
                // 
                console.log(obj.curr);
                // 
                // 
                q.pagenum = obj.curr
                    // 
                q.pagesize = obj.limit
                    // 
                    // initTable()
                if (!frist) {
                    initTable()
                }
            }
        })
    }

    // 
    $('tbody').on('click', '.btn-delete', function() {
        // 
        var len = $('.btn-delete').length
        console.log(len);
        // 
        var id = $(this).attr('data-id')
            // 
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                        // 
                        // 
                        // 
                        // 
                    if (len === 1) {
                        // 
                        // 
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })
})