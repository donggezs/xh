let $ = window.$;
let echarts = window.echarts
let layui = window.layui
let plugin = null
let isLogin = false
let is_use = 0
let timer = null
let loginType = "pass"

let is_manage = 0


$(function (){

    let yxTelPhone = localStorage.getItem("yxTelPhone")
    let yxPassword = localStorage.getItem("yxPassword")

    if(yxTelPhone && yxPassword){
        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/tb/user/login",
            data: {
                telephone: yxTelPhone,
                password: yxPassword,
            },
            success : function(res) {
                if(res.code == 0){
                    isLogin = true
                    clearInterval(timer)
                    sessionStorage.setItem('yxToken', res.data.token)

                    is_manage = res.data.is_manage
                    
                    if(is_manage == 1){ // 万能
                        is_use = 1
                    }else{
                        is_use = res.data.plugin[1].is_use
                    }

                    $.ajax({
                        type : "POST",
                        url : window.baseUrl + "/plugin/user/info",
                        headers: {
                            Authorization: res.data.token
                        },
                        success : function(res) {
                            window.yxUser = res.data.user
                            window.yxSetting = res.data.setting
                        }
                    })
                }else{
                    isLogin = false
                }
            },
            error: function (e) {
                
            }
        })
    }

    

    $("body").on("click", ".yx-login-btn-dl", function(){
        if(!$(".yx_login_name").val()){
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('请输入手机号码');
            });
            return
        }
        if(!$(".yx_login_password").val()){
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('请输入登录密码');
            });
            return
        }
        loginAjax($(".yx_login_name").val(),$(".yx_login_password").val())
    })

    function loginAjax(name, pass){
        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/tb/user/login",
            data: {
                telephone: name,
                password: pass,
            },
            success : function(res) {
                if(res.code == 0){
                    localStorage.setItem("yxTelPhone", $(".yx_login_name").val())
                    localStorage.setItem("yxPassword", $(".yx_login_password").val())
                    isLogin = true
                    clearInterval(timer)
                    sessionStorage.setItem('yxToken', res.data.token)

                    $.ajax({
                        type : "POST",
                        url : window.baseUrl + "/plugin/user/info",
                        headers: {
                            Authorization: res.data.token
                        },
                        success : function(res) {
                            window.yxUser = res.data.user
                            window.yxSetting = res.data.setting
                        }
                    })
                    
                    layui.use('layer', function () {
                        var layer = layui.layer;

                        layer.close(layer.index)
                        layer.msg("登录成功")
                    })

                    if(is_manage == 1){ // 万能
                        is_use = 1
                    }else{
                        is_use = res.data.plugin[1].is_use
                    }


                    // plugin = res.data.plugin
                    
                    // plugin.map(v=>{
                    //     if(v.type == 2){
                    //         tmall = v.is_use == 0 ? true : false
                    //     }
                    // })
                } else if(res.code == 2){
                    layui.use('layer', function () {
                        var layer = layui.layer;

                        layer.close(layer.index)
                        layer.msg(res.error)
                    })
                    isLogin = false

                    window.open(`https://www.zhaidh.cn/`, "_blank")
                }else{
                    layui.use('layer', function () {
                        var layer = layui.layer;

                        layer.close(layer.index)
                        layer.msg(res.error)
                    })
                    isLogin = false
                }
            },
            error: function (e) {
                
            }
        })
    }

    setTimeout(()=>{
        $("#detail,#J_Market,.tb-header-search,.tb-tabbar-wrap,#bd .sub-wrap,.tb-header-market, .tb-header-search,#J_IdsSegments,.tb-header-market-hd,.tb-header-search,.tb-desc-segments-list-sticky,.tb-vertical-desc-segments-list").css({
            zIndex: 9999
        })
    
        $(".tb-header-market, .tb-header-market-hd,.site-nav,.tb-toolbar").css({
            zIndex: 33
        })
    }, 2000)
    

    $("body").on("click", '.yx_logout_label', function(){
        layui.use('layer', function () {
            var layer = layui.layer;
            
            layer.close(layer.index)
            layer.msg("已注销登录")
        })
        isLogin = false
        localStorage.removeItem('yxTelPhone')
        localStorage.removeItem('yxPassword')
        sessionStorage.removeItem('yxToken')

    })
})

function login(){
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.closeAll()
        layer.open({
            type: 1,
            area: ['800px', '400px'],
            shade: false,
            title: false, //不显示标题
            content: $('.yx-login'), //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
            cancel: function () {
                loginType = 'pass'
            }
        });
    })
}

$("body").append("<link rel='stylesheet' href='https://www.zhaidh.cn/xh/assets/css/common.css'>");
$("body").append("<link rel='stylesheet' href='https://www.zhaidh.cn/xh/assets/layer/theme/default/layer.css?v=3.1.1'>");
$("body").append("<link rel='stylesheet' href='https://www.zhaidh.cn/xh/assets/layui/css/layui.css'>");
$("body").append("<div id='yx-loading'><img src='https://www.zhaidh.cn/xh/assets/images/loading.png' class='loading-img' /></div>")


const script = document.createElement("script");
script.charset = "UTF-8";
script.src = "https://www.zhaidh.cn/xh/assets/jszip.min.js";
document.documentElement.appendChild(script);

const script1 = document.createElement("script");
script1.charset = "UTF-8";
script1.src = "https://www.zhaidh.cn/xh/assets/FileSaver.js";
document.documentElement.appendChild(script1);


let plugin_name = ""
// 前台分类弹出
$.ajax({
    type : "POST",
    url : window.baseUrl + "/plugin/setting",
    success : function(res) {
        window.yxInfo = res.data
        plugin_name = res.data.plugin_name
        let yingxiao = `<div id='yx-yy'>
        <div id='yx'>
        <img src='https://www.zhaidh.cn/xh/assets/images/reduce.png' alt='' class='yx-off'>
        <img src='${ res.data.logo }' alt='' class='yx-logo'>
        <p class='yx-name'>${ res.data.plugin_name }</p>
        <div class='yx-category'>
        <div class='yx-item' id='yx-sku'>热卖SKU分析</div>
        <div class='yx-item' id='yx-comment-xiu'>评论买家秀采集</div>
        <div class='yx-item' id='yx-download-img-video'>宝贝图片下载</div>
        <div class='yx-item' id='yx-wendajia'>采集问大家</div>
        <div class='yx-item' id='shopTesting'>宝贝正常检测</div>
        <div class='yx-item' id='history_search'>历史价格查询</div>
        <div class='yx-item' id="share">推广分享</div>
        <div class='yx-item' id="yx-userInfo">用户信息</div>
        <div class='yx-item' id='yx-help'>使用帮助</div>
        </div>
        <div class='yx-version'>插件版本：v1.0.0</div>
        </div>
        <div class='yx-toggle'>展开</div>
        </div>`
        $("body").append(yingxiao)


        $.ajax({
            type : "POST",
            url : window.baseUrl + "/auth/open/login",
            data: {
                oauth_type: "we-chat"
            },
            success : function(res) {
                let url = res.data.url
                let scan_type = res.data.scan_type

                $("body").append(`
                    <div class="yx-login">
                        <div class="yx-type-login">
                            <img id="yx-pass-type" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAMqklEQVR4Xu2dMYwdRxnH/4OJRAERIh0RLqgowKaIYpAx2A0piISREpm0pLh3ICyQCLZEpNgSkRyIBEoE966AFiIXOBIUrmxIrMQORRIoqCiCko6ADAUSJIPeu+d3PvvsmW/ne7Ozt7+TolP8vvlm9/fN783O7u1u0C4/caoTko4o6IiiDuwWw7/tSuC6pFcU9ersd1jXxRqc4oYekvR5BX1u/lu6t0a/e6KPoDcV9ZKkl8JEL9y6T+Hmf4ib2q+oc5Ie2xM73/dOBD0d1vTkKjcjbuqHivrBKvsYUe5fKeh0WNNbN/Z5KUjc0BkFPTUiGPV2NepQWNc1zw7jhh5U0FXPnORaEAg6E9Z0dvZ/c0HiVAclvQ6glRF4N0x0n2f2ONXfJX3MMye5dhD4bJjojRuCvCzpMIBWSuD5MNFJjx7iVM9J+rZHLnLckcCVMNEXQpzqEUnnAVWBwD26Pzyud0p6ir/Qx/VfvV2Sg7bZBB6dCTJblJ/KbkJgCYHjYaIXSxLEqb4q6UJJDtpmE3hmJshrkh7IbkJgCYFnw0RPlCSIU/1Y0vdKctA2m8AfZ4LE7HACSwlcDhMdK0kSp7ok6WhJDtrmE0CQfFYekQjiQbFiDgSpCFsSgtTlXdwbghQjNCVAEBOu/oMRpG4NEKQu7+LeEKQYoSkBgphw9R+MIHVrgCB1eRf3hiDFCE0JEMSEq/9gD0Eu978b1bag9PpDK4JQs8wh4yJI6cWvzG3tPczhomoTgoTJ1l9x7/Ufj4uqCGIYJQhigNVAKIJULgKCVAZe2B2CFAK0NkcQK7F+4xGkMn8EqQy8sDsEKQRobY4gVmL9xiNIZf4IUhl4YXcIUgjQ2hxBrMT6jUeQyvwRpDLwwu4QpBCgtTmCWIn1G48glfkjSGXghd0hSCFAa3MEsRLrNx5BKvNHkMrAC7tDkEKA1uYIYiXWbzyCVOaPIJWBF3aHIIUArc0RxEqs3/g9I8hiR1ZLM+psWFfRjUIIslWiuKGjNV6VUXqf0V4TpPRuvbsLFnUMQbYQld4wtRBk9oTHVf60cXPZXvlWTFYKQZaIECQ5WrZZIUg+rL3CCkHya97ELbcex4rJXWYGYQZJDpLbAxDEAI0ZZMcinTVI5thpYjGV3FZmEGaQ5CBhBuE0L2exTJpwiGXAxSEWh1iG4bIM5RArn1oTrDiLlV8wZpB8VrP3yZe+rg5B8nm3wWqvFD3JnUU6i/TkIGGRziKdRbpJEw6xDLj2ymzLGiS/6AiSz4o1yIIVf6xoGDSDeXMraxDWILZxPY9mBjFA4xCL6yCG4cJ1kA6w2jh1WfgCHQ6xbJVvoujJTeYQi0Os5CDhNC+neTnNa9KENYgBF2sQ1iCG4cIapAOsJg5HuQ6SXzlmkHxWXAfhOohhtGyHNvGtmNxyFuks0pODhEU6i3QW6SZN2jjEmj2IrMIPz8XaguyyBhlGvWb3zReNrSYEqcDapQvOYrlgrJbE42k5CGIoF4IYYDUQiiCVi4AglYEXdocghQCtzRHESqzfeASpzB9BKgMv7A5BCgFamyOIlVi/8QhSmT+CVAZe2B2CFAK0NkcQK7F+4xGkMn8EqQy8sDsEKQRobY4gVmL9xiNIZf4IUhl4YXcIUgjQ2hxBrMT6jUeQyvwRpDLwwu4QpBCgtTmCWIn1G48glfkjSGXghd0hSCFAa3MEsRLrN74VQfqlMKzeh3F78rCYrnRrPe4HWekG7rHkCDKwgiJI3YIhSF3exb0hSDFCUwIEMeHqPxhB6tYAQeryLu4NQYoRmhIgiAlX/8EIUrcGCFKXd3FvCFKM0JQAQUy4+g+eCfIPSR/tf1NGsQUXwkRfK9nTONVvJB0vyUHbbAL/nAkC8GxehYHv67vhm/ppSZb4c31HH9BPSnLQNpvAhZkgpySdy25CYAmBL4WJ/lCSIE71RUm/L8lB22wCp0Pc1JcVdTG7CYFdCbyt9/Sp8C39u2uCWbv4M31Y+/QXSfeX5KFtBoGgh8Ic+lS/lnQiowkhXQkEnQpr+lHX5je3i5v6vqKe8chFjjsSeCFM9PW5IAtJIrBWRCDozbCmg57Z46beUNQBz5zk2iZw4wn424Js6jOK+q2k/YByJfC7MNHDrhm3v9Rm9frKKnKPOOdbCno4rOlPMwZLQW6aSVi0+4yOvyrodFjTeZ90u2eJm3pUcX6S5ZOr7GckuU+Hyc5D19sEmR9u/VKf0P90WHH+36dHAsdjN/+lqKvap6v6j66Fk7rukTSVIz6ne/UhPaj3dEhBhyR9JNWGzxcEgv6soCv6oK6Eb+hvt3LZVRDgQQACWwQQhJEAgbsQQBCGBwQQhDEAgW4EmEG6caPVSAggyEgKzW52I4Ag3bjRaiQEEGQkhWY3uxFAkG7caDUSAggykkKzm90IIEg3brQaCQEEGUmh2c1uBBCkGzdajYQAgoyk0OxmNwII0o0brUZCAEFGUmh2sxsBbpjqxu1OrVZ+w9TirUm+W31rtqizYV2XV9tJefYaLLjltrxOd8qwkltuPV4rltzlqGMDEWTlDxrhoQ3J0VIc4PrQBgTZrofDOyOTxeWxP0lEDgGOj/1BkB4E4cFxDhKkUjg9OA5BKgvCo0dTI9vtc59Hj051SdJRt63aLRFrkCUVHl690pF2W3KPh1cjyAJrlTUIrz+oaIjH6w+YQZYFqyUIL9Cp54jHC3SYQSrPICs/l1xv/DXf0zBewcYaZMcaBEHqeYUgjqxrHWIhiGPREqkQxJE1gjjCbCQVgjgWAkEcYTaSCkEcC4EgjjAbSYUgjoVAEEeYjaRCEMdCIIgjzEZSIYhjIYYiSHHRHZmtNJVDQYpZ8ceK2yV2qEdyvMz+Fqv0NG9x0ZNb2UhAC6wQBEEa0eH2zUCQtkrjUI/kDjGDJBG5fmMVz7bMIK71SFYfQZKIXAuCIAbeqVBmkBShyp87FARBHGvmUI/k1jCDJBExgxgQVQ1FkKq40505FIQZJI05O8KhHsm+mEGSiBqbQTaM96Pv63Aa/32dMWDpFurwcLpoZdFhSxHEAM3hG6t4BjFsbudQzpRto0MQwzBCEAOsVOhA7lpEkFQhb/ocQQywUqEIkiI0vM8RxLFmCOIIs5FUCOJYCARxhNlIKgRxLASCOMJsJBWCOBYCQfJh1jifPdua0ndeIEh+TZORCJJEtAwYynl3BMmvaTISQZKIECQfUdXIoXxh1YDSxHWQoRSEGcRxSDKD5MNEkHxWNSKHUo8aLJhBDJSZQQywUqHMIClC258P5RsLQfJrmoxEkCQiFun5iKpGDuULqwYUDrEMlJlBDLBSocwgKUIcYuUTqhvJDLLNmxnEMPaYQQywUqHMIClCzCD5hOpGMoMwg3QaccwgnbDt3ogZJB/mUL6xECS/pslIBEki4jRvPqKqkUP5wqoBhUW6gTIziAFWKpQZJEWIRXo+obqRzCAs0juNOGaQTthWtkhfiOy4Uben4hDLgBdBDLBSoQ6HWA71SG2lECSJaMeh4CjexjWUQywEMQzeZGgb31g8evRGodqoR3LYMIMkETGDGBDlhyKIgdVUlyTjU8vz029FtlEQZhBmEOvIlUZ0zIsgCIIgdyGAIAjSWRB7Q0sLjxe2jOSd8iOa0ZMjqIlFenIrGwlwOK3IDMIM0shoXsFmIIgj1DZOmiR3iBkkiYjTvAZE+aEIks9qKJHMII6VQhBHmI2kQhDHQiCII8xGUiGIYyEQxBFmI6kQxLEQCOIIs5FUCOJYCARxhNlIqhYEGcpFvFTJquxHaiMyPuc0bwak5bWtBq6kVxlYDt/uKaxV9iO1ERmfI0gGJAQxQMoMRZBMUEMK4xDLr1oI4seymUwI4lcKBPFj2UwmBPErBYL4sWwmE4L4lQJB/Fg2kwlB/EoxKkH8sDWf6WjhFhbfD1JlYHGad1lmj9O8hWNmVM0RZFHuKqI7DC0EcYBoSIEgCGIYLuMLRRAEGd+oN+wxgiCIYbiMLxRBEGR8o96wxwiCIIbhMr5QBEGQ8Y16wx4jyAAFeU3SA4YiE9qdwLNhoie6Nx/Oc4xT+zik6yDnJJ1K7RCfuxA4HiZ6sSRTlYHFlfRliWYXCh+RdL6kaLTNJHCP7g+P653M6F3DEKSEnr1tmDWJU70s6bC9OS0MBJ4PE500xCNIKSyH9jcEOSjpdYd8pNidwLthovs84DCDeFDMzzEXZD6LbOiMgp7Kb0pkNoGoQ2Fd17Lj7xKIIB4U83MsBZlLsqn9ipot2h/LT0HkHQkEPR3W9KQnIQTxpJnOtUOQ5Wwy1QlJRxR0RFEH0mmIWBC4LukVRb06+x3WddGbDIJ4E717vv8DDY57DbSBBAEAAAAASUVORK5CYII=">
                            <img id="yx-qrcode-type" src="data:image/png;base64,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">
                        </div>
                        <div class='yx-login-box'>
                            <div class="yx-login-title">${plugin_name}登录</div>
                            <div class="yx-login-tab yx-tab">
                                <input type="text" class="yx-inp1 yx_login_name" placeholder="请输入手机号码"/>
                                <input type="password" class="yx-inp1 yx_login_password" placeholder="请输入登录密码"/>
                                <div class="yx-pass-flex">
                                    <p class="yx-pass">还没注册? <a href="https://www.zhaidh.cn/register" target="_blank">去注册</a></p>
                                    <p class="yx-pass flex1">忘记密码? <a href="https://www.zhaidh.cn/forget" target="_blank">找回密码</a></p>
                                </div>
                                <div class="yx-login-btn-dl">登录</div>
                            </div>
                        </div>
                        <div class='yx-login-box' style="display:none">
                            <div class="yx-login-title">${plugin_name}登录</div>
                            <div class="yx-qrcode"><img src='${url}' /></div>
                            <div class="yx-login-tab yx-tab">
                                <div class="yx-pass-flex">
                                    <p class="yx-pass">还没注册? <a href="https://www.zhaidh.cn/register" target="_blank">去注册</a></p>
                                    <p class="yx-pass flex1">忘记密码? <a href="https://www.zhaidh.cn/forget" target="_blank">找回密码</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                `)

                if(!isLogin){
                    let timer = setInterval(function(){
                        if(loginType != 'qrcode'){
                            return
                        }
                        $.ajax({
                            type : "POST",
                            url : window.baseUrl + "/auth/open/login/check",
                            data: {
                                oauth_type: "we-chat",
                                scan_type: scan_type,
                                check_plugin: 1
                            },
                            success : function(res) {
                                if(res.data.status != 'waiting'){
                                    clearInterval(timer)
                                    layui.use('layer', function () {
                                        var layer = layui.layer;
                                        layer.msg(res.data.message);
                                    })

                                    if(res.data.status == 'done'){
                                        layui.use('layer', function () {
                                            var layer = layui.layer;
                                            layer.closeAll()
                                        })
                                        clearInterval(timer)
        
                                        
                                        isLogin = true
                                        sessionStorage.setItem('yxToken', res.data.token)

                                        if(is_manage == 1){ // 万能
                                            is_use = 1
                                        }else{
                                            is_use = res.data.plugin[1].is_use
                                        }
        
                                        $.ajax({
                                            type : "POST",
                                            url : window.baseUrl + "/plugin/user/info",
                                            headers: {
                                                Authorization: res.data.token
                                            },
                                            success : function(res) {
                                                window.yxUser = res.data.user
                                                window.yxSetting = res.data.setting
                                            }
                                        })
                                        
                                        layui.use('layer', function () {
                                            var layer = layui.layer;
        
                                            layer.close(layer.index)
                                            layer.msg("登录成功")
                                        })
        
                                    }
                                }
                            }
                        })
                    }, 1000)
                }

            }
        })

    },
    error: function (e) {
        
    }
})

$("body").on("click", '#yx-pass-type',function(){
    $(this).hide()
    $('#yx-qrcode-type').show()
    $(".yx-login-box").hide().eq(1).show()
    loginType = 'qrcode'
})

$("body").on("click", '#yx-qrcode-type',function(){
    $("#yx-pass-type").show()
    $(this).hide()
    $(".yx-login-box").hide().eq(0).show()
    loginType = 'pass'
})




$("body").on("click", '.gohome', function(){
    console.log("gohome")
    window.open(`https://www.zhaidh.cn/`, "_blank")
})

$("body").on("click", '#version', function(){
    window.open(`https://www.zhaidh.cn/user/version`, "_blank")
})

$("body").on("click", '#share', function(){
    window.open(`https://www.zhaidh.cn/user/share`, "_blank")
})

$("body").on("click", '#yx-help', function(){
    window.open(`https://www.zhaidh.cn/help/0 `, "_blank")
})

$("body").on("click", '#history_search', function(){
    if(!isLogin){
        login()
        return
    }

    if(is_use == 0){
        isUse()
        return
    }

    window.open(`http://detail.tmallvvv.com/item.htm?id=${window.g_config.itemId}`)
})

function isUse(){
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
            title: "温馨提示",
            btn: ['确定','取消'] //按钮
        }, function(){
            
            layer.close(layer.index)
        }, function(){
            layer.close(layer.index)
        });
    })
}


$("body").on("click", ".yx_user_avatar_name,.yx_user_avatar_ava", function () { 
    window.open("https://www.zhaidh.cn/user/version", '_blank')
})

$("body").on("click", "#yx-userInfo", function(){
    if(!isLogin){
        login()
        return
    }

    let user = window.yxUser
    
    user.sex
    let sexstr = ""
    switch(user.sex) {
        case 1:
            sexstr = "男"
           break;
        case 2:
            sexstr = "女"
           break;
        default:
            sexstr = "保密"
   } 

   let html = ''
   user.full_shop_name.map(v=>{
    html+="<div class='qas'>"+ v +"</div>"
   })

    let setting = window.yxSetting
    layui.use('layer', function () {
        var layer = layui.layer;
        var index = layer.open();
        layer.close(index)
        layer.closeAll()
        layer.open({
            type: 1,
            title: false,
            closeBtn: 1,
            area: ['800px', '630px'],
            skin: 'yourclass',
            content: `<div class='yx-userInfo1'>
                <p class='yx-user-tit'>用户信息</p>
                <div class="yx_user_avatar">
                    <img src="${ user.avatar_url }" class="yx_user_avatar_ava"/>
                    <div class="yx_logout">
                        <span class='yx_nickname yx_user_avatar_name'>${ user.nickname }</span>
                        <span class='yx_logout_label'>退出登录</span>
                    </div>
                </div>
                <div class='yx-user-flex'>
                    <div class='yx-user-dd'>
                        <div class='yx-top-content'>
                            <ul>
                                <li>
                                    <span class='yx-t-label'>手机:</span>
                                    <span class='val'>${user.telephone}</span>
                                </li>
                                <li>
                                    <span class='yx-t-label'>姓名:</span>
                                    <span class='val'>${user.real_name}</span>
                                </li>
                                <li>
                                    <span class='yx-t-label'>性别:</span>
                                    <span class='val'>${ sexstr }</span>
                                </li>
                                <li>
                                    <span class='yx-t-label'>经营类目:</span>
                                    <span class='val'>${ user.business_category }</span>
                                </li>
                                <li>
                                    <span class='yx-t-label'>店铺账号:</span>
                                    <div class='val relative'>
                                        ${user.shop_name}
                                        <div class='yx-gd'>
                                            <img src="https://www.zhaidh.cn/xh/assets/images/gd.png" style="width:20px;height:20px"/>
                                            更多
                                            <div class='yx-shop-list'>${ html }</div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <span class='yx-t-label'>微信号:</span>
                                    <span class='val'>${user.wechat}</span>
                                </li>
                                <li>
                                    <span class='yx-t-label'>联系邮箱:</span>
                                    <span class='val'>${user.email}</span>
                                </li>
                                <li>
                                    <span class='yx-t-label'>注册时间:</span>
                                    <span class='val'>${user.create_time}</span>
                                </li>
                            </ul>
                        </div>
                        <div class='v-btn1' id="version">查看我已购买的插件版本</div>
                    </div>
                    <div class='yx-user-dd'>
                        <div class='yx-top-content'>
                            <div class='yx-qr-code'>
                                <div class='yx-qr-flex'>
                                    <img src='${setting.persona_wechat}'>
                                    <p>微信联系负责人</p>
                                </div>
                                <div class='yx-qr-flex'>
                                    <img src='${setting.official_account}'>
                                    <p>公众号实操教程</p>
                                </div>
                            </div>
                            <div class='yx-email-info'>
                                <p><span class='yx-qq'>联系电话：</span><span class='yx-qq1'>${setting.telephone}</span></p>
                                <p><span class='yx-qq'>联系邮箱：</span><span class='yx-qq1'>${setting.email}</span></p>
                                <p><span class='yx-qq'>咨询旺旺：</span><span class='yx-qq1'>${setting.wangwang}</span></p>
                                <p><span class='yx-qq'>联系地址：</span><span class='yx-qq1'>${setting.address}</span></p>
                            </div>
                        </div>
                        <div class='v-btn2' id='yxclear'>清除缓存并刷新</div>
                    </div>
                </div>
            </div>`
        });
    })
})

$("body").on('mouseenter', '.yx-gd', function(){
    $(".yx-shop-list").fadeIn()
})
$("body").on('mouseleave', '.yx-gd', function(){
    $(".yx-shop-list").fadeOut()
})


$("body").on("click", "#yxclear", function(){
    window.location.reload();
})

// 关闭
$('body').on('click', '.yx-off', function () {
    $('#yx').animate({
        left: -200
    }, function () {
        $('.yx-toggle').animate({
            left: 0
        })
    })
})
// 展开
$('body').on('click', '.yx-toggle',function () {
    $('.yx-toggle').animate({
        left: -80
    }, function () {
        $('#yx').animate({
            left: 0
        })
    })
})

// 帖子详情
// https://h5api.m.tmall.com/h5/mtop.taobao.social.ugc.post.detail/2.0/?jsv=2.4.8&appKey=12574478&sign=77e4de87da147ec0224de0d63ac33791&t=1577176730039&api=mtop.taobao.social.ugc.post.detail&v=2.0&ecode=1&type=jsonp&dataType=jsonp&data=%7B%22id%22%3A%22239195950396%22%2C%22params%22%3A%22%7B%5C%22clusterId%5C%22%3A%5C%22null%5C%22%7D%22%7D&callback=jQuery33105385093447856264_1577176382040&_=1577176382041
// jsv: 2.4.8
// appKey: 12574478
// sign: 063f7310ecac74e97858685645af0498
// t: 1577176730034
// api: mtop.taobao.social.ugc.post.detail
// v: 2.0
// ecode: 1
// type: jsonp
// dataType: jsonp
// data: {"id":"246880068421","params":"{\"clusterId\":\"null\"}"}
// callback: jQuery33105385093447856264_1577176382036
// _: 1577176382039

// https://h5api.m.tmall.com/h5/mtop.taobao.social.ugc.post.detail/2.0/?jsv=2.4.8&appKey=12574478&sign=0fabe4e89c7af9cfcfddb8b3b268b205&t=1577178711078&api=mtop.taobao.social.ugc.post.detail&v=2.0&ecode=1&type=jsonp&dataType=jsonp&data=%7B%22id%22%3A%22248122745945%22%2C%22params%22%3A%22%7B%5C%22clusterId%5C%22%3A%5C%22null%5C%22%7D%22%7D&callback=jQuery33108782693493442284_1577178675615&_=1577178675618

// 采集问大家
let pieTableRenderWen = null
let series_wen = []
$("body").on("click", '#yx-wendajia',function () {
    if(!isLogin){
        login()
        return
    }

    if(is_use == 0){
        isUse()
        return
    }

    $("#yx-loading").fadeIn()

    let parse_cookie = getCookie('_m_h5_tk');
    let t = new Date().getTime()
    let data = JSON.stringify({"cursor":"1","pageNum": 1,"pageId":24501,"env":1,"bizVersion":0,"params":"{\"refId\":\""+window.g_config.itemId+"\",\"namespace\":1,\"pageNum\":1,\"pageSize\":50}"})
    
    let sign = h(parse_cookie.split("_")[0] + '&' + t + '&' + 12574478 + '&' + data)

    $.ajax({
        url: "https://h5api.m.taobao.com/h5/mtop.taobao.social.feed.aggregate/1.0/?jsv=2.4.8&appKey=12574478&sign="+sign+"&t="+t+"&api=mtop.taobao.social.feed.aggregate&v=1.0&ecode=1&type=jsonp&dataType=jsonp&data="+encodeURIComponent(data),
        dataType: "jsonp",
        type: "jsonp",
        jsonpCallback: 'mtopjsonp1'
    })

    let that = this


    
    let tag = []
    window.mtopjsonp1 = function (v) {
        if (v.data.list.length == 0) {
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.msg('问大家暂无数据');
            })
            $("#yx-loading").fadeOut()
            return
        }
        
        let allList = []
        v.data.list.map(v => { 
            v.map(j => { 
                if (j.id !=0 ) { 
                    allList.push({
                        id: j.id,
                        clusterId: j.clusterId ? j.clusterId : null
                    })
                }
            })
        })

        tag.push(...v.data.questionWords)


        let ListNum = 0
        let similarIdsAll = []
        let aliv = false
        allList.map(v => { 
            let name = 'jsonp' + new Date().getTime()
            let parse_cookie = getCookie('_m_h5_tk');
            let t = new Date().getTime()
            let data = JSON.stringify({"id": v.id,"params":"{\"clusterId\":\""+v.clusterId+"\"}"})

            let sign = h(parse_cookie.split("_")[0] + '&' + t + '&' + 12574478 + '&' + data)

            window[name] = function (val) {
                ListNum++
                if (!val.data.id) {
                    aliv = true
                    
                } else { 
                    similarIdsAll.push({
                        id: val.data.id,
                    })
    
                    val.data.similarIds.map(j => { 
                        similarIdsAll.push({
                            id: j
                        })
                    })
                }
                
                if (ListNum == allList.length) {
                    if (aliv) {
                        layui.use('layer', function () {
                            var layer = layui.layer;
                            layer.open({
                                type: 2,
                                title: "请手动验证完毕后需手动关闭窗口，再重新点击操作按钮",
                                area: ['500px', '350px'],
                                content: `${val.data.url}`
                            });
                        })
                        aliv = false
                        $("#yx-loading").fadeOut()
                        return
                    }
                    
                    var obj = {};
                    let xin = similarIdsAll.reduce(function(item, next) {
                        obj[next.id] ? '' : obj[next.id] = true && item.push(next);
                        return item;
                    }, []);
                    
                    let toNum = 0
                    let aliv1 = false
                    xin.map(p => { 
                        let q_name = 'jsonp' + new Date().getTime()
                        let q_parse_cookie = getCookie('_m_h5_tk');
                        let q_t = new Date().getTime()
                        let q_data = JSON.stringify({"id": p.id,"params":"{\"clusterId\":\""+null+"\"}"})

                        let q_sign = h(q_parse_cookie.split("_")[0] + '&' + q_t + '&' + 12574478 + '&' + q_data)
                        $.ajax({
                            url: "https://h5api.m.taobao.com/h5/mtop.taobao.social.ugc.post.detail/2.0/?jsv=2.4.8&appKey=12574478&sign="+q_sign+"&t="+q_t+"&api=mtop.taobao.social.ugc.post.detail&v=2.0&ecode=1&type=jsonp&dataType=jsonp&data="+encodeURIComponent(q_data),
                            dataType: "jsonp",
                            type: "jsonp",
                            jsonpCallback: q_name
                        })
                        
                        window[q_name] = function (s) {
                            toNum++
                            if (!s.data.title) {
                                aliv1 = true
                            } else { 
                                series_wen.push({
                                    title: s.data.title,
                                    userLogo: s.data.userLogo,
                                    userNick: s.data.userNick,
                                    gmtCreate: $.formatDateTime(parseInt(s.data.gmtCreate)),
                                    list: s.data.list.list,
                                    id: s.data.id
                                })
                            }

                            if (toNum == xin.length) { 
                                if (aliv1) { 
                                    $("#yx-loading").fadeOut()
                                    layui.use('layer', function () {
                                        var layer = layui.layer;
                                        layer.open({
                                            type: 2,
                                            title: false,
                                            area: ['500px', '350px'],
                                            content: `${s.data.url}`
                                        });
                                    })
                                    aliv1 = false
                                    return
                                }

                                $("#yx-loading").fadeOut()

                                let taghtml = ''
                                tag.map(v => { 
                                    taghtml += '<span>'+v+'</span>'
                                })

                                layui.use('layer', function(){
                                    var layer = layui.layer;
                                
                                    layer.open({
                                        type: 1,
                                        maxmin: true,
                                        move: false,
                                        title: `<div class='yx-caiji-content gohome'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>采集问大家<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                                        area: ['80%', '80%'],
                                        content: `<div class='yx-sku-wen'><div class="yx-tags">${taghtml}</div><div class='yx-operation'><div class='yx-btns'><span class='yx-sp1_5'>下载数据</span><span class='yx-sp2_5'>复制数据</span></div><div class='yx-fr'>搜索<input type='text' id='yx-inp-search4'></div></div><table id='pieTable4' lay-filter='pie'></table></div>`
                                    });
                            
                                });
                                createWenTable(series_wen)
                            }
                        }
                    })

                   

                }
            }
        
            $.ajax({
                url: "https://h5api.m.taobao.com/h5/mtop.taobao.social.ugc.post.detail/2.0/?jsv=2.4.8&appKey=12574478&sign="+sign+"&t="+t+"&api=mtop.taobao.social.ugc.post.detail&v=2.0&ecode=1&type=jsonp&dataType=jsonp&data="+encodeURIComponent(data),
                dataType: "jsonp",
                type: "jsonp",
                jsonpCallback: name
            })

            
        })
        
    }
})


function createWenTable(data) {
    layui.use('table', function(){
        var table = layui.table;
        
        //第一个实例
        pieTableRenderWen = table.render({
          id: "pieList4",
          elem: '#pieTable4',
          title: "采集问大家",
          page: true, //开启分页
          limit: 10,
          limits: [10, 30, 50, 100],
          data: data,
          initSort: {
            field: 'gmtCreate', //排序字段，对应 cols 设定的各字段名
            type: 'desc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
          },
          cols: [[ //表头
            {field: 'gmtCreate', title: '时间', width: 180, sort: true},
            {field: 'title', title: '问题', sort: true, templet: function(d){
                return '<div class="yx-twen"><img src='+ d.userLogo +'><div class="yx-flexs-wen"><p class="yx-nick">'+ d.userNick +'</p><p class="yx-tit">'+ d.title +'</p></div></div>'
            }},
              {
                field: 'userLogo', title: '回答', sort: true, templet: function (d) {
                let li = ''
                      
                d.list.map(v => { 
                    let time = $.formatDateTime(parseInt(v.gmtCreate))
                    li += `<li><img src="${v.userLogo}"><div class="yx-flexs-ans"><p class='yx-ans-p1'><span>${v.userNick}</span>${time}</p><p class='yx-ans-p2'>${v.title}</p></div></li>`
                })
                return `<div class="yx-answer">
                    <ul>
                        ${
                            li
                        }
                    </ul>
                </div>`
            }},
          ]]
        });
    });
}


$("body").on("click", '#shopTesting',function (){
    if(!isLogin){
        login()
        return
    }

    if(is_use == 0){
        isUse()
        return
    }

    let html = `<div class="yx-comment_box" id="sku_yx_comment">
        <p class="yx-test"><img src="https://www.zhaidh.cn/xh/assets/images/success.png"></p>
        <p class="yx-test-tips">该宝贝搜索正常</p>
    </div>`

    layui.use('layer', function () {
        var layer = layui.layer;
        layer.open({
            title: '<span>宝贝正常检测</span>',
            type: 1,
            area: ['500px', '300px'],
            content: html
        });
    })
})

function getCookie(NameOfCookie) {
    if (document.cookie.length > 0) {
        let begin = document.cookie.indexOf(NameOfCookie + "=");
        if (begin !== -1) {
            begin += NameOfCookie.length + 1;
            let end = document.cookie.indexOf(";", begin);
            if (end === -1) end = document.cookie.length;
            return unescape(document.cookie.substring(begin, end));
        }
    }
    return null;
}

function h(a) {
    function b(a, b) {
        return a << b | a >>> 32 - b
    }
    function c(a, b) {
        var c, d, e, f, g;
        return e = 2147483648 & a,
        f = 2147483648 & b,
        c = 1073741824 & a,
        d = 1073741824 & b,
        g = (1073741823 & a) + (1073741823 & b),
        c & d ? 2147483648 ^ g ^ e ^ f : c | d ? 1073741824 & g ? 3221225472 ^ g ^ e ^ f : 1073741824 ^ g ^ e ^ f : g ^ e ^ f
    }
    function d(a, b, c) {
        return a & b | ~a & c
    }
    function e(a, b, c) {
        return a & c | b & ~c
    }
    function f(a, b, c) {
        return a ^ b ^ c
    }
    function g(a, b, c) {
        return b ^ (a | ~c)
    }
    function h(a, e, f, g, h, i, j) {
        return a = c(a, c(c(d(e, f, g), h), j)),
        c(b(a, i), e)
    }
    function i(a, d, f, g, h, i, j) {
        return a = c(a, c(c(e(d, f, g), h), j)),
        c(b(a, i), d)
    }
    function j(a, d, e, g, h, i, j) {
        return a = c(a, c(c(f(d, e, g), h), j)),
        c(b(a, i), d)
    }
    function k(a, d, e, f, h, i, j) {
        return a = c(a, c(c(g(d, e, f), h), j)),
        c(b(a, i), d)
    }
    function l(a) {
        for (var b, c = a.length, d = c + 8, e = (d - d % 64) / 64, f = 16 * (e + 1), g = new Array(f - 1), h = 0, i = 0; c > i; )
            b = (i - i % 4) / 4,
            h = i % 4 * 8,
            g[b] = g[b] | a.charCodeAt(i) << h,
            i++;
        return b = (i - i % 4) / 4,
        h = i % 4 * 8,
        g[b] = g[b] | 128 << h,
        g[f - 2] = c << 3,
        g[f - 1] = c >>> 29,
        g
    }
    function m(a) {
        var b, c, d = "", e = "";
        for (c = 0; 3 >= c; c++)
            b = a >>> 8 * c & 255,
            e = "0" + b.toString(16),
            d += e.substr(e.length - 2, 2);
        return d
    }
    function n(a) {
        a = a.replace(/\r\n/g, "\n");
        for (var b = "", c = 0; c < a.length; c++) {
            var d = a.charCodeAt(c);
            128 > d ? b += String.fromCharCode(d) : d > 127 && 2048 > d ? (b += String.fromCharCode(d >> 6 | 192),
            b += String.fromCharCode(63 & d | 128)) : (b += String.fromCharCode(d >> 12 | 224),
            b += String.fromCharCode(d >> 6 & 63 | 128),
            b += String.fromCharCode(63 & d | 128))
        }
        return b
    }
    var o, p, q, r, s, t, u, v, w, x = [], y = 7, z = 12, A = 17, B = 22, C = 5, D = 9, E = 14, F = 20, G = 4, H = 11, I = 16, J = 23, K = 6, L = 10, M = 15, N = 21;
    for (a = n(a),
    x = l(a),
    t = 1732584193,
    u = 4023233417,
    v = 2562383102,
    w = 271733878,
    o = 0; o < x.length; o += 16)
        p = t,
        q = u,
        r = v,
        s = w,
        t = h(t, u, v, w, x[o + 0], y, 3614090360),
        w = h(w, t, u, v, x[o + 1], z, 3905402710),
        v = h(v, w, t, u, x[o + 2], A, 606105819),
        u = h(u, v, w, t, x[o + 3], B, 3250441966),
        t = h(t, u, v, w, x[o + 4], y, 4118548399),
        w = h(w, t, u, v, x[o + 5], z, 1200080426),
        v = h(v, w, t, u, x[o + 6], A, 2821735955),
        u = h(u, v, w, t, x[o + 7], B, 4249261313),
        t = h(t, u, v, w, x[o + 8], y, 1770035416),
        w = h(w, t, u, v, x[o + 9], z, 2336552879),
        v = h(v, w, t, u, x[o + 10], A, 4294925233),
        u = h(u, v, w, t, x[o + 11], B, 2304563134),
        t = h(t, u, v, w, x[o + 12], y, 1804603682),
        w = h(w, t, u, v, x[o + 13], z, 4254626195),
        v = h(v, w, t, u, x[o + 14], A, 2792965006),
        u = h(u, v, w, t, x[o + 15], B, 1236535329),
        t = i(t, u, v, w, x[o + 1], C, 4129170786),
        w = i(w, t, u, v, x[o + 6], D, 3225465664),
        v = i(v, w, t, u, x[o + 11], E, 643717713),
        u = i(u, v, w, t, x[o + 0], F, 3921069994),
        t = i(t, u, v, w, x[o + 5], C, 3593408605),
        w = i(w, t, u, v, x[o + 10], D, 38016083),
        v = i(v, w, t, u, x[o + 15], E, 3634488961),
        u = i(u, v, w, t, x[o + 4], F, 3889429448),
        t = i(t, u, v, w, x[o + 9], C, 568446438),
        w = i(w, t, u, v, x[o + 14], D, 3275163606),
        v = i(v, w, t, u, x[o + 3], E, 4107603335),
        u = i(u, v, w, t, x[o + 8], F, 1163531501),
        t = i(t, u, v, w, x[o + 13], C, 2850285829),
        w = i(w, t, u, v, x[o + 2], D, 4243563512),
        v = i(v, w, t, u, x[o + 7], E, 1735328473),
        u = i(u, v, w, t, x[o + 12], F, 2368359562),
        t = j(t, u, v, w, x[o + 5], G, 4294588738),
        w = j(w, t, u, v, x[o + 8], H, 2272392833),
        v = j(v, w, t, u, x[o + 11], I, 1839030562),
        u = j(u, v, w, t, x[o + 14], J, 4259657740),
        t = j(t, u, v, w, x[o + 1], G, 2763975236),
        w = j(w, t, u, v, x[o + 4], H, 1272893353),
        v = j(v, w, t, u, x[o + 7], I, 4139469664),
        u = j(u, v, w, t, x[o + 10], J, 3200236656),
        t = j(t, u, v, w, x[o + 13], G, 681279174),
        w = j(w, t, u, v, x[o + 0], H, 3936430074),
        v = j(v, w, t, u, x[o + 3], I, 3572445317),
        u = j(u, v, w, t, x[o + 6], J, 76029189),
        t = j(t, u, v, w, x[o + 9], G, 3654602809),
        w = j(w, t, u, v, x[o + 12], H, 3873151461),
        v = j(v, w, t, u, x[o + 15], I, 530742520),
        u = j(u, v, w, t, x[o + 2], J, 3299628645),
        t = k(t, u, v, w, x[o + 0], K, 4096336452),
        w = k(w, t, u, v, x[o + 7], L, 1126891415),
        v = k(v, w, t, u, x[o + 14], M, 2878612391),
        u = k(u, v, w, t, x[o + 5], N, 4237533241),
        t = k(t, u, v, w, x[o + 12], K, 1700485571),
        w = k(w, t, u, v, x[o + 3], L, 2399980690),
        v = k(v, w, t, u, x[o + 10], M, 4293915773),
        u = k(u, v, w, t, x[o + 1], N, 2240044497),
        t = k(t, u, v, w, x[o + 8], K, 1873313359),
        w = k(w, t, u, v, x[o + 15], L, 4264355552),
        v = k(v, w, t, u, x[o + 6], M, 2734768916),
        u = k(u, v, w, t, x[o + 13], N, 1309151649),
        t = k(t, u, v, w, x[o + 4], K, 4149444226),
        w = k(w, t, u, v, x[o + 11], L, 3174756917),
        v = k(v, w, t, u, x[o + 2], M, 718787259),
        u = k(u, v, w, t, x[o + 9], N, 3951481745),
        t = c(t, p),
        u = c(u, q),
        v = c(v, r),
        w = c(w, s);
    var O = m(t) + m(u) + m(v) + m(w);
    return O.toLowerCase()
}



// 下载图片和视频
let file_content = ""
let file_name = ""
$("body").on("click", "#yx-download-img-video", function () {
    if(!isLogin){
        login()
        return
    }

    if(is_use == 0){
        isUse()
        return
    }

    $("body").append('<div id="yx-download"><p class="yx-tits">正在下载</p><div class="yx-progress"><div class="yx-progress-bar"></div><span class="yx-prog-text">0%</span></div><div class="yx-down-btn" id="yx-down">点击下载</div></div>')
    $('html, body').animate({
        scrollTop: 20000
    }, 6000);
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.open({
            title: "宝贝图片下载",
            type: 1,
            area: ['420px', '240px'],
            content: $("#yx-download")
        });
    })


    file_name = `宝贝图${$.getUrlParam('id')}.zip`
    let total = 0
    $(".yx-tits").html("正在下载")
    $("#yx-down").hide()
    $(".yx-prog-text").html("0%")
    $(".yx-progress-bar").css({ "width": '0%' })

   

    setTimeout(function(){
        // 主图
        let imgAll = []
        let zhutuLen = 0
        $("#J_UlThumb>li:not('#J_VideoThumb')").each(function() { 
            let url = $(this).find("img").eq(0).attr("src")
        
            url = url.replace("50x50", "800x800")
            url = url.replace('_.webp','')
            imgAll.push(url)
            zhutuLen++
        })

        console.log(imgAll)
        
        var zip = new JSZip();//*****创建实例，zip是对象实例
        var len=function(arr){
            var l = 0;
            for(var key in arr){
                l++;
            }
            return l;
        }

        imgAll = imgAll.map(v => {
            if(v.includes("http")){
                return v
            }else{
                return "https:"+v
            }
        })

        // 详情大图
        $("#J_DivItemDesc img").each(function () {
            if($(this).attr("data-ks-lazyload")){
                imgAll.push($(this).attr("data-ks-lazyload"))
            }else{
                imgAll.push($(this).attr("src"))
            }
        })

       

        let zhutuFile = zip.folder("主图");
        let detailFile = zip.folder("详情");

        let detLen = $("#description img").length
        let ziplength = 0
        let errorNum = 0
        let nums = 0

        for(let i=0;i<imgAll.length;i++){
            getBase64ByUrl(imgAll[i], function (dataURL) {
                if (!dataURL) {
                    errorNum = errorNum + 1
                } else { 
                    var img_arr = dataURL.split(',');
                    nums++
                    console.log(nums)
                    if (i < imgAll.length - detLen) {
                        zhutuFile.file(i.toString() + '.jpg', img_arr[1], { base64: true });
                    } else {
                        detailFile.file(i.toString() + '.jpg', img_arr[1], { base64: true });//根据base64数据在压缩包中生成jpg数据
                    }
                }

                

                ziplength = len(zhutuFile.files) - 2 + errorNum;
            
                $(".yx-prog-text").html((Math.floor((ziplength/imgAll.length)*100)) + "%")
                $(".yx-progress-bar").css({ "width": (Math.floor((ziplength/imgAll.length)*100)) + "%"})

              
                if((ziplength)==imgAll.length){//当所有图片都已经生成打包并保存zip
                    $(".yx-tits").html("打包中...")
                    zip.generateAsync({type:"blob"})
                    .then(function (content) {
                        $(".yx-tits").html("打包完成")
                        $(".yx-prog-text").html("100%")
                        $(".yx-progress-bar").css({ "width": '100%' })
                        $("#yx-down").fadeIn()
                        
                        file_content = content
                        
                    });
                }
            });
        }
    },6000)
    
})
$("body").on("click", "#yx-down", function () { 
    saveAs(file_content, file_name);
})


let legend = [], series = [], totalList = []
let legend1 = [], series1 = [], totalList1 = []
let legend2 = [], series2 = [], totalList2 = []

let pieTableRender = null, pieTableRender1 = null, pieTableRender2 = null
let skuTabData = [] // 细分总览数据

let skuLine = []
let skuLineXAxis = []
// 确定评论条件
$("body").on("click", "#yx-confirm-comment", function () {

    legend = []
    series = []
    totalList = []
    legend1 = []
    series1 = []
    totalList1 = []
    legend2 = []
    series2 = []
    totalList2 = []
    pieTableRender = null
    pieTableRender1 = null
    pieTableRender2 = null
    skuTabData = []
    skuLine = []
    skuLineXAxis = []


    let order = $('#sku_yx_comment input[name="order"]:checked').val()
    let type = $('#sku_yx_comment input[name="type"]:checked').val()
    let content = $('#sku_yx_comment input[name="content"]:checked').val()

    let picture = type == 2 ? 1 : 0
    let append = type == 1 ? 1 : 0

    layui.use('layer', function () {
        var layer = layui.layer;
        layer.close(layer.index)
    })

    // picture 图片   0    1
    // order    按时间  1    按默认  3
    // content 有内容  0   1 
    // append 追评   0    1 
    openCommentQuery(picture, order, content, append)
    $("#yx-loading").fadeIn()
    
})


$("body").on("click", "#yx-confirm-xiu", function () {

    let order = $('#sku_yx_xiu input[name="order1"]:checked').val()
    let type = $('#sku_yx_xiu input[name="type1"]:checked').val()
    let content = $('#sku_yx_xiu input[name="content1"]:checked').val()

    let picture = type == 2 ? 1 : 0
    let append = type == 1 ? 1 : 0

    layui.use('layer', function () {
        var layer = layui.layer;
        layer.close(layer.index)
    })

    // picture 图片   0    1
    // order    按时间  1    按默认  3
    // content 有内容  0   1 
    // append 追评   0    1 
    openCommentXiuQuery(picture, order, content, append)
    $("#yx-loading").fadeIn()
    
})
// 买家秀
let pieTableRenderXiu = null
let series3 = []
function openCommentXiuQuery(picture, order, content, append) { 
    let shopId = $.getUrlParam('id')
    let totalList = []
    

    let page = 0
    let shopData = {}
    let series = []
    let aliv = false

   
    for (let i = 1; i < 100; i++) {
        page++
        let url = 'https://rate.tmall.com/list_detail_rate.htm?itemId='+ shopId +'&sellerId='+ window.g_config.sellerId +'&currentPage='+ page +'&picture='+ picture +'&order='+ order +'&content='+ content +'&append=' + append

        let name = 'jsonp' + new Date().getTime()
        window[name] = function (v) {
            let rateList
            if (!v.rateDetail) {
                aliv = true
            } else { 
                rateList = v.rateDetail.rateList
                totalList.push(...rateList)
            }
            
            // jsonp循环请求 数据组装完成
            
            let xiuNum = 0; // 有买家秀
            let zpNum = 0; // 有追评
            let zpXiuNum = 0;
            if (i == 99) {
                
                if(aliv){
                    $("#yx-loading").fadeOut()
                    $.ajax({
                        url: v.url,
                        type: "get",
                        success: function (data){
                            layui.use('layer', function () {
                                var layer = layui.layer;
                                layer.open({
                                    title: "请手动验证完毕后需手动关闭窗口，再重新点击操作按钮",
                                    type: 2,
                                    area: ['500px', '350px'],
                                    content: data
                                });
                            })
                            aliv = false
                        }
                    })
                    return
                }

                totalList.map(v => { 
                    if(v.pics.length>0){
                        xiuNum++
                    }
                    if(v.appendComment){
                        zpNum++
                    }
                    if(v.appendComment && v.pics.length>0){
                        zpXiuNum++
                    }
                    series.push({
                        auctionSku: v.auctionSku,
                        displayUserNick: v.displayUserNick ? v.displayUserNick : '',
                        rateContent: v.rateContent ? v.rateContent : '',
                        rateDate: v.rateDate ? v.rateDate : '',
                        serviceRateContent: v.serviceRateContent ? v.serviceRateContent : '',
                        reply: v.reply ? v.reply : '',
                        appendComment: v.appendComment && v.appendComment.content ? v.appendComment.content : '',
                        appendCommentTime: v.appendComment && v.appendComment.commentTime ? v.appendComment.commentTime : '',
                        appendReply: v.appendComment && v.appendComment.reply ? v.appendComment.reply : ''
                    })
                })
                
                $("#yx-loading").fadeOut()
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        move: false,
                        maxmin: true,
                        title: `<div class='yx-caiji-content gohome'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>评论分析<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: "<div class='yx-sku-xiu'><div class='yx-atag'><span>买家秀</span><span>追评</span><span>追评和图片</span></div><div class='xiu_content_a'><div id='xiu1'></div><div id='xiu2'></div><div id='xiu3'></div></div><div class='yx-operation'><div class='yx-btns'><span class='yx-sp1_4'>下载数据</span><span class='yx-sp2_4'>复制数据</span></div><div class='yx-fr'>搜索<input type='text' id='yx-inp-search3'></div></div><table id='pieTable3' lay-filter='pie'></table></div>"
                    });

                });  
                
                
                createXiuPie( [{ name: "没有买家秀", value: totalList.length-xiuNum },{ name: "有买家秀", value: xiuNum }], "xiu1")
                createXiuPie( [{ name: "没有追评", value: totalList.length-zpNum },{ name: "有追评", value: zpNum }], "xiu2")
                createXiuPie( [{ name: "没有追评和图片", value: totalList.length-zpXiuNum },{ name: "有追评和图片", value: zpXiuNum }], "xiu3")
                createXiuTable(series)
                series3 = series
            }
        }

        $.ajax({
            url: url,
            dataType: "jsonp",
            type: "jsonp",
            jsonpCallback: name,
            success: function (data){
            
            }
        })
    }
}

// 创建饼图
function createXiuPie(series, id) {
    var myChart = echarts.init(document.getElementById(id));
    // 指定图表的配置项和数据
    var option = {
        title: {
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        // legend: {
        //     data: legend,
        //     type: 'scroll',
        //     orient: 'vertical',
        //     right: 10,
        //     top: 20,
        //     bottom: 20,
        // },
        series: [
            {
                name: '',
                type: 'pie',
                radius: '55%',
                center: ['50%', '45%'],
                data: series,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}



let pies1 = [];
let pies2 = [];
let pies3 = []
function openCommentQuery(picture, order, content, append) { 
    let shopId = $.getUrlParam('id')
    let sellerId = $.getUrlParam('user_id')
    

    let page = 0
    let shopData = {}
    let aliv = false
    let qqNum = 0
   
    for (let i = 1; i < 100; i++) {
        page++
        let url = 'https://rate.tmall.com/list_detail_rate.htm?itemId='+ shopId +'&sellerId='+ window.g_config.sellerId +'&currentPage='+ page +'&picture='+ picture +'&order='+ order +'&content='+ content +'&append=' + append

        let name = 'jsonp' + new Date().getTime()
        window[name] = function (v) {
            let detail, rateList
            qqNum++
            if (!v.rateDetail) {
                aliv = true
            } else { 
                detail = v.rateDetail
                rateList = detail.rateList
                totalList.push(...rateList)
            }
            
            // jsonp循环请求 数据组装完成
            if (qqNum == 99) {
                
                if (aliv) {
                    $("#yx-loading").fadeOut()
                    
                            layui.use('layer', function () {
                                var layer = layui.layer;
                                layer.open({
                                        type: 2,
                                        title: "请手动验证完毕后需手动关闭窗口，再重新点击操作按钮",
                                        area: ['500px', '350px'],
                                        content: `https:${v.url}`
                                    });
                            })
                            aliv = false
                    return
                }

                if(totalList.length == 0){
                    layui.use('layer', function(){
                        var layer = layui.layer;
                        layer.msg('该宝贝暂无评价，无法获取数据进行热卖SKU分析，请过段时间再来吧。');
                    });
                    $("#yx-loading").fadeOut()
                    return
                }
            
               
                totalList.map(v => {
                    if (shopData[v.auctionSku]) {
                        shopData[v.auctionSku].num = shopData[v.auctionSku].num + 1
                    } else { 
                        shopData[v.auctionSku] = {
                            num: 1
                        }
                    }
                })

                // 细分的legend
                let tabLegend = []
                for (let key in shopData) { 
                    legend.push(key)
                    series.push({
                        name: key,
                        value: shopData[key].num
                    })

                    let spl = key.split(";")
                    spl.map((v, j) => { 
                        tabLegend[j] = tabLegend[j] ? tabLegend[j] : []
                        tabLegend[j].push(v)
                    })
                }

                // 去重之后的真实sku
                tabLegend.map(v => { 
                    v = $.unique(v)
                })
                

                skuTabData = tabLegend.map(v => { 
                    return v.map(j => { 
                        return {
                            name: j,
                            num: 0
                        }
                    })
                })
                
                // 细分sku 总览
                skuTabData.map(v => { 
                    v.map(j => { 
                        totalList.map(s => {
                            let arrs = s.auctionSku.split(";")
                            arrs.map(qq => {
                                if (qq == j.name) { 
                                    j.num = j.num + 1
                                }
                            })
                            // if (s.auctionSku.includes(j.name)) { 
                                
                            // }
                        })
                    })
                })
                // 填充数据
                skuTabData[0].map(v => { 
                    legend1.push(v.name)
                    series1.push({
                        name: v.name,
                        value: v.num
                    })
                })
                
                let allSku = totalList[1].auctionSku.split(";")
                let skuList = []
                let span = ''
                allSku.map((v, i) => { 
                    skuList.push(v.split(":")[0])
                    if (i == 0) {
                        span += '<span class="active">' + v.split(":")[0] + '</span>'
                    } else { 
                        span += '<span>' + v.split(":")[0] + '</span>'
                    }
                })

                // 折线图数据
                // let legend2 = [], series2 = [], totalList2 = []


                $("#yx-loading").fadeOut()
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.tab({
                        area: ['1180px', '650px'],
                        maxmin: true,
                        type: 1,
                        min: () => { 
                            resize()
                        },
                        full: () => { 
                            resize()
                        },
                        tab: [{
                            title: 'SKU总览',
                            content: "<div class='yx-sku-tab'><div id='echarts'></div><div class='yx-operation'><div class='yx-btns'><span class='yx-sp1'>下载数据</span><span class='yx-sp2'>复制数据</span></div><div class='yx-fr'>搜索<input type='text' id='yx-inp-search'></div></div><table id='pieTable' lay-filter='pie'></table></div>"
                        }, {
                            title: 'SKU细分总览',
                            content: "<div class='yx-sku-tab'><div class='yx-sku-label'>"+span+"</div><div id='echarts1'></div><div class='yx-operation'><div class='yx-btns'><span class='yx-sp1_2'>下载数据</span><span class='yx-sp2_2'>复制数据</span></div><div class='yx-fr'>搜索<input type='text' id='yx-inp-search1'></div></div><table id='pieTable1' lay-filter='pie_type'></table></div>"
                        }, {
                            title: 'SKU每日趋势',
                            content: "<div class='yx-sku-tab'><div id='echarts2'></div><div class='yx-operation'><div class='yx-btns'><span class='yx-sp1_3'>下载数据</span><span class='yx-sp2_3'>复制数据</span></div><div class='yx-fr'>搜索<input type='text' id='yx-inp-search2'></div></div><table id='pieTable2' lay-filter='pie_line'></table></div>"
                        }]
                    });
                });  
                
                // sku总览
                createEchartsPie(legend, series)
                pieTable(series)
                series.sort((a,b)=>{
                    return b.value - a.value
                })
                pies1 = series
                // sku细分总览
                createEchartsPie1(legend1, series1)
                pieTable1(series1)
                series1.sort((a,b)=>{
                    return b.value - a.value
                })
                pies2 = series1
                // 折线图
                canvasLine(totalList)
            }
        }

        $.ajax({
            url: url,
            dataType: "jsonp",
            type: "jsonp",
            jsonpCallback: name,
            success: function (data){
            
            }
        })
    }
}

$("body").on("click", ".layui-layer-tab span", function () { 
    $("#echarts").css({
        width: "100%",
        height: "450px"
    })
    $("#echarts1").css({
        width: "100%",
        height: "450px"
    })
    $("#echarts2").css({
        width: "100%",
        height: "550px"
    })
    myPieChart1.resize()
    myPieChart2.resize()
    myPieChart3.resize()

    layui.use('table', function () {
        var table = layui.table;
        table.resize('pieList')
        table.resize('pieList1')
        table.resize('pieList2')
    })
})

function canvasLine(arr) { 
    let time = []
        let series = []

        arr.map(v=>{
            let dates = new Date(v.rateDate)
            let month = (dates.getMonth() + 1) >= 10 ? (dates.getMonth() + 1) : '0' + (dates.getMonth() + 1)
            let day = dates.getDate() >= 10 ? dates.getDate() : '0' + dates.getDate()

            v.date = dates.getFullYear() + '-' + month + '-' + day
            v.time = new Date(v.rateDate).getTime()
        })

        let sortArr = arr.sort((a,b)=>{
            return a.time - b.time
        })
        let dates = sortArr.map(v=>{
            time.push(v.date)
        })
        let timeArr = $.unique(time)
        
        
        let skuS = {}
        arr.map(v=>{
            if(skuS[v.auctionSku]){
                skuS[v.auctionSku].num = skuS[v.auctionSku].num + 1
            }else{
                skuS[v.auctionSku] = {
                    name: v.auctionSku,
                    num: 1,
                    date: v.date,
                    time: v.time
                }
            }
        })

        let legend = []
        for(let k in skuS){
            legend.push(k)
        }

        legend.map(v=>{
            let dayData = getSkuDayData(arr, timeArr, v)
            series.push({
                name: v,
                data: dayData,
                type: 'line',
                stack: '总量',
            })
        })
        
        let option = {
            xAxis: {
                type: 'category',
                data: timeArr
            },
            yAxis: {
                type: 'value'
            },
            series: series,
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '3%',
                right: '20%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    restore: {},
                    dataView: {},
                    magicType: {
                        type: ['line', 'bar', 'stack']
                    },
                    saveAsImage: {}
                }
            },
            legend: {
                data: legend,
                type: 'scroll',
                orient: 'vertical',
                right: 10,
                top: 30,
                bottom: 20,
            },
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    start: 50,
                    end: 100
                },
                {
                    type: 'inside',
                    realtime: true,
                    start: 50,
                    end: 100
                }
            ],
        };


    var myChart = echarts.init(document.getElementById('echarts2'));
    myPieChart3 = myChart
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        
        // 表格
        let skuTimeData = {}
        arr.map(v => { 
            if (skuTimeData[v.date+"$"+v.auctionSku]) {// 如果存在
                skuTimeData[v.date+"$"+v.auctionSku].num = skuTimeData[v.date+"$"+v.auctionSku].num + 1
            } else { 
                skuTimeData[v.date+"$"+v.auctionSku] = {
                    name: v.auctionSku,
                    num: 1,
                    date: v.date,
                    time: v.time
                }
            }
        })
        
        for(let st in skuTimeData){
            series2.push({
                name: skuTimeData[st].name,
                value: skuTimeData[st].num,
                date: skuTimeData[st].date
            })
        }
        
    let sortArr1 = series2.sort((a, b) => { 
        return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
    pieTable2(sortArr1)
    pies3 = sortArr1
}
// sku获取展示
$("body").on('click', '#yx-sku', function () {
    if(!isLogin){
        login()
        return
    }

    if(is_use == 0){
        isUse()
        return
    }
    let html = '<div class="yx-comment_box" id="sku_yx_comment">' +
    '<div class="yx-comment_content layui-form">' +
        '<div class="yx-comment_items">' + 
            '<span class="yx-comment_label"><span class="yx-red">*</span>排序方式：</span>' +
            '<div class="yx-right_radio">' +
                '<input type="radio" name="order" value="3" title="按默认" checked>' +
                '<input type="radio" name="order" value="1" title="按时间">' +
            '</div>' +
        '</div>' +
        '<div class="yx-comment_items">' +
            '<span class="yx-comment_label"><span class="yx-red">*</span>类型：</span>' +
            '<div class="yx-right_radio">' +
                '<input type="radio" name="type" value="0" title="全部" checked>' +
                '<input type="radio" name="type" value="1" title="追评">' +
                '<input type="radio" name="type" value="2" title="图片">' +
            '</div>' +
        '</div>' +
        '<div class="yx-comment_items">' +
        '<span class="yx-comment_label"><span class="yx-red">*</span>过滤无内容：</span>' +
        '<div class="yx-right_radio">' +
        '<input type="radio" name="content" value="1" title="是" checked>' +
        '<input type="radio" name="content" value="0" title="否">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="yx-flexs_btn">' +
        '<button class="layui-btn" lay-submit lay-filter="formDemo" id="yx-confirm-comment">确定</button>' +
        '</div>' +
        '</div>'
    
        layui.use('layer', function () {
            var layer = layui.layer;
            layer.open({
                title: '请选择评论类型',
                type: 1,
                area: ['500px', '350px'],
                content: html
            });
        })

    layui.use('form', function () {
        var form = layui.form;
        form.render();
    });
})
$("body").on("click", '#yx-comment-xiu',function(){
    if(!isLogin){
        login()
        return
    }

    if(is_use == 0){
        isUse()
        return
    }

    let html = '<div class="yx-comment_box" id="sku_yx_xiu">' +
    '<div class="yx-comment_content layui-form">' +
        '<div class="yx-comment_items">' + 
            '<span class="yx-comment_label"><span class="yx-red">*</span>排序方式：</span>' +
            '<div class="yx-right_radio">' +
                '<input type="radio" name="order1" value="3" title="按默认" checked>' +
                '<input type="radio" name="order1" value="1" title="按时间">' +
            '</div>' +
        '</div>' +
        '<div class="yx-comment_items">' +
            '<span class="yx-comment_label"><span class="yx-red">*</span>类型：</span>' +
            '<div class="yx-right_radio">' +
                '<input type="radio" name="type1" value="0" title="全部" checked>' +
                '<input type="radio" name="type1" value="1" title="追评">' +
                '<input type="radio" name="type1" value="2" title="图片">' +
            '</div>' +
        '</div>' +
        '<div class="yx-comment_items">' +
        '<span class="yx-comment_label"><span class="yx-red">*</span>过滤无内容：</span>' +
        '<div class="yx-right_radio">' +
        '<input type="radio" name="content1" value="1" title="是" checked>' +
        '<input type="radio" name="content1" value="0" title="否">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="yx-flexs_btn">' +
        '<button class="layui-btn" lay-submit lay-filter="formDemo" id="yx-confirm-xiu">确定</button>' +
        '</div>' +
        '</div>'
    
        layui.use('layer', function () {
            var layer = layui.layer;
            layer.open({
                title: '请选择评论类型',
                type: 1,
                area: ['500px', '350px'],
                content: html
            });
        })

    layui.use('form', function () {
        var form = layui.form;
        form.render();
    });
})
// 切换tab
$("body").on("click", '.yx-sku-label span', function () { 
    $(this).addClass("active").siblings().removeClass("active")
    let idx = $(this).index()

   
    pieTableRender1.config.title = $(this).html() + 'SKU细分总览'

    // 填充数据
    legend1 = []
    series1 = []
    
    skuTabData[idx].map(v => { 
        legend1.push(v.name)
        series1.push({
            name: v.name,
            value: v.num
        })
    })
    // sku细分总览
    createEchartsPie1(legend1, series1)
    pieTable1(series1)
})
// 下载数据
$("body").on("click", ".yx-sp1", function(){
    layui.use('table', function () {
        var table = layui.table;
        table.exportFile(pieTableRender.config.id, pies1); //导出数据
    })
})

// 下载数据 pie tab
$("body").on("click", ".yx-sp1_2", function () {
    layui.use('table', function () {
        var table = layui.table;
        table.exportFile(pieTableRender1.config.id, pies2); //导出数据
    })
})

// 下载数据 折线 tab
$("body").on("click", ".yx-sp1_3", function () {
    layui.use('table', function () {
        var table = layui.table;
        table.exportFile(pieTableRender2.config.id, pies3); //导出数据
    })
})

// 下载数据 评论分析 tab
$("body").on("click", ".yx-sp1_4", function () {
    layui.use('table', function () {
        var table = layui.table;
        table.exportFile(pieTableRenderXiu.config.id, series3); //导出数据
    })
})

// 下载数据 问大家
$("body").on("click", ".yx-sp1_5", function () {
    layui.use('table', function () {
        var table = layui.table;
        table.exportFile(pieTableRenderWen.config.id, series_wen); //导出数据
    })
})

// 复制数据
$("body").on("click", ".yx-sp2", function () {
    let str = ''

    layui.use('table', function () {
        var table = layui.table.cache.pieList;

        table.map((v) => { 
            str += v.name +'--'+ v.value +'\n'
        })
        window.GM_setClipboard(str)
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.msg('复制成功');
        });
    })
})

$("body").on("click", ".yx-sp2_2", function () {
    let str = ''

    layui.use('table', function () {
        var table = layui.table.cache.pieList1;

        table.map((v) => { 
            str += v.name +'--'+ v.value +'\n'
        })
        window.GM_setClipboard(str)
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.msg('复制成功');
        });
    })
})

$("body").on("click", ".yx-sp2_3", function () {
    let str = ''

    layui.use('table', function () {
        var table = layui.table.cache.pieList2;

        table.map((v) => {
            str += v.name +'--'+ v.date +'\n' + '--'+ v.value +'\n'
        })
        window.GM_setClipboard(str)
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.msg('复制成功');
        });
    })
})


$("body").on("click", ".yx-sp2_4", function () {
    let str = ''

    layui.use('table', function () {
        var table = layui.table.cache.pieList3;

        table.map((v) => {
            str += v.auctionSku +'--'+ v.displayUserNick +'\n' + '--'+ v.rateContent +'\n' + '--'+ v.rateDate +'\n' + '--'+ v.serviceRateContent +'\n' + '--'+ v.reply +'\n' + '--'+ v.appendComment +'\n' + '--'+ v.appendCommentTime +'\n' + '--'+ v.appendReply
        })
        window.GM_setClipboard(str)
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.msg('复制成功');
        });
    })
})

$("body").on("click", ".yx-sp2_5", function () {
    let str = ''

    layui.use('table', function () {
        var table = layui.table.cache.pieList4;

        let comment = ''
        let str = ''
        
        str += $(".tb-detail-hd h1").html()
        str += ''
        str += '时间      问题      回答'
        table.map((v) => {
            
            v.list.map(c=>{
                comment += $.formatDateTime(parseInt(c.gmtCreate)) + c.userNick + ":" + c.title
            })

            str += `${v.gmtCreate}      ${v.userNick}:${v.title}      ${comment}`
        })
        window.GM_setClipboard(str)
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.msg('复制成功');
        });
    })
})


// 搜索
$("body").on("input propertychange", "#yx-inp-search", function () { 
    layui.use('table', function () {
        var pieList = series;
        let key = $('#yx-inp-search').val()
        
        let filter = pieList.filter((v) => { 
            let name = v.name
            let value = v.value.toString()
            return name.includes(key) || value.includes(key)
        })
        
        pieTableRender.reload({
            data: filter
        });
        
    })
})

$("body").on("input propertychange", "#yx-inp-search1", function () { 
    layui.use('table', function () {
        var pieList = series1;
        let key = $('#yx-inp-search1').val()
        
        let filter = pieList.filter((v) => { 
            let name = v.name
            let value = v.value.toString()
            return name.includes(key) || value.includes(key)
        })
        
        pieTableRender1.reload({
            data: filter
        });
        
    })
})

$("body").on("input propertychange", "#yx-inp-search2", function () { 
    layui.use('table', function () {
        var pieList = series2;
        let key = $('#yx-inp-search2').val()
        
        let filter = pieList.filter((v) => { 
            let name = v.name
            let value = v.value.toString()
            return name.includes(key) || value.includes(key)
        })
        
        pieTableRender2.reload({
            data: filter
        });
        
    })
})

$("body").on("input propertychange", "#yx-inp-search3", function () { 
    layui.use('table', function () {
        var pieList = series3;
        let key = $('#yx-inp-search3').val()
        
        let filter = pieList.filter((v) => { 
            let auctionSku = v.auctionSku
            let displayUserNick = v.displayUserNick
            let rateContent = v.rateContent
            let rateDate = v.rateDate
            let serviceRateContent = v.serviceRateContent
            let reply = v.reply
            let appendComment = v.appendComment
            let appendCommentTime = v.appendCommentTime
            let appendReply = v.appendReply
            return auctionSku.includes(key) || displayUserNick.includes(key) || rateContent.includes(key) || rateDate.includes(key) || serviceRateContent.includes(key) || reply.includes(key) || appendComment.includes(key) || appendCommentTime.includes(key) || appendReply.includes(key)
        })

        pieTableRenderXiu.reload({
            data: filter
        });
        
    })
})


$("body").on("input propertychange", "#yx-inp-search4", function () { 
    layui.use('table', function () {
        var pieList = series_wen;
        let key = $('#yx-inp-search4').val()
        let filter = pieList.filter((v) => { 
            let gmtCreate = v.gmtCreate
            let title = v.title
            let text = ''
            v.list.map(j => {
                text += j.title
                text += j.userNick
            })
            text += v.userNick
 
            return gmtCreate.includes(key) || title.includes(key) || text.includes(key)
        })

        pieTableRenderWen.reload({
            data: filter
        });
        
    })
})


var myPieChart1,myPieChart2,myPieChart3
function resize() {
    $("#echarts").css({
        width: "100%",
        height: "450px"
    })
    $("#echarts1").css({
        width: "100%",
        height: "450px"
    })
    $("#echarts2").css({
        width: "100%",
        height: "550px"
    })
    myPieChart1.resize()
    myPieChart2.resize()
    myPieChart3.resize()

    layui.use('table', function () {
        var table = layui.table;
        table.resize('pieList')
        table.resize('pieList1')
        table.resize('pieList2')
    })
}
// 创建饼图
function createEchartsPie(legend, series) {

    var myChart = echarts.init(document.getElementById('echarts'));
    myPieChart1 = myChart
    // 指定图表的配置项和数据
    var option = {
        title: {
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            data: legend,
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: '75%',
                center: ['50%', '60%'],
                data: series,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
// pieTable
function pieTable(data) {
    layui.use('table', function(){
        var table = layui.table;
        
        //第一个实例
        pieTableRender = table.render({
          id: "pieList",
          elem: '#pieTable',
          title: "热卖SKU总览",
          page: true, //开启分页
          limit: 10,
          limits: [10, 30, 50, 100],
          data: data,
          initSort: {
            field: 'value', //排序字段，对应 cols 设定的各字段名
            type: 'desc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
          },
          cols: [[ //表头
            {field: 'name', title: 'SKU信息', sort: true},
            {field: 'value', title: '数量', sort: true}
          ]]
        });
    });
}


// 创建细分饼图
function createEchartsPie1(legend, series) {

    var myChart = echarts.init(document.getElementById('echarts1'));
    myPieChart2 = myChart
    // 指定图表的配置项和数据
    var option = {
        title: {
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            data: legend,
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,

        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: '75%',
                center: ['50%', '60%'],
                data: series,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

// pieTable 细分
function pieTable1(data) {
    layui.use('table', function(){
        var table = layui.table;
        
        //第一个实例
        pieTableRender1 = table.render({
          id: "pieList1",
          elem: '#pieTable1',
          title: "热卖SKU细分总览",
          page: true, //开启分页
          limit: 10,
          limits: [10, 30, 50, 100],
          data: data,
          initSort: {
            field: 'value', //排序字段，对应 cols 设定的各字段名
            type: 'desc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
          },
          cols: [[ //表头
            {field: 'name', title: 'SKU信息', sort: true},
            {field: 'value', title: '数量', sort: true}
          ]]
        });
    });
}

// pieTable 细分
function pieTable2(data) {
    layui.use('table', function(){
        var table = layui.table;
        
        //第一个实例
        pieTableRender2 = table.render({
          id: "pieList2",
          elem: '#pieTable2',
          title: "热卖SKU每日趋势",
          page: true, //开启分页
          limit: 10,
          limits: [10, 30, 50, 100],
          data: data,
          initSort: {
            field: 'date', //排序字段，对应 cols 设定的各字段名
            type: 'desc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
          },
          cols: [[ //表头
            {field: 'name', title: 'SKU信息', sort: true},
            {field: 'date', title: '时间', sort: true},
            {field: 'value', title: '数量', sort: true}
          ]]
        });
    });
}

function createXiuTable(data) {
    layui.use('table', function(){
        var table = layui.table;
        
        //第一个实例
        pieTableRenderXiu = table.render({
          id: "pieList3",
          elem: '#pieTable3',
          title: "评论分析",
          page: true, //开启分页
          limit: 10,
          limits: [10, 30, 50, 100],
          data: data,
          initSort: {
            field: 'rateDate', //排序字段，对应 cols 设定的各字段名
            type: 'desc' //排序方式  asc: 升序、desc: 降序、null: 默认排序
          },
          cols: [[ //表头
            {field: 'auctionSku', title: 'SKU', sort: true},
            {field: 'displayUserNick', title: '旺旺名', sort: true},
            {field: 'rateContent', title: '初次评语', sort: true},
            {field: 'rateDate', title: '初次评语时间', sort: true},
            {field: 'serviceRateContent', title: '服务评语', sort: true},
            {field: 'reply', title: '初次商家回复', sort: true},
            {field: 'appendComment', title: '追加评语', sort: true},
            {field: 'appendCommentTime', title: '追加评语时间', sort: true},
            {field: 'appendReply', title: '追加商家回复', sort: true},
          ]]
        });
    });
}

//****传入图片链接，返回base64数据
var getBase64ByUrl = function(src, callback, outputFormat) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', src, true);

    xhr.responseType = 'arraybuffer';

    xhr.onload = function(e) {
        if (xhr.status == 200) {
            var uInt8Array = new Uint8Array(xhr.response);
            var i = uInt8Array.length;
            var binaryString = new Array(i);
            while (i--) {
                binaryString[i] = String.fromCharCode(uInt8Array[i]);
            }
            var data = binaryString.join('');
            var base64 = window.btoa(data);
            var dataUrl = "data:" + (outputFormat || "image/png") + ";base64," + base64;
            callback.call(this, dataUrl);
        } else { 
            callback.call(this, null)
        }
    };

    xhr.send();
}

function getSkuDayData(arr, timeArr, sku){
    // 获取当前sku的天数数组
    let day = []
    timeArr.map((t, i)=>{
        let num = 0
        arr.map(v=>{
            if(t == v.date && sku == v.auctionSku){
                num++
            }
        })
        day.push(num)
    })
    return day
}

$.getUrlParam = function(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return unescape(r[2]); return null;
}

$.unique = function(arr){            
    for(var i=0; i<arr.length; i++){
        for(var j=i+1; j<arr.length; j++){
            if(arr[i]==arr[j]){
                arr.splice(j,1);
                j--;
            }
        }
    }
    return arr;
}

$.formatDateTime = function (inputTime, type) {
    var date = new Date(inputTime);
    var y = date.getFullYear();    
    var  m  =  date.getMonth()  +  1;      
    m  =  m  <  10  ?  ('0'  +  m)  :  m;      
    var  d  =  date.getDate();      
    d  =  d  <  10  ?  ('0'  +  d)  :  d;      
    var  h  =  date.getHours();    
    h  =  h  <  10  ?  ('0'  +  h)  :  h;    
    var  minute  =  date.getMinutes();    
    var  second  =  date.getSeconds();    
    minute  =  minute  <  10  ?  ('0'  +  minute)  :  minute;      
	second = second < 10 ? ('0' + second) : second;     
	if (type == 1) { 
		return  y  +  '-'  +  m  +  '-'  +  d
	}
    return  y  +  '-'  +  m  +  '-'  +  d + ' ' + h + ':' + minute + ':' + second;  
}