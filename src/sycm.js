let $ = window.$;
let echarts = window.echarts
let layui = window.layui
let is_use = 0

let isLogin = false
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
                check_plugin: 0
            },
            success : function(res) {
                if(res.code == 0){
                    isLogin = true
                    clearInterval(timer)
                    sessionStorage.setItem('yxToken', res.data.token)
                    
                    is_manage = res.data.is_manage

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
                check_plugin: 0
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

                    window.open(`https://www.yingxiaods.com/`, "_blank")
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


$(function (){
    setTimeout(()=>{
        

        // let store = getStore()

        // for (let key in store) {
        //     if (key.includes('sycm.taobao.com/custom/menu/getViewMode.json')) {
               
        //         let data = store[key].split("|")[1]
        //         let d = JSON.parse(`"${data}`)
        //         let data_json = JSON.parse(d).value._d

        //         let shopName = data_json.singleShops[0].runAsUserName
                let shopName = $(".ebase-ModernFrame__title").text() || $(".ebase-Frame__title").text() || $(".current-shop-item-title").text()
                $.ajax({
                    type : "POST",
                    url : window.baseUrl + "/plugin/tb/login",
                    data: {
                        shop_name: shopName,
                        platform_type: 'sycm'
                    },
                    success : function(res) {
                        if(is_manage == 1){ // 万能
                            is_use = 1
                        }else{
                            if(res.error == '店铺不存在'){
                                layui.use('layer', function () {
                                    var layer = layui.layer;
                                    layer.confirm('您还没有注册'+ plugin_name +'插件帐号，去注册？',{
                                        title: "温馨提示",
                                        btn: ['确定','取消'] //按钮
                                    }, function(){
                                        window.open("https://www.yingxiaods.com/register", '_blank')
                                        layer.close(layer.index)
                                    }, function(){
                                        layer.close(layer.index)
                                    });
                                })
                                return
                            }
                            is_use = res.data.plugin[0].is_use
                        }
                        clearInterval(timer)
                        
                    },
                    error: function (e) {
                        
                    }
                })
        //     }
        // }
    }, 2000)
})

$("body").append("<link rel='stylesheet' href='https://www.yingxiaods.com/xh/assets/css/common.css'>");
$("body").append("<link rel='stylesheet' href='https://www.yingxiaods.com/xh/assets/layer/theme/default/layer.css?v=3.1.1'>");
$("body").append("<link rel='stylesheet' href='https://www.yingxiaods.com/xh/assets/layui/css/layui.css'>");
$("body").append("<div id='yx-loading'><img src='https://www.yingxiaods.com/xh/assets/images/loading.png' class='loading-img' /></div>")



const script1 = document.createElement("script");
script1.charset = "UTF-8";
script1.src = "https://www.yingxiaods.com/xh/assets/xlsx.core.min.js";
document.documentElement.appendChild(script1);


let plugin_name = "小黄工具箱"
// 前台分类弹出
$.ajax({
    type : "POST",
    url : window.baseUrl + "/plugin/setting",
    success : function(res) {
        plugin_name = res.data.plugin_name
        window.yxInfo = res.data
        let yingxiao = `<div id='yx-yy'>
        <div id='yx'>
        <img src='https://www.yingxiaods.com/xh/assets/images/reduce.png' alt='' class='yx-off'>
        <img src='${ res.data.logo }' alt='' class='yx-logo'>
        <p class='yx-name'>${ res.data.plugin_name }</p>
        <div class='yx-category'>
            <div class='yx-item' id='sycm'>生意参谋</div>
            <div class='yx-item' id='toTaobao'>前台</div>
            <div class='yx-item' id='totit'>标题优化</div>
            <div class='yx-item' id="share">推广分享</div>
            <div class='yx-item' id="yx-userInfo">用户信息</div>
            <div class='yx-item' id='yx-help'>使用帮助</div>
        </div>
        <div class='yx-version'>插件版本：v1.0.0</div>
        </div>
        <div class='yx-toggle'>展开</div>
        </div>`

        if (window.location.href.includes('shopbank/app/consumerManagerGuide')) {
            
        } else { 
            if(top == self){
                $("body").append(yingxiao)
            }
            
        }


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
                            <img id="yx-qrcode-type" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAMxElEQVR4Xu2de4xcZRmHn3cLAg2Vi6BGRLkZjQ0IAsGEkhQlCBoUMaBBJNzCnNmGKqggagRCBAQFrWHnDFZuIip4ISolUAmNFhSFIIoSK5qSECBAuKQoFNr9zEy27fa2e8430/nmPed3EsIffO/3/r7nnYezs7tz1tAlAiKwWQImNiIgApsnIEH06hCBKQhIEL08RECC6DUgAnEEdAeJ46aqmhCQIDUZtI4ZR0CCxHFTVU0ISJCaDFrHjCMgQeK4qaomBCRITQatY8YRkCBx3FRVEwISpCaD1jHjCEiQOG6qqgkBCVKTQeuYcQT6IkhoM5NxtmeEWaxiFtb9Z0ZcJFWJQASBwGoCK9iKFYyzghFetgb/i9hpvZIoQUKbOcAcwsS/YYdeg6heBLYAgZeApcC9jPMXAg/ZPJ4u06ewIKHNO4ATCZwI7FumidaKwNAQCNzMCDdbg9uLZJpWkLCAbdiaq7CuGLpTFKGqNR4ILGWchTbKDVOFnVKQ0OLNjHA9gaM9nFgZRSCCwDWW0dhc3WYFCQvZh1XcBBwS0VQlIuCJwCOWbfptw+YFybkHmOvplMoqAtEEjCetwW4b1m9SkNDiQowLopupUAQ8EghcZE0unBx9I0FCi7lY9+6hSwTqSOA0y7huzcE3FqTNjQQ+W0cyOrMIYDzBSt5v83m2Q2M9Qbo/EQ88BbxRqESgtgSMc63BFRsLkvNx4LbagtHBRaBDIPAor3OAzWfl+neQnJ8AnxIlEag9ASOzBu0NBXkcur9SoksE6k0gcKs1OWGtIKHNDgRejKTyN+CWifoXCDyP8UrkXioTgfIEjG0J7IixM4GdMDLg7eU3WlvxhGXsPlmQzm/n/r70hsb51uCy0nUqEIEtTCC0uAXj+B7azJ4sSJPAWKnNjMuswfmlarRYBAZIIOSMAldHtjxjnSA5l0CpF/szlvGWyMYqE4GBEQg5jwF7RzS8dLIgC4CzCm9ifM4adGp0icBQEwg5pwMLI0J+b7Ig1wKnlthktmX8o8R6LRWBJARCm30J/DWi+XXrBCn7hmYbtrNTeTWiqUpEYKAEwpVsx8yIz6d3vtW7Jmlos6jEB6OWW8aeAz2lmolADwRCTvmf8Rl3TP4Sq8znP5ZYxuE95FWpCAyUQIj7fNMSCTLQMalZKgISJBV59XVBQIK4GJNCpiIgQVKRV18XBCSIizEpZCoCEiQVefV1QUCCuBiTQqYiIEFSkVdfFwQkiIsxKWQqAhIkFXn1dUFAgrgYk0KmIiBBUpFXXxcEJIiLMSlkKgISJBV59XVBQIK4GJNCpiIgQVKRV18XBCSIizEpZCoCEiQVefV1QUCCuBiTQqYiIEFSkVdfFwQkiIsxKWQqAhIkFXn1dUFAgrgYk0KmIiBBUpFXXxcEJIiLMSlkKgISJBV59XVBQIK4GJNCpiIgQVKRV18XBCSIizEpZCoCEiQVefV1QUCCuBiTQqYiIEFSkVdfFwQkiIsxKWQqAhIkFXn1dUFAgrgYk0KmIiBBUpFXXxcEJIiLMSlkKgISJBV59XVBQIK4GJNCpiIgQVKRV18XBCSIizEpZCoCEiQVefV1QUCCuBiTQqYiIEFSkVdfFwQkiIsxKWQqAhIkFXn1dUFAgrgYk0KmIiBBUpFXXxcEJIiLMSlkKgISJBV59XVBQIK4GJNCpiIgQVKRV18XBCSIizEpZCoCEiQVefV1QUCCuBiTQqYiIEFSkVdfFwQkiIsxKWQqAhIkFXn1dUFAgrgYk0KmIiBBUpFXXxcEJIiLMSlkKgISJBV59XVBQIK4GJNCpiIgQVKRV18XBCSIizEpZCoCEiQVefV1QUCCuBiTQqYiIEFSkVdfFwQkiIsxKWQqAhIkFXn1dUFAgrgYk0KmIiBBUpFXXxcEJIiLMSlkKgISJBV59XVBQIK4GJNCpiIgQVKRV18XBAYtyP2W8QEXZBRSBICQ8wBwYEkYS2xNQUnDnreMN5VspuUikIxAyHke2KlkgGhBwDjBGtxasqGWi8DACYQWp2BcF9G4B0FgOXAX8CCBZRHNVSICW5rA7hgHEzgaY5+IZj0JEtFPJSLgioAEcTUuhR00AQkyaOLq54qABHE1LoUdNAEJMmji6ueKgARxNS6FHTQBCTJo4urnioAEcTUuhR00AQkyaOLq54qABHE1LoUdNAEJMmji6ueKgARxNS6FHTQBCTJo4lP2Mx4nsBrYa6hy1TeMBBmC2S8mcCvjLLV5PNrJE65mH2ZwGNAADhmCjHWNIEGSTt44xxpcNVWGkHMT8JmkOevbfD1B7gSOrC+LAZ98hGPsTH5TpGvI+RDw2yJrtaavBO6a/JHbnwPH9XV7bbZpAkbbGmRl8IQxPs/I1HebMvtpbSECv5gsyA3AyYXKtKgXAosti7tThxaLMY7opblqSxG4cbIgVwOjpcq1OIbAdyzj7JjC0GaMQDOmVjVRBMbWCdLimxjnRm2jouIEApk1aRcvWLcytJlP4LsxtaqJIBC4fPId5IvAFRHbqKQMgcDh1mRJmZI1a0OLuRj3xNSqJorAFyYLchRwR9Q2KipOQHeQ4qxSrzQOWyfIGHsxwr9TZ6pBf70H8THklbzGDmsF6WQOOc+Bnpi4heen72JtYcB92n6pZZPuIBOCLAUO7VMDbbM5Ap03f03OKwMotDgN4wdlarS2JwJXWsa69yATgnwNuLinbVVcjEBgT2t2n0457RXa7ELg2WkXakH/CIxzkI3y4PpfYn2f/VjNw/3rop2mJBCYY03unWpND8+VFfx4AtdY1v1FUdYTpHsXaXMnIe4nvfF5alxpXA78lCd5xC7itYkZbM0qZjPCPIwzakwnzdEn7h6bFiT+SdhpDlOdrq9jPDbxeZB3A1tX52iOThK4zJqcvybxRneQifcinUfFn+LoWIoqAv0g8GvL+NjkjTYtSIs9Jn5iu0c/umoPEXBBwNjRGrw0rSATd5HOr753PqyznYvDKaQI9EJghEPtTO7bcItN3kHWLAotPohxI7BbL71VKwJDTOB+XuEoO5sXN5VxSkG6d5IxDmQGLQIHD/EhFU0EyhEwXgVa1uCcqQqnFWTt3STnOIwTCXyyXBKtFoEhImAsY5wfY/zIMv41XbLCgkwS5SBgLjBn4h/9tdvpKOu/pyTwX6DzK1R/Bh7iNW63+awsGqi0IBtuHFocwAzeympmYcxinFmMsD2BrYqGcLHO+CjQ+Z9DFa4HCNxehYOsPYOxinFeZoQVBFYwgxWs5mlr8lAv5+xZkF6ae6oNOZ3/E830lHmKrCstY9uKnGWLHkOCFMQbckLBpT6WPcUMu4hxH2HTpZQgBdiHnPcCfy+w1M+Scd5jo/zTT+A0SSVIAe7hGj7d/c5Hta7jLeNn1TpS/08jQQowDW0uJfDlAkv9LAlcbE2+7idwmqQSpAD3kFPFp07eZhmfKHD8Wi+RIAXGH3IeAA4ssNTTkv9Yxt6eAqfIKkEKUA959+OuuxRY6mvJzsy0E3jFV+jBppUg0/AOC9iVN/DMYMcysG77W6aPWE9FW4JMJ8gYRzDC4oG9ZAfbSN/Jmoa3BJlOkJwzIe5ZuoN9rUd0M75qDS6JqKxNiQSZTpAW38D4SkVfEddbxqkVPVtfjiVBphMk54fASX2hPWybBO6zph4UqPcgPbwwQ87voPsHNat4vcg4e9koL1TxcP04k+4g091B2iwn8M5+wB7KPQKHWJM/DWW2IQhVC0FCzkkYRzLO+zD2GwLuniM8iPEwq/mDjbLQ80GKZK+8ICFnAXBWERhaU5rA3ZZV+28mVlqQkHe/tt6x9NhVUIbAcsvYs0yBp7WVFSTk/BI41tMw3GY1zrNG9xnDlbsqKUjIOQb4VeWmNcwHWs2HbR53DXPEmGxVFaTzrKNvxwBRTTSBL1nGt6Krh7SwqoJ0vrty+pAyr2qsSv5UvqqCdL686nyZpWtwBBZZ1n00UqWuagrS4kKMCyo1qeE/zBWWce7wxyyXsJqCVPMhC+UmO+jVgZOt2f29tUpd1RRkAdvwBv4I7F+paQ3vYRZhHGsNXh/eiHHJKilIB0XIeRewLA6LqkoRMN5mDZ4qVeNkcWUF6Uoyxn6MsEh/32SLvRpfYJyP2Gj3bl3Jq9KCrJlYyLs/5e38xSw9xaM/L+NlBO62JqP92W54d6mFIGtFuZZdWcns4R2Hg2QjPGINnnOQtC8RayVIX4hpk1oRkCC1GrcOW5aABClLTOtrRUCC1GrcOmxZAhKkLDGtrxUBCVKrceuwZQlIkLLEtL5WBCRIrcatw5YlIEHKEtP6WhGQILUatw5bloAEKUtM62tFQILUatw6bFkCEqQsMa2vFQEJUqtx67BlCUiQssS0vlYE/g9eEn2V2Gy0nAAAAABJRU5ErkJggg==">
                        </div>
                        <div class='yx-login-box'>
                            <div class="yx-login-title">${plugin_name}登录</div>
                            <div class="yx-login-tab yx-tab">
                                <input type="text" class="yx-inp1 yx_login_name" placeholder="请输入手机号码"/>
                                <input type="password" class="yx-inp1 yx_login_password" placeholder="请输入登录密码"/>
                                <div class="yx-pass-flex">
                                    <p class="yx-pass">还没注册? <a href="https://www.yingxiaods.com/register" target="_blank">去注册</a></p>
                                    <p class="yx-pass flex1">忘记密码? <a href="https://www.yingxiaods.com/forget" target="_blank">找回密码</a></p>
                                </div>
                                <div class="yx-login-btn-dl">登录</div>
                            </div>
                        </div>
                        <div class='yx-login-box' style="display:none">
                            <div class="yx-login-title">${plugin_name}登录</div>
                            <div class="yx-qrcode"><img src='${url}' /></div>
                            <div class="yx-login-tab yx-tab">
                                <div class="yx-pass-flex">
                                    <p class="yx-pass">还没注册? <a href="https://www.yingxiaods.com/register" target="_blank">去注册</a></p>
                                    <p class="yx-pass flex1">忘记密码? <a href="https://www.yingxiaods.com/forget" target="_blank">找回密码</a></p>
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




$("body").on("click", '#version', function(){
    window.open(`https://www.yingxiaods.com/user/version`, "_blank")
})

$("body").on("click", '#share', function(){
    window.open(`https://www.yingxiaods.com/user/share`, "_blank")
})

$("body").on("click", '#totit', function(){
    window.open(`https://sycm.taobao.com/flow/monitor/itemsource`)
})

$("body").on("click", '#yx-help', function(){
    window.open(`https://www.yingxiaods.com/help/0 `, "_blank")
})

$("body").on("click", '#toTaobao', function(){
    window.open("https://www.taobao.com", "_blank")
})

$("body").on("click", '#sycm', function(){
    window.location.href = "https://sycm.taobao.com/mc/mq/market_monitor"
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



$("body").on("click", '.yx-caiji-content', function(){
    window.open(`https://www.yingxiaods.com/`, "_blank")
})


let jkkb_shop_table_render = null,
    jkkb_goods_table_render = null,
    jkkb_brand_table_render = null,
    hyjk_shop_table_render = null,
    hyjk_goods_table_render = null,
    hyjk_brand_table_render = null,
    scdp_hyqs_table_render = null,
    scdp_hygc_table_render = null,
    jdsb_table_render = null,
    jdfx_zbdb_table_render = null,
    flow_source_table_render = null,
    complete_table_render = null,
    jdfx_top_table_render = null,
    goods_source_table_render = null,
    keyword_source_table_render = null,
    analy_trend_table_render = null,
    analy_title_table_render = null,
    search_rank_table_render = null,
    complete_shop_table_render = null,
    itemRecognition_table_render = null,
    itemRecognitionCard_table_render = null,
    competeBrand_table_render = null,
    competeBrandTrend_table_render = null,
    brandAnalysis_table_render = null,
    drainShop_table_render = null,
    shopRecognition_table_render = null,
    shopLostTop_table_render = null,
    industry_table_render = null,
    brandGoodsTop_table_render = null,
    brandShopsTop_table_render = null,
    generalize_table_render = null,
    analysisWord_table_render = null,
    analysisCategory_table_render = null,
    sycmBrand_table_render = null
    
    
let jkkb_shop_table_data = [],
    jkkb_goods_table_data = [],
    jkkb_brand_table_data = [],
    hyjk_shop_table_data = [],
    hyjk_goods_table_data = [],
    hyjk_brand_table_data = [],
    scdp_hyqs_table_data = [],
    scdp_hygc_table_data = [],
    jdsb_table_data = [],
    jdfx_zbdb_table_data = [],
    flow_source_table_data = [],
    complete_table_data = [],
    jdfx_top_table_data = [],
    goods_source_table_data = [],
    keyword_source_table_data = [],
    trend_analy_table_data = [],
    analy_title_table_data = [],
    search_rank_table_data = [],
    complete_shop_table_data = [],
    itemRecognition_table_data = [],
    itemRecognitionCard_table_data = [],
    competeBrand_table_data = [],
    competeBrandTrend_table_data = [],
    brandAnalysis_table_data = [],
    drainShop_table_data = [],
    shopRecognition_table_data = [],
    shopLostTop_table_data = [],
    industry_table_data = [],
    brandGoodsTop_table_data = [],
    brandShopsTop_table_data = [],
    generalize_table_data = [],
    analysisWord_table_data = [],
    analysisCategory_table_data = [],
    sycmBrand_table_data = []

    
$(function () {
    $('.everywhere-widget-container').remove()

    let sycmMqBrandCunstomer = setInterval(() => {
        if ($("#sycmMqBrandCunstomer .oui-card-header").length > 0 && $("#sycm-brand-conver").length == 0) {
            $("#sycmMqBrandCunstomer .oui-card-header").append(`<div class="yx-conversion">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='sycm-brand-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)
    
    let visitorConver = setInterval(() => {
        if ($("#component-visitor-list").length > 0 && $("#visitor-conver").length == 0) {
            $("#component-visitor-list .pagination-container").append(`<div class="yx-conversion" style="float:left">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='visitor-conver'>存储数据</span><span class="yx-cover-btn4">直通车查看</span><span class="yx-cover-btn5">下载数据</span></div></div>`)
        }
    }, 100)

    let analysisCategory = setInterval(() => {
        if ($(".oui-card").length > 0 && $(".oui-tab-switch .oui-tab-switch-item-active").eq(0).text().includes('类目构成') && $("#analysisCategory-conver").length == 0) {
            $(".oui-card-header-wrapper").eq(0).append(`<div class="yx-conversion" style="position: absolute;right: 20px;top: 0;">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='analysisCategory-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)
    
    let analysisWord = setInterval(() => {
        if ($(".oui-card").length > 0 && $(".oui-tab-switch .oui-tab-switch-item-active").eq(0).text().includes('相关分析') && $("#analysisWord-conver").length == 0) {
            $(".oui-card-header-wrapper").eq(0).find(".oui-card-header").prepend(`<div class="yx-conversion" style="margin-left:20px">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='analysisWord-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)
    
    let searchTrend = setInterval(() => {
        if ($("#searchTrend .oui-card-header-wrapper").length > 0 && $("#searchTrend-conver").length == 0) {
            $("#searchTrend .cardHeader").append(`<div class="yx-conversion">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='searchTrend-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    // 品牌分析 top商品榜
    let brandGoodsTop = setInterval(() => {
        if ($("#brandAnalysisItems .oui-card-header").length > 0 && $("#brand-goods-conver").length == 0) {
            $("#brandAnalysisItems .oui-card-header").append(`<div class="yx-conversion">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='brand-goods-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    // 品牌分析 top商品榜
    let brandShopsTop = setInterval(() => {
        if ($("#brandAnalysisShops .oui-card-header").length > 0 && $("#brand-shops-conver").length == 0) {
            $("#brandAnalysisShops .oui-card-header").append(`<div class="yx-conversion">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='brand-shops-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    
    let jdShopKeyConver = setInterval(() => {
        if ($(".oui-tab-switch-item-active").eq(0).text() == '竞店搜索关键词' && $(".out-plan-overview-tab-switch").length > 0 && $("#jdShopKey-conver").length == 0) {
            $(".oui-card-header").prepend(`<div class="yx-conversion" style='float:right;margin-left:20px'>${ plugin_name }:<div class="yx-cover-btn" ><span class="yx-cover-btn1" id='jdShopKey-conver' >一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)


    let industryConver = setInterval(() => {
        if ($(".oui-tab-switch-item-active").eq(0).text() == '行业相关搜索词' && $(".out-plan-overview-tab-switch").length > 0 && $("#industry1-conver").length == 0) {
            $(".oui-card-header").prepend(`<div class="yx-conversion" style='float:right;margin-top:12px'><div class="yx-cover-btn" ><span class="yx-cover-btn1" id='industry1-conver' >一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)


    // 监控品牌 品牌识别
    let drainShop = setInterval(() => {
        if ($("#op-mc-rival-trend-analysis-shop").length > 0 && $(".oui-tab-switch .oui-tab-switch-item-active").text() == '竞争店铺' && $("#drain-shop #drainShop-conver").length == 0) {
            $("#drain-shop #op-mc-rival-trend-analysis-shop .op-mc-rival-trend-analysis-info").append(`<div class="yx-conversion">${ plugin_name }:<div class="yx-cover-btn" style='margin:22px'><span class="yx-cover-btn1" id='drainShop-conver' style="border-radius:5px">一键转化</span></div></div>`)
        }
    }, 100)
    let drainShop1 = setInterval(() => {
        if ($("#drain-item #op-mc-rival-trend-analysis-item").length > 0 && $("#drain-item #drainShop-conver").length == 0) {
            $("#drain-item #op-mc-rival-trend-analysis-item .op-mc-rival-trend-analysis-info").append(`<div class="yx-conversion">${ plugin_name }:<div class="yx-cover-btn" style='margin:22px'><span class="yx-cover-btn1" id='drainShop-conver' style="border-radius:5px">一键转化</span></div></div>`)
        }
    }, 100)
    let drainShop2 = setInterval(() => {
        if ($("#op-mc-rival-trend-analysis-brand").length > 0 && $("#drain-brand #drainShop-conver").length == 0) {
            $("#drain-brand .oui-card-content>.op-mc-rival-trend-analysis-info").append(`<div class="yx-conversion">${ plugin_name }:<div class="yx-cover-btn" style='margin:22px'><span class="yx-cover-btn1" id='drainShop-conver' style="border-radius:5px">一键转化</span></div></div>`)
        }
    }, 100)
    

   
    let shopRecognition = setInterval(() => {
        if ($("#shopRecognitionDrainShopList .oui-card-header-wrapper").length > 0 && $("#shopRecognition-conver").length == 0) {
            $("#shopRecognitionDrainShopList .cardHeader").append(`<div class="yx-conversion">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='shopRecognition-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    // 监控品牌 品牌识别
    let brandAnalysisTrend = setInterval(() => {
        if ($("#brandAnalysisTrend .cardHeader").length > 0 && $("#brand-analysis-conver").length == 0) {
            $("#brandAnalysisTrend .cardHeader").append(`<div class="yx-conversion">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='brand-analysis-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    
    // 监控品牌 品牌识别
    let brandTrendConver = setInterval(() => {
        if ($("#drainRecognition .op-mc-rival-trend-analysis-info").length > 0 && $("#brand-trend-conver").length == 0) {
            $("#drainRecognition .op-mc-rival-trend-analysis-info").append(`<div class="yx-conversion" style="margin: 22px 10px">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='brand-trend-conver' style="border-radius:5px">一键转化</span></div></div>`)
        }
    }, 100)

    // 监控品牌 品牌列表
    let completeBrand = setInterval(() => {
        if ($("#completeBrand").length > 0 && $("#jz-brand-conver").length == 0) {
            $("#completeBrand .oui-card-header").append(`<div class="yx-conversion">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='jz-brand-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    // 监控看板
    let cardTimer = setInterval(() => {
        if ($(".mc-marketMonitor #monitor-card").length > 0 && $('.ant-table-content table').eq(1).find('.ant-table-tbody tr').length > 0 && $("#jkkb-conver").length == 0) {
            $(".mc-marketMonitor .oui-card-header").append(`<div class="yx-conversion">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='jkkb-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    let marketTimer = setInterval(() => {
        if ($(".op-mc-market-monitor-industryCard .oui-card-header-item-pull-right").length > 0 && $('.op-mc-market-monitor-industryCard').find('.ant-table-content table').find('.ant-table-tbody tr').length > 0 && $("#industry-conver").length == 0) {
        
            $(".op-mc-market-monitor-industryCard .oui-card-header-item-pull-right").eq(0).after(`<div class="yx-conversion">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='industry-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    // 市场大盘
    let market_Timer = setInterval(() => {
        if ($("#cateTrend .oui-card-header-item-pull-right").length > 0 && $("#cateTrend .oui-card-title").text() == "行业趋势" && $("#trend-conver").length == 0) {
          
            $("#cateTrend .oui-card-header-item-pull-right").eq(0).after(`<div class="yx-conversion yx-conversion-pr">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='trend-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)
    // 行业构成
    let cateCons_Timer = setInterval(() => {
        if ($("#cateCons .oui-card-header-item-pull-right").length > 0 && $("#cateCons .oui-card-title").text() == "行业构成" && $("#cateCons-conver").length == 0) {
           
            $("#cateCons .oui-card-header-item-pull-right").eq(0).after(`<div class="yx-conversion yx-conversion-pr">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='cateCons-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    // 竞店识别
    setInterval(() => {
        if ($(".op-mc-rival-trend-analysis-info").length > 0 && $(".analy-cj").length == 0 && $(".menuList .selected .selected .name").text() == "竞店识别") {
            $(".op-mc-rival-trend-analysis-info").eq(0).after(`<div class="yx-conversion yx-conversion-pt analy-cj">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='analysis-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    // 关键指标对比
    let index = setInterval(() => {
        if ($(".alife-one-design-sycm-indexes-trend").length > 0 && $(".op-mc-shop-analysis .oui-card-title").eq(1).text() == "关键指标对比" && $("#index-conver").length == 0) {
           
            $(".alife-one-design-sycm-indexes-trend .oui-card-header-item-pull-right").eq(0).after(`<div class="yx-conversion yx-conversion-pr analy-cj">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='index-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    // TOP商品榜
    let topList_Timer = setInterval(() => {
        if ($("#shopAnalysisItems").length > 0 && $("#topList-conver").length == 0) {
          
            $("#shopAnalysisItems .oui-card-header-item-pull-right").eq(0).after(`<div class="yx-conversion yx-conversion-pr analy-cj">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='topList-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    // 入店来源
    let sycmFlow = setInterval(() => {
        if ($("#sycm-mc-flow-analysis").length > 0 && $("#flowSource-conver").length == 0 && $(".menuList .selected .selected .name").text() == '竞店分析') {
           
            $("#sycm-mc-flow-analysis .oui-card-header-item-pull-right").eq(0).after(`<div class="yx-conversion yx-conversion-pr analy-cj">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='flowSource-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    // 监控商品 竞争列表
    let completeItem_Timer = setInterval(() => {
        if ($("#completeItem").length > 0 && $("#completeItem-conver").length == 0) {
           
            $("#completeItem .oui-card-header-item-pull-right").eq(0).after(`<div class="yx-conversion yx-conversion-pr analy-cj">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='completeItem-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    // 竞品 入店来源
    let goodsSycmFlow = setInterval(() => {
        if ($("#sycm-mc-flow-analysis").length > 0 && $("#goods-flowSource-conver").length == 0 && $(".menuList .selected .selected .name").text() == '竞品分析') {
           
            $("#sycm-mc-flow-analysis .oui-card-header-item-pull-right").eq(0).after(`<div class="yx-conversion yx-conversion-pr analy-cj">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='goods-flowSource-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    // 入店搜索词
    setInterval(() => {
        if ($("#itemAnalysisKeyword").length > 0 && $("#analy-keyword-conver").length == 0) {
            
            $("#itemAnalysisKeyword .oui-card-header-item-pull-right").eq(0).after(`<div class="yx-conversion yx-conversion-pr analy-cj">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='analy-keyword-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    // 关键指标对比
    setInterval(() => {
        if ($("#itemAnalysisTrend").length > 0 && $("#trend-analy-conver").length == 0) {
            $("#itemAnalysisTrend .oui-card-header-item-pull-right").eq(0).after(`<div class="yx-conversion yx-conversion-pr analy-cj">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='trend-analy-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    // 标题优化
    setInterval(() => {
        if ($(".sycm-goods-td").length != $(".sycmGoodsTitle").length && $(".menuList .selected .selected .name").text() == '商品来源') {
            $(".sycm-goods-td .goodsInfo").each(function (){
                $(this).after(`<div class="sycmGoodsTitle">标题优化</div>`)
            })
        }
    }, 100)

    // 标题拆封
    setInterval(() => {
        if ($("#item-source-detail-table").length > 0 && $("#itemTitleKey").length == 0) {
            $("#item-source-detail-table .oui-card-header-item-pull-right").eq(0).after(`<div class="yx-conversion yx-conversion-pr analy-cj">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='itemTitleKey'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    // 搜索排行
    setInterval(() => {
        if ($(".op-mc-search-rank-container").length > 0 && $("#search-rank-conver").length == 0 && $(".menuList .selected .selected .name").text() == '搜索排行') {
            $(".op-mc-search-rank-container .oui-card-header-item-pull-right").eq(0).after(`<div class="yx-conversion yx-conversion-pr analy-cj">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='search-rank-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    // 监控店铺 竞争列表
    setInterval(() => {
        if ($("#completeShop").length > 0 && $("#completeShop-conver").length == 0 && $(".menuList .selected .selected .name").text() == '监控店铺') {
            $("#completeShop .oui-card-header-item-pull-right").eq(0).after(`<div class="yx-conversion yx-conversion-pr analy-cj">小黄工具箱:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='completeShop-conver'>一键转化</span><span class="yx-cover-btn3">缓存数据</span></div></div>`)
        }
    }, 100)

    // 竞品识别 顾客流失
    setInterval(() => {
        if ($("#itemRecognition").length > 0 && $("#itemRecognition-conver").length == 0 && $(".menuList .selected .selected .name").text() == '竞品识别') {
            $("#itemRecognition .oui-card-header-item-pull-right").eq(0).after(`<div class="yx-conversion yx-conversion-pr analy-cj">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='itemRecognition-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    // 竞品识别 搜索流失
    setInterval(() => {
        if ($("#itemRecognitionCard").length > 0 && $("#itemRecognitionCard-conver").length == 0 && $(".menuList .selected .selected .name").text() == '竞品识别') {
            $("#itemRecognitionCard .oui-card-header-wrapper").eq(0).find(".oui-card-header-pull-right").eq(0).after(`<div class="yx-conversion yx-conversion-pr analy-cj">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='itemRecognitionCard-conver'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    // 市场大盘 地域分布
    setInterval(() => {
        if ($(".oui-card").length > 0 && $("#cateTrend-conver").length == 0 && $(".menuList .selected .selected .name").text() == '市场大盘') {
            $("#cateOverview").next().after(`<div class="yx-conversion yx-conversion-pr analy-cj">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='cateTrend-conver'>一键下载</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        }
    }, 100)

    let itemId = ''
    $("body").on("click", ".op-mc-item-recognition-main-operation-item", function (){
        let a = $(this).parents("tr").find(".goodsImg").attr("href").split("=")
        itemId = a[a.length-1]
    })

    let area = [{
        area_id: 440000,
        area_name: "广东省"
    },{
        area_id: 320000,
        area_name: "江苏省"
    },{
        area_id: 330000,
        area_name: "浙江省"
    },{
        area_id: 350000,
        area_name: "福建省"
    },{
        area_id: 370000,
        area_name: "山东省"
    },{
        area_id: 110000,
        area_name: "北京"
    },{
        area_id: 130000,
        area_name: "河北省"
    },{
        area_id: 410000,
        area_name: "河南省"
    },{
        area_id: 340000,
        area_name: "安徽省"
    },{
        area_id: 310000,
        area_name: "上海"
    },{
        area_id: 450000,
        area_name: "广西壮族自治区"
    },{
        area_id: 360000,
        area_name: "江西省"
    },{
        area_id: 510000,
        area_name: "四川省"
    },{
        area_id: 610000,
        area_name: "陕西省"
    },{
        area_id: 140000,
        area_name: "山西省"
    },{
        area_id: 430000,
        area_name: "湖南省"
    },{
        area_id: 420000,
        area_name: "湖北省"
    },{
        area_id: 500000,
        area_name: "重庆"
    },{
        area_id: 810000,
        area_name: "香港特别行政区"
    },{
        area_id: 120000,
        area_name: "天津"
    },{
        area_id: 210000,
        area_name: "辽宁省"
    },{
        area_id: 530000,
        area_name: "云南省"
    },{
        area_id: 710000,
        area_name: "台湾"
    },{
        area_id: 650000,
        area_name: "新疆维吾尔自治区",
    },{
        area_id: 230000,
        area_name: "黑龙江省"
    },{
        area_id: 820000,
        area_name: "澳门特别行政区"
    },{
        area_id: 520000,
        area_name: "贵州省"
    },{
        area_id: 150000,
        area_name: "内蒙古自治区"
    },{
        area_id: 460000,
        area_name: "海南省"
    },{
        area_id: 220000,
        area_name: "吉林省"
    },{
        area_id: 540000,
        area_name: "西藏自治区"
    },{
        area_id: 640000,
        area_name: "宁夏回族自治区"
    },{
        area_id: 620000,
        area_name: "甘肃省"
    }]
    $("body").on("click", '#cateTrend-conver', function(){
      

        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }

        let store = getStore()

        let dateRange,start_time,end_time,cateId,data_json,type
        let keyarea = $(".oui-breadcrumb>span").eq(1).text()
        let area_id = null
        if(keyarea){ // 如果存在就是市
            area.map(v=>{
                if(keyarea.includes(v.area_name)){
                    area_id = v.area_id
                }
            })
        }
        for (let key in store) {
            if (key.includes('/mc/mq/supply/mkt/area/province.json') && $(".oui-breadcrumb>span").length == 1) {
                type = 'province'
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                data_json = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }

            if (key.includes('/mc/mq/supply/mkt/area/city.json') && $(".oui-breadcrumb>span").length > 1 && key.includes(`provinceId=${area_id}`)) {
                type = 'city'
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                data_json = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }
        }

        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/market/area",
            data: {
                data: data_json,
                start_time,
                end_time,
                cateId,
                type
            },
            success: function (res) {
                let title = ["区域名称", "卖家数", "父行业卖家数占比", "有交易卖家数", "父行业有交易卖家数占比"]
                JSONToExcelConvertor(title, res.data, '卖家概况地域分布')
            }
        })

        
        function JSONToExcelConvertor(title, data, fileName) {
            var CSV = '';
            var row = "";
            
            for (var i = 0; i < title.length; i++) {
                row += title[i] + ',';
            }
            CSV += row + '\r\n';
           
            for (var i = 0; i < data.length; i++) {
                var row = "";
                row += data[i].area_name + '/' + '较前一日' + ','
                row += data[i].shop.value + '/' + data[i].shop.rate + ','
                row += data[i].parent_cate_shop_rate.value + '/' +  data[i].parent_cate_shop_rate.rate + ','
                row += data[i].trade_shop.value + '/' +  data[i].trade_shop.rate + ','
                row += data[i].parent_cate_trade_shop_rate.value + '/' +  data[i].parent_cate_trade_shop_rate.rate + ','

                CSV += row + '\r\n';
            }
            
            var fileName = fileName;
            var uri = new Blob(['\ufeff' + CSV], {type:"text/csv"});
            var link = document.createElement("a");
            link.href = URL.createObjectURL(uri);
            
            link.style = "visibility:hidden";
            link.download = fileName + ".csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

    })


    
    $("body").on("click", '.yx-cover-btn4', function () {
        window.open("https://subway.simba.taobao.com/#!/visitor/info", '_blank')
    })


    $("body").on("click", '#sycm-brand-conver', function () {

        let idx = $("#sycmMqBrandCunstomer .oui-index-picker-list .ant-radio-wrapper-checked").parent().index()

        let store = getStore()
        let data_json = null, ids
        for (let key in store) {
            if (key.includes('/mc/ci/brand/crowd/trend.json') && idx == 0 && key.includes("indexCode=payByrCntIndex")) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                data_json = JSON.parse(d).value._d


                ids = $.getUrlParamVal("diffBrandIds", key)
            }
            if (key.includes('/mc/ci/brand/crowd/trend.json') && idx == 1 && key.includes("indexCode=tradeIndex")) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                data_json = JSON.parse(d).value._d


                ids = $.getUrlParamVal("diffBrandIds", key)
            }
            if (key.includes('/mc/ci/brand/crowd/trend.json') && idx == 2 && key.includes("indexCode=payRateIndex")) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                data_json = JSON.parse(d).value._d


                ids = $.getUrlParamVal("diffBrandIds", key)
            }
        }

      
        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/compete/brand/customers",
            data: {
                data: data_json,
                brand_ids: ids
            },
            success: function (res) {
                $("#yx-loading").fadeOut()
                sycmBrand_table_data = res.data
                
               
            
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        maxmin: true,
                        move: false,
                        title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>品牌客群-客群趋势<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: `<div class='yx-jkkb'>
                                    <div id="echarts_brand"></div>
                                    <div class='yx-operation'>
                                        <div class='yx-btns'>
                                            <span class='yx-b1 sycmBrand_down'>下载数据</span>
                                            <span class='yx-b2 sycmBrand_copy'>复制数据</span>
                                        </div>

                                        <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_sycmBrand_rank'></div>
                                    </div>
                                    <table id='sycmBrand_table'></table>
                                </div>`
                    });

                });



                let xA = []
                let series = []

                let idsArr = ids.split(",")

                let a1 = [],a2 = [],a3 = []
                sycmBrand_table_data.map(v => {
                    if (!xA.includes(v.date)) { 
                        xA.push(v.date)
                    }
                    if (v.brand_type == '品牌1' && idsArr[0]) {
                        a1.push(v.pay_byr_cnt)
                    } else if (v.brand_type == '品牌2' && idsArr[1]) {
                        a2.push(v.pay_byr_cnt)
                    } else if(idsArr[2]){ 
                        a3.push(v.pay_byr_cnt)
                    }
                })

                let legend = []
                if (idsArr[0]) { 
                    series.push({
                        name: '品牌1',
                        type: 'line',
                        data: a1,
                        smooth: true,
                        yAxisIndex: 0,
                        symbol: 'none',
                    })
                    legend.push('品牌1')
                }
                
                if (idsArr[1]) {
                    series.push({
                        name: '品牌2',
                        type: 'line',
                        data: a2,
                        smooth: true,
                        yAxisIndex: 1,
                        symbol: 'none',
                    })
                    legend.push('品牌2')
                }
                
                if (idsArr[2]) {
                    series.push({
                        name: '品牌3',
                        type: 'line',
                        data: a3,
                        smooth: true,
                        yAxisIndex: 1,
                        symbol: 'none',
                    })
                    legend.push('品牌3')
                }
                
                var myChart = echarts.init(document.getElementById('echarts_brand'));
                // 指定图表的配置项和数据
                var option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: legend,
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '10%',
                        containLabel: false
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data:  xA
                    },
                    yAxis: [
                        {
                            type: 'value',
                            show: false,
                            // max: 10000
                        },
                        {
                            type: 'value',
                            show: false,
                            // max: 10000
                        },
                        {
                            type: 'value',
                            show: false,
                            // max: 10000
                        }
                    ],
                    series
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);

                let title = []
                $(".alife-dt-card-sycm-common-select").each(function () { 
                    title.push($(this).find(".sycm-common-select-selected-title").text())
                })


                layui.use('table', function(){
                    var table = layui.table;
                    
                    //第一个实例
                    sycmBrand_table_render = table.render({
                        id: "sycmBrand_table",
                        elem: '#sycmBrand_table',
                        title: "品牌客群-客群趋势",
                        page: true, //开启分页
                        limit: 10,
                        limits: [5, 10, 20, 50, 100],
                        data: res.data,
                        cols: [[
                            {field: 'brand_type', title: '品牌信息', minWidth: "240", unresize: true, templet: function(d){
                                if (d.brand_type == '品牌1') {
                                    return '<span>'+ title[0] +'</span>'
                                } else if (d.brand_type == '品牌2') { 
                                    return '<span>'+ title[1] +'</span>'
                                }else{
                                    return '<span>'+ title[2] +'</span>'
                                }
                            }},
                            { field: 'brand_type', title: '类目', minWidth: "120", sort: true, unresize: true,},
                            {field: 'date', title: '日期',minWidth: "120", sort: true, unresize: true},
                            {field: 'pay_byr_cnt', title: '支付人数',minWidth: "120", sort: true, unresize: true},
                            {field: 'trade_price', title: '交易金额',minWidth: "120", sort: true, unresize: true},
                            {field: 'pay_rate', title: '支付转换率(%)', minWidth: "120", sort: true, unresize: true }
                        ]]
                    });
                });
            }
        })


    })

    
    $("body").on("click", '#visitor-conver', function () {
        let data = []
        $(".table-container tbody tr").each(function (i){
            if($(this).find(".col-3 .keyword").length > 0){
                let device_type = $(".ui-switch-menu .active").index()+1
                let keyword = $(this).find(".col-3 .keyword").text()
                let time = $(this).find(".col-2").text()
                let link = $(this).find(".col-4 a").attr("href")
                let location = $(this).find(".col-5").text()
                let number = $(this).find(".col-6").text()
                
                data.push({
                    device_type,
                    keyword,
                    time,
                    link,
                    location,
                    number
                })
            }
        })

        $("#yx-loading").fadeIn()
        let shopName = $(".ebase-ModernFrame__title").text() || $(".ebase-Frame__title").text() || $(".current-shop-item-title").text()
        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/through_train/live/keyword/collect",
            data: {
                data,
                shop_name: shopName
            },
            success: function () {
                layui.use('layer', function(){
                    var layer = layui.layer;
                    layer.msg('存储数据成功');
                });
                $("#yx-loading").fadeOut()
            }
        })
    })


    $("body").on("click", '#analysisCategory-conver', function () {
        if (is_use == 0) {
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`, {
                    title: "温馨提示",
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function () {
                    layer.close(layer.index)
                });
            })
            return
        }

        $("#yx-loading").fadeIn()

        let data = []
        $(".ant-table-tbody tr").each(function (i) { 
            let cateName = $(this).find("td").eq(0).text()
            let clickHits = $(this).find("td").eq(1).text()
            let clickHitsRatio = $(this).find("td").eq(2).text()
            let clickHot = $(this).find("td").eq(3).text()
            let clickCntRatio = $(this).find("td").eq(4).text()
            let clickRate = $(this).find("td").eq(5).text()

            data.push({
                cateName,
                clickHits,
                clickHitsRatio,
                clickHot,
                clickCntRatio,
                clickRate
            })
        })


        
        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/market/search/analysis/category",
            data: {
                data
            },
            success: function (res) {
                $("#yx-loading").fadeOut()
                analysisCategory_table_data = res.data
                
            
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        maxmin: true,
                        move: false,
                        title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>搜索分析-类目构成<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: `<div class='yx-jkkb'>
                                    <div class='yx-operation'>
                                        <div class='yx-btns'>
                                            <span class='yx-b1 analysisCategory_down'>下载数据</span>
                                            <span class='yx-b2 analysisCategory_copy'>复制数据</span>
                                        </div>

                                        <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_analysisCategory_rank'></div>
                                    </div>
                                    <table id='analysisCategory_table'></table>
                                </div>`
                    });

                });


                layui.use('table', function(){
                    var table = layui.table;
                    
                    //第一个实例
                    analysisCategory_table_render = table.render({
                        id: "analysisCategory_table",
                        elem: '#analysisCategory_table',
                        title: "搜索分析-类目构成",
                        page: true, //开启分页
                        limit: 10,
                        limits: [5, 10, 20, 50, 100],
                        data: res.data,
                        cols: [[{field: 'cate_name', title: '类目名称',minWidth: "120", sort: true, unresize: true},
                        {field: 'click_hits', title: '点击人数',minWidth: "120", sort: true, unresize: true},
                        {field: 'click_num', title: '点击次数',minWidth: "120", sort: true, unresize: true},
                        {field: 'click_hits_ratio', title: '点击人数占比(%)',minWidth: "120", sort: true, unresize: true},
                        {field: 'click_cnt_ratio', title: '点击次数占比(%)',minWidth: "120", sort: true, unresize: true},
                        {field: 'click_rate', title: '点击率(%)',minWidth: "120", sort: true, unresize: true},]]
                    });
                });
            }
        })
    })

    // 复制数据 下载数据 搜索数据
    $("body").on("click", ".analysisCategory_down", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(analysisCategory_table_render.config.id, analysisCategory_table_data); //导出数据
        })
    })
    $("body").on("click", ".analysisCategory_copy", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.analysisCategory_table;
            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'

            
            str += '类目名称      点击人数       点击次数      点击人数占比(%)      点击次数占比(%)      点击率(%)\n'
            table.map((v) => {
                str += `\n${v.cate_name}      ${v.click_hits}      ${v.click_num}      ${v.click_hits_ratio}      ${v.click_cnt_ratio}      ${v.click_rate}`
            })
            

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_analysisWord_rank", function () { 
        layui.use('table', function () {
            var pieList = analysisWord_table_data;
            let key = $('#yx_analysisWord_rank').val()
            let filter = pieList.filter((v) => {
                
                let cate_name = v.cate_name
                let click_hits = v.click_hits.toString()
                let click_hits_ratio = v.click_hits_ratio.toString()
                let click_num = v.click_num.toString()
    
                return cate_name.includes(key) || click_hits.includes(key) || click_num.includes(key) || click_hits_ratio.includes(key)
            })

            analysisCategory_table_render.reload({
                data: filter
            });
        })
    })










    $("body").on("click", '#analysisWord-conver', function () {
        if (is_use == 0) {
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`, {
                    title: "温馨提示",
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function () {
                    layer.close(layer.index)
                });
            })
            return
        }

        $("#yx-loading").fadeIn()

        let idx = $(".oui-card-header-item").eq(0).find(".oui-tab-switch-item-active").index()

        let date = $(".oui-date-picker-particle-button .ant-btn-primary").text()
        let dateType = null

        if (date == '7天') {
            dateType = 'recent7'
        } else if(date == '30天'){ 
            dateType = 'recent30'
        } else if(date == '日'){ 
            dateType = 'day'
        } else if(date == '周'){ 
            dateType = 'week'
        } else if(date == '月'){ 
            dateType = 'month'
        }

        let store = getStore()
        let dateRange,start_time,end_time,data_json
        for (let key in store) {
            if (key.includes('/mc/searchword/relatedWord.json') && idx == 0 && key.includes("dateType="+dateType)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                data_json = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
            }
            if (key.includes('/mc/searchword/relatedBrand.json') && idx == 1 && key.includes("dateType="+dateType)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                data_json = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
            }
            if (key.includes('/mc/searchword/relatedProperty.json') && idx == 2 && key.includes("dateType="+dateType)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                data_json = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
            }
            if (key.includes('/mc/searchword/relatedHotWord.json') && idx == 3 && key.includes("dateType="+dateType)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                data_json = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
            }
        }

        let typeList = ['word', 'brand', 'property', 'hot']
        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/market/search/analysis/word",
            data: {
                type: typeList[idx],
                data: data_json,
                start_time,
                end_time,
            },
            success: function (res) {
                $("#yx-loading").fadeOut()
                analysisWord_table_data = res.data
                
            
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        maxmin: true,
                        move: false,
                        title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>搜索分析-相关分析<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: `<div class='yx-jkkb'>
                                    <div class='yx-operation'>
                                        <div class='yx-btns'>
                                            <span class='yx-b1 analysisWord_down'>下载数据</span>
                                            <span class='yx-b2 analysisWord_copy'>复制数据</span>
                                        </div>

                                        <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_analysisWord_rank'></div>
                                    </div>
                                    <table id='analysisWord_table'></table>
                                </div>`
                    });

                });

                let cols = []

                if (idx == 0) {
                    cols.push(
                        {field: 'keyword', title: '关键词',minWidth: "120", sort: true, unresize: true},
                        {field: 'se_ipv_uv_hits', title: '搜索人数',minWidth: "120", sort: true, unresize: true},
                        {field: 'se_ipv_hits', title: '搜索热度',minWidth: "120", sort: true, unresize: true},
                        {field: 'click_rate', title: '点击率(%)',minWidth: "120", sort: true, unresize: true},
                        {field: 'click_hits', title: '点击人数',minWidth: "120", sort: true, unresize: true},
                        {field: 'click_hot', title: '点击热度',minWidth: "120", sort: true, unresize: true},
                        {field: 'trade_price', title: '交易金额',minWidth: "120", sort: true, unresize: true},
                        {field: 'pay_rate_index', title: '支付转化率(%)',minWidth: "120", sort: true, unresize: true},
                        {field: 'online_goods_cnt', title: '在线商品数',minWidth: "120", sort: true, unresize: true},
                        {field: 'tm_click_ratio', title: '商城点击占比(%)',minWidth: "120", sort: true, unresize: true},
                        {field: 'p4p_amt', title: '直通车参考价',minWidth: "120", sort: true, unresize: true},
                        {field: 'pay_hits', title: '支付人数',minWidth: "120", sort: true, unresize: true},
                        {field: 'pay_byr_cnt', title: '客单价',minWidth: "120", sort: true, unresize: true},
                        {field: 'se_goods_rate', title: '搜索人数/在线商品数之比',minWidth: "120", sort: true, unresize: true},
                        {field: 'trade_goods_rate', title: '交易金额/在线商品数之比',minWidth: "120", sort: true, unresize: true},
                    )
                } else { 
                    cols.push(
                        {field: 'keyword', title: '关键词',minWidth: "120", sort: true, unresize: true},
                        {field: 'se_ipv_uv_hits', title: '搜索人数',minWidth: "120", sort: true, unresize: true},
                        {field: 'rel_se_word_cnt', title: '相关搜索词数',minWidth: "120", sort: true, unresize: true},
                        {field: 'click_hits', title: '点击人数',minWidth: "120", sort: true, unresize: true},
                        {field: 'avg_word_click_rate', title: '词均点击率(%)',minWidth: "120", sort: true, unresize: true},
                        {field: 'avg_word_pay_rate', title: '词均支付转化率(%)',minWidth: "120", sort: true, unresize: true},
                    )
                }
                

                layui.use('table', function(){
                    var table = layui.table;
                    
                    //第一个实例
                    analysisWord_table_render = table.render({
                        id: "analysisWord_table",
                        elem: '#analysisWord_table',
                        title: "搜索分析-相关分析",
                        page: true, //开启分页
                        limit: 10,
                        limits: [5, 10, 20, 50, 100],
                        data: res.data,
                        cols: [cols]
                    });
                });
            }
        })
    })

    // 复制数据 下载数据 搜索数据
    $("body").on("click", ".analysisWord_down", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(analysisWord_table_render.config.id, analysisWord_table_data); //导出数据
        })
    })
    $("body").on("click", ".analysisWord_copy", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.analysisWord_table;
            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'

            if (table[0].pay_hits) {
                str += '关键词      搜索人数      搜索热度      点击率(%)      点击人数      点击热度      交易金额      支付转化率(%)      在线商品数      商城点击占比(%)      直通车参考价      支付人数      客单价      搜索人数/在线商品数之比      交易金额/在线商品数之比\n'
                table.map((v) => {
                    str += `\n${v.keyword}      ${v.se_ipv_uv_hits}      ${v.se_ipv_hits}      ${v.click_rate}      ${v.click_hits}      ${v.click_hot}      ${v.trade_price}      ${v.pay_rate_index}      ${v.online_goods_cnt}      ${v.tm_click_ratio}      ${v.p4p_amt}      ${v.pay_hits}      ${v.pay_byr_cnt}      ${v.se_goods_rate}      ${v.trade_goods_rate}`
                })
            } else { 
                str += '关键词      搜索人数       相关搜索词数      点击人数      词均点击率(%)      词均支付转化率(%)\n'
                table.map((v) => {
                    str += `\n${v.keyword}      ${v.se_ipv_uv_hits}      ${v.rel_se_word_cnt}      ${v.click_hits}      ${v.avg_word_click_rate}      ${v.avg_word_pay_rate}`
                })
            }
            

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_analysisWord_rank", function () { 
        layui.use('table', function () {
            var pieList = analysisWord_table_data;
            let key = $('#yx_analysisWord_rank').val()
            let filter = pieList.filter((v) => {
                
                let keyword = v.keyword
                let se_ipv_uv_hits = v.se_ipv_uv_hits.toString()
                let trade_price = v.trade_price.toString()
                let se_ipv_hits = v.se_ipv_hits.toString()
    
                return keyword.includes(key) || se_ipv_uv_hits.includes(key) || trade_price.includes(key) || se_ipv_hits.includes(key)
            })

            analysisWord_table_render.reload({
                data: filter
            });
        })
    })






    $("body").on("click", '#searchTrend-conver', function () {
        if (is_use == 0) {
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`, {
                    title: "温馨提示",
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function () {
                    layer.close(layer.index)
                });
            })
            return
        }

        let date = $(".oui-date-picker-particle-button .ant-btn-primary").text()
        let dateType = null

        if (date == '7天') {
            dateType = 'recent7'
        } else if(date == '30天'){ 
            dateType = 'recent30'
        } else if(date == '日'){ 
            dateType = 'day'
        } else if(date == '周'){ 
            dateType = 'week'
        } else if(date == '月'){ 
            dateType = 'month'
        }
        
        console.log("dateType="+dateType)

        let store = getStore()
        let dateRange,start_time,end_time,data_json
        for (let key in store) {
            if (key.includes('/mc/searchword/propertyTrend.json') && key.includes("dateType="+dateType)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                data_json = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
            }
        }

        $("#yx-loading").fadeIn()

        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/market/search/analysis/generalize",
            data: {
                data: data_json,
                start_time,
                end_time,
                keyword: $(".item-keyword").text()
            },
            success: function (res) {
                $("#yx-loading").fadeOut()
                generalize_table_data = res.data
                
            
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        maxmin: true,
                        move: false,
                        title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>搜索分析-概况<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: `<div class='yx-jkkb'>
                                    <div id="echarts_generalize"></div>
                                    <div class='yx-operation'>
                                        <div class='yx-btns'>
                                            <span class='yx-b1 generalize_down'>下载数据</span>
                                            <span class='yx-b2 generalize_copy'>复制数据</span>
                                        </div>

                                        <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_generalize_rank'></div>
                                    </div>
                                    <table id='generalize_table'></table>
                                </div>`
                    });

                });


                let xA = []
                let series = []

                let a1 = [],a2 = [],a3 = [],a4 = [],a5 = [],a6 = [],a7 = [],a8 = [],a9 = []
                generalize_table_data.map(v=>{
                    xA.push(v.date)

                    a1.push(v.trade_price)
                    a2.push(v.se_ipv_uv_hits)
                    a3.push(v.se_ipv_hits)
                    a4.push(v.click_rate)
                    a5.push(v.click_hits)
                    a6.push(v.click_num)
                    a7.push(v.pay_rate_index)
                    a8.push(v.pay_hits)
                    a9.push(v.pay_byr_cnt)
                })

                series.push({
                    name: '交易金额',
                    type: 'line',
                    data: a1,
                    smooth: true,
                    yAxisIndex: 0,
                    symbol: 'none',
                })
                series.push({
                    name: '搜索人数',
                    type: 'line',
                    data: a2,
                    smooth: true,
                    yAxisIndex: 1,
                    symbol: 'none',
                })
                series.push({
                    name: '搜索次数',
                    type: 'line',
                    data: a3,
                    smooth: true,
                    yAxisIndex: 2,
                    symbol: 'none',
                })
                series.push({
                    name: '点击率',
                    type: 'line',
                    data: a4,
                    smooth: true,
                    yAxisIndex: 3,
                    symbol: 'none',
                })
                series.push({
                    name: '点击人数',
                    type: 'line',
                    data: a5,
                    smooth: true,
                    yAxisIndex: 4,
                    symbol: 'none',
                })
                series.push({
                    name: '点击次数',
                    type: 'line',
                    data: a6,
                    smooth: true,
                    yAxisIndex: 5,
                    symbol: 'none',
                })
                series.push({
                    name: '支付转化率(%)',
                    type: 'line',
                    data: a7,
                    smooth: true,
                    yAxisIndex: 6,
                    symbol: 'none',
                })
                series.push({
                    name: '支付人数',
                    type: 'line',
                    data: a8,
                    smooth: true,
                    yAxisIndex: 7,
                    symbol: 'none',
                })
                series.push({
                    name: '客单价',
                    type: 'line',
                    data: a9,
                    smooth: true,
                    yAxisIndex: 8,
                    symbol: 'none',
                })
                

                var myChart = echarts.init(document.getElementById('echarts_generalize'));
                // 指定图表的配置项和数据
                var option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['交易金额', '搜索人数', '搜索次数', '点击率', '点击人数', '点击次数', '支付转化率(%)', '支付人数', '客单价'],
                        selected: {
                            '搜索次数': false,
                            '点击率': false,
                            '点击人数': false,
                            '点击次数': false,
                            '支付转化率(%)': false,
                            '支付人数': false,
                            '客单价': false
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '10%',
                        containLabel: false
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data:  xA
                    },
                    yAxis: [
                        {
                            type: 'value',
                            show: false,
                            max: 10000
                        },
                        {
                            type: 'value',
                            show: false,
                            max: 100000
                        },
                        {
                            type: 'value',
                            show: false,
                            max: 1000000
                        },
                        {
                            type: 'value',
                            show: false,
                            max: 100
                        },
                        {
                            type: 'value',
                            show: false,
                            max: 10000
                        },
                        {
                            type: 'value',
                            show: false,
                            max: 1000000
                        },
                        {
                            type: 'value',
                            show: false,
                            max: 100
                        },
                        {
                            type: 'value',
                            show: false,
                            max: 30000
                        },
                        {
                            type: 'value',
                            show: false,
                            max: 1000
                        }
                    ],
                    series
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);

                

                layui.use('table', function(){
                    var table = layui.table;
                    
                    //第一个实例
                    generalize_table_render = table.render({
                    id: "generalize_table",
                    elem: '#generalize_table',
                    title: "搜索分析-概况",
                    page: true, //开启分页
                    limit: 10,
                    limits: [5, 10, 20, 50, 100],
                    data: res.data,
                    cols: [[ //表头
                        {field: 'keyword', title: '关键词', minWidth: "120",sort: true, unresize: true},
                        {field: 'date', title: '日期',minWidth: "120", sort: true, unresize: true},
                        {field: 'trade_price', title: '交易金额', minWidth: "120",sort: true, unresize: true},
                        {field: 'se_ipv_uv_hits', title: '搜索人数', minWidth: "120",sort: true, unresize: true},
                        {field: 'click_rate', title: '点击率',minWidth: "120", sort: true, unresize: true},
                        {field: 'click_hits', title: '点击人数',minWidth: "120", sort: true, unresize: true},
                        {field: 'click_num', title: '点击次数',minWidth: "120", sort: true, unresize: true},
                        {field: 'pay_rate_index', title: '支付转化率(%)',minWidth: "120", sort: true, unresize: true},
                        {field: 'pay_hits', title: '支付人数',minWidth: "120", sort: true, unresize: true},
                        {field: 'pay_byr_cnt', title: '客单价',minWidth: "120", sort: true, unresize: true},
                    ]]
                    });
                });
            }
        })
    })

    // 复制数据 下载数据 搜索数据
    $("body").on("click", ".generalize_down", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(generalize_table_render.config.id, generalize_table_data); //导出数据
        })
    })
    $("body").on("click", ".generalize_copy", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.generalize_table;
            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '关键词      交易金额       搜索人数      搜索次数      点击率(%)      点击人数      点击次数      支付转化率(%)      支付人数      客单价\n'
            table.map((v) => {
                str += `\n${v.keyword}      ${v.trade_price}      ${v.se_ipv_uv_hits}      ${v.se_ipv_hits}      ${v.click_rate}      ${v.click_hits}      ${v.click_num}      ${v.pay_rate_index}      ${v.pay_hits}      ${v.pay_byr_cnt}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_generalize_rank", function () { 
        layui.use('table', function () {
            var pieList = generalize_table_data;
            let key = $('#yx_generalize_rank').val()
            let filter = pieList.filter((v) => {
                
                let keyword = v.keyword
                let se_ipv_uv_hits = v.se_ipv_uv_hits.toString()
                let trade_price = v.trade_price.toString()
                let se_ipv_hits = v.se_ipv_hits.toString()
    
                return keyword.includes(key) || se_ipv_uv_hits.includes(key) || trade_price.includes(key) || se_ipv_hits.includes(key)
            })

            generalize_table_render.reload({
                data: filter
            });
        })
    })






    $("body").on("click", '#brand-shops-conver', function () {
        if (is_use == 0) {
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`, {
                    title: "温馨提示",
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function () {
                    layer.close(layer.index)
                });
            })
            return
        }

        let store = getStore()
        let rivalBrand1Id = null
        let rivalBrand2Id = null
        for (let key in store) {
            if (key.includes('__q__')) {
                let data = store[key]
                data = data.substr(1, data.length-2)
                let strarr = data.split("|")
                strarr.map(v => { 
                    if (v && v.includes("rivalBrand1Id") && v.includes("rivalBrand2Id")) {
                        rivalBrand1Id = getQueryStringByName('rivalBrand1Id', decodeURIComponent(v))
                        rivalBrand2Id = getQueryStringByName('rivalBrand2Id', decodeURIComponent(v))
                    }
                })
                
            }
        }

        let indexCode = ""
        if ($("#brandAnalysisShops .oui-tab-switch-item-active").text() == "热销") {
            indexCode = "tradeIndex"
        } else { 
            indexCode = "uvIndex"
        }

        
        let dateRange, start_time, end_time, cateId

        let brandTradeData1, brandUvData1, brandTradeData2, brandUvData2
        for (let key in store) {
            if (key.includes('/mc/rivalBrand/analysis/getTopShops.json') && key.includes("brandId="+rivalBrand1Id) && key.includes(`indexCode=tradeIndex`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                brandTradeData1 = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }
            if (key.includes('/mc/rivalBrand/analysis/getTopShops.json') && key.includes("brandId="+rivalBrand1Id) && key.includes(`indexCode=uvIndex`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                brandUvData1 = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }
            if (key.includes('/mc/rivalBrand/analysis/getTopShops.json') && key.includes("brandId="+rivalBrand2Id) && key.includes(`indexCode=tradeIndex`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                brandTradeData2 = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }
            if (key.includes('/mc/rivalBrand/analysis/getTopShops.json') && key.includes("brandId="+rivalBrand2Id) && key.includes(`indexCode=uvIndex`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                brandUvData2 = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }
        }


        if (brandTradeData1 && brandUvData1) {
            ajax()
        } else { 
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm('您需要先点击 热销 和 流量 两个选项卡才能显示完整数据，是否继续？',{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    layer.close(layer.index)
                    ajax()
                }, function(){
                    
                });
            })
            return
        }

        function ajax() {
            $.ajax({
                type : "POST",
                url : window.baseUrl + "/plugin/compete/brand/shop/top",
                data: {
                    brandTradeData1,
                    brandUvData1,
                    brandTradeData2,
                    brandUvData2,
                    start_time,
                    end_time,
                },
                success: function (res) {
                    
                    brandShopsTop_table_data = res.data
                    
                
                    layui.use('layer', function(){
                        var layer = layui.layer;
                    
                        layer.open({
                            type: 1,
                            maxmin: true,
                            move: false,
                            title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>品牌分析-TOP店铺榜<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                            area: ['80%', '80%'],
                            content: `<div class='yx-jkkb'>
                                        <div class='yx-operation'>
                                            <div class='yx-btns'>
                                                <span class='yx-b1 brandShopsTop_down'>下载数据</span>
                                                <span class='yx-b2 brandShopsTop_copy'>复制数据</span>
                                            </div>
    
                                            <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_brandShopsTop_rank'></div>
                                        </div>
                                        <table id='brandShopsTop_table'></table>
                                    </div>`
                        });
    
                    });
    
                    layui.use('table', function(){
                        var table = layui.table;
                        
                        //第一个实例
                        brandShopsTop_table_render = table.render({
                            id: "brandShopsTop_table",
                            elem: '#brandShopsTop_table',
                            title: "选词助手-行业相关搜索词",
                            page: true, //开启分页
                            limit: 10,
                            limits: [5, 10, 20, 50, 100],
                            data: res.data,
                            cols: [[
                                {
                                    field: 'shop_logo', title: '店铺信息', minWidth: "240", unresize: true, templet: function (d) {
                                        let img = d.shop_logo ? d.shop_logo : "https://img.alicdn.com/tfs/TB1vtTgNVXXXXX4apXXXXXXXXXX-64-64.png"
                                       
                                    return '<div class="yx-goods-logo"><img src='+ img +' class="yx-goods-img" /><div class="yx-alink"><span>'+ d.shop_name +'</span></div></div>'
                                }},
                                {field: 'brand_type', title: '类别',minWidth: "120", sort: true, unresize: true},
                                {field: 'trade_price', title: '交易金额',minWidth: "120", sort: true, unresize: true},
                                {field: 'uv_index', title: '访客人数',minWidth: "120", sort: true, unresize: true},
                                {field: 'se_ipv_uv_hits', title: '搜索人数',minWidth: "120", sort: true, unresize: true},
                                {field: 'se_ipv_rate', title: '搜索占比(%)',minWidth: "120", sort: true, unresize: true},
                                {field: 'pay_rate_index', title: '支付转化率(%)',minWidth: "120", sort: true, unresize: true},
                                {field: 'pay_hits', title: '支付人数',minWidth: "120", sort: true, unresize: true},
                                {field: 'pay_byr_cnt', title: '客单价',minWidth: "120", sort: true, unresize: true},
                                {field: 'uv_byr_price', title: 'uv价值',minWidth: "120", sort: true, unresize: true},
                            ]]
                        });
                    });
                }
            })
        }
        
    })

    // 复制数据 下载数据 搜索数据
    $("body").on("click", ".brandShopsTop_down", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(brandShopsTop_table_render.config.id, brandShopsTop_table_data); //导出数据
        })
    })
    $("body").on("click", ".brandShopsTop_copy", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.brandShopsTop_table;
            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '店铺名称      类别      交易金额      访客人数      搜索人数      搜索占比(%)      支付转化率(%)      支付人数      客单价      uv价值\n'
            table.map((v) => {
                str += `\n${v.shop_name}      ${v.brand_type}      ${v.trade_price}      ${v.uv_index}      ${v.se_ipv_uv_hits}      ${v.se_ipv_rate}      ${v.pay_rate_index}      ${v.pay_hits}      ${v.pay_byr_cnt}      ${v.uv_byr_price}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_brandShopsTop_rank", function () { 
        layui.use('table', function () {
            var pieList = brandShopsTop_table_data;
            let key = $('#yx_brandShopsTop_rank').val()
            let filter = pieList.filter((v) => {
                
                let shop_name = v.shop_name
                let brand_type = v.brand_type.toString()
                let trade_price = v.trade_price.toString()
                let uv_index = v.uv_index.toString()
    
                return shop_name.includes(key) || brand_type.includes(key) || trade_price.includes(key) || uv_index.includes(key)
            })

            brandShopsTop_table_render.reload({
                data: filter
            });
        })
    })
    

    
    function getQueryStringByName(name, url){
        var result = url.match(new RegExp("[\?\&]" + name+ "=([^\&]+)","i"));
        if(result == null || result.length < 1){
           return "";
        }
        return result[1];
    }

    $("body").on("click", '#brand-goods-conver', function () {
        if (is_use == 0) {
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`, {
                    title: "温馨提示",
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function () {
                    layer.close(layer.index)
                });
            })
            return
        }

        let store = getStore()
        let rivalBrand1Id = null
        let rivalBrand2Id = null
        for (let key in store) {
            if (key.includes('__q__')) {
                let data = store[key]
                data = data.substr(1, data.length-2)
                let strarr = data.split("|")
                strarr.map(v => { 
                    if (v && v.includes("rivalBrand1Id") && v.includes("rivalBrand2Id")) {
                        rivalBrand1Id = getQueryStringByName('rivalBrand1Id', decodeURIComponent(v))
                        rivalBrand2Id = getQueryStringByName('rivalBrand2Id', decodeURIComponent(v))
                    }
                })
                
            }
        }

        let indexCode = ""
        if ($("#brandAnalysisItems .oui-tab-switch-item-active").text() == "热销") {
            indexCode = "tradeIndex"
        } else { 
            indexCode = "uvIndex"
        }

        
        let dateRange, start_time, end_time, cateId

        let brandTradeData1, brandUvData1, brandTradeData2, brandUvData2
        for (let key in store) {
            if (key.includes('/mc/rivalBrand/analysis/getTopItems.json') && key.includes("brandId="+rivalBrand1Id) && key.includes(`indexCode=tradeIndex`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                brandTradeData1 = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }
            if (key.includes('/mc/rivalBrand/analysis/getTopItems.json') && key.includes("brandId="+rivalBrand1Id) && key.includes(`indexCode=uvIndex`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                brandUvData1 = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }
            if (key.includes('/mc/rivalBrand/analysis/getTopItems.json') && key.includes("brandId="+rivalBrand2Id) && key.includes(`indexCode=tradeIndex`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                brandTradeData2 = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }
            if (key.includes('/mc/rivalBrand/analysis/getTopItems.json') && key.includes("brandId="+rivalBrand2Id) && key.includes(`indexCode=uvIndex`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                brandUvData2 = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }
        }

        if (brandTradeData1 && brandUvData1) {
            ajax()
        } else { 
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm('您需要先点击 热销 和 流量 两个选项卡才能显示完整数据，是否继续？',{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    layer.close(layer.index)
                    ajax()
                }, function(){
                    
                });
            })
            return
        }

        function ajax() {
            $.ajax({
                type : "POST",
                url : window.baseUrl + "/plugin/compete/brand/goods/top",
                data: {
                    brandTradeData1,
                    brandUvData1,
                    brandTradeData2,
                    brandUvData2,
                    start_time,
                    end_time,
                },
                success: function (res) {
                    
                    brandGoodsTop_table_data = res.data
                    
                
                    layui.use('layer', function(){
                        var layer = layui.layer;
                    
                        layer.open({
                            type: 1,
                            maxmin: true,
                            move: false,
                            title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>品牌分析-TOP商品榜<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                            area: ['80%', '80%'],
                            content: `<div class='yx-jkkb'>
                                        <div class='yx-operation'>
                                            <div class='yx-btns'>
                                                <span class='yx-b1 brandGoodsTop_down'>下载数据</span>
                                                <span class='yx-b2 brandGoodsTop_copy'>复制数据</span>
                                            </div>
    
                                            <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_brandGoodsTop_rank'></div>
                                        </div>
                                        <table id='brandGoodsTop_table'></table>
                                    </div>`
                        });
    
                    });
    
                    layui.use('table', function(){
                        var table = layui.table;
                        
                        //第一个实例
                        brandGoodsTop_table_render = table.render({
                            id: "brandGoodsTop_table",
                            elem: '#brandGoodsTop_table',
                            title: "选词助手-行业相关搜索词",
                            page: true, //开启分页
                            limit: 10,
                            limits: [5, 10, 20, 50, 100],
                            data: res.data,
                            cols: [[
                                {field: 'shop_logo', title: '商品信息', minWidth: "240", unresize: true, templet: function(d){
                                    return '<div class="yx-goods-logo"><img src='+ d.goods_image +' class="yx-goods-img" /><div class="yx-alink">'+d.goods_title+'<span>'+ d.shop_name +'</span></div></div>'
                                }},
                                {field: 'brand_type', title: '类别',minWidth: "120", sort: true, unresize: true},
                                {field: 'trade_price', title: '交易金额',minWidth: "120", sort: true, unresize: true},
                                {field: 'uv_index', title: '访客人数',minWidth: "120", sort: true, unresize: true},
                                {field: 'se_ipv_uv_hits', title: '搜索人数',minWidth: "120", sort: true, unresize: true},
                                {field: 'se_ipv_rate', title: '搜索占比(%)',minWidth: "120", sort: true, unresize: true},
                                {field: 'pay_rate_index', title: '支付转化率(%)',minWidth: "120", sort: true, unresize: true},
                                {field: 'pay_hits', title: '支付人数',minWidth: "120", sort: true, unresize: true},
                                {field: 'pay_byr_cnt', title: '客单价',minWidth: "120", sort: true, unresize: true},
                                {field: 'uv_byr_price', title: 'uv价值',minWidth: "120", sort: true, unresize: true},
                            ]]
                        });
                    });
                }
            })
        }
        
    })

    // 复制数据 下载数据 搜索数据
    $("body").on("click", ".brandGoodsTop_down", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(brandGoodsTop_table_render.config.id, brandGoodsTop_table_data); //导出数据
        })
    })
    $("body").on("click", ".brandGoodsTop_copy", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.brandGoodsTop_table;
            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '商品名称      类别      交易金额      访客人数      搜索人数      搜索占比(%)      支付转化率(%)      支付人数      客单价      uv价值\n'
            table.map((v) => {
                str += `\n${v.goods_title}      ${v.brand_type}      ${v.trade_price}      ${v.uv_index}      ${v.se_ipv_uv_hits}      ${v.se_ipv_rate}      ${v.pay_rate_index}      ${v.pay_hits}      ${v.pay_byr_cnt}      ${v.uv_byr_price}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_brandGoodsTop_rank", function () { 
        layui.use('table', function () {
            var pieList = brandGoodsTop_table_data;
            let key = $('#yx_brandGoodsTop_rank').val()
            let filter = pieList.filter((v) => {
                
                let goods_title = v.goods_title.toString()
                let brand_type = v.brand_type.toString()
                let trade_price = v.trade_price.toString()
                let uv_index = v.uv_index.toString()
    
                return goods_title.includes(key) || brand_type.includes(key) || trade_price.includes(key) || uv_index.includes(key)
            })

            brandGoodsTop_table_render.reload({
                data: filter
            });
        })
    })











    $("body").on("click", '#industry1-conver', function () {
        if (is_use == 0) {
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`, {
                    title: "温馨提示",
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function () {
                    layer.close(layer.index)
                });
            })
            return
        }

        let typeName = $(".oui-card-header-item-pull-left .oui-tab-switch-item-active").text()
        let type = null
        switch (typeName) {
            case '搜索词':
                type = "1";
                break;
            case '长尾词':
                type = "2";
                 break;
            case '品牌词':
                type = "3";
                 break;
            case '核心词':
                type = "4";
                 break;
            case '修饰词':
                type = "5";
                 break;
        }

        let checkbox = []
        let str = ['search_rank', 'se_ipv_uv_hits', 'click_hits', 'click_rate', 'pay_rate_index']
        $(".oui-index-picker-list .ant-checkbox").each(function (i) {
            if ($(this).hasClass("ant-checkbox-checked")) {
                checkbox.push(str[i])
            }
        })

        

        let data = []
        $(".ant-table-tbody tr").each(function (i) {
            let keyword = $(this).find("td").eq(0).find("div").text()
            let obj = {
                keyword,
            }

            checkbox.map((v, i) => { 
                obj[v] = $(this).find("td").eq((i+1)).find(".alife-dt-card-common-table-sortable-value").text()
            })

            data.push(obj)
        })

        let dateRange = $.getUrlParamVal("dateRange", window.location.href).split('|')
        let start_time = dateRange[0]
        let end_time = dateRange[1]


        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/keyword/assistant/industry/search",
            data: {
                data: data,
                start_time,
                end_time,
                type
            },
            success: function (res) {
                
                industry_table_data = res.data
                
            
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        maxmin: true,
                        move: false,
                        title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>选词助手-行业相关搜索词<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: `<div class='yx-jkkb'>
                                    <div class='yx-operation'>
                                        <div class='yx-btns'>
                                            <span class='yx-b1 industry_down'>下载数据</span>
                                            <span class='yx-b2 industry_copy'>复制数据</span>
                                        </div>

                                        <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_industry_rank'></div>
                                    </div>
                                    <table id='industry_table'></table>
                                </div>`
                    });

                });


                let cols = [{field: 'keyword', title: '搜索词',minWidth: "120", sort: true, unresize: true}]
               
                checkbox.map(v => { 
                    if (v == 'search_rank') {
                        cols.push({field: 'search_rank', title: '热搜排名',minWidth: "120", sort: true, unresize: true})
                    } else if(v == 'se_ipv_uv_hits'){ 
                        cols.push({field: 'se_ipv_uv_hits', title: '搜索指数',minWidth: "120", sort: true, unresize: true})
                    }else if(v == 'click_hits'){ 
                        cols.push({field: 'click_hits', title: '点击人气',minWidth: "120", sort: true, unresize: true})
                    }else if(v == 'click_rate'){ 
                        cols.push({field: 'click_rate', title: '点击率(%)',minWidth: "120", sort: true, unresize: true})
                    }else if(v == 'pay_rate_index'){ 
                        cols.push({field: 'pay_rate_index', title: '支付转化率(%)',minWidth: "120", sort: true, unresize: true})
                    }
                })
                

                layui.use('table', function(){
                    var table = layui.table;
                    
                    //第一个实例
                    industry_table_render = table.render({
                    id: "industry_table",
                    elem: '#industry_table',
                    title: "选词助手-行业相关搜索词",
                    page: true, //开启分页
                    limit: 10,
                    limits: [5, 10, 20, 50, 100],
                    data: res.data,
                    cols: [cols]
                    });
                });
            }
        })
        

    })

    // 复制数据 下载数据 搜索数据
    $("body").on("click", ".industry_down", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(industry_table_render.config.id, industry_table_data); //导出数据
        })
    })
    $("body").on("click", ".industry_copy", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.industry_table;
            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '搜索词      热搜排名      搜索指数      点击人气      点击率(%)      支付转化率(%)\n'
            table.map((v) => {
                str += `\n${v.keyword}      ${v.search_rank}      ${v.se_ipv_uv_hits}      ${v.click_hits}      ${v.click_rate}      ${v.pay_rate_index}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_industry_rank", function () { 
        layui.use('table', function () {
            var pieList = industry_table_data;
            let key = $('#yx_industry_rank').val()
            let filter = pieList.filter((v) => {
                
                let keyword = v.keyword.toString()
    
                return keyword.includes(key)
            })

            industry_table_render.reload({
                data: filter
            });
        })
    })










    
    $("body").on("click", '#jdShopKey-conver', function () {
        if (is_use == 0) {
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`, {
                    title: "温馨提示",
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function () {
                    layer.close(layer.index)
                });
            })
            return
        }

        let typeName = $(".oui-card-header-item-pull-left .oui-tab-switch-item-active").text()
        let type = null
        switch (typeName) {
            case '搜索词':
                type = "1";
                break;
            case '长尾词':
                type = "2";
                 break;
            case '品牌词':
                type = "3";
                 break;
            case '品类词':
                type = "4";
                 break;
            case '修饰词':
                type = "5";
                 break;
        } 


        let checkbox = []
        let str = ['trade_index', 'uv_index']
        $(".oui-index-picker-list .ant-checkbox").each(function (i) {
            if ($(this).hasClass("ant-checkbox-checked")) {
                checkbox.push(str[i])
            }
        })


        let data = []
        $(".ant-table-tbody tr").each(function (i) {
            let keyword = $(this).find("td").eq(0).find("div").text()
            let obj = {
                keyword,
            }

            checkbox.map((v, i) => { 
                obj[v] = $(this).find("td").eq((i+1)).find(".alife-dt-card-common-table-sortable-value").text()
            })

            data.push(obj)
        })
        
        let dateRange = $.getUrlParamVal("dateRange", window.location.href).split('|')
        let start_time = dateRange[0]
        let end_time = dateRange[1]

        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/keyword/assistant/shop/search",
            data: {
                data: data,
                start_time,
                end_time,
                type
            },
            success: function (res) {
                
                shopLostTop_table_data = res.data
                
            
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        maxmin: true,
                        move: false,
                        title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>选词助手-竞店搜索关键词<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: `<div class='yx-jkkb'>
                                    <div class='yx-operation'>
                                        <div class='yx-btns'>
                                            <span class='yx-b1 shopLostTop_down'>下载数据</span>
                                            <span class='yx-b2 shopLostTop_copy'>复制数据</span>
                                        </div>

                                        <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_shopLostTop_rank'></div>
                                    </div>
                                    <table id='shopLostTop_table'></table>
                                </div>`
                    });

                });

                let cols = [{field: 'keyword', title: '搜索词',minWidth: "120", sort: true, unresize: true}]
                    
                checkbox.map(v => { 
                    if (v == 'uv_index') {
                        cols.push({field: 'uv_index', title: '访问人数',minWidth: "120", sort: true, unresize: true})
                    } else { 
                        cols.push({field: 'trade_price', title: '交易金额',minWidth: "120", sort: true, unresize: true})
                    }
                })

                layui.use('table', function(){
                    var table = layui.table;
                    
                    //第一个实例
                    shopLostTop_table_render = table.render({
                    id: "shopLostTop_table",
                    elem: '#shopLostTop_table',
                    title: "选词助手-竞店搜索关键词",
                    page: true, //开启分页
                    limit: 10,
                    limits: [5, 10, 20, 50, 100],
                    data: res.data,
                    cols: [cols]
                    });
                });
            }
        })
    })

    // 复制数据 下载数据 搜索数据
    $("body").on("click", ".shopLostTop_down", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(shopLostTop_table_render.config.id, shopLostTop_table_data); //导出数据
        })
    })
    $("body").on("click", ".shopLostTop_copy", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.shopLostTop_table;
            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '搜索词      访问人数      交易金额\n'
            table.map((v) => {
                str += `\n${v.keyword}      ${v.uv_index}      ${v.trade_price}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_shopLostTop_rank", function () { 
        layui.use('table', function () {
            var pieList = shopLostTop_table_data;
            let key = $('#yx_shopLostTop_rank').val()
            let filter = pieList.filter((v) => {
                
                let keyword = v.keyword.toString()
                return keyword.includes(key)
            })

            shopLostTop_table_render.reload({
                data: filter
            });
        })
    })









    
    $("body").on("click", '#shopRecognition-conver', function () {
        if (is_use == 0) {
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`, {
                    title: "温馨提示",
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function () {
                    layer.close(layer.index)
                });
            })
            return
        }

        let store = getStore()
        let dateRange,start_time,end_time,cateId,data_json
        for (let key in store) {
            if (key.includes('/mc/ci/shop/recognition/getTopDrainList.json')) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                data_json = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }
        }

        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/compete/shop/lost/top",
            data: {
                data: data_json,
                start_time,
                end_time,
                cateId
            },
            success: function (res) {
                
                shopRecognition_table_data = res.data
                
            
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        maxmin: true,
                        move: false,
                        title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>竞店识别-TOP流失店铺列表<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: `<div class='yx-jkkb'>
                                    <div class='yx-operation'>
                                        <div class='yx-btns'>
                                            <span class='yx-b1 shopRecognition_down'>下载数据</span>
                                            <span class='yx-b2 shopRecognition_copy'>复制数据</span>
                                        </div>

                                        <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_shopRecognition_rank'></div>
                                    </div>
                                    <table id='shopRecognition_table'></table>
                                </div>`
                    });

                });

                

                layui.use('table', function(){
                    var table = layui.table;
                    
                    //第一个实例
                    shopRecognition_table_render = table.render({
                    id: "shopRecognition_table",
                    elem: '#shopRecognition_table',
                    title: "竞店识别-TOP流失店铺列表",
                    page: true, //开启分页
                    limit: 10,
                    limits: [5, 10, 20, 50, 100],
                    data: res.data,
                    cols: [[ //表头
                        {field: 'shop_logo', title: '店铺信息', minWidth: "200", unresize: true, templet: function(d){
                            return '<div class="yx-goods-logo"><img src='+ d.shop_logo +' class="yx-goods-img" style="height:auto"/><div class="yx-alink">'+d.shop_name+'</div></div>'
                        }},
                        {field: 'lost_amount', title: '流失金额', minWidth: "120",sort: true, unresize: true},
                        {field: 'lost_hits', title: '流失人数', minWidth: "120",sort: true, unresize: true},
                        {field: 'uv_index', title: '访问人数', minWidth: "120",sort: true, unresize: true},
                        {field: 'se_ipv_uv_hits', title: '搜索人数',minWidth: "120", sort: true, unresize: true},
                        {field: 'trade_price', title: '交易金额',minWidth: "120", sort: true, unresize: true},
                        {field: 'se_ipv_rate', title: '搜索占比(%)',minWidth: "120", sort: true, unresize: true},
                        {field: 'uv_byr_price', title: 'uv价值',minWidth: "120", sort: true, unresize: true},
                    ]]
                    });
                });
            }
        })
    })

    // 复制数据 下载数据 搜索数据
    $("body").on("click", ".shopRecognition_down", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(shopRecognition_table_render.config.id, shopRecognition_table_data); //导出数据
        })
    })
    $("body").on("click", ".shopRecognition_copy", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.shopRecognition_table;
            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '店铺名称      流失金额      流失人数      访问人数      搜索人数      交易金额      搜索占比(%)      uv价值\n'
            table.map((v) => {
                str += `\n${v.shop_name}      ${v.lost_amount}      ${v.lost_hits}      ${v.uv_index}      ${v.se_ipv_uv_hits}      ${v.trade_price}      ${v.se_ipv_rate}      ${v.uv_byr_price}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_drainShop_rank", function () { 
        layui.use('table', function () {
            var pieList = shopRecognition_table_data;
            let key = $('#yx_drainShop_rank').val()
            let filter = pieList.filter((v) => {
                
                let uv_index = v.uv_index.toString()
                let shop_name = v.shop_name.toString()
                let lost_amount = v.lost_amount.toString()
                let se_ipv_uv_hits = v.se_ipv_uv_hits.toString()
                let lost_hits = v.lost_hits.toString()
                
                
    
                return uv_index.includes(key) || shop_name.includes(key) || lost_amount.includes(key) || se_ipv_uv_hits.includes(key) || lost_hits.includes(key)
            })

            drainShop_table_render.reload({
                data: filter
            });
        })
    })





    
    $("body").on("click", '#drainShop-conver', function () {
        if (is_use == 0) {
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`, {
                    title: "温馨提示",
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function () {
                    layer.close(layer.index)
                });
            })
            return
        }


        let typeName = $(".oui-tab-switch-item-active").text()
        let type = ''
        let dateRange, start_time, end_time, cateId, data_json
        let oname = ''

        if (typeName == "竞争店铺") {
            type = "shop"

            if ($("#drain-shop .shopName span").length == 0) { 
                layui.use('layer', function(){
                    var layer = layui.layer;
                    layer.msg('请选择一个竞争店铺');
                });
                return
            }
            oname = $("#drain-shop .shopName span").text()

            let store = getStore()
            for (let key in store) {
                if (key.includes('/mc/ci/shop/trend.json')) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }
        } else if (typeName == "竞争商品"){ 
            type = 'goods'

            if ($("#drain-item .goodsShopName").length == 0) { 
                layui.use('layer', function(){
                    var layer = layui.layer;
                    layer.msg('请选择一个竞争商品');
                });
                return
            }

            oname = $("#drain-item .goodsShopName").text()

            let store = getStore()
            for (let key in store) {
                if (key.includes('/mc/ci/item/trend.json')) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }
        } else if (typeName == "竞争品牌"){ 
            type = 'brand'

            if ($("#drain-brand .shopName span").length == 0) { 
                layui.use('layer', function(){
                    var layer = layui.layer;
                    layer.msg('请选择一个竞争品牌');
                });
                return
            }

            $("#drain-brand .shopName span").text()

            let store = getStore()
            for (let key in store) {
                if (key.includes('/mc/ci/brand/trend.json')) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }
        }


        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/compete/config/query",
            data: {
                data: data_json,
                type,
                cateId
            },
            success: function (res) {
                
                drainShop_table_data = res.data
            
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        maxmin: true,
                        move: false,
                        title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>竞争配置-竞店/商品/品牌<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: `<div class='yx-jkkb'>
                                    <div id="echarts_drainShop"></div>
                                    <div class='yx-operation'>
                                        <div class='yx-btns'>
                                            <span class='yx-b1 drainShop_down'>下载数据</span>
                                            <span class='yx-b2 drainShop_copy'>复制数据</span>
                                        </div>

                                        <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_drainShop_rank'></div>
                                    </div>
                                    <table id='drainShop_table'></table>
                                </div>`
                    });

                });



                let xA = []
                let series = []

                let a1 = [],a2 = [],a3 = [],a4 = []
                drainShop_table_data.map(v=>{
                    xA.push(v.date)

                    a1.push(v.uv_index)
                    a2.push(v.pay_rate_index)
                    a3.push(v.trade_price)
                    a4.push(v.pay_hits)
                })

                series.push({
                    name: '访客人数',
                    type: 'line',
                    data: a1,
                    smooth: true,
                    yAxisIndex: 0,
                    symbol: 'none',
                })
                series.push({
                    name: '支付转化率',
                    type: 'line',
                    data: a2,
                    smooth: true,
                    yAxisIndex: 1,
                    symbol: 'none',
                })
                series.push({
                    name: '交易金额',
                    type: 'line',
                    data: a3,
                    smooth: true,
                    yAxisIndex: 2,
                    symbol: 'none',
                })
                series.push({
                    name: '支付人数',
                    type: 'line',
                    data: a4,
                    smooth: true,
                    yAxisIndex: 3,
                    symbol: 'none',
                })

                

                var myChart = echarts.init(document.getElementById('echarts_drainShop'));
                // 指定图表的配置项和数据
                var option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['访客人数', '支付转化率', '交易金额', '支付人数'],
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '10%',
                        containLabel: false
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data:  xA
                    },
                    yAxis: [
                        {
                            type: 'value',
                            show: false,
                            max: 100000
                        },
                        {
                            type: 'value',
                            show: false,
                            max: 1
                        },
                        {
                            type: 'value',
                            show: false,
                            max: 10000000
                        },
                        {
                            type: 'value',
                            show: false,
                            max: 500
                        }
                    ],
                    series
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);

                

                layui.use('table', function(){
                    var table = layui.table;
                    
                    //第一个实例
                    drainShop_table_render = table.render({
                    id: "drainShop_table",
                    elem: '#drainShop_table',
                    title: "竞争配置-" + oname,
                    page: true, //开启分页
                    limit: 10,
                    limits: [5, 10, 20, 50, 100],
                    data: res.data,
                    cols: [[ //表头
                        {field: 'date', title: '日期', minWidth: "120",sort: true, unresize: true},
                        {field: 'trade_price', title: '交易金额', minWidth: "120", sort: true, unresize: true},
                        { field: 'uv_index', title: '访问人数', minWidth: "120", sort: true, unresize: true },
                        {field: 'pay_hits', title: '支付人数', minWidth: "120",sort: true, unresize: true},
                        {field: 'pay_rate_index', title: '支付转化率(%)', minWidth: "120",sort: true, unresize: true},
                        {field: 'pay_byr_cnt', title: '客单价', minWidth: "120",sort: true, unresize: true},
                        {field: 'uv_byr_price', title: 'uv价值', minWidth: "120",sort: true, unresize: true},
                    ]]
                    });
                });
            }
        })

        
    })

    // 复制数据 下载数据 搜索数据
    $("body").on("click", ".drainShop_down", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(drainShop_table_render.config.id, drainShop_table_data); //导出数据
        })
    })
    $("body").on("click", ".drainShop_copy", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.drainShop_table;
            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '日期      交易金额      访问人数      支付人数      支付转化率(%)      客单价      uv价值\n'
            table.map((v) => {
                str += `\n${v.date}      ${v.trade_price}      ${v.uv_index}      ${v.pay_hits}      ${v.pay_rate_index}      ${v.pay_byr_cnt}      ${v.uv_byr_price}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_drainShop_rank", function () { 
        layui.use('table', function () {
            var pieList = drainShop_table_data;
            let key = $('#yx_drainShop_rank').val()
            let filter = pieList.filter((v) => {
                
                let uv_index = v.uv_index.toString()
                let pay_hits = v.pay_hits.toString()
                let date = v.date.toString()
                let trade_price = v.trade_price.toString()
                
    
                return uv_index.includes(key) || brand_type.includes(key) || date.includes(key) || trade_price.includes(key)
            })

            drainShop_table_render.reload({
                data: filter
            });
        })
    })





    $("body").on("click", '#brand-analysis-conver', function () {
        if (is_use == 0) {
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`, {
                    title: "温馨提示",
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function () {
                    layer.close(layer.index)
                });
            })
            return
        }

        
        let dateName = $(".ant-btn-primary").text()
        let dateType = ""

        if (dateName == '30天') {
            dateType = 'recent30'
        } else if (dateName == '7天') {
            dateType = 'recent7'
        } else if (dateName == '日') { 
            dateType = 'day'
        } else if (dateName == '周') { 
            dateType = 'week'
        } else if (dateName == '月') { 
            dateType = 'month'
        }

        let shop1 = $(".alife-dt-card-sycm-common-select").eq(0).find(".sycm-common-select-selected-title").text()
        let shop1_img = $(".alife-dt-card-sycm-common-select").eq(0).find(".sycm-common-select-selected-image-wrapper img").attr("src")
        let shop2 = $(".alife-dt-card-sycm-common-select").eq(1).find(".sycm-common-select-selected-title").text()
        let shop2_img = $(".alife-dt-card-sycm-common-select").eq(1).find(".sycm-common-select-selected-image-wrapper img").attr("src")

        let store = getStore()
        let dateRange, start_time, end_time, cateId, data_json
        for (let key in store) {
            if(shop1 && !shop2){
                if (key.includes('/mc/rivalBrand/analysis/getCoreTrend.json') && key.includes(`dateType=${dateType}`) && key.includes('rivalBrand1Id') && !key.includes('rivalBrand2Id')) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }
            if(!shop1 && shop2){
                if (key.includes('/mc/rivalBrand/analysis/getCoreTrend.json') && key.includes(`dateType=${dateType}`) && key.includes('rivalBrand2Id') && !key.includes('rivalBrand1Id')) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }
            if(shop1 && shop2){
                if (key.includes('/mc/rivalBrand/analysis/getCoreTrend.json') && key.includes(`dateType=${dateType}`) && key.includes('rivalBrand2Id') && key.includes('rivalBrand1Id')) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }
        }

        let brand = []
        $(".sycm-common-select-wrapper .alife-dt-card-sycm-common-select").each(function (i) { 
            brand.push($(this).find('.sycm-common-select-selected-title').text())
        })

        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/compete/brand/keyword/index",
            data: {
                brand: brand,
                data: data_json,
                start_time,
                end_time,
                cateId
            },
            success: function (res) {
                
                brandAnalysis_table_data = res.data
            
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        maxmin: true,
                        move: false,
                        title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>品牌分析-关键指标对比<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: `<div class='yx-jkkb'>
                                    <div class='yx-operation'>
                                        <div class='yx-btns'>
                                            <span class='yx-b1 brandAnalysis_down'>下载数据</span>
                                            <span class='yx-b2 brandAnalysis_copy'>复制数据</span>
                                        </div>

                                        <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_brandAnalysis_rank'></div>
                                    </div>
                                    <table id='brandAnalysis_table'></table>
                                </div>`
                    });

                });

                

                layui.use('table', function(){
                    var table = layui.table;
                    
                    //第一个实例
                    brandAnalysis_table_render = table.render({
                    id: "brandAnalysis_table",
                    elem: '#brandAnalysis_table',
                    title: "品牌分析-关键指标对比",
                    page: true, //开启分页
                    limit: 10,
                    limits: [5, 10, 20, 50, 100],
                    data: res.data,
                    cols: [[ //表头

                        {field: 'brand_name', title: '品牌信息', minWidth: "240", unresize: true, templet: function(d){
                            if(d.brand_type == '品牌1'){
                                return '<div class="yx-goods-logo"><img src='+ shop1_img +' class="yx-goods-img" /><div class="yx-alink">'+shop1+'</div></div>'
                            }else{
                                return '<div class="yx-goods-logo"><img src='+ shop2_img +' class="yx-goods-img" /><div class="yx-alink">'+shop2+'</div></div>'
                            }
                        }},
                        {field: 'brand_type', title: '品牌类型', minWidth: "120", sort: true, unresize: true},
                        {field: 'date', title: '日期', minWidth: "120",sort: true, unresize: true},
                        {field: 'trade_price', title: '交易金额', minWidth: "120", sort: true, unresize: true},
                        {field: 'uv_index', title: '访问人数', minWidth: "120",sort: true, unresize: true},
                        {field: 'se_ipv_uv_hits', title: '搜索人数', minWidth: "120",sort: true, unresize: true},
                        {field: 'clt_hits', title: '收藏人数', minWidth: "120",sort: true, unresize: true},
                        {field: 'cart_hits', title: '加购人数',minWidth: "120", sort: true, unresize: true},
                        {field: 'pay_rate_index', title: '支付转化率(%)', minWidth: "120",sort: true, unresize: true},
                        {field: 'pay_hits', title: '支付人数', minWidth: "120",sort: true, unresize: true},
                        {field: 'pay_byr_cnt', title: '客单价',minWidth: "120", sort: true, unresize: true},
                        {field: 'uv_byr_price', title: 'uv价值', minWidth: "120",sort: true, unresize: true},
                        {field: 'se_ipv_rate', title: '搜索占比(%)',minWidth: "120", sort: true, unresize: true},
                        {field: 'cart_rate', title: '加购率(%)',minWidth: "120", sort: true, unresize: true},
                        {field: 'clt_rate', title: '收藏率(%)',minWidth: "120", sort: true, unresize: true},
                        {field: 'pay_item_cnt', title: '支付商品数',minWidth: "120", sort: true, unresize: true},
                        {field: 'slr_cnt', title: '卖家数',minWidth: "120", sort: true, unresize: true},
                        {field: 'pay_slr_cnt', title: '有支付卖家数',minWidth: "120", sort: true, unresize: true},
                    ]]
                    });
                });
            }
        })

    })


    // 复制数据 下载数据 搜索数据
    $("body").on("click", ".brandAnalysis_down", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(brandAnalysis_table_render.config.id, brandAnalysis_table_data); //导出数据
        })
    })
    $("body").on("click", ".brandAnalysis_copy", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.brandAnalysis_table;
            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '品牌名称      品牌类型      日期      交易金额      访问人数      搜索人数      收藏人数      加购人数      支付转化率(%)      支付人数      客单价      uv价值      搜索占比(%)      加购率(%)      收藏率(%)      支付商品数       卖家数       有支付卖家数\n'
            table.map((v) => {
                str += `\n${v.brand_name}      ${v.brand_type}      ${v.date}      ${v.trade_price}      ${v.uv_index}      ${v.se_ipv_uv_hits}      ${v.clt_hits}      ${v.cart_hits}      ${v.pay_rate_index}      ${v.pay_hits}      ${v.pay_byr_cnt}      ${v.uv_byr_price}      ${v.se_ipv_rate}      ${v.cart_rate}      ${v.clt_rate}      ${v.pay_item_cnt}      ${v.slr_cnt}      ${v.pay_slr_cnt}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_brandAnalysis_rank", function () { 
        layui.use('table', function () {
            var pieList = brandAnalysis_table_data;
            let key = $('#yx_brandAnalysis_rank').val()
            let filter = pieList.filter((v) => {
                
                let brand_name = v.brand_name.toString()
                let brand_type = v.brand_type.toString()
                let date = v.date.toString()
                let trade_price = v.trade_price.toString()
                
    
                return brand_name.includes(key) || brand_type.includes(key) || date.includes(key) || trade_price.includes(key)
            })

            brandAnalysis_table_render.reload({
                data: filter
            });
        })
    })










    
    
    $("body").on("click", '#brand-trend-conver', function () {
        if (is_use == 0) {
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`, {
                    title: "温馨提示",
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function () {
                    layer.close(layer.index)
                });
            })
            return
        }

        let store = getStore()
        let dateRange,start_time,end_time,cateId,data_json
        for (let key in store) {
            if (key.includes('/mc/ci/brand/trend.json')) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                data_json = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }
        }

        if (!data_json) { 
            for (let key in store) {
                if (key.includes('/mc/ci/shop/trend.json')) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }
        }

        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/compete/brand/trend",
            data: {
                data: data_json,
                start_time,
                end_time,
                cateId
            },
            success: function (res) {
                
                competeBrandTrend_table_data = res.data
                
            
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        maxmin: true,
                        move: false,
                        title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>品牌识别-趋势分析<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: `<div class='yx-jkkb'>
                                    <div id="echarts_market"></div>
                                    <div class='yx-operation'>
                                        <div class='yx-btns'>
                                            <span class='yx-b1 competeBrandTrend_down'>下载数据</span>
                                            <span class='yx-b2 competeBrandTrend_copy'>复制数据</span>
                                        </div>

                                        <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_competeBrandTrend_rank'></div>
                                    </div>
                                    <table id='competeBrandTrend_table'></table>
                                </div>`
                    });

                });


                let xA = []
                let series = []

                let a1 = [],a2 = [],a3 = [],a4 = [],a5 = [],a6 = []
                competeBrandTrend_table_data.map(v=>{
                    xA.push(v.date)

                    a1.push(v.uv_index)
                    a2.push(v.pay_rate_index)
                    a3.push(v.trade_price)
                    a4.push(v.pay_hits)
                    a5.push(v.pay_byr_cnt)
                    a6.push(v.uv_byr_price)
                })

                series.push({
                    name: '访客人数',
                    type: 'line',
                    data: a1,
                    smooth: true,
                    yAxisIndex: 0,
                    symbol: 'none',
                })
                series.push({
                    name: '支付转化率',
                    type: 'line',
                    data: a2,
                    smooth: true,
                    yAxisIndex: 1,
                    symbol: 'none',
                })
                series.push({
                    name: '交易金额',
                    type: 'line',
                    data: a3,
                    smooth: true,
                    yAxisIndex: 2,
                    symbol: 'none',
                })
                series.push({
                    name: '支付人数',
                    type: 'line',
                    data: a4,
                    smooth: true,
                    yAxisIndex: 3,
                    symbol: 'none',
                })
                series.push({
                    name: '客单价',
                    type: 'line',
                    data: a5,
                    smooth: true,
                    yAxisIndex: 4,
                    symbol: 'none',
                })
                series.push({
                    name: 'uv价值',
                    type: 'line',
                    data: a6,
                    smooth: true,
                    yAxisIndex: 5,
                    symbol: 'none',
                })
                

                var myChart = echarts.init(document.getElementById('echarts_market'));
                // 指定图表的配置项和数据
                var option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['访客人数', '支付转化率', '交易金额', '支付人数', '客单价', 'uv价值'],
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '10%',
                        containLabel: false
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data:  xA
                    },
                    yAxis: [
                        {
                            type: 'value',
                            show: false,
                            // max: 100000
                        },
                        {
                            type: 'value',
                            show: false,
                            // max: 10
                        },
                        {
                            type: 'value',
                            show: false,
                            // max: 500000
                        },
                        {
                            type: 'value',
                            show: false,
                            // max: 10000
                        },
                        {
                            type: 'value',
                            show: false,
                            // max: 10000
                        },
                        {
                            type: 'value',
                            show: false,
                            // max: 100
                        }
                    ],
                    series
                };

                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);

                

                layui.use('table', function(){
                    var table = layui.table;
                    
                    //第一个实例
                    competeBrandTrend_table_render = table.render({
                    id: "competeBrandTrend_table",
                    elem: '#competeBrandTrend_table',
                    title: "品牌识别-趋势分析",
                    page: true, //开启分页
                    limit: 10,
                    limits: [5, 10, 20, 50, 100],
                    data: res.data,
                    cols: [[ //表头
                        {field: 'date', title: '日期', minWidth: "120",sort: true, unresize: true},
                        {field: 'trade_price', title: '交易金额', minWidth: "120",sort: true, unresize: true},
                        {field: 'uv_index', title: '访问人数', minWidth: "120",sort: true, unresize: true},
                        {field: 'pay_hits', title: '支付人数',minWidth: "120", sort: true, unresize: true},
                        {field: 'pay_rate_index', title: '支付转化率(%)', minWidth: "120",sort: true, unresize: true},
                        {field: 'pay_byr_cnt', title: '客单价', minWidth: "120",sort: true, unresize: true},
                        {field: 'uv_byr_price', title: 'uv价值', minWidth: "120",sort: true, unresize: true},
                    ]]
                    });
                });
            }
        })
    })



    $("body").on("click", '#jz-brand-conver', function () {
        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }

        let tag = $(".oui-date-picker .ant-btn-primary").text()
        let dateType = null
        if(tag == '实 时'){
            dateType = 'today'
        }else if(tag == '7天'){
            dateType = 'recent7'
        }else if(tag == '30天'){
            dateType = 'recent30'
        }else if(tag == '日'){
            dateType = 'day'
        }else if(tag == '周'){
            dateType = 'week'
        }else if(tag == '月'){
            dateType = 'month'
        }

        console.log(dateType)

        let store = getStore()
        let dateRange,start_time,end_time,cateId,data_json
        for (let key in store) {
            if (key.includes('/mc/live/ci/brand/monitor/list.json') && key.includes(`dateType=${dateType}`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                data_json = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }
        }

        let idx = $(".oui-card-header-item .oui-tab-switch-item-active").index()

        if (!data_json) { 
            for (let key in store) {
                if (key.includes('/mc/ci/brand/monitor/list.json') && idx == 0 && key.includes("type=all") && key.includes(`dateType=${dateType}`)) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
                if (key.includes('/mc/ci/brand/monitor/list.json') && idx == 1 && key.includes("type=rankIncrease") && key.includes(`dateType=${dateType}`)) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
                if (key.includes('/mc/ci/brand/monitor/list.json') && idx == 2 && key.includes("type=tradeIncrease") && key.includes(`dateType=${dateType}`)) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
                if (key.includes('/mc/ci/brand/monitor/list.json') && idx == 3 && key.includes("type=flowIncrease") && key.includes(`dateType=${dateType}`)) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }
        }


        if(!data_json){
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('请稍等片刻再次点击');
            });
            return
        }

        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/compete/brand/analysis",
            data: {
                data: data_json,
                start_time,
                end_time,
                cateId
            },
            success: function (res) {
                competeBrand_table_data = res.data
                
            
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        maxmin: true,
                        move: false,
                        title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>竞争品牌-监控品牌<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: `<div class='yx-jkkb'>
                                    <div class='yx-operation'>
                                        <div class='yx-btns'>
                                            <span class='yx-b1 competeBrand_down'>下载数据</span>
                                            <span class='yx-b2 competeBrand_copy'>复制数据</span>
                                        </div>

                                        <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_competeBrand_rank'></div>
                                    </div>
                                    <table id='competeBrand_table'></table>
                                </div>`
                    });

                });

                
                let cols = []


                if($(".oui-date-picker-particle-button .ant-btn-primary").text() == '实 时'){
                    cols.push(
                        {field: 'shop_logo', title: '品牌信息', minWidth: "200", unresize: true, templet: function(d){
                            return '<div class="yx-goods-logo"><img src='+ d.brand_logo +' class="yx-goods-img" style="height:auto"/><div class="yx-alink">'+d.brand_name+'</div></div>'
                        }},
                        {field: 'trade_price', title: '交易金额', minWidth: "120",sort: true, unresize: true},
                        {field: 'cate_rank_id', title: '行业排名', minWidth: "120",sort: true, unresize: true}
                    )
                    
                }else{
                    cols.push(
                        {field: 'shop_logo', title: '品牌信息', minWidth: "200", unresize: true, templet: function(d){
                            return '<div class="yx-goods-logo"><img src='+ d.brand_logo +' class="yx-goods-img" style="height:auto"/><div class="yx-alink">'+d.brand_name+'</div></div>'
                        }},
                        {field: 'trade_price', title: '交易金额', minWidth: "120",sort: true, unresize: true},
                        {field: 'cate_rank_id', title: '行业排名', minWidth: "120",sort: true, unresize: true},
                        {field: 'uv_index', title: '访问人数', minWidth: "120",sort: true, unresize: true},
                        {field: 'pay_rate_index', title: '支付转化率(%)',minWidth: "120", sort: true, unresize: true},
                        {field: 'pay_hits', title: '支付人数', minWidth: "120",sort: true, unresize: true},
                        {field: 'pay_byr_cnt', title: '客单价', minWidth: "120",sort: true, unresize: true},
                        {field: 'uv_byr_price', title: 'uv价值', minWidth: "120",sort: true, unresize: true},
                        {field: 'se_ipv_uv_hits', title: '搜索人数',minWidth: "120", sort: true, unresize: true},
                        {field: 'clt_hits', title: '收藏人数', minWidth: "120",sort: true, unresize: true},
                        {field: 'cart_hits', title: '加购人数', minWidth: "120",sort: true, unresize: true},
                        {field: 'se_ipv_rate', title: '搜索占比(%)',minWidth: "120", sort: true, unresize: true},
                        {field: 'clt_rate', title: '收藏率(%)', minWidth: "120",sort: true, unresize: true},
                        {field: 'cart_rate', title: '加购率(%)',minWidth: "120", sort: true, unresize: true},
                    )
                }


                layui.use('table', function(){
                    var table = layui.table;
                    
                    //第一个实例
                    competeBrand_table_render = table.render({
                    id: "competeBrand_table",
                    elem: '#competeBrand_table',
                    title: "竞争品牌-监控品牌",
                    page: true, //开启分页
                    limit: 10,
                    limits: [5, 10, 20, 50, 100],
                    data: res.data,
                    cols: [cols]
                    });
                });
            }
        })

    })

    // 顾客流失 复制数据 下载数据 搜索数据
    $("body").on("click", ".competeBrand_down", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(competeBrand_table_render.config.id, competeBrand_table_data); //导出数据
        })
    })
    $("body").on("click", ".competeBrand_copy", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.competeBrand_table;
            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'

            if($(".oui-date-picker-particle-button .ant-btn-primary").text() == '实 时'){

                str += '品牌信息      交易金额      行业排名\n'
                table.map((v) => {
                    str += `\n${v.brand_name}      ${v.trade_price}      ${v.cate_rank_id}`
                })

            }else{

                str += '品牌信息      交易金额      行业排名      访问人数      支付转化率      支付人数      客单价      uv价值      搜索人数      收藏人数      加购人数      搜索占比      收藏率      加购率\n'
                table.map((v) => {
                    str += `\n${v.brand_name}      ${v.trade_price}      ${v.cate_rank_id}      ${v.uv_index}      ${v.pay_rate_index}      ${v.pay_hits}      ${v.pay_byr_cnt}      ${v.uv_byr_price}      ${v.se_ipv_uv_hits}      ${v.clt_hits}      ${v.cart_hits}      ${v.se_ipv_rate}      ${v.clt_rate}      ${v.cart_rate}`
                })

            }

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_competeBrand_rank", function () { 
        layui.use('table', function () {
            var pieList = competeBrand_table_data;
            let key = $('#yx_competeBrand_rank').val()
            let filter = pieList.filter((v) => {
                
                let brand_name = v.brand_name.toString()
                let trade_price = v.trade_price.toString()
                let cate_rank_id = v.cate_rank_id.toString()
                let uv_index = v.uv_index.toString()
                let pay_rate_index = v.pay_rate_index.toString()
                let pay_hits = v.pay_hits.toString()
                let uv_byr_price = v.uv_byr_price.toString()
                
    
                return brand_name.includes(key) || trade_price.includes(key) || cate_rank_id.includes(key) || uv_index.includes(key) || pay_rate_index.includes(key) || pay_hits.includes(key) || uv_byr_price.includes(key)
            })

            competeBrand_table_render.reload({
                data: filter
            });
        })
    })














    // 搜索流失
    $("body").on("click", '#itemRecognitionCard-conver', function(){
       
       
        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }

        let store = getStore()

        let dateRange,start_time,end_time,cateId,data_json
        for (let key in store) {
            if (key.includes('/mc/ci/item/recognition/getSeDrainDetail.json') && key.includes(`itemId=${itemId}`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                data_json = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }
        }
        
        if(!start_time){
            layui.use('layer', function () {
                var layer = layui.layer;
                
                layer.close(layer.index)
                layer.msg("请先在下面的宝贝中选择一个，点击 搜索竞争详情")
            })
            return false
        }
       

        let type = ""
        let radio = $(".ant-radio-checked").parents(".oui-index-picker-item").find(".oui-index-picker-text").text()

        if(radio == "搜索引导访客数"){
            type = "uv"
        }else if(radio == "搜索引导加购人数"){
            type = "cart"
        }else if(radio == "搜索引导支付买家数"){
            type = "pay"
        }else if(radio == "搜索引导支付转化率"){
            type = "pay_rate"
        }
        
        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/compete/goods/search/lose",
            data: {
                data: data_json,
                start_time,
                end_time,
                cateId,
                type
            },
            success: function (res) {
                
                itemRecognitionCard_table_data = res.data
                
            
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        maxmin: true,
                        move: false,
                        title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>竞品识别-搜索流失竞品推荐<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: `<div class='yx-jkkb'>
                                    <div class='yx-operation'>
                                        <div class='yx-btns'>
                                            <span class='yx-b1 itemRecognitionCard_down'>下载数据</span>
                                            <span class='yx-b2 itemRecognitionCard_copy'>复制数据</span>
                                        </div>

                                        <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_itemRecognitionCard_rank'></div>
                                    </div>
                                    <table id='itemRecognitionCard_table'></table>
                                </div>`
                    });

                });

                

                layui.use('table', function(){
                    var table = layui.table;
                    
                    //第一个实例
                    itemRecognitionCard_table_render = table.render({
                    id: "itemRecognitionCard_table",
                    elem: '#itemRecognitionCard_table',
                    title: "竞品识别-搜索流失竞品推荐",
                    page: true, //开启分页
                    limit: 10,
                    limits: [5, 10, 20, 50, 100],
                    data: res.data,
                    cols: [[ //表头
                        {field: 'shop_logo', title: '商品信息', minWidth: "240", unresize: true, templet: function(d){
                            return '<div class="yx-goods-logo"><img src='+ d.goods_logo +' class="yx-goods-img" /><div class="yx-alink"><a href='+d.goods_link+' target="_blank">'+d.goods_name+'</a></div></div>'
                        }},
                        {field: 'se_pay_amount', title: '搜索交易金额', sort: true, unresize: true},
                        // {field: 'pay_byr_cnt', title: '客单价', sort: true, unresize: true},
                        {field: 'se_ipv_uv_hits', title: '搜索人数', sort: true, unresize: true},
                        {field: 'uv_byr_price', title: '搜索uv价值', sort: true, unresize: true},
                        // {field: 'se_pay_amt_index', title: '搜索成交人数', sort: true, unresize: true},
                        // {field: 'se_byr_rate', title: '搜索转化率', sort: true, unresize: true},
                        {field: 'se_cart_index', title: '搜索加购人数', sort: true, unresize: true},
                        {field: 'cart_rate', title: '搜索加购率', sort: true, unresize: true},
                        {field: 'se_clt_index', title: '搜索收藏人数', sort: true, unresize: true},
                        {field: 'clt_rate', title: '搜索收藏率', sort: true, unresize: true},
                    ]]
                    });
                });
            }
        })

    })

    // 顾客流失 复制数据 下载数据 搜索数据
    $("body").on("click", ".itemRecognitionCard_down", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(itemRecognitionCard_table_render.config.id, itemRecognitionCard_table_data); //导出数据
        })
    })
    $("body").on("click", ".itemRecognitionCard_copy", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.itemRecognitionCard_table;
            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '搜索交易金额      搜索人数      搜索uv价值      搜索加购人数      搜索加购率      搜索收藏人数      搜索收藏率\n'
            table.map((v) => {
                str += `\n${v.se_pay_amount}      ${v.se_ipv_uv_hits}      ${v.uv_byr_price}      ${v.se_cart_index}      ${v.cart_rate}      ${v.se_clt_index}      ${v.clt_rate}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_itemRecognitionCard_rank", function () { 
        layui.use('table', function () {
            var pieList = itemRecognitionCard_table_data;
            let key = $('#yx_itemRecognitionCard_rank').val()
            let filter = pieList.filter((v) => {
                
                let goods_name = v.goods_name.toString()
                let shop_name = v.shop_name.toString()
                let se_pay_amount = v.se_pay_amount.toString()
                let se_ipv_uv_hits = v.se_ipv_uv_hits.toString()
                let se_cart_index = v.se_cart_index.toString()
                let se_pay_amt_index = v.se_pay_amt_index.toString()
                let se_clt_index = v.se_clt_index.toString()
                
    
                return goods_name.includes(key) || shop_name.includes(key) || se_pay_amount.includes(key) || se_ipv_uv_hits.includes(key) || se_cart_index.includes(key) || se_pay_amt_index.includes(key) || se_clt_index.includes(key)
            })

            itemRecognitionCard_table_render.reload({
                data: filter
            });
        })
    })





    // 顾客流失
    $("body").on("click", '#itemRecognition-conver', function(){
      

        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }


        $("#yx-loading").fadeIn()

        let store = getStore()

        let dateRange,start_time,end_time,cateId,data_json
        for (let key in store) {
            if (key.includes('/mc/ci/item/recognition/getCrmDrainList.json')) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                data_json = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }
        }
        
        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/compete/goods/customer/lose",
            data: {
                data: data_json,
                start_time,
                end_time,
                cateId
            },
            success: function (res) {
                $("#yx-loading").fadeOut()
                
                itemRecognition_table_data = res.data
                
            
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        maxmin: true,
                        move: false,
                        title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>竞品识别-顾客流失竞品推荐<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: `<div class='yx-jkkb'>
                                    <div class='yx-operation'>
                                        <div class='yx-btns'>
                                            <span class='yx-b1 itemRecognition_down'>下载数据</span>
                                            <span class='yx-b2 itemRecognition_copy'>复制数据</span>
                                        </div>

                                        <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_itemRecognition_rank'></div>
                                    </div>
                                    <table id='itemRecognition_table'></table>
                                </div>`
                    });

                });

                

                layui.use('table', function(){
                    var table = layui.table;
                    
                    //第一个实例
                    itemRecognition_table_render = table.render({
                    id: "itemRecognition_table",
                    elem: '#itemRecognition_table',
                    title: "竞品识别-顾客流失竞品推荐",
                    page: true, //开启分页
                    limit: 10,
                    limits: [5, 10, 20, 50, 100],
                    data: res.data,
                    cols: [[ //表头
                        {field: 'shop_logo', title: '商品信息', minWidth: "260", unresize: true, templet: function(d){
                            return '<div class="yx-goods-logo"><img src='+ d.goods_logo +' class="yx-goods-img" /><div class="yx-alink"><a href='+d.goods_link+' target="_blank">'+d.goods_name+'</a></div></div>'
                        }},
                        {field: 'pay_lost_amt', title: '流失金额', sort: true, unresize: true},
                        {field: 'los_byr_cnt', title: '流失人数', sort: true, unresize: true},
                        {field: 'pay_byr_cnt', title: '流失客单价', sort: true, unresize: true},
                        {field: 'los_rate', title: '流失率(%)', sort: true, unresize: true},
                        {field: 'clt_los_byr_cnt', title: '收藏后流失人数', sort: true, unresize: true},
                        {field: 'cart_los_byr_cnt', title: '加购后流失人数', sort: true, unresize: true},
                        {field: 'clt_jmp_byr_cnt', title: '收藏后跳失人数', sort: true, unresize: true},
                        {field: 'cart_jmp_byr_cnt', title: '加购后跳失人数', sort: true, unresize: true},
                        {field: 'direct_los_cnt', title: '直接流失人数', sort: true, unresize: true},
                        {field: 'los_itm_cnt', title: '引起流失的商品数', sort: true, unresize: true},
                        {field: 'los_shop_cnt', title: '引起流失的店铺数', sort: true, unresize: true},
                    ]]
                    });
                });
            }
        })

    })


    // 顾客流失 复制数据 下载数据 搜索数据
    $("body").on("click", ".itemRecognition_down", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(itemRecognition_table_render.config.id, itemRecognition_table_data); //导出数据
        })
    })
    $("body").on("click", ".itemRecognition_copy", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.itemRecognition_table;
            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '商品名称      流失金额      流失人数      流失客单价      流失率(%)      收藏后流失人数      加购后流失人数      收藏后跳失人数      加购后跳失人数      直接流失人数      引起流失的商品数      引起流失的店铺数\n'
            table.map((v) => {
                str += `\n${v.goods_name}      ${v.pay_lost_amt}      ${v.los_byr_cnt}      ${v.pay_byr_cnt}      ${v.los_rate}      ${v.clt_los_byr_cnt}      ${v.cart_los_byr_cnt}      ${v.clt_jmp_byr_cnt}      ${v.cart_jmp_byr_cnt}      ${v.direct_los_cnt}      ${v.los_itm_cnt}      ${v.los_shop_cnt}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_itemRecognition_rank", function () { 
        layui.use('table', function () {
            var pieList = itemRecognition_table_data;
            let key = $('#yx_itemRecognition_rank').val()
            let filter = pieList.filter((v) => {
                
                let goods_name = v.goods_name.toString()
                let los_byr_cnt = v.los_byr_cnt.toString()
                let los_rate = v.los_rate.toString()
                let clt_los_byr_cnt = v.clt_los_byr_cnt.toString()
                let cart_los_byr_cnt = v.cart_los_byr_cnt.toString()
                let clt_jmp_byr_cnt = v.clt_jmp_byr_cnt.toString()
    
                return goods_name.includes(key) || los_byr_cnt.includes(key) || los_rate.includes(key) || clt_los_byr_cnt.includes(key) || cart_los_byr_cnt.includes(key) || clt_jmp_byr_cnt.includes(key)
            })

            itemRecognition_table_render.reload({
                data: filter
            });
        })
    })


    $("body").on("click", '.yx-cover-btn3', function () { 

        if ($(".oui-card-header-item .oui-tab-switch-item-active").index() != 0) { 
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('暂不支持全部监控店铺之外的数据！');
            });
            return
        }

        if ($(".oui-date-picker-particle-button .ant-btn-primary").text() == '实 时') {
            let ss_list_data = JSON.parse(localStorage.getItem("ss_jd_list"))

            let lr1 = $(".ant-table-thead .ant-table-column-has-filters").eq(0).text()
            let lr2 = $(".ant-table-thead .ant-table-column-has-filters").eq(1).text()
            let lr3 = $(".ant-table-thead .ant-table-column-has-filters").eq(2).text()
            let lr4 = $(".ant-table-thead .ant-table-column-has-filters").eq(3).text()
            let lr5 = $(".ant-table-thead .ant-table-column-has-filters").eq(4).text()
            
            let data = []
            $(".ant-table-tbody tr").each(function(i){
                let shop_logo = $(this).find("td").eq(0).find("img").attr("src")
                let shop_name = $(this).find("td").eq(0).find(".shopName").text()
                let data1 = $(this).find(".ant-table-column-has-filters").eq(0).text()
                let data2 = $(this).find(".ant-table-column-has-filters").eq(1).text()
                let data3 = $(this).find(".ant-table-column-has-filters").eq(2).text()
                let data4 = $(this).find(".ant-table-column-has-filters").eq(3).text()
                let data5 = $(this).find(".ant-table-column-has-filters").eq(4).text()
                data.push({
                    shop_logo,
                    shop_name,
                    data1,
                    data2,
                    data3,
                    data4,
                    data5
                })
            })

            let dataKey = [{
                key: "uv_index",
                zh: "全店流量指数"
            },{
                key: "se_ipv_uv_hits",
                zh: "全店搜索人气"
            },{
                key: "clt_hits",
                zh: "全店收藏人气"
            },{
                key: "cart_hits",
                zh: "全店加购人气"
            },{
                key: "pay_rate_index",
                zh: "全店支付转化指数"
            },{
                key: "trade_index",
                zh: "全店交易指数"
            },{
                key: "cate_trade_index",
                zh: "类目交易指数"
            },{
                key: "pay_byr_cnt_index",
                zh: "全店客群指数"
            },{
                key: "pre_pay_amt_index",
                zh: "全店预售定金指数"
            },{
                key: "pre_pay_goods_num",
                zh: "全店预售定金商品数"
            },{
                key: "new_goods_num",
                zh: "全店上新商品数"
            },{
                key: "cate_rank",
                zh: "类目行业排名"
            }]

            let cols = []
            dataKey.map(v=>{
                if(lr1 == (v.zh)){
                    lr1 = v.key
                }
                if(lr2 == (v.zh)){
                    lr2 = v.key
                }
                if(lr3 == (v.zh)){
                    lr3 = v.key
                }
                if(lr4 == (v.zh)){
                    lr4 = v.key
                }
                if(lr5 == (v.zh)){
                    lr5 = v.key
                }
            })
            
            data.map(v=>{
                if(lr1){
                    v[lr1] = v.data1
                    delete v.data1
                }
                if(lr2){
                    v[lr2] = v.data2
                    delete v.data2
                }
                if(lr3){
                    v[lr3] = v.data3
                    delete v.data3
                }
                if(lr4){
                    v[lr4] = v.data4
                    delete v.data4
                }
                if(lr5){
                    v[lr5] = v.data5
                    delete v.data5
                }
            })

            if (ss_list_data) { 
                ss_list_data.map((v, i) => { 
                    v = Object.assign(v, data[i])
                })
            }
            
            data = ss_list_data ? ss_list_data : data
            
            localStorage.setItem("ss_jd_list", JSON.stringify(data))

            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('缓存成功!');
            }); 


        } else { 
            let idx = $(".oui-date-picker-particle-button .ant-btn-primary").index()

   
            if (idx == 1) { // 全部监控店铺 
                let day7_jd_list = JSON.parse(localStorage.getItem("day7_jd_list"))

                let lr1 = $(".ant-table-thead .ant-table-column-has-filters").eq(0).text()
                let lr2 = $(".ant-table-thead .ant-table-column-has-filters").eq(1).text()
                let lr3 = $(".ant-table-thead .ant-table-column-has-filters").eq(2).text()
                let lr4 = $(".ant-table-thead .ant-table-column-has-filters").eq(3).text()
                let lr5 = $(".ant-table-thead .ant-table-column-has-filters").eq(4).text()
                
                let data = []
                $(".ant-table-tbody tr").each(function (i) {
                    let shop_logo = $(this).find("td").eq(0).find("img").attr("src")
                    let shop_name = $(this).find("td").eq(0).find(".shopName").text()
                    let data1 = $(this).find(".ant-table-column-has-filters").eq(0).text()
                    let data2 = $(this).find(".ant-table-column-has-filters").eq(1).text()
                    let data3 = $(this).find(".ant-table-column-has-filters").eq(2).text()
                    let data4 = $(this).find(".ant-table-column-has-filters").eq(3).text()
                    let data5 = $(this).find(".ant-table-column-has-filters").eq(4).text()
                    data.push({
                        shop_logo,
                        shop_name,
                        data1,
                        data2,
                        data3,
                        data4,
                        data5
                    })
                })

                let dataKey = [{
                    key: "uv_index",
                    zh: "全店流量指数"
                }, {
                    key: "se_ipv_uv_hits",
                    zh: "全店搜索人气"
                }, {
                    key: "clt_hits",
                    zh: "全店收藏人气"
                }, {
                    key: "cart_hits",
                    zh: "全店加购人气"
                }, {
                    key: "pay_rate_index",
                    zh: "全店支付转化指数"
                }, {
                    key: "trade_index",
                    zh: "全店交易指数"
                }, {
                    key: "cate_trade_index",
                    zh: "类目交易指数"
                }, {
                    key: "pay_byr_cnt_index",
                    zh: "全店客群指数"
                }, {
                    key: "pre_pay_amt_index",
                    zh: "全店预售定金指数"
                }, {
                    key: "pre_pay_goods_num",
                    zh: "全店预售定金商品数"
                }, {
                    key: "new_goods_num",
                    zh: "全店上新商品数"
                }, {
                    key: "cate_rank",
                    zh: "类目行业排名"
                }]

                let cols = []
                dataKey.map(v => {
                    if (lr1 == (v.zh)) {
                        lr1 = v.key
                    }
                    if (lr2 == (v.zh)) {
                        lr2 = v.key
                    }
                    if (lr3 == (v.zh)) {
                        lr3 = v.key
                    }
                    if (lr4 == (v.zh)) {
                        lr4 = v.key
                    }
                    if (lr5 == (v.zh)) {
                        lr5 = v.key
                    }
                })
                
                data.map(v => {
                    if (lr1) {
                        v[lr1] = v.data1
                        delete v.data1
                    }
                    if (lr2) {
                        v[lr2] = v.data2
                        delete v.data2
                    }
                    if (lr3) {
                        v[lr3] = v.data3
                        delete v.data3
                    }
                    if (lr4) {
                        v[lr4] = v.data4
                        delete v.data4
                    }
                    if (lr5) {
                        v[lr5] = v.data5
                        delete v.data5
                    }
                })

                if (day7_jd_list) {
                    day7_jd_list.map((v, i) => {
                        v = Object.assign(v, data[i])
                    })
                }
                
                data = day7_jd_list ? day7_jd_list : data
                
                localStorage.setItem("day7_jd_list", JSON.stringify(data))
                

                layui.use('layer', function () {
                    var layer = layui.layer;
                    layer.msg('缓存成功!');
                });

            } else if (idx == 2) {
                let day30_jd_list = JSON.parse(localStorage.getItem("day30_jd_list"))

                let lr1 = $(".ant-table-thead .ant-table-column-has-filters").eq(0).text()
                let lr2 = $(".ant-table-thead .ant-table-column-has-filters").eq(1).text()
                let lr3 = $(".ant-table-thead .ant-table-column-has-filters").eq(2).text()
                let lr4 = $(".ant-table-thead .ant-table-column-has-filters").eq(3).text()
                let lr5 = $(".ant-table-thead .ant-table-column-has-filters").eq(4).text()
                
                let data = []
                $(".ant-table-tbody tr").each(function (i) {
                    let shop_logo = $(this).find("td").eq(0).find("img").attr("src")
                    let shop_name = $(this).find("td").eq(0).find(".shopName").text()
                    let data1 = $(this).find(".ant-table-column-has-filters").eq(0).text()
                    let data2 = $(this).find(".ant-table-column-has-filters").eq(1).text()
                    let data3 = $(this).find(".ant-table-column-has-filters").eq(2).text()
                    let data4 = $(this).find(".ant-table-column-has-filters").eq(3).text()
                    let data5 = $(this).find(".ant-table-column-has-filters").eq(4).text()
                    data.push({
                        shop_logo,
                        shop_name,
                        data1,
                        data2,
                        data3,
                        data4,
                        data5
                    })
                })

                let dataKey = [{
                    key: "uv_index",
                    zh: "全店流量指数"
                }, {
                    key: "se_ipv_uv_hits",
                    zh: "全店搜索人气"
                }, {
                    key: "clt_hits",
                    zh: "全店收藏人气"
                }, {
                    key: "cart_hits",
                    zh: "全店加购人气"
                }, {
                    key: "pay_rate_index",
                    zh: "全店支付转化指数"
                }, {
                    key: "trade_index",
                    zh: "全店交易指数"
                }, {
                    key: "cate_trade_index",
                    zh: "类目交易指数"
                }, {
                    key: "pay_byr_cnt_index",
                    zh: "全店客群指数"
                }, {
                    key: "pre_pay_amt_index",
                    zh: "全店预售定金指数"
                }, {
                    key: "pre_pay_goods_num",
                    zh: "全店预售定金商品数"
                }, {
                    key: "new_goods_num",
                    zh: "全店上新商品数"
                }, {
                    key: "cate_rank",
                    zh: "类目行业排名"
                }]

                let cols = []
                dataKey.map(v => {
                    if (lr1 == (v.zh)) {
                        lr1 = v.key
                    }
                    if (lr2 == (v.zh)) {
                        lr2 = v.key
                    }
                    if (lr3 == (v.zh)) {
                        lr3 = v.key
                    }
                    if (lr4 == (v.zh)) {
                        lr4 = v.key
                    }
                    if (lr5 == (v.zh)) {
                        lr5 = v.key
                    }
                })
                
                data.map(v => {
                    if (lr1) {
                        v[lr1] = v.data1
                        delete v.data1
                    }
                    if (lr2) {
                        v[lr2] = v.data2
                        delete v.data2
                    }
                    if (lr3) {
                        v[lr3] = v.data3
                        delete v.data3
                    }
                    if (lr4) {
                        v[lr4] = v.data4
                        delete v.data4
                    }
                    if (lr5) {
                        v[lr5] = v.data5
                        delete v.data5
                    }
                })

                if (day30_jd_list) {
                    day30_jd_list.map((v, i) => {
                        v = Object.assign(v, data[i])
                    })
                }
                
                data = day30_jd_list ? day30_jd_list : data
                
                localStorage.setItem("day30_jd_list", JSON.stringify(data))
                

                layui.use('layer', function () {
                    var layer = layui.layer;
                    layer.msg('缓存成功!');
                });
            } else if (idx == 3) {
                let day_jd_list = JSON.parse(localStorage.getItem("day_jd_list"))

                let lr1 = $(".ant-table-thead .ant-table-column-has-filters").eq(0).text()
                let lr2 = $(".ant-table-thead .ant-table-column-has-filters").eq(1).text()
                let lr3 = $(".ant-table-thead .ant-table-column-has-filters").eq(2).text()
                let lr4 = $(".ant-table-thead .ant-table-column-has-filters").eq(3).text()
                let lr5 = $(".ant-table-thead .ant-table-column-has-filters").eq(4).text()
                
                let data = []
                $(".ant-table-tbody tr").each(function (i) {
                    let shop_logo = $(this).find("td").eq(0).find("img").attr("src")
                    let shop_name = $(this).find("td").eq(0).find(".shopName").text()
                    let data1 = $(this).find(".ant-table-column-has-filters").eq(0).text()
                    let data2 = $(this).find(".ant-table-column-has-filters").eq(1).text()
                    let data3 = $(this).find(".ant-table-column-has-filters").eq(2).text()
                    let data4 = $(this).find(".ant-table-column-has-filters").eq(3).text()
                    let data5 = $(this).find(".ant-table-column-has-filters").eq(4).text()
                    data.push({
                        shop_logo,
                        shop_name,
                        data1,
                        data2,
                        data3,
                        data4,
                        data5
                    })
                })

                let dataKey = [{
                    key: "uv_index",
                    zh: "全店流量指数"
                }, {
                    key: "se_ipv_uv_hits",
                    zh: "全店搜索人气"
                }, {
                    key: "clt_hits",
                    zh: "全店收藏人气"
                }, {
                    key: "cart_hits",
                    zh: "全店加购人气"
                }, {
                    key: "pay_rate_index",
                    zh: "全店支付转化指数"
                }, {
                    key: "trade_index",
                    zh: "全店交易指数"
                }, {
                    key: "cate_trade_index",
                    zh: "类目交易指数"
                }, {
                    key: "pay_byr_cnt_index",
                    zh: "全店客群指数"
                }, {
                    key: "pre_pay_amt_index",
                    zh: "全店预售定金指数"
                }, {
                    key: "pre_pay_goods_num",
                    zh: "全店预售定金商品数"
                }, {
                    key: "new_goods_num",
                    zh: "全店上新商品数"
                }, {
                    key: "cate_rank",
                    zh: "类目行业排名"
                }]

                let cols = []
                dataKey.map(v => {
                    if (lr1 == (v.zh)) {
                        lr1 = v.key
                    }
                    if (lr2 == (v.zh)) {
                        lr2 = v.key
                    }
                    if (lr3 == (v.zh)) {
                        lr3 = v.key
                    }
                    if (lr4 == (v.zh)) {
                        lr4 = v.key
                    }
                    if (lr5 == (v.zh)) {
                        lr5 = v.key
                    }
                })
                
                data.map(v => {
                    if (lr1) {
                        v[lr1] = v.data1
                        delete v.data1
                    }
                    if (lr2) {
                        v[lr2] = v.data2
                        delete v.data2
                    }
                    if (lr3) {
                        v[lr3] = v.data3
                        delete v.data3
                    }
                    if (lr4) {
                        v[lr4] = v.data4
                        delete v.data4
                    }
                    if (lr5) {
                        v[lr5] = v.data5
                        delete v.data5
                    }
                })

                if (day_jd_list) {
                    day_jd_list.map((v, i) => {
                        v = Object.assign(v, data[i])
                    })
                }
                
                data = day_jd_list ? day_jd_list : data
                
                localStorage.setItem("day_jd_list", JSON.stringify(data))
                

                layui.use('layer', function () {
                    var layer = layui.layer;
                    layer.msg('缓存成功!');
                });
            } else if (idx == 4) {
                let week_jd_list = JSON.parse(localStorage.getItem("week_jd_list"))

                let lr1 = $(".ant-table-thead .ant-table-column-has-filters").eq(0).text()
                let lr2 = $(".ant-table-thead .ant-table-column-has-filters").eq(1).text()
                let lr3 = $(".ant-table-thead .ant-table-column-has-filters").eq(2).text()
                let lr4 = $(".ant-table-thead .ant-table-column-has-filters").eq(3).text()
                let lr5 = $(".ant-table-thead .ant-table-column-has-filters").eq(4).text()
                
                let data = []
                $(".ant-table-tbody tr").each(function (i) {
                    let shop_logo = $(this).find("td").eq(0).find("img").attr("src")
                    let shop_name = $(this).find("td").eq(0).find(".shopName").text()
                    let data1 = $(this).find(".ant-table-column-has-filters").eq(0).text()
                    let data2 = $(this).find(".ant-table-column-has-filters").eq(1).text()
                    let data3 = $(this).find(".ant-table-column-has-filters").eq(2).text()
                    let data4 = $(this).find(".ant-table-column-has-filters").eq(3).text()
                    let data5 = $(this).find(".ant-table-column-has-filters").eq(4).text()
                    data.push({
                        shop_logo,
                        shop_name,
                        data1,
                        data2,
                        data3,
                        data4,
                        data5
                    })
                })

                let dataKey = [{
                    key: "uv_index",
                    zh: "全店流量指数"
                }, {
                    key: "se_ipv_uv_hits",
                    zh: "全店搜索人气"
                }, {
                    key: "clt_hits",
                    zh: "全店收藏人气"
                }, {
                    key: "cart_hits",
                    zh: "全店加购人气"
                }, {
                    key: "pay_rate_index",
                    zh: "全店支付转化指数"
                }, {
                    key: "trade_index",
                    zh: "全店交易指数"
                }, {
                    key: "cate_trade_index",
                    zh: "类目交易指数"
                }, {
                    key: "pay_byr_cnt_index",
                    zh: "全店客群指数"
                }, {
                    key: "pre_pay_amt_index",
                    zh: "全店预售定金指数"
                }, {
                    key: "pre_pay_goods_num",
                    zh: "全店预售定金商品数"
                }, {
                    key: "new_goods_num",
                    zh: "全店上新商品数"
                }, {
                    key: "cate_rank",
                    zh: "类目行业排名"
                }]

                let cols = []
                dataKey.map(v => {
                    if (lr1 == (v.zh)) {
                        lr1 = v.key
                    }
                    if (lr2 == (v.zh)) {
                        lr2 = v.key
                    }
                    if (lr3 == (v.zh)) {
                        lr3 = v.key
                    }
                    if (lr4 == (v.zh)) {
                        lr4 = v.key
                    }
                    if (lr5 == (v.zh)) {
                        lr5 = v.key
                    }
                })
                
                data.map(v => {
                    if (lr1) {
                        v[lr1] = v.data1
                        delete v.data1
                    }
                    if (lr2) {
                        v[lr2] = v.data2
                        delete v.data2
                    }
                    if (lr3) {
                        v[lr3] = v.data3
                        delete v.data3
                    }
                    if (lr4) {
                        v[lr4] = v.data4
                        delete v.data4
                    }
                    if (lr5) {
                        v[lr5] = v.data5
                        delete v.data5
                    }
                })

                if (week_jd_list) {
                    week_jd_list.map((v, i) => {
                        v = Object.assign(v, data[i])
                    })
                }
                
                data = week_jd_list ? week_jd_list : data
                
                localStorage.setItem("week_jd_list", JSON.stringify(data))
                

                layui.use('layer', function () {
                    var layer = layui.layer;
                    layer.msg('缓存成功!');
                });
            } else { 
                let month_jd_list = JSON.parse(localStorage.getItem("month_jd_list"))

                let lr1 = $(".ant-table-thead .ant-table-column-has-filters").eq(0).text()
                let lr2 = $(".ant-table-thead .ant-table-column-has-filters").eq(1).text()
                let lr3 = $(".ant-table-thead .ant-table-column-has-filters").eq(2).text()
                let lr4 = $(".ant-table-thead .ant-table-column-has-filters").eq(3).text()
                let lr5 = $(".ant-table-thead .ant-table-column-has-filters").eq(4).text()
                
                let data = []
                $(".ant-table-tbody tr").each(function(i){
                    let shop_logo = $(this).find("td").eq(0).find("img").attr("src")
                    let shop_name = $(this).find("td").eq(0).find(".shopName").text()
                    let data1 = $(this).find(".ant-table-column-has-filters").eq(0).text()
                    let data2 = $(this).find(".ant-table-column-has-filters").eq(1).text()
                    let data3 = $(this).find(".ant-table-column-has-filters").eq(2).text()
                    let data4 = $(this).find(".ant-table-column-has-filters").eq(3).text()
                    let data5 = $(this).find(".ant-table-column-has-filters").eq(4).text()
                    data.push({
                        shop_logo,
                        shop_name,
                        data1,
                        data2,
                        data3,
                        data4,
                        data5
                    })
                })

                let dataKey = [{
                    key: "uv_index",
                    zh: "全店流量指数"
                },{
                    key: "se_ipv_uv_hits",
                    zh: "全店搜索人气"
                },{
                    key: "clt_hits",
                    zh: "全店收藏人气"
                },{
                    key: "cart_hits",
                    zh: "全店加购人气"
                },{
                    key: "pay_rate_index",
                    zh: "全店支付转化指数"
                },{
                    key: "trade_index",
                    zh: "全店交易指数"
                },{
                    key: "cate_trade_index",
                    zh: "类目交易指数"
                },{
                    key: "pay_byr_cnt_index",
                    zh: "全店客群指数"
                },{
                    key: "pre_pay_amt_index",
                    zh: "全店预售定金指数"
                },{
                    key: "pre_pay_goods_num",
                    zh: "全店预售定金商品数"
                },{
                    key: "new_goods_num",
                    zh: "全店上新商品数"
                },{
                    key: "cate_rank",
                    zh: "类目行业排名"
                }]

                let cols = []
                dataKey.map(v=>{
                    if(lr1 == (v.zh)){
                        lr1 = v.key
                    }
                    if(lr2 == (v.zh)){
                        lr2 = v.key
                    }
                    if(lr3 == (v.zh)){
                        lr3 = v.key
                    }
                    if(lr4 == (v.zh)){
                        lr4 = v.key
                    }
                    if(lr5 == (v.zh)){
                        lr5 = v.key
                    }
                })
                
                data.map(v=>{
                    if(lr1){
                        v[lr1] = v.data1
                        delete v.data1
                    }
                    if(lr2){
                        v[lr2] = v.data2
                        delete v.data2
                    }
                    if(lr3){
                        v[lr3] = v.data3
                        delete v.data3
                    }
                    if(lr4){
                        v[lr4] = v.data4
                        delete v.data4
                    }
                    if(lr5){
                        v[lr5] = v.data5
                        delete v.data5
                    }
                })

                if (month_jd_list) { 
                    month_jd_list.map((v, i) => { 
                        v = Object.assign(v, data[i])
                    })
                }
                
                data = month_jd_list ? month_jd_list : data
                
                localStorage.setItem("month_jd_list", JSON.stringify(data))
                

                layui.use('layer', function(){
                    var layer = layui.layer;
                    layer.msg('缓存成功!');
                });
            }
        }

    })


    setInterval(() => { 
        let ss_jd_list = localStorage.getItem("ss_jd_list")
        let day7_jd_list = localStorage.getItem("day7_jd_list")
        let day30_jd_list = localStorage.getItem("day30_jd_list")
        let day_jd_list = localStorage.getItem("day_jd_list")
        let week_jd_list = localStorage.getItem("week_jd_list")
        let month_jd_list = localStorage.getItem("month_jd_list")

        if (ss_jd_list && !window.location.href.includes("sycm.taobao.com/mc/ci/shop/monito")) { 
            localStorage.removeItem("ss_jd_list")
        }
        if (day7_jd_list && !window.location.href.includes("sycm.taobao.com/mc/ci/shop/monito")) { 
            localStorage.removeItem("day7_jd_list")
        }
        if (day30_jd_list && !window.location.href.includes("sycm.taobao.com/mc/ci/shop/monito")) { 
            localStorage.removeItem("day30_jd_list")
        }
        if (day_jd_list && !window.location.href.includes("sycm.taobao.com/mc/ci/shop/monito")) { 
            localStorage.removeItem("day_jd_list")
        }
        if (week_jd_list && !window.location.href.includes("sycm.taobao.com/mc/ci/shop/monito")) { 
            localStorage.removeItem("week_jd_list")
        }
        if (month_jd_list && !window.location.href.includes("sycm.taobao.com/mc/ci/shop/monito")) { 
            localStorage.removeItem("month_jd_list")
        }
    }, 2000)
    
    // 竞品识别 顾客流失
    $("body").on("click", '#completeShop-conver', function(){
      

        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }

        if ($(".oui-card-header-item .oui-tab-switch-item-active").index() != 0) { 
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('暂不支持除全部外的其他数据！');
            });
            return
        }

        let data
        if ($(".oui-date-picker-particle-button .ant-btn-primary").text() == '实 时') { 
            data = JSON.parse(localStorage.getItem("ss_jd_list"))
        }
        if ($(".oui-date-picker-particle-button .ant-btn-primary").text() == '7天') { 
            data = JSON.parse(localStorage.getItem("day7_jd_list"))
        }
        if ($(".oui-date-picker-particle-button .ant-btn-primary").text() == '30天') { 
            data = JSON.parse(localStorage.getItem("day30_jd_list"))
        }
        if ($(".oui-date-picker-particle-button .ant-btn-primary").text() == '日') { 
            data = JSON.parse(localStorage.getItem("day_jd_list"))
        }
        if ($(".oui-date-picker-particle-button .ant-btn-primary").text() == '周') { 
            data = JSON.parse(localStorage.getItem("week_jd_list"))
        }
        if ($(".oui-date-picker-particle-button .ant-btn-primary").text() == '月') { 
            data = JSON.parse(localStorage.getItem("month_jd_list"))
        }

        if (!data) {
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('请先缓存想要查看的数据!');
            }); 
            return
        }


        $("#yx-loading").fadeIn()

        // let lr1 = $(".ant-table-thead .ant-table-column-has-filters").eq(0).text()
        // let lr2 = $(".ant-table-thead .ant-table-column-has-filters").eq(1).text()
        // let lr3 = $(".ant-table-thead .ant-table-column-has-filters").eq(2).text()
        // let lr4 = $(".ant-table-thead .ant-table-column-has-filters").eq(3).text()
        // let lr5 = $(".ant-table-thead .ant-table-column-has-filters").eq(4).text()
        
        // let data = []
        // $(".ant-table-tbody tr").each(function(i){
        //     let shop_logo = $(this).find("td").eq(0).find("img").attr("src")
        //     let shop_name = $(this).find("td").eq(0).find(".shopName").text()
        //     let data1 = $(this).find(".ant-table-column-has-filters").eq(0).text()
        //     let data2 = $(this).find(".ant-table-column-has-filters").eq(1).text()
        //     let data3 = $(this).find(".ant-table-column-has-filters").eq(2).text()
        //     let data4 = $(this).find(".ant-table-column-has-filters").eq(3).text()
        //     let data5 = $(this).find(".ant-table-column-has-filters").eq(4).text()
        //     data.push({
        //         shop_logo,
        //         shop_name,
        //         data1,
        //         data2,
        //         data3,
        //         data4,
        //         data5
        //     })
        // })

        // let dataKey = [{
        //     key: "uv_index",
        //     zh: "全店流量指数"
        // },{
        //     key: "se_ipv_uv_hits",
        //     zh: "全店搜索人气"
        // },{
        //     key: "clt_hits",
        //     zh: "全店收藏人气"
        // },{
        //     key: "cart_hits",
        //     zh: "全店加购人气"
        // },{
        //     key: "pay_rate_index",
        //     zh: "全店支付转化指数"
        // },{
        //     key: "trade_index",
        //     zh: "全店交易指数"
        // },{
        //     key: "cate_trade_index",
        //     zh: "类目交易指数"
        // },{
        //     key: "pay_byr_cnt_index",
        //     zh: "全店客群指数"
        // },{
        //     key: "pre_pay_amt_index",
        //     zh: "全店预售定金指数"
        // },{
        //     key: "pre_pay_goods_num",
        //     zh: "全店预售定金商品数"
        // },{
        //     key: "new_goods_num",
        //     zh: "全店上新商品数"
        // },{
        //     key: "cate_rank",
        //     zh: "类目行业排名"
        // }]

        // let cols = []
        // dataKey.map(v=>{
        //     if(lr1 == (v.zh)){
        //         lr1 = v.key

        //         // cols.push({field: lr1, title: v.zh, sort: true, unresize: true})
        //     }
        //     if(lr2 == (v.zh)){
        //         lr2 = v.key

        //         // cols.push({field: lr2, title: v.zh, sort: true, unresize: true})
        //     }
        //     if(lr3 == (v.zh)){
        //         lr3 = v.key

        //         // cols.push({field: lr3, title: v.zh, sort: true, unresize: true})
        //     }
        //     if(lr4 == (v.zh)){
        //         lr4 = v.key

        //         // cols.push({field: lr4, title: v.zh, sort: true, unresize: true})
        //     }
        //     if(lr5 == (v.zh)){
        //         lr5 = v.key

        //         // cols.push({field: lr5, title: v.zh, sort: true, unresize: true})
        //     }
        // })
        
        // data.map(v=>{
        //     if(lr1){
        //         v[lr1] = v.data1
        //         delete v.data1
        //     }
        //     if(lr2){
        //         v[lr2] = v.data2
        //         delete v.data2
        //     }
        //     if(lr3){
        //         v[lr3] = v.data3
        //         delete v.data3
        //     }
        //     if(lr4){
        //         v[lr4] = v.data4
        //         delete v.data4
        //     }
        //     if(lr5){
        //         v[lr5] = v.data5
        //         delete v.data5
        //     }
        // })



        
        let dateRange = $.getUrlParamVal("dateRange", window.location.href).split('|')
        let start_time = dateRange[0]
        let end_time = dateRange[1]
        let cateId = $.getUrlParamVal("cateId", window.location.href)
       

        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/compete/shop/monitor",
            data: {
                data,
                start_time,
                end_time,
                cateId
            },
            success: function (res) {
                $("#yx-loading").fadeOut()
                
                complete_shop_table_data = res.data
                
            
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        maxmin: true,
                        move: false,
                        title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>监控店铺-竞店列表<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: `<div class='yx-jkkb'>
                                    <div class='yx-operation'>
                                        <div class='yx-btns'>
                                            <span class='yx-b1 complete_shop_down'>下载数据</span>
                                            <span class='yx-b2 complete_shop_copy'>复制数据</span>
                                        </div>
                                    </div>
                                    <table id='complete_shop_table'></table>
                                    
                                </div>`
                    });

                });

                

                layui.use('table', function(){
                    var table = layui.table;
                    
                    //第一个实例
                    complete_shop_table_render = table.render({
                    id: "complete_shop_table",
                    elem: '#complete_shop_table',
                    title: "监控店铺-竞店列表",
                    page: true, //开启分页
                    limit: 10,
                    limits: [5, 10, 20, 50, 100],
                    data: res.data,
                    cols: [[ //表头
                        {field: 'shop_logo', title: '商品信息', minWidth: "240", unresize: true, templet: function(d){
                            return '<div class="yx-goods-logo"><img src='+ d.shop_logo +' class="yx-goods-img" /><div class="yx-alink"><span>'+ d.shop_name +'</span></div></div>'
                        }},
                        // { field: 'cate_rank', title: '行业排名', minWidth: "120",sort: true, unresize: true },
                        { field: 'trade_index', title: '交易金额', minWidth: "120",sort: true, unresize: true },
                        {field: 'uv_index', title: '访问人数', minWidth: "120",sort: true, unresize: true},
                        {field: 'se_ipv_uv_hits', title: '搜索人数', minWidth: "120",sort: true, unresize: true},
                        {field: 'clt_hits', title: '收藏人数', minWidth: "120",sort: true, unresize: true},
                        {field: 'cart_hits', title: '加购人数', minWidth: "120",sort: true, unresize: true},
                        {field: 'pay_rate_index', title: '支付转化率(%)', minWidth: "120",sort: true, unresize: true},
                        {field: 'pay_hits', title: '支付人数', minWidth: "120",sort: true, unresize: true},
                        {field: 'pay_byr_cnt', title: '客单价', minWidth: "120",sort: true, unresize: true},
                        {field: 'uv_byr_price', title: 'uv价值', minWidth: "120",sort: true, unresize: true},
                        {field: 'se_ipv_rate', title: '搜索占比(%)', minWidth: "120",sort: true, unresize: true},
                        {field: 'clt_rate', title: '收藏率(%)', minWidth: "120",sort: true, unresize: true},
                        {field: 'cart_rate', title: '加购率(%)', minWidth: "120",sort: true, unresize: true},
                    ]]
                    });
                });
            }
        })
    })

    // 监控店铺 复制数据 下载数据 搜索数据
    $("body").on("click", ".complete_shop_down", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(complete_shop_table_render.config.id, complete_shop_table_data); //导出数据
        })
    })
    $("body").on("click", ".complete_shop_copy", function () {
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.msg('复制失败,请下载数据查看');
        });
    })
    




    let searchIndex = ''
    $("body").on("click", '#search-rank-conver', function(){
       

        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }

        if ($(".ebase-FaCommonFilter__left .oui-tab-switch-item-active").text() == '主题词') { 
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('不支持该操作！');
            });
            return
        }
        
        $("#yx-loading").fadeIn()
        let store = getStore()

        let dateRange,start_time,end_time,cateId
        let searchWord,tailWord,brandWord,coreWord,attrWord
        for (let key in store) {
            if (key.includes('/mc/industry/searchWord.json')) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                searchWord = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }
            if (key.includes('/mc/industry/tailWord.json')) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                tailWord = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }
            if (key.includes('/mc/industry/brandWord.json')) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                brandWord = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }
            if (key.includes('/mc/industry/coreWord.json')) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                coreWord = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }
            if (key.includes('/mc/industry/attrWord.json')) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                attrWord = JSON.parse(d).value._d
                
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }
        }

        let active = $(".ebase-FaCommonFilter__left").eq(1).find(".oui-tab-switch-item-active").text()
        let type = ''
        let data = ''
        switch(active){
            case '搜索词':
                type = 'search_word'
                data = searchWord
                break;
            case '长尾词':
                type = 'tail_word'
                data = tailWord
                break;
            case '品牌词':
                type = 'brand_word'
                data = brandWord
                break;
            case '核心词':
                type = 'core_word'
                data = coreWord
                break;
            case '修饰词':
                type = 'attr_word'
                data = attrWord
                break;
        }
        
        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/market/search/rank",
            data: {
                type,
                data,
                start_time,
                end_time,
                cateId
            },
            success : function(res) {
                $("#yx-loading").fadeOut()
              
                
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        maxmin: true,
                        move: false,
                        title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>搜索排行<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: `<div class='yx-jkkb'>
                                    <div class='yx-operation'>
                                        <div class='yx-btns'>
                                            <span class='yx-b1 search_rank_down'>下载数据</span>
                                            <span class='yx-b2 search_rank_copy'>复制数据</span>
                                        </div>
                                        <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_search_rank'></div>
                                    </div>
                                    <table id='search_rank_table'></table>
                                </div>`
                    });

                }); 


                let isHot = $(".oui-tab-switch").eq(1).find(".oui-tab-switch-item-active").text() == '热搜' ? 1 : 2
               
                if((type == 'search_word' || type == 'tail_word') && isHot == 1){ // 搜索词、长尾词  热度
                    searchIndex = 1
                    search_rank_table_data = res.data.hot
                    layui.use('table', function(){
                        var table = layui.table;
                        
                        //第一个实例
                        search_rank_table_render = table.render({
                          id: "search_rank_table",
                          elem: '#search_rank_table',
                          title: "搜索排行",
                          page: true, //开启分页
                          limit: 10,
                          limits: [5, 10, 20, 50, 100],
                          data: res.data.hot,
                          cols: [[ //表头
                            {field: 'search_word', title: '搜索词', sort: true, unresize: true},
                            {field: 'click_hits', title: '点击人数', sort: true, unresize: true},
                            {field: 'click_rate', title: '点击率(%)', sort: true, unresize: true},
                            {field: 'hot_search_rank', title: '热搜排行', sort: true, unresize: true},
                            {field: 'pay_rate', title: '支付转化率(%)', sort: true, unresize: true},
                            {field: 'search_uv_hits', title: '搜索人数', sort: true, unresize: true},
                            {field: 'click_num', title: '点击次数', sort: true, unresize: true},
                            {field: 'pay_hits', title: '支付人数', sort: true, unresize: true},
                          ]]
                        });
                    });
                }
                if((type == 'search_word' || type == 'tail_word') && isHot == 2){ // 搜索词、长尾词  飙升
                    searchIndex = 2
                    search_rank_table_data = res.data.soar
                    layui.use('table', function(){
                        var table = layui.table;
                        
                        //第一个实例
                        search_rank_table_render = table.render({
                          id: "search_rank_table",
                          elem: '#search_rank_table',
                          title: "搜索排行",
                          page: true, //开启分页
                          limit: 10,
                          limits: [5, 10, 20, 50, 100],
                          data: res.data.soar,
                          cols: [[ //表头
                            {field: 'search_word', title: '搜索词', sort: true, unresize: true},
                            {field: 'click_hits', title: '点击人数', sort: true, unresize: true},
                            {field: 'click_rate', title: '点击率(%)', sort: true, unresize: true},
                            {field: 'pay_rate', title: '支付转化率(%)', sort: true, unresize: true},
                            {field: 'search_uv_hits', title: '搜索人数', sort: true, unresize: true},
                            {field: 'search_rise_rate', title: '搜索增长幅度(%)', sort: true, unresize: true},
                            {field: 'soar_rank', title: '飙升排行', sort: true, unresize: true},
                            {field: 'click_num', title: '点击次数', sort: true, unresize: true},
                            {field: 'pay_hits', title: '支付人数', sort: true, unresize: true},
                          ]]
                        });
                    });
                }
                if((type == 'brand_word' || type == 'core_word' || type == 'attr_word') && isHot == 1){ // 品牌词、核心词、修饰词 热搜
                    searchIndex = 3
                    search_rank_table_data = res.data.hot
                    layui.use('table', function(){
                        var table = layui.table;
                        
                        //第一个实例
                        search_rank_table_render = table.render({
                          id: "search_rank_table",
                          elem: '#search_rank_table',
                          title: "搜索排行",
                          page: true, //开启分页
                          limit: 10,
                          limits: [5, 10, 20, 50, 100],
                          data: res.data.hot,
                          cols: [[ //表头
                            {field: 'search_word', title: '搜索词', sort: true, unresize: true},
                            {field: 'click_hits', title: '点击人数', sort: true, unresize: true},
                            {field: 'click_rate', title: '点击率(%)', sort: true, unresize: true},
                            {field: 'hot_search_rank', title: '热搜排行', sort: true, unresize: true},
                            {field: 'pay_rate', title: '支付转化率(%)', sort: true, unresize: true},
                            {field: 'search_uv_hits', title: '搜索人数', sort: true, unresize: true},
                            {field: 'search_word_num', title: '相关搜索词数', sort: true, unresize: true},
                            {field: 'pay_hits', title: '支付人数', sort: true, unresize: true},
                          ]]
                        });
                    });
                }
                if((type == 'brand_word' || type == 'core_word' || type == 'attr_word') && isHot == 2){ // 品牌词、核心词、修饰词 飙升
                    searchIndex = 4
                    search_rank_table_data = res.data.soar
                    layui.use('table', function(){
                        var table = layui.table;
                        
                        //第一个实例
                        search_rank_table_render = table.render({
                          id: "search_rank_table",
                          elem: '#search_rank_table',
                          title: "搜索排行",
                          page: true, //开启分页
                          limit: 10,
                          limits: [5, 10, 20, 50, 100],
                          data: res.data.soar,
                          cols: [[ //表头
                            {field: 'search_word', title: '搜索词', sort: true, unresize: true},
                            {field: 'click_hits', title: '点击人数', sort: true, unresize: true},
                            {field: 'pay_rate', title: '支付转化率(%)', sort: true, unresize: true},
                            {field: 'search_uv_hits', title: '搜索人数', sort: true, unresize: true},
                            {field: 'search_rise_rate', title: '搜索增长幅度(%)', sort: true, unresize: true},
                            {field: 'search_word_num', title: '相关搜索词数', sort: true, unresize: true},
                            {field: 'soar_rank', title: '飙升排行', sort: true, unresize: true},
                            {field: 'pay_hits', title: '支付人数', sort: true, unresize: true},
                            {field: 'click_rate', title: '点击率', sort: true, unresize: true},
                          ]]
                        });
                    });
                }
            },
            error: function (err) {
                console.log(err)
            }
        })

    })
    // 搜索排行 复制数据 下载数据 搜索数据
    $("body").on("click", ".search_rank_down", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(search_rank_table_render.config.id, search_rank_table_data); //导出数据
        })
    })
    $("body").on("click", ".search_rank_copy", function () {
        let str = ''
        
        layui.use('table', function () {
            var table = layui.table.cache.search_rank_table;
            let str = ''

            if(searchIndex == 1){
                str += plugin_name+"\n"
                str += '\n'
                str += '搜索词      点击人数      点击率      热搜排行      支付转化率      搜索人数      点击次数      支付人数\n'
                table.map((v) => {
                    
                    str += `\n${v.search_word}      ${v.click_hits}      ${v.click_rate}      ${v.hot_search_rank}      ${v.pay_rate}      ${v.search_uv_hits}      ${v.click_num}      ${v.pay_hits}`
                })
            }else if(searchIndex == 2){
                str += plugin_name+"\n"
                str += '\n'
                str += '搜索词      点击人数      点击率      支付转化率      搜索人数      搜索增长幅度      飙升排行      点击次数      支付人数\n'
                table.map((v) => {
                    str += `\n${v.search_word}      ${v.click_hits}      ${v.click_rate}      ${v.hot_search_rank}      ${v.search_uv_hits}      ${v.search_rise_rate}      ${v.soar_rank}      ${v.click_num}      ${v.pay_hits}`
                })
            }else if(searchIndex == 3){
                str += plugin_name+"\n"
                str += '\n'
                str += '搜索词      点击人数      点击率      热搜排行      支付转化率      搜索人数      相关搜索词数      支付人数\n'
                table.map((v) => {
                    str += `\n${v.search_word}      ${v.click_hits}      ${v.click_rate}      ${v.hot_search_rank}      ${v.pay_rate}      ${v.search_uv_hits}      ${v.search_word_num}      ${v.pay_hits}`
                })
            }else if(searchIndex == 4){
                str += plugin_name+"\n"
                str += '\n'
                str += '搜索词      点击人数      支付转化率      搜索人数      搜索增长幅度      相关搜索词数      飙升排行      支付人数\n'
                table.map((v) => {
                    str += `\n${v.search_word}      ${v.click_hits}      ${v.pay_rate}      ${v.search_uv_hits}      ${v.search_rise_rate}      ${v.search_word_num}      ${v.soar_rank}      ${v.pay_hits}`
                })
            }
            

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_search_rank", function () { 
        layui.use('table', function () {
            var pieList = search_rank_table_data;
            let key = $('#yx_search_rank').val()
            let filter = pieList.filter((v) => {
                

                
                
                if(searchIndex == 1){
                    let search_word = v.search_word.toString()
                    let click_hits = v.click_hits.toString()
                    let click_rate = v.click_rate.toString()
                    let hot_search_rank = v.hot_search_rank.toString()
                    let pay_rate = v.pay_rate.toString()
                    let search_uv_hits = v.search_uv_hits.toString()
                    return search_word.includes(key) || click_hits.includes(key) || hot_search_rank.includes(key) || click_rate.includes(key) || pay_rate.includes(key) || search_uv_hits.includes(key)
                }else if(searchIndex == 2){
                    let search_word = v.search_word.toString()
                    let click_hits = v.click_hits.toString()
                    let click_rate = v.click_rate.toString()
                    let soar_rank = v.soar_rank.toString()
                    let pay_rate = v.pay_rate.toString()
                    let search_uv_hits = v.search_uv_hits.toString()

                    return search_word.includes(key) || click_hits.includes(key) || click_rate.includes(key) || soar_rank.includes(key) || pay_rate.includes(key) || search_uv_hits.includes(key)
                }else if(searchIndex == 3){
                    let search_word = v.search_word.toString()
                    let click_hits = v.click_hits.toString()
                    let hot_search_rank = v.hot_search_rank.toString()
                    let pay_rate = v.pay_rate.toString()
                    let search_uv_hits = v.search_uv_hits.toString()
                    let search_word_num = v.search_word_num.toString()

                    return search_word.includes(key) || click_hits.includes(key) ||  hot_search_rank.includes(key) || pay_rate.includes(key) || search_uv_hits.includes(key) || search_word_num.includes(key)
                }else if(searchIndex == 4){
                    let search_word = v.search_word.toString()
                    let click_hits = v.click_hits.toString()
                    let pay_rate = v.pay_rate.toString()
                    let search_uv_hits = v.search_uv_hits.toString()
                    let search_word_num = v.search_word_num.toString()
                    let search_rise_rate = v.search_rise_rate.toString()

                    return search_word.includes(key) || click_hits.includes(key) || pay_rate.includes(key) || search_uv_hits.includes(key) || search_rise_rate.includes(key) || search_word_num.includes(key) || soar_rank.includes(key)
                }
            })

            search_rank_table_render.reload({
                data: filter
            });
        })
    })







    
    $("body").on("click", '#itemTitleKey', function(){
      
        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }

        $("#yx-loading").fadeIn()

        let dateRange = $.getUrlParamVal("dateRange", window.location.href)
        let dateType = $.getUrlParamVal("dateType", window.location.href)
        let itemId = $.getUrlParamVal("itemId", window.location.href)

        readWorkbookFromRemoteFile(`https://sycm.taobao.com/flow/excel.do?_path_=v3/new/excel/item/source/detail&order=desc&orderBy=uv&dateType=${dateType}&dateRange=${dateRange}&itemId=${itemId}&device=2&pageId=23.s1150&pPageId=23&pageLevel=2&childPageType=se_keyword&belong=all`, function(res){
            let data = res.Sheets[res.SheetNames]

           
            let line_start = 7
            let z = data['!ref'].split(":")[1]
            let line_end = z.slice(1)

            
            let arr = []

            let key = []
            let visitor = []
            let volume = []
            let conversion = []
            let collection = []
            let addpurchase = []
            for(let i=line_start;i<line_end;i++){
                key.push(data['A'+i].v)
                visitor.push(data['B'+i].v)
                volume.push(data['I'+i].v)
                conversion.push(data['J'+i].v)
                collection.push(data['G'+i].v)
                addpurchase.push(data['H'+i].v)
            }
            
            key.map((v, i)=>{
                arr.push({
                    key: v, // 关键字
                    visitor: visitor[i], // 访客
                    volume: volume[i], // 销量
                    conversion: conversion[i], // 转换率
                    collection: collection[i], // 收藏
                    addpurchase: addpurchase[i] // 加购
                })
            })

            $.ajax({
                type : "POST",
                url : window.baseUrl + "/plugin/compete/goods/analysis/title",
                data: {
                    data: arr
                },
                success: function (res) {
                    $("#yx-loading").fadeOut()
                    
                    analy_title_table_data = res.data
                    
                
                    layui.use('layer', function(){
                        var layer = layui.layer;
                    
                        layer.open({
                            type: 1,
                            maxmin: true,
                            move: false,
                            title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>商品来源-标题分析<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                            area: ['80%', '80%'],
                            content: `<div class='yx-jkkb'>
                                        <div id="titleBar"></div>
                                        <div class='yx-operation'>
                                            <div class='yx-btns'>
                                                <span class='yx-b1 analy_title_down'>下载数据</span>
                                                <span class='yx-b2 analy_title_copy'>复制数据</span>
                                            </div>
                                            <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_search_analy_title'></div>
                                        </div>
                                        <table id='analy_title_table'></table>
                                    </div>`
                        });

                    }); 
                    
                    let keyword = []
                    let legend = ['访客', '销量', '收藏', '加购']
                    let uv_index = []
                    let volume = []
                    let clt_hits = []
                    let cart_hits = []
                    for(let i=0;i<10;i++){
                        keyword.push(analy_title_table_data[i].keyword)
                        uv_index.push(analy_title_table_data[i].uv_index)
                        volume.push(analy_title_table_data[i].volume)
                        clt_hits.push(analy_title_table_data[i].clt_hits)
                        cart_hits.push(analy_title_table_data[i].cart_hits)
                    }
                    
                    let series= [
                        {
                            name: '访客',
                            type: 'bar',
                            data: uv_index,
                            barWidth: '10',
                        },
                        {
                            name: '销量',
                            type: 'bar',
                            data: volume,
                            barWidth: '10',
                        },
                        {
                            name: '收藏',
                            type: 'bar',
                            data: clt_hits,
                            barWidth: '10',
                        },
                        {
                            name: '加购',
                            type: 'bar',
                            data: cart_hits,
                            barWidth: '10',
                        }
                    ]
                    createTitleBar(legend, keyword, series)

                    layui.use('table', function(){
                        var table = layui.table;
                        
                        //第一个实例
                        analy_title_table_render = table.render({
                        id: "analy_title_table",
                        elem: '#analy_title_table',
                        title: "商品来源-标题分析",
                        page: true, //开启分页
                        limit: 10,
                        limits: [5, 10, 20, 50, 100],
                        data: res.data,
                        cols: [[ //表头
                            {field: 'keyword', title: '关键词', sort: true, unresize: true},
                            {field: 'uv_index', title: '访问人数', sort: true, unresize: true},
                            {field: 'hits_rate', title: '转化率', sort: true, unresize: true},
                            {field: 'volume', title: '销量', sort: true, unresize: true},
                            {field: 'clt_hits', title: '收藏人数', sort: true, unresize: true},
                            {field: 'cart_hits', title: '加购人数', sort: true, unresize: true},
                            {field: 'clt_hits_rate', title: '收藏转化率(%)', sort: true, unresize: true},
                            {field: 'cart_hits_rate', title: '加购转化率(%)', sort: true, unresize: true},
                        ]]
                        });
                    });
                }
            })
        })
        // 从网络上读取某个excel文件，url必须同域，否则报错
        function readWorkbookFromRemoteFile(url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('get', url, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function(e) {
                if(xhr.status == 200) {
                    var data = new Uint8Array(xhr.response)
                    var workbook = XLSX.read(data, {type: 'array'});
                    if(callback) callback(workbook);
                }
            };
            xhr.send();
        }
    })


    // 组 柱状图bar
    function createTitleBar(legend, keyword, series) {

        var myChart = echarts.init(document.getElementById('titleBar'));
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: legend
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, 0.01]
            },
            xAxis: {
                type: 'category',
                axisLabel: {
                    interval:0,
                },

                data: keyword
            },
            series: series
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    }

    // 标题分析 复制数据 下载数据 搜索数据
    $("body").on("click", ".analy_title_down", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(analy_title_table_render.config.id, analy_title_table_data); //导出数据
        })
    })
    $("body").on("click", ".analy_title_copy", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.analy_title_table;
            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '关键词      访问人数      销量      转化率      收藏人数      加购人数      收藏转化率      加购转化率\n'
            table.map((v) => {
                str += `\n${v.keyword}      ${v.uv_index}      ${v.volume}      ${v.hits_rate}      ${v.clt_hits}      ${v.cart_hits}      ${v.clt_hits_rate}      ${v.cart_hits_rate}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_search_analy_title", function () { 
        layui.use('table', function () {
            var pieList = analy_title_table_data;
            let key = $('#yx_search_analy_title').val()
            let filter = pieList.filter((v) => {
                let keyword = v.keyword.toString()
                let uv_index = v.uv_index.toString()
                let clt_hits = v.clt_hits.toString()
                let cart_hits = v.cart_hits.toString()
                let volume = v.volume.toString()
                let clt_hits_rate = v.clt_hits_rate.toString()
                let cart_hits_rate = v.cart_hits_rate.toString()
    
                return keyword.includes(key) || uv_index.includes(key) || clt_hits.includes(key) || cart_hits.includes(key) || volume.includes(key) || clt_hits_rate.includes(key) || cart_hits_rate.includes(key)
            })

            analy_title_table_render.reload({
                data: filter
            });
        })
    })






    $("body").on("click", '.sycmGoodsTitle', function(){
      

        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }

        if($(".oui-date-picker-particle-button .ant-btn-primary").text() == '实 时'){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.msg('不支持实时数据');
            })
            return
        }

        let dateRange = $.getUrlParamVal("dateRange", window.location.href)
        let dateType = $.getUrlParamVal("dateType", window.location.href)
        let href = $(this).parents(".sycm-goods-td").find(".goodsName a").attr("href")
        let itemId = $.getUrlParamVal("id", href)
        window.open(`https://sycm.taobao.com/flow/monitor/itemsourcedetail?belong=all&childPageType=se_keyword&dateRange=${dateRange}&dateType=${dateType}&device=2&itemId=${itemId}&pPageId=23&pageId=23.s1150&pageLevel=2&pageName=手淘搜索`, '_blank')
    })

    $("body").on("click", "#trend-analy-conver", function(){
        
        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }

        if($("#content-container .ant-btn-primary").text() == '实 时'){
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('暂不支持实时数据');
            });
            return
        }

        let dt1 = $(".alife-dt-card-sycm-common-select").eq(0).find(".sycm-common-select-selected-title")
        let dt1_img = $(".alife-dt-card-sycm-common-select").eq(0).find("img").attr("src")
        let dt2 = $(".alife-dt-card-sycm-common-select").eq(1).find(".sycm-common-select-selected-title")
        let dt2_img = $(".alife-dt-card-sycm-common-select").eq(1).find("img").attr("src")
        let dt3 = $(".alife-dt-card-sycm-common-select").eq(2).find(".sycm-common-select-selected-title")
        let dt3_img = $(".alife-dt-card-sycm-common-select").eq(2).find("img").attr("src")

        let store = getStore()
        
        let date = $(".oui-date-picker .ant-btn-primary").text()
        let dateType = null
        if (date == '7天') {
            dateType = 'recent7'
        } else if(date == '30天'){ 
            dateType = 'recent30'
        } else if(date == '日'){ 
            dateType = 'day'
        } else if(date == '周'){ 
            dateType = 'week'
        } else if(date == '月'){ 
            dateType = 'month'
        }

        let dateRange,start_time,end_time,cateId,data_json
        
        for (let key in store) {
            
            if (dt1.length > 0 && dt2.length == 0 && dt3.length == 0) { 
                if (key.includes('/mc/rivalItem/analysis/getCoreTrend.json') && key.includes('selfItemId') && !key.includes('rivalItem1Id') && !key.includes('rivalItem2Id') && key.includes(`dateType=${dateType}`)) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                    console.log(0)
                }
            }
            if (dt2.length > 0 && dt1.length == 0 && dt3.length == 0) { 
                if (key.includes('/mc/rivalItem/analysis/getCoreTrend.json') && key.includes('rivalItem1Id') && !key.includes('rivalItem2Id') && !key.includes('selfItemId') && key.includes(`dateType=${dateType}`)) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                    console.log(1)
                }
            }
            if (dt3.length > 0 && dt1.length == 0 && dt2.length == 0) { 
                if (key.includes('/mc/rivalItem/analysis/getCoreTrend.json') && key.includes('rivalItem2Id') && !key.includes('rivalItem1Id') && !key.includes('selfItemId') && key.includes(`dateType=${dateType}`)) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                    console.log(2)
                }
            }
            if (dt1.length > 0 && dt2.length > 0 && dt3.length == 0) { 
                if (key.includes('/mc/rivalItem/analysis/getCoreTrend.json') && key.includes('selfItemId') && key.includes('rivalItem1Id') && !key.includes('rivalItem2Id') && key.includes(`dateType=${dateType}`)) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                    console.log(3)
                }
            }
            if (dt1.length > 0 && dt3.length > 0 && dt2.length == 0) { 
                if (key.includes('/mc/rivalItem/analysis/getCoreTrend.json') && key.includes('selfItemId') && key.includes('rivalItem2Id') && !key.includes('rivalItem1Id') && key.includes(`dateType=${dateType}`)) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                    console.log(4)
                }
            }
            if (dt2.length > 0 && dt3.length > 0 && dt1.length == 0) { 
                if (key.includes('/mc/rivalItem/analysis/getCoreTrend.json') && key.includes('rivalItem1Id') && key.includes('rivalItem2Id') && !key.includes('selfItemId') && key.includes(`dateType=${dateType}`)) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                    console.log(5)
                }
            }

            if (dt1.length > 0 && dt2.length > 0 && dt3.length > 0) { 
                if (key.includes('/mc/rivalItem/analysis/getCoreTrend.json') && key.includes('selfItemId') && key.includes('rivalItem1Id') && key.includes('rivalItem2Id') && key.includes(`dateType=${dateType}`)) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                    console.log(6)
                }
            }
        }    

        let self_goods = {goods_name: dt1.text(), goods_image: dt1_img}
        let rival_goods1 = {goods_name: dt2.text(), goods_image: dt2_img}
        let rival_goods2 = {goods_name: dt3.text(), goods_image: dt3_img}

        console.log(self_goods)
        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/compete/goods/analysis/index",
            data: {
                data: data_json,
                start_time,
                end_time,
                cateId,
                self_goods,
                rival_goods1,
                rival_goods2
            },
            success : function(res) {
                $("#yx-loading").fadeOut()
              
                trend_analy_table_data = res.data
                
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        maxmin: true,
                        move: false,
                        title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>竞店分析-关键指标对比<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: `<div class='yx-jkkb'>
                                    <div class='yx-operation'>
                                        <div class='yx-btns'>
                                            <span class='yx-b1 analy_trend_down'>下载数据</span>
                                            <span class='yx-b2 analy_trend_copy'>复制数据</span>
                                        </div>
                                        <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_search_analy_trend'></div>
                                    </div>
                                    <table id='analy_trend_table'></table>
                                </div>`
                    });

                }); 

                layui.use('table', function(){
                    var table = layui.table;
                    
                    //第一个实例
                    analy_trend_table_render = table.render({
                      id: "analy_trend_table",
                      elem: '#analy_trend_table',
                      title: "竞店分析-关键指标对比",
                      page: true, //开启分页
                      limit: 10,
                      limits: [5, 10, 20, 50, 100],
                      data: res.data,
                      cols: [[ //表头
                        {field: 'shop_logo', title: '商品信息', minWidth: "240", unresize: true, templet: function(d){
                            return '<div class="yx-goods-logo"><img src='+ d.goods_image +' class="yx-goods-img" /><div class="yx-alink">'+d.goods_name+'</div></div>'
                        }},
                        {field: 'shop_type_name', title: '店铺类别', minWidth: "120", sort: true, unresize: true,templet: function(d){
                            if(d.goods_type == 'self'){
                                return `<div><span style="background: #3164dd;color:#fff">本店</span></div>`
                            }else if(d.goods_type == 'rival1'){
                                return `<div><span style="background: #eecf4f;color:#fff">竞店1</span></div>`
                            }else{
                                return `<div><span style="background: #df773c;color:#fff">竞店2</span></div>`
                            }
                        }},
                        {field: 'trade_price', title: '交易金额', sort: true, unresize: true},
                        {field: 'uv_index', title: '访问人数', sort: true, unresize: true},
                        {field: 'clt_hits', title: '收藏人数', sort: true, unresize: true},
                        {field: 'cart_hits', title: '加购人数', sort: true, unresize: true},
                        {field: 'se_ipv_uv_hits', title: '搜索人数', sort: true, unresize: true},
                        {field: 'pay_rate_index', title: '支付转化率(%)', sort: true, unresize: true},
                        {field: 'pay_hits', title: '支付人数', sort: true, unresize: true},
                        {field: 'pay_byr_cnt', title: '客单价', sort: true, unresize: true},
                        {field: 'uv_byr_price', title: 'uv价值', sort: true, unresize: true},
                        {field: 'se_ipv_rate', title: '搜索占比(%)', sort: true, unresize: true},
                        {field: 'clt_rate', title: '收藏率(%)', sort: true, unresize: true},
                        {field: 'cart_rate', title: '加购率(%)', sort: true, unresize: true},
                      ]]
                    });
                });
            },
            error: function (err) {
                console.log(err)
            }
        })
    })

    // 竞品 入店来源 复制数据 下载数据 搜索数据
    $("body").on("click", ".analy_trend_down", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(analy_trend_table_render.config.id, trend_analy_table_data); //导出数据
        })
    })
    $("body").on("click", ".analy_trend_copy", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.analy_trend_table;
            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '交易金额      访问人数      收藏人数      加购人数      搜索人数      支付转化率      支付人数      客单价      uv价值      搜索占比(%)      收藏率(%)      加购率(%)\n'
            table.map((v) => {
                str += `\n${v.trade_price}      ${v.uv_index}      ${v.clt_hits}      ${v.cart_hits}      ${v.se_ipv_uv_hits}      ${v.pay_rate_index}      ${v.pay_hits}      ${v.pay_byr_cnt}      ${v.uv_byr_price}      ${v.se_ipv_rate}      ${v.clt_rate}      ${v.cart_rate}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_search_analy_trend", function () { 
        layui.use('table', function () {
            var pieList = trend_analy_table_data;
            let key = $('#yx_search_analy_trend').val()
            let filter = pieList.filter((v) => {
                let trade_price = v.trade_price.toString()
                let uv_index = v.uv_index.toString()
                let clt_hits = v.clt_hits.toString()
                let cart_hits = v.cart_hits.toString()
                let se_ipv_uv_hits = v.se_ipv_uv_hits.toString()
                let pay_rate_index = v.pay_rate_index.toString()
    
                return trade_price.includes(key) || uv_index.includes(key) || clt_hits.includes(key) || cart_hits.includes(key) || se_ipv_uv_hits.includes(key) || pay_rate_index.includes(key)
            })

            analy_trend_table_render.reload({
                data: filter
            });
        })
    })


    

    $("body").on("click", ".yx-cover-btn5", function(){
        let shopName = $(".ebase-ModernFrame__title").text() || $(".ebase-Frame__title").text() || $(".current-shop-item-title").text()
        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/through_train/live/keyword/download",
            data: {
                shop_name: shopName
            },
            success : function(res) {
                if(res.code == 0){
                    window.location.href = `https://www.yingxiaods.com/api/export/data?key=${res.data}&filename=实时访客数据`
                }else{
                    layui.use('layer', function(){
                        var layer = layui.layer;
                        layer.msg(res.error);
                    });
                }
            }
        })
    })

    // 竞品 入店搜索词
    $("body").on("click", "#analy-keyword-conver", function(){
        
        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }

        let shopArr = []

        $(".alife-dt-card-sycm-common-select").each(function(){
            shopArr.push({
                img: $(this).find(".sycm-common-select-selected-image-wrapper>img").attr("src"),
                title: $(this).find(".sycm-common-select-selected-title").text()
            })
        })

        let date = $(".oui-date-picker .ant-btn-primary").text()
        let dateType = null
        if (date == '实 时') {
            dateType = 'today'
        }else if (date == '7天') {
            dateType = 'recent7'
        } else if(date == '30天'){ 
            dateType = 'recent30'
        } else if(date == '日'){ 
            dateType = 'day'
        } else if(date == '周'){ 
            dateType = 'week'
        } else if(date == '月'){ 
            dateType = 'month'
        }

        
        let store = getStore()
        let arrVal = []
        console.log(dateType)
        for (let key in store) {
            if (key.includes('/mc/rivalItem/analysis/getLiveKeywords.json') && key.includes(`dateType=${dateType}`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                let data_json = JSON.parse(d).value._d
                arrVal.push({
                    key: key,
                    val: data_json
                })
            }
        }

        if(arrVal.length == 0){
            for (let key in store) {
                
                if (key.includes('/mc/rivalItem/analysis/getKeywords.json') && key.includes(`dateType=${dateType}`)) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    let data_json = JSON.parse(d).value._d
                    arrVal.push({
                        key: key,
                        val: data_json
                    })
                }
            }
        }

        console.log(arrVal)


        

        let goodsId,goods1Id,goods2Id,dateRange,start_time,end_time,cateId,shop_type = $(".oui-card-switch-item-active").text() == '淘宝' ? 'taobao' : 'tmall'
        let data_self_uv,data_rival1_uv,data_rival2_uv,data_self_trade,data_rival1_trade,data_rival2_trade

        for (let key in store) {
            if (key.includes('CoreTrend.json') && key.includes('selfItemId')) {
                goodsId = $.getUrlParamVal("selfItemId", key)
            }
            if (key.includes('CoreTrend.json') && key.includes('rivalItem1Id')) {
                goods1Id = $.getUrlParamVal("rivalItem1Id", key)
            }
            if (key.includes('CoreTrend.json') && key.includes('rivalItem2Id')) {
                goods2Id = $.getUrlParamVal("rivalItem2Id", key)
            }
            
            dateRange = $.getUrlParamVal("dateRange", arrVal[0].key).split('|')
            start_time = dateRange[0]
            end_time = dateRange[1]
            cateId = $.getUrlParamVal("cateId", arrVal[0].key)
        }

        arrVal.map(v=>{
            if(v.key.includes("topType=trade") && v.key.includes(`itemId=${goodsId}`)){
                data_self_trade = v.val
            }
            if(v.key.includes("topType=trade") && v.key.includes(`itemId=${goods1Id}`)){
                data_rival1_trade = v.val
            }
            if(v.key.includes("topType=trade") && v.key.includes(`itemId=${goods2Id}`)){
                data_rival2_trade = v.val
            }

            if(v.key.includes("topType=flow") && v.key.includes(`itemId=${goodsId}`)){
                data_self_uv = v.val
            }
            if(v.key.includes("topType=flow") && v.key.includes(`itemId=${goods1Id}`)){
                data_rival1_uv = v.val
            }
            if(v.key.includes("topType=flow") && v.key.includes(`itemId=${goods2Id}`)){
                data_rival2_uv = v.val
            }
        })

        if(!data_self_trade || !data_self_uv){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm('您需要先点击 引流关键词 和 成交关键词 两个选项卡才能显示完整数据，是否继续？',{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    layer.close(layer.index)
                    ajax()
                }, function(){
                    
                });
            })
            return
        }

        console.log(shopArr)

        ajax()
        function ajax(){
            $.ajax({
                type : "POST",
                url : window.baseUrl + "/plugin/compete/goods/keyword/index",
                data: {
                    data_self_uv,
                    data_rival1_uv,
                    data_rival2_uv,
                    data_self_trade,
                    data_rival1_trade,
                    data_rival2_trade,
                    shop_type,
                    start_time,
                    end_time,
                    cateId
                },
                success : function(res) {
                    $("#yx-loading").fadeOut()
                  
                    keyword_source_table_data = res.data
                    
                    layui.use('layer', function(){
                        var layer = layui.layer;
                    
                        layer.open({
                            type: 1,
                            maxmin: true,
                            move: false,
                            title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>竞品分析-入店<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                            area: ['80%', '80%'],
                            content: `<div class='yx-jkkb'>
                                        <div class='yx-operation'>
                                            <div class='yx-btns'>
                                                <span class='yx-b1 keyword_down_source'>下载数据</span>
                                                <span class='yx-b2 keyword_copy_source'>复制数据</span>
                                            </div>
                                            <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='keyword_search_source'></div>
                                        </div>
                                        <table id='keyword_source_table'></table>
                                    </div>`
                        });
    
                    }); 
    
                    layui.use('table', function(){
                        var table = layui.table;
                        
                        //第一个实例
                        keyword_source_table_render = table.render({
                          id: "keyword_source_table",
                          elem: '#keyword_source_table',
                          title: "竞品分析-入店来源",
                          page: true, //开启分页
                          limit: 10,
                          limits: [5, 10, 20, 50, 100],
                          data: res.data,
                          cols: [[ //表头
                            {field: 'shop_logo', title: '商品信息', minWidth: "240", unresize: true, templet: function(d){
                                if(d.goods_type == 'self'){
                                    return '<div class="yx-goods-logo"><img src='+ shopArr[0].img +' class="yx-goods-img" /><div class="yx-alink">'+shopArr[0].title+'</div></div>'
                                }else if(d.goods_type == 'rival1'){
                                    return '<div class="yx-goods-logo"><img src='+ shopArr[1].img +' class="yx-goods-img" /><div class="yx-alink">'+shopArr[1].title+'</div></div>'
                                }else{
                                    return '<div class="yx-goods-logo"><img src='+ shopArr[2].img +' class="yx-goods-img" /><div class="yx-alink">'+shopArr[2].title+'</div></div>'
                                }
                            }},
                            {field: 'goods_type_name', title: '店铺类别', minWidth: "120", sort: true, unresize: true,templet: function(d){
                                if(d.goods_type == 'self'){
                                    return `<div><span style="background: #3164dd;color:#fff">本店</span></div>`
                                }else if(d.goods_type == 'rival1'){
                                    return `<div><span style="background: #eecf4f;color:#fff">竞店1</span></div>`
                                }else{
                                    return `<div><span style="background: #df773c;color:#fff">竞店2</span></div>`
                                }
                            }},
                            {field: 'keyword', title: '关键词', sort: true, unresize: true},
                            {field: 'trade_price', title: '交易金额', sort: true, unresize: true},
                            {field: 'uv_index', title: '访问人数', sort: true, unresize: true},
                          ]]
                        });
                    });
                },
                error: function (err) {
                    console.log(err)
                }
            })
        }
    })

    // 竞品 入店来源 复制数据 下载数据 搜索数据
    $("body").on("click", ".keyword_down_source", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(keyword_source_table_render.config.id, keyword_source_table_data); //导出数据
        })
    })
    $("body").on("click", ".keyword_copy_source", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.keyword_source_table;
            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '店铺类别      关键词      访问人数      交易金额\n'
            table.map((v) => {
                str += `\n${v.goods_type_name}      ${v.keyword}      ${v.trade_price}      ${v.uv_index}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#keyword_search_source", function () { 
        layui.use('table', function () {
            var pieList = keyword_source_table_data;
            let key = $('#keyword_search_source').val()
            let filter = pieList.filter((v) => {
                let goods_type_name = v.goods_type_name.toString()
                let keyword = v.keyword.toString()
                let trade_price = v.trade_price.toString()
                let uv_index = v.uv_index.toString()
    
                return goods_type_name.includes(key) || keyword.includes(key) || trade_price.includes(key) || uv_index.includes(key)
            })

            keyword_source_table_render.reload({
                data: filter
            });
        })
    })





    // 竞品 入店来源
    $("body").on("click", "#goods-flowSource-conver", function(){
        

        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }
        if ($(".oui-date-picker-particle-button .ant-btn-primary").text() == "实 时") {
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('入店来源在实时下仅显示访客数，无需转换！');
            });
            return
        }
        $("#yx-loading").fadeIn()

        let shopArr = []

        $(".alife-dt-card-sycm-common-select").each(function(){
            shopArr.push({
                img: $(this).find(".sycm-common-select-selected-image-wrapper>img").attr("src"),
                title: $(this).find(".sycm-common-select-selected-title").text()
            })
        })

        let store = getStore()
        let data_json, start_time, end_time, cateId
        let indexCodeIdx = $(".oui-index-picker-list .ant-radio-checked").parents("li").index()
        let indexStr = ['uv','payByrCntIndex','payRateIndex','tradeIndex']
        let indexCode = indexStr[indexCodeIdx]
            
        let date = $(".oui-date-picker .ant-btn-primary").text()
        let dateType = null
        if (date == '7天') {
            dateType = 'recent7'
        } else if(date == '30天'){ 
            dateType = 'recent30'
        } else if(date == '日'){ 
            dateType = 'day'
        } else if(date == '周'){ 
            dateType = 'week'
        } else if(date == '月'){ 
            dateType = 'month'
        }

        for (let key in store) {
            if (key.includes('/mc/rivalItem/analysis/getLiveFlowSource.json') && key.includes(`indexCode=${indexCode}`) && key.includes(`dateType=${dateType}`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                data_json = JSON.parse(d).value._d
                
                
                let dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }
        }

        if(!data_json){
            for (let key in store) {
                if (key.includes('/mc/rivalItem/analysis/getFlowSource.json') && key.includes(`dateType=${dateType}`) && key.includes(`indexCode=${indexCode}`)) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    let dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }
        }
        let shopName = $(".ebase-ModernFrame__title").text() || $(".ebase-Frame__title").text() || $(".current-shop-item-title").text()
        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/compete/goods/analysis/source",
            data: {
                data: data_json,
                start_time,
                end_time,
                cateId,
                shop_name: shopName
            },
            success : function(res) {
                $("#yx-loading").fadeOut()
              
                goods_source_table_data = res.data
                
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        maxmin: true,
                        move: false,
                        title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>竞品分析-入店来源<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: `<div class='yx-jkkb'>
                                    <div class='yx-operation'>
                                        <div class='yx-btns'>
                                            <span class='yx-b1 goods_flow_down_source'>下载数据</span>
                                            <span class='yx-b2 goods_flow_copy_source'>复制数据</span>
                                        </div>
                                        <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='goods_search_flow_source'></div>
                                    </div>
                                    <table id='goods_source_table'></table>
                                </div>`
                    });

                }); 

                layui.use('table', function(){
                    var table = layui.table;
                    
                    //第一个实例
                    goods_source_table_render = table.render({
                      id: "goods_source_table",
                      elem: '#goods_source_table',
                      title: "竞品分析-入店来源",
                      page: true, //开启分页
                      limit: 10,
                      limits: [5, 10, 20, 50, 100],
                      data: res.data,
                      cols: [[ //表头
                        {field: 'shop_logo', title: '商品信息', minWidth: "240", unresize: true, templet: function(d){
                            if(d.goods_type == 'self'){
                                return '<div class="yx-goods-logo"><img src='+ shopArr[0].img +' class="yx-goods-img" /><div class="yx-alink">'+shopArr[0].title+'</div></div>'
                            }else if(d.goods_type == 'rival1'){
                                return '<div class="yx-goods-logo"><img src='+ shopArr[1].img +' class="yx-goods-img" /><div class="yx-alink">'+shopArr[1].title+'</div></div>'
                            }else{
                                return '<div class="yx-goods-logo"><img src='+ shopArr[2].img +' class="yx-goods-img" /><div class="yx-alink">'+shopArr[2].title+'</div></div>'
                            }
                        }},
                        {field: 'goods_type_name', title: '店铺类别', minWidth: "120", sort: true, unresize: true,templet: function(d){
                            if(d.goods_type == 'self'){
                                return `<div><span style="background: #3164dd;color:#fff">本店</span></div>`
                            }else if(d.goods_type == 'rival1'){
                                return `<div><span style="background: #eecf4f;color:#fff">竞店1</span></div>`
                            }else{
                                return `<div><span style="background: #df773c;color:#fff">竞店2</span></div>`
                            }
                        }},
                        {field: 'page_level', title: '来源等级', sort: true, unresize: true},
                        {field: 'page_name', title: '流量来源', sort: true, unresize: true},
                        {field: 'uv', title: '访问人数', sort: true, unresize: true},
                        {field: 'trade_price', title: '交易金额', sort: true, unresize: true},
                        {field: 'pay_rate_index', title: '支付转化率(%)', sort: true, unresize: true},
                        {field: 'pay_hits', title: '支付人数', sort: true, unresize: true},
                        {field: 'org_pay_rate_index', title: '支付转化指数', sort: true, unresize: true},
                        {field: 'pay_byr_cnt', title: '客单价', sort: true, unresize: true},
                        {field: 'uv_byr_price', title: 'uv价值', sort: true, unresize: true},
                      ]]
                    });
                });
            },
            error: function (err) {
                console.log(err)
            }
        })
    })

    // 竞品 入店来源 复制数据 下载数据 搜索数据
    $("body").on("click", ".goods_flow_down_source", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(goods_source_table_render.config.id, goods_source_table_data); //导出数据
        })
    })
    $("body").on("click", ".goods_flow_copy_source", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.goods_source_table;

            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '店铺类别      来源等级      流量来源      访问人数      交易金额      支付转化率(%)      支付人数      支付转化指数      客单价      uv价值\n'
            table.map((v) => {
                str += `\n${v.goods_type_name}      ${v.page_level}      ${v.page_name}      ${v.uv}      ${v.trade_price}      ${v.pay_rate_index}      ${v.pay_hits}      ${v.org_pay_rate_index}      ${v.pay_byr_cnt}      ${v.uv_byr_price}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#goods_search_flow_source", function () { 
        layui.use('table', function () {
            var pieList = goods_source_table_data;
            let key = $('#goods_search_flow_source').val()
            let filter = pieList.filter((v) => {
                let goods_type_name = v.goods_type_name.toString()
                let page_level = v.page_level.toString()
                let page_name = v.page_name.toString()
                let uv = v.uv.toString()
                let trade_price = v.trade_price.toString()
                let pay_rate_index = v.pay_rate_index.toString()
    
                return goods_type_name.includes(key) || page_level.includes(key) || page_name.includes(key) || uv.includes(key) || trade_price.includes(key) || pay_rate_index.includes(key)
            })

            goods_source_table_render.reload({
                data: filter
            });
        })
    })




    $("body").on("click", "#completeItem-conver", function(){
        

        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }

        $("#yx-loading").fadeIn()
        let store = getStore()
        let page = $("#mqItemMonitor .ant-select-selection-selected-value").text()
        for (let key in store) {
            if (key.includes('/mc/live/ci/item/monitor/list.json') && key.includes(`pageSize=${page}`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                let data_json = JSON.parse(d).value._d
                
                
                let dateRange = $.getUrlParamVal("dateRange", key).split('|')
                let start_time = dateRange[0]
                let end_time = dateRange[1]
                let cateId = $.getUrlParamVal("cateId", key)

                $.ajax({
                    type : "POST",
                    url : window.baseUrl + "/plugin/compete/goods/analysis",
                    data: {
                        type: "all",
                        data: data_json,
                        start_time,
                        end_time,
                        cateId
                    },
                    success : function(res) {
                        $("#yx-loading").fadeOut()
                      
                        complete_table_data = res.data
                        
                        layui.use('layer', function(){
                            var layer = layui.layer;
                        
                            layer.open({
                                type: 1,
                                maxmin: true,
                                move: false,
                                title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>市场大盘-行业构成<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                                area: ['80%', '80%'],
                                content: `<div class='yx-jkkb'>
                                            <div class='yx-operation'>
                                                <div class='yx-btns'>
                                                    <span class='yx-b1 yx_complete_down'>下载数据</span>
                                                    <span class='yx-b2 yx_complete_copy'>复制数据</span>
                                                </div>
                                                <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_search_complete'></div>
                                            </div>
                                            <table id='complete_table'></table>
                                        </div>`
                            });
        
                        }); 
        
                        layui.use('table', function(){
                            var table = layui.table;
                            
                            //第一个实例
                            complete_table_render = table.render({
                              id: "complete_table",
                              elem: '#complete_table',
                              title: "竞店分析-入店来源",
                              page: true, //开启分页
                              limit: 10,
                              limits: [5, 10, 20, 50, 100],
                              data: res.data,
                              cols: [[ //表头
                                {field: 'shop_logo', title: '商品信息', minWidth: "240", unresize: true, templet: function(d){
                                    return '<div class="yx-goods-logo"><img src='+ d.goods_logo +' class="yx-goods-img" /><div class="yx-alink"><a href='+d.goods_link+' target="_blank">'+d.goods_name+'</a><span>'+ d.shop_name +'</span></div></div>'
                                }},
                                {field: 'clt_hits', title: '收藏人数', minWidth: "120",sort: true, unresize: true},
                                {field: 'uv_index', title: '访问人数', minWidth: "120",sort: true, unresize: true},
                                {field: 'pay_rate_index', title: '支付转化率(%)',minWidth: "120", sort: true, unresize: true},
                                {field: 'trade_price', title: '交易金额', minWidth: "120",sort: true, unresize: true},
                                {field: 'cart_hits', title: '加购人数',minWidth: "120", sort: true, unresize: true},
                                {field: 'se_ipv_uv_hits', title: '搜索人数',minWidth: "120", sort: true, unresize: true},
                                {field: 'pay_hits', title: '支付人数', minWidth: "120",sort: true, unresize: true},
                                {field: 'pay_byr_cnt', title: '客单价', minWidth: "120",sort: true, unresize: true},
                                {field: 'uv_byr_price', title: 'uv价值', minWidth: "120",sort: true, unresize: true},
                                {field: 'se_ipv_rate', title: '搜索占比',minWidth: "120", sort: true, unresize: true},
                                {field: 'cart_rate', title: '加购率',minWidth: "120", sort: true, unresize: true},
                                {field: 'clt_rate', title: '收藏率', minWidth: "120",sort: true, unresize: true},
                              ]]
                            });
                        });
                    },
                    error: function (err) {
                        console.log(err)
                    }
                })
            }
        }
    })


    // 竞品 入店来源 复制数据 下载数据 搜索数据
    $("body").on("click", ".yx_complete_down", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(complete_table_render.config.id, complete_table_data); //导出数据
        })
    })
    $("body").on("click", ".yx_complete_copy", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.complete_table;

            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '商品信息      收藏人数      访问人数      支付转化率(%)      交易金额      加购人数      搜索人数      支付人数      客单价      uv价值      搜索占比      加购率      收藏率\n'
            table.map((v) => {
                str += `\n${v.goods_name}      ${v.clt_hits}      ${v.uv_index}      ${v.pay_rate_index}      ${v.trade_price}      ${v.cart_hits}      ${v.pay_byr_cnt}      ${v.uv_byr_price}      ${v.se_ipv_rate}      ${v.cart_rate}      ${v.clt_rate}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_search_complete", function () { 
        layui.use('table', function () {
            var pieList = complete_table_data;
            let key = $('#yx_search_complete').val()
            let filter = pieList.filter((v) => {
                let goods_name = v.goods_name.toString()
                let clt_hits = v.clt_hits.toString()
                let uv_index = v.uv_index.toString()
                let pay_rate_index = v.pay_rate_index.toString()
                let trade_price = v.trade_price.toString()
                let cart_hits = v.cart_hits.toString()
    
                return goods_name.includes(key) || clt_hits.includes(key) || uv_index.includes(key) || pay_rate_index.includes(key) || trade_price.includes(key) || pay_rate_index.includes(key)
            })

            complete_table_render.reload({
                data: filter
            });
        })
    })

    
    


    // 入店来源
    $("body").on("click", "#flowSource-conver", function (){
        

        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }

        if($(".oui-date-picker-particle-button .ant-btn-primary").text() == "实 时"){
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('暂不支持实时数据');
            });
            return
        }


        let shopArr = []

        $(".alife-dt-card-sycm-common-select").each(function(){
            shopArr.push({
                img: $(this).find(".sycm-common-select-selected-image-wrapper>img").attr("src"),
                title: $(this).find(".sycm-common-select-selected-title").text()
            })
        })


        let shop1 = $(".alife-dt-card-sycm-common-select").eq(0).find(".sycm-common-select-selected-title").text()
        let shop2 = $(".alife-dt-card-sycm-common-select").eq(1).find(".sycm-common-select-selected-title").text()
        let shop3 = $(".alife-dt-card-sycm-common-select").eq(2).find(".sycm-common-select-selected-title").text()

        let qidx = $("#sycm-mc-flow-analysis .oui-index-picker-list").find(".ant-radio-wrapper-checked").parent().index()
        console.log(qidx)
        let indexCode = ['uvIndex', 'payByrCntIndex', 'payRateIndex', 'tradeIndex']
        console.log(indexCode)
        let store = getStore()
        let dateRange, start_time, end_time, cateId, data_json
        for (let key in store) {
            if(shop1 && !shop2 && !shop3){
                if (key.includes('/mc/rivalShop/analysis/getFlowSource.json') && key.includes(`indexCode=${indexCode[qidx]}`) && key.includes("selfUserId") && !key.includes("rivalUser1Id") && !key.includes("rivalUser2Id")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }
            if(!shop1 && shop2 && !shop3){
                if (key.includes('/mc/rivalShop/analysis/getFlowSource.json') && key.includes(`indexCode=${indexCode[qidx]}`) && !key.includes("selfUserId") && key.includes("rivalUser1Id") && !key.includes("rivalUser2Id")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }
            if(!shop1 && !shop2 && shop3){
                if (key.includes('/mc/rivalShop/analysis/getFlowSource.json') && key.includes(`indexCode=${indexCode[qidx]}`) && !key.includes("selfUserId") && !key.includes("rivalUser1Id") && key.includes("rivalUser2Id")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }
            if(shop1 && shop2 && !shop3){
                if (key.includes('/mc/rivalShop/analysis/getFlowSource.json') && key.includes(`indexCode=${indexCode[qidx]}`) && key.includes("selfUserId") && key.includes("rivalUser1Id") && !key.includes("rivalUser2Id")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }
            if(shop1 && !shop2 && shop3){
                if (key.includes('/mc/rivalShop/analysis/getFlowSource.json') && key.includes(`indexCode=${indexCode[qidx]}`) && key.includes("selfUserId") && !key.includes("rivalUser1Id") && key.includes("rivalUser2Id")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }
            if(!shop1 && shop2 && shop3){
                if (key.includes('/mc/rivalShop/analysis/getFlowSource.json') && key.includes(`indexCode=${indexCode[qidx]}`) && !key.includes("selfUserId") && key.includes("rivalUser1Id") && key.includes("rivalUser2Id")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }
            if(shop1 && shop2 && shop3){
                if (key.includes('/mc/rivalShop/analysis/getFlowSource.json') && key.includes(`indexCode=${indexCode[qidx]}`) && key.includes("selfUserId") && key.includes("rivalUser1Id") && key.includes("rivalUser2Id")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    data_json = JSON.parse(d).value._d
                    
                    
                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }
        }
        let shopName = $(".ebase-ModernFrame__title").text() || $(".ebase-Frame__title").text() || $(".current-shop-item-title").text()
        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/compete/shop/analysis/source",
            data: {
                data: data_json,
                start_time,
                end_time,
                cateId,
                shop_name: shopName
            },
            success : function(res) {
                $("#yx-loading").fadeOut()
              
                flow_source_table_data = res.data
                
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        maxmin: true,
                        move: false,
                        title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>竞店分析-入店来源<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: `<div class='yx-jkkb'>
                                    <div class='yx-operation'>
                                        <div class='yx-btns'>
                                            <span class='yx-b1 yx_flow_down_source'>下载数据</span>
                                            <span class='yx-b2 yx_flow_copy_source'>复制数据</span>
                                        </div>
                                        <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_search_flow_source'></div>
                                    </div>
                                    <table id='flow_source_table'></table>
                                </div>`
                    });

                }); 

                layui.use('table', function(){
                    var table = layui.table;
                    
                    //第一个实例
                    flow_source_table_render = table.render({
                      id: "flow_source_table",
                      elem: '#flow_source_table',
                      title: "竞店分析-入店来源",
                      page: true, //开启分页
                      limit: 10,
                      limits: [5, 10, 20, 50, 100],
                      data: res.data,
                      cols: [[ //表头
                        {field: 'shop_type_name', title: '店铺信息', minWidth: "240", templet: function(d){
                            if(d.shop_type == 'self'){
                                return `<div class='yx-a-imgs'><img src=${shopArr[0].img}><span>${shopArr[0].title}</span></div>`
                            }else if(d.shop_type == 'rival1'){
                                return `<div class='yx-a-imgs'><img src=${shopArr[1].img}><span>${shopArr[1].title}</span></div>`
                            }else{
                                return `<div class='yx-a-imgs'><img src=${shopArr[2].img}><span>${shopArr[2].title}</span></div>`
                            }
                        }},
                        {field: 'shop_type_name', title: '店铺类别', sort: true, unresize: true},
                        {field: 'page_level', title: '来源等级', sort: true, unresize: true},
                        {field: 'page_name', title: '流量来源', sort: true, unresize: true},
                        {field: 'trade_price', title: '交易金额', sort: true, unresize: true},
                        {field: 'uv_index', title: '访问人数', sort: true, unresize: true},
                        {field: 'pay_rate', title: '支付转换率(%)', sort: true, unresize: true},
                        {field: 'pay_hits', title: '支付人数', sort: true, unresize: true},
                        {field: 'pay_byr_cnt', title: '客单价', sort: true, unresize: true},
                        {field: 'uv_byr_price', title: 'uv价值', sort: true, unresize: true},
                      ]]
                    });
                });
            },
            error: function (err) {
                console.log(err)
            }
        })
    })

    // top商品榜 复制数据 下载数据 搜索数据
    $("body").on("click", ".yx_flow_down_source", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(flow_source_table_render.config.id, flow_source_table_data); //导出数据
        })
    })
    $("body").on("click", ".yx_flow_copy_source", function () {
        let shopArr = []

        $(".alife-dt-card-sycm-common-select").each(function(){
            shopArr.push({
                img: $(this).find(".sycm-common-select-selected-image-wrapper>img").attr("src"),
                title: $(this).find(".sycm-common-select-selected-title").text()
            })
        })
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.flow_source_table;

            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '店铺信息      店铺类别      来源等级      流量来源      交易金额      访问人数      支付转换率(%)      支付人数      客单价      uv价值\n'
            table.map((v) => {
                let t = ''
                if(v.shop_type == 'self'){
                    t = shopArr[0].title
                }else if(d.shop_type == 'rival1'){
                    t = shopArr[1].title
                }else{
                    t = shopArr[2].title
                }
                str += `\n${t}      ${v.shop_type_name}      ${v.page_level}      ${v.page_name}      ${v.trade_price}      ${v.uv_index}      ${v.pay_rate}      ${v.pay_hits}      ${v.pay_byr_cnt}      ${v.uv_byr_price}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_search_flow_source", function () { 
        layui.use('table', function () {
            var pieList = flow_source_table_data;
            let key = $('#yx_search_flow_source').val()
            let filter = pieList.filter((v) => {
                let shop_type_name = v.shop_type_name.toString()
                let page_level = v.page_level.toString()
                let page_name = v.page_name.toString()
                let uv_index = v.uv_index.toString()
    
                return shop_type_name.includes(key) || page_level.includes(key) || page_name.includes(key) || uv_index.includes(key)
            })

            flow_source_table_render.reload({
                data: filter
            });
        })
    })

    
    $("body").on("click", '#topList-conver', function(){
        

        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }

        let shopArr = []

        $(".alife-dt-card-sycm-common-select").each(function(){
            shopArr.push({
                img: $(this).find(".sycm-common-select-selected-image-wrapper>img").attr("src"),
                title: $(this).find(".sycm-common-select-selected-title").text()
            })
        })

        
        let store = getStore()
        let arrVal = []
        for (let key in store) {
            if (key.includes('/mc/rivalShop/analysis/getLiveTopItems.json')) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                let data_json = JSON.parse(d).value._d
                arrVal.push({
                    key: key,
                    val: data_json
                })
            }
        }

        if(arrVal.length == 0){
            for (let key in store) {
                if (key.includes('/mc/rivalShop/analysis/getTopItems.json')) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    let data_json = JSON.parse(d).value._d
                    arrVal.push({
                        key: key,
                        val: data_json
                    })
                }
            }
        }

        
        let spl,shopId,spl1,shop1Id,spl2,shop2Id
        if($("#shopAnalysisItemsTableselfUserId .ant-table-row img").length > 0){
            spl = $("#shopAnalysisItemsTableselfUserId .ant-table-row img").attr("src").split("/")
            shopId = spl[spl.length-2]
        }
        
        if($("#shopAnalysisItemsTablerivalUser1Id .ant-table-row img").length > 0){
            spl1 = $("#shopAnalysisItemsTablerivalUser1Id .ant-table-row img").attr("src").split("/")
            shop1Id = spl1[spl1.length-2]
        }
        
        if($("#shopAnalysisItemsTablerivalUser2Id .ant-table-row img").length > 0){
            spl2 = $("#shopAnalysisItemsTablerivalUser2Id .ant-table-row img").attr("src").split("/")
            shop2Id = spl2[spl2.length-2]
        }
        
        let dateRange = $.getUrlParamVal("dateRange", arrVal[arrVal.length-1].key).split('|')
        let start_time = dateRange[0]
        let end_time = dateRange[1]
        let cateId = $.getUrlParamVal("cateId", arrVal[arrVal.length-1].key)

        let data_self,data_rival1,data_rival2,data_self_uv,data_rival1_uv,data_rival2_uv

      
        arrVal.map(v=>{
            if(v.key.includes("topType=trade") && v.key.includes(`userId=${shopId}`)){
                data_self = v.val
            }
            if(v.key.includes("topType=trade") && v.key.includes(`userId=${shop1Id}`)){
                data_rival1 = v.val
            }
            if(v.key.includes("topType=trade") && v.key.includes(`userId=${shop2Id}`)){
                data_rival2 = v.val
            }

            if(v.key.includes("topType=flow") && v.key.includes(`userId=${shopId}`)){
                data_self_uv = v.val
            }
            if(v.key.includes("topType=flow") && v.key.includes(`userId=${shop1Id}`)){
                data_rival1_uv = v.val
            }
            if(v.key.includes("topType=flow") && v.key.includes(`userId=${shop2Id}`)){
                data_rival2_uv = v.val
            }
        })

        if(!data_self_uv || !data_self){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm('您需要先点击 热销 和 流量 两个选项卡才能显示完整数据，是否继续？',{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    layer.close(layer.index)
                    ajax()
                }, function(){
                    
                });
            })
            return
        }

        ajax()
        function ajax(){
            $.ajax({
                type : "POST",
                url : window.baseUrl + "/plugin/compete/shop/analysis/goods/top",
                data: {
                    data_self_trade: data_self,
                    data_rival1_trade: data_rival1,
                    data_rival2_trade: data_rival2,
                    data_self_uv,
                    data_rival1_uv,
                    data_rival2_uv,
                    start_time,
                    end_time,
                    cateId
                },
                success : function(res) {
                    $("#yx-loading").fadeOut()
                    
                    jdfx_top_table_data = res.data
                    layui.use('layer', function(){
                        var layer = layui.layer;
                    
                        layer.open({
                            type: 1,
                            maxmin: true,
                            move: false,
                            title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>竞店分析-关键指标对比<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                            area: ['80%', '80%'],
                            content: `<div class='yx-jkkb'>
                                        <div class='yx-operation'>
                                            <div class='yx-btns'>
                                                <span class='yx-b1 yx_jdfx_down_top'>下载数据</span>
                                                <span class='yx-b2 yx_jdfx_copy_top'>复制数据</span>
                                            </div>
                                            <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_search_scdp_top'></div>
                                        </div>
                                        <table id='jdfx_top_table'></table>
                                    </div>`
                        });
    
                    }); 

                    let cols = [{field: 'shop_logo', title: '商品信息', minWidth: "240", unresize: true, templet: function(d){
                        return '<div class="yx-goods-logo"><img src='+ d.goods_logo +' class="yx-goods-img" /><div class="yx-alink"><a href='+d.goods_link+' target="_blank">'+d.goods_name+'</a><span>'+ d.shop_type_name +'</span></div></div>'
                    }},
                    {field: 'shop_type_name', title: '店铺类别', sort: true, unresize: true},
                    {field: 'trade_price', title: '交易金额', sort: true, unresize: true},
                    {field: 'uv_index', title: '访客人数', sort: true, unresize: true},
                    {field: 'uv_byr_price', title: 'uv价值', sort: true, unresize: true}]

                    if (jdfx_top_table_data[0].discount_price) { 
                        cols.push({field: 'discount_price', title: '一口价', sort: true, unresize: true})
                    }
    
                    layui.use('table', function(){
                        var table = layui.table;
                        
                        //第一个实例
                        jdfx_top_table_render = table.render({
                            id: "jdfx_top_table",
                            elem: '#jdfx_top_table',
                            title: "竞店分析-关键指标对比",
                            page: true, //开启分页
                            limit: 10,
                            limits: [5, 10, 20, 50, 100],
                            data: res.data,
                            cols: [cols]
                        });
                    });
                },
                error: function (err) {
                    console.log(err)
                }
            })
        }
            
        
    })

    // top商品榜 复制数据 下载数据 搜索数据
    $("body").on("click", ".yx_jdfx_down_top", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(jdfx_top_table_render.config.id, jdfx_top_table_data); //导出数据
        })
    })
    $("body").on("click", ".yx_jdfx_copy_top", function () {
        let shopArr = []

        $(".alife-dt-card-sycm-common-select").each(function(){
            shopArr.push({
                img: $(this).find(".sycm-common-select-selected-image-wrapper>img").attr("src"),
                title: $(this).find(".sycm-common-select-selected-title").text()
            })
        })

        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.jdfx_top_table;

            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '店铺信息      店铺类别      交易金额      一口价      访客人数      uv价值\n'
            table.map((v) => {
                let t = ''
                if(v.shop_type == 'self'){
                    t = shopArr[0].title
                }else if(d.shop_type == 'rival1'){
                    t = shopArr[1].title
                }else{
                    t = shopArr[2].title
                }
                str += `\n${t}      ${v.shop_type_name}      ${v.trade_price}      ${v.discount_price}      ${v.uv_index}      ${v.uv_byr_price}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_search_scdp_top", function () { 
        layui.use('table', function () {
            var pieList = jdfx_top_table_data;
            let key = $('#yx_search_scdp_top').val()
            let filter = pieList.filter((v) => {
                let shop_type_name = v.shop_type_name.toString()
                let trade_price = v.trade_price.toString()
                let uv_index = v.uv_index.toString()
                let discount_price = v.discount_price.toString()
    
                return shop_type_name.includes(key) || trade_price.includes(key) || uv_index.includes(key) || discount_price.includes(key)
            })

            jdfx_top_table_render.reload({
                data: filter
            });
        })
    })



    // 关键指标对比 
    $("body").on("click", '#index-conver', function(){
        
        let tag = $(".oui-date-picker-particle-button .ant-btn-primary").text()

        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }


        let shopArr = []

        $(".alife-dt-card-sycm-common-select").each(function(){
            shopArr.push({
                img: $(this).find(".sycm-common-select-selected-image-wrapper>img").attr("src"),
                title: $(this).find(".sycm-common-select-selected-title").text()
            })
        })


        let shop2 = $(".alife-dt-card-sycm-common-select").eq(1).find(".sycm-common-select-selected-title").text()
        let shop3 = $(".alife-dt-card-sycm-common-select").eq(2).find(".sycm-common-select-selected-title").text()

        if(!shop2 && !shop3){
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('请至少选择一个竞店');
            });
            return
        }


        if($(".oui-card-switch-item-active").text() == "类目"){
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('暂不支持类目数据');
            });
            return
        }
        
        if($(".oui-date-picker-particle-button .ant-btn-primary").text() == "实 时"){
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('暂不支持实时数据');
            });
            return
        }

        let store = getStore()
        let arrVal = []
        for (let key in store) {
            if(tag == "实 时" && shop3 && !shop2){
                if (key.includes('/mc/rivalShop/analysis/getLiveCoreTrend.json') && key.includes("rivalUser2Id") && !key.includes("rivalUser1Id") && key.includes("dateType=today")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    let data_json = JSON.parse(d).value._d
                    arrVal.push({
                        key: key,
                        val: data_json
                    })
                }
            }
            if(tag == "实 时" && shop2 && !shop3){
                if (key.includes('/mc/rivalShop/analysis/getLiveCoreTrend.json') && key.includes("rivalUser1Id") && !key.includes("rivalUser2Id") && key.includes("dateType=today")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    let data_json = JSON.parse(d).value._d
                    arrVal.push({
                        key: key,
                        val: data_json
                    })
                }
            }
            if(tag == "实 时" && shop2 && shop3){
                if (key.includes('/mc/rivalShop/analysis/getLiveCoreTrend.json') && key.includes("rivalUser1Id") && key.includes("rivalUser2Id") && key.includes("dateType=today")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    let data_json = JSON.parse(d).value._d
                    arrVal.push({
                        key: key,
                        val: data_json
                    })
                }
            }


            if(tag == "7天" && shop3 && !shop2){
                if (key.includes('/mc/rivalShop/analysis/getLiveCoreTrend.json') && key.includes("rivalUser2Id") && !key.includes("rivalUser1Id") && key.includes("dateType=recent7")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    let data_json = JSON.parse(d).value._d
                    arrVal.push({
                        key: key,
                        val: data_json
                    })
                }
            }
            if(tag == "7天" && shop2 && !shop3){
                if (key.includes('/mc/rivalShop/analysis/getLiveCoreTrend.json')  && key.includes("rivalUser1Id") && !key.includes("rivalUser2Id") && key.includes("dateType=recent7")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    let data_json = JSON.parse(d).value._d
                    arrVal.push({
                        key: key,
                        val: data_json
                    })
                }
            }
            if(tag == "7天" && shop2 && shop3){
                if (key.includes('/mc/rivalShop/analysis/getLiveCoreTrend.json') && key.includes("rivalUser1Id") && key.includes("rivalUser2Id") && key.includes("dateType=recent7")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    let data_json = JSON.parse(d).value._d
                    arrVal.push({
                        key: key,
                        val: data_json
                    })
                }
            }


            if(tag == "30天" && !shop2 && shop3){
                if (key.includes('/mc/rivalShop/analysis/getLiveCoreTrend.json') && key.includes("rivalUser2Id") && !key.includes("rivalUser1Id") && key.includes("dateType=recent30")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    let data_json = JSON.parse(d).value._d
                    arrVal.push({
                        key: key,
                        val: data_json
                    })
                }
            }
            if(tag == "30天" && shop2 && !shop3){
                if (key.includes('/mc/rivalShop/analysis/getLiveCoreTrend.json') && key.includes("rivalUser1Id") && !key.includes("rivalUser2Id") && key.includes("dateType=recent30")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    let data_json = JSON.parse(d).value._d
                    arrVal.push({
                        key: key,
                        val: data_json
                    })
                }
            }
            if(tag == "30天" && shop2 && shop3){
                if (key.includes('/mc/rivalShop/analysis/getLiveCoreTrend.json') && key.includes("rivalUser1Id") && key.includes("rivalUser2Id") && key.includes("dateType=recent30")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    let data_json = JSON.parse(d).value._d
                    arrVal.push({
                        key: key,
                        val: data_json
                    })
                }
            }
            
            if(tag == "日" && !shop2 && shop3){
                if (key.includes('/mc/rivalShop/analysis/getLiveCoreTrend.json') && key.includes("rivalUser2Id") && !key.includes("rivalUser1Id") && key.includes("dateType=day")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    let data_json = JSON.parse(d).value._d
                    arrVal.push({
                        key: key,
                        val: data_json
                    })
                }
            }
            if(tag == "日" && shop2 && !shop3){
                if (key.includes('/mc/rivalShop/analysis/getLiveCoreTrend.json') && key.includes("rivalUser1Id") && !key.includes("rivalUser2Id") && key.includes("dateType=day")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    let data_json = JSON.parse(d).value._d
                    arrVal.push({
                        key: key,
                        val: data_json
                    })
                }
            }
            if(tag == "日" && shop2 && shop3){
                if (key.includes('/mc/rivalShop/analysis/getLiveCoreTrend.json') && key.includes("rivalUser1Id") && key.includes("rivalUser2Id") && key.includes("dateType=day")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    let data_json = JSON.parse(d).value._d
                    arrVal.push({
                        key: key,
                        val: data_json
                    })
                }
            }



            if(tag == "周" && !shop2 && shop3){
                if (key.includes('/mc/rivalShop/analysis/getLiveCoreTrend.json') && key.includes("rivalUser2Id") && !key.includes("rivalUser1Id") && key.includes("dateType=week")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    let data_json = JSON.parse(d).value._d
                    arrVal.push({
                        key: key,
                        val: data_json
                    })
                }
            }
            if(tag == "周" && shop2 && !shop3){
                if (key.includes('/mc/rivalShop/analysis/getLiveCoreTrend.json') && key.includes("rivalUser1Id") && !key.includes("rivalUser2Id") && key.includes("dateType=week")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    let data_json = JSON.parse(d).value._d
                    arrVal.push({
                        key: key,
                        val: data_json
                    })
                }
            }
            if(tag == "周" && shop2 && shop3){
                if (key.includes('/mc/rivalShop/analysis/getLiveCoreTrend.json') && key.includes("rivalUser1Id") && key.includes("rivalUser2Id") && key.includes("dateType=week")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    let data_json = JSON.parse(d).value._d
                    arrVal.push({
                        key: key,
                        val: data_json
                    })
                }
            }



            if(tag == "月" && !shop2 && shop3){
                if (key.includes('/mc/rivalShop/analysis/getLiveCoreTrend.json') && key.includes("rivalUser2Id") && !key.includes("rivalUser1Id") && key.includes("dateType=month")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    let data_json = JSON.parse(d).value._d
                    arrVal.push({
                        key: key,
                        val: data_json
                    })
                }
            }
            if(tag == "月" && shop2 && !shop3){
                if (key.includes('/mc/rivalShop/analysis/getLiveCoreTrend.json') && key.includes("rivalUser1Id") && !key.includes("rivalUser2Id") && key.includes("dateType=month")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    let data_json = JSON.parse(d).value._d
                    arrVal.push({
                        key: key,
                        val: data_json
                    })
                }
            }
            if(tag == "月" && shop2 && shop3){
                if (key.includes('/mc/rivalShop/analysis/getLiveCoreTrend.json') && key.includes("dateType=month")) {
                    let data = store[key].split("|")[1]
                    let d = JSON.parse(`"${data}`)
                    let data_json = JSON.parse(d).value._d
                    arrVal.push({
                        key: key,
                        val: data_json
                    })
                }
            }
            
        }


        if(arrVal.length == 0){
            for (let key in store) {
                if(tag == "实 时" && shop3 && !shop2){
                    if (key.includes('/mc/rivalShop/analysis/getCoreTrend.json') && key.includes("rivalUser2Id") && !key.includes("rivalUser1Id") && key.includes("dateType=today")) {
                        let data = store[key].split("|")[1]
                        let d = JSON.parse(`"${data}`)
                        let data_json = JSON.parse(d).value._d
                        arrVal.push({
                            key: key,
                            val: data_json
                        })
                    }
                }
                if(tag == "实 时" && shop2 && !shop3){
                    if (key.includes('/mc/rivalShop/analysis/getCoreTrend.json') && key.includes("rivalUser1Id") && !key.includes("rivalUser2Id") && key.includes("dateType=today")) {
                        let data = store[key].split("|")[1]
                        let d = JSON.parse(`"${data}`)
                        let data_json = JSON.parse(d).value._d
                        arrVal.push({
                            key: key,
                            val: data_json
                        })
                    }
                }
                if(tag == "实 时" && shop2 && shop3){
                    if (key.includes('/mc/rivalShop/analysis/getCoreTrend.json') && key.includes("rivalUser1Id") && key.includes("rivalUser2Id") && key.includes("dateType=today")) {
                        let data = store[key].split("|")[1]
                        let d = JSON.parse(`"${data}`)
                        let data_json = JSON.parse(d).value._d
                        arrVal.push({
                            key: key,
                            val: data_json
                        })
                    }
                }
    
    
                if(tag == "7天" && shop3 && !shop2){
                    if (key.includes('/mc/rivalShop/analysis/getCoreTrend.json') && key.includes("rivalUser2Id") && !key.includes("rivalUser1Id") && key.includes("dateType=recent7")) {
                        let data = store[key].split("|")[1]
                        let d = JSON.parse(`"${data}`)
                        let data_json = JSON.parse(d).value._d
                        arrVal.push({
                            key: key,
                            val: data_json
                        })
                    }
                }
                if(tag == "7天" && shop2 && !shop3){
                    if (key.includes('/mc/rivalShop/analysis/getCoreTrend.json')  && key.includes("rivalUser1Id") && !key.includes("rivalUser2Id") && key.includes("dateType=recent7")) {
                        let data = store[key].split("|")[1]
                        let d = JSON.parse(`"${data}`)
                        let data_json = JSON.parse(d).value._d
                        arrVal.push({
                            key: key,
                            val: data_json
                        })
                    }
                }
                if(tag == "7天" && shop2 && shop3){
                    if (key.includes('/mc/rivalShop/analysis/getCoreTrend.json') && key.includes("rivalUser1Id") && key.includes("rivalUser2Id") && key.includes("dateType=recent7")) {
                        let data = store[key].split("|")[1]
                        let d = JSON.parse(`"${data}`)
                        let data_json = JSON.parse(d).value._d
                        arrVal.push({
                            key: key,
                            val: data_json
                        })
                    }
                }
    
    
                if(tag == "30天" && !shop2 && shop3){
                    if (key.includes('/mc/rivalShop/analysis/getCoreTrend.json') && key.includes("rivalUser2Id") && !key.includes("rivalUser1Id") && key.includes("dateType=recent30")) {
                        let data = store[key].split("|")[1]
                        let d = JSON.parse(`"${data}`)
                        let data_json = JSON.parse(d).value._d
                        arrVal.push({
                            key: key,
                            val: data_json
                        })
                    }
                }
                if(tag == "30天" && shop2 && !shop3){
                    if (key.includes('/mc/rivalShop/analysis/getCoreTrend.json') && key.includes("rivalUser1Id") && !key.includes("rivalUser2Id") && key.includes("dateType=recent30")) {
                        let data = store[key].split("|")[1]
                        let d = JSON.parse(`"${data}`)
                        let data_json = JSON.parse(d).value._d
                        arrVal.push({
                            key: key,
                            val: data_json
                        })
                    }
                }
                if(tag == "30天" && shop2 && shop3){
                    if (key.includes('/mc/rivalShop/analysis/getCoreTrend.json') && key.includes("rivalUser1Id") && key.includes("rivalUser2Id") && key.includes("dateType=recent30")) {
                        let data = store[key].split("|")[1]
                        let d = JSON.parse(`"${data}`)
                        let data_json = JSON.parse(d).value._d
                        arrVal.push({
                            key: key,
                            val: data_json
                        })
                    }
                }
                
                if(tag == "日" && !shop2 && shop3){
                    if (key.includes('/mc/rivalShop/analysis/getCoreTrend.json') && key.includes("rivalUser2Id") && !key.includes("rivalUser1Id") && key.includes("dateType=day")) {
                        let data = store[key].split("|")[1]
                        let d = JSON.parse(`"${data}`)
                        let data_json = JSON.parse(d).value._d
                        arrVal.push({
                            key: key,
                            val: data_json
                        })
                    }
                }
                if(tag == "日" && shop2 && !shop3){
                    if (key.includes('/mc/rivalShop/analysis/getCoreTrend.json') && key.includes("rivalUser1Id") && !key.includes("rivalUser2Id") && key.includes("dateType=day")) {
                        let data = store[key].split("|")[1]
                        let d = JSON.parse(`"${data}`)
                        let data_json = JSON.parse(d).value._d
                        arrVal.push({
                            key: key,
                            val: data_json
                        })
                    }
                }
                if(tag == "日" && shop2 && shop3){
                    if (key.includes('/mc/rivalShop/analysis/getCoreTrend.json') && key.includes("rivalUser1Id") && key.includes("rivalUser2Id") && key.includes("dateType=day")) {
                        let data = store[key].split("|")[1]
                        let d = JSON.parse(`"${data}`)
                        let data_json = JSON.parse(d).value._d
                        arrVal.push({
                            key: key,
                            val: data_json
                        })
                    }
                }
    
    
    
                if(tag == "周" && !shop2 && shop3){
                    if (key.includes('/mc/rivalShop/analysis/getCoreTrend.json') && key.includes("rivalUser2Id") && !key.includes("rivalUser1Id") && key.includes("dateType=week")) {
                        let data = store[key].split("|")[1]
                        let d = JSON.parse(`"${data}`)
                        let data_json = JSON.parse(d).value._d
                        arrVal.push({
                            key: key,
                            val: data_json
                        })
                    }
                }
                if(tag == "周" && shop2 && !shop3){
                    if (key.includes('/mc/rivalShop/analysis/getCoreTrend.json') && key.includes("rivalUser1Id") && !key.includes("rivalUser2Id") && key.includes("dateType=week")) {
                        let data = store[key].split("|")[1]
                        let d = JSON.parse(`"${data}`)
                        let data_json = JSON.parse(d).value._d
                        arrVal.push({
                            key: key,
                            val: data_json
                        })
                    }
                }
                if(tag == "周" && shop2 && shop3){
                    if (key.includes('/mc/rivalShop/analysis/getCoreTrend.json') && key.includes("rivalUser1Id") && key.includes("rivalUser2Id") && key.includes("dateType=week")) {
                        let data = store[key].split("|")[1]
                        let d = JSON.parse(`"${data}`)
                        let data_json = JSON.parse(d).value._d
                        arrVal.push({
                            key: key,
                            val: data_json
                        })
                    }
                }
    
    
    
                if(tag == "月" && !shop2 && shop3){
                    if (key.includes('/mc/rivalShop/analysis/getCoreTrend.json') && key.includes("rivalUser2Id") && !key.includes("rivalUser1Id") && key.includes("dateType=month")) {
                        let data = store[key].split("|")[1]
                        let d = JSON.parse(`"${data}`)
                        let data_json = JSON.parse(d).value._d
                        arrVal.push({
                            key: key,
                            val: data_json
                        })
                    }
                }
                if(tag == "月" && shop2 && !shop3){
                    if (key.includes('/mc/rivalShop/analysis/getCoreTrend.json') && key.includes("rivalUser1Id") && !key.includes("rivalUser2Id") && key.includes("dateType=month")) {
                        let data = store[key].split("|")[1]
                        let d = JSON.parse(`"${data}`)
                        let data_json = JSON.parse(d).value._d
                        arrVal.push({
                            key: key,
                            val: data_json
                        })
                    }
                }
                if(tag == "月" && shop2 && shop3){
                    if (key.includes('/mc/rivalShop/analysis/getCoreTrend.json') && key.includes("dateType=month")) {
                        let data = store[key].split("|")[1]
                        let d = JSON.parse(`"${data}`)
                        let data_json = JSON.parse(d).value._d
                        arrVal.push({
                            key: key,
                            val: data_json
                        })
                    }
                }
            }
        }

        console.log(arrVal)

        let dateRange = $.getUrlParamVal("dateRange", arrVal[arrVal.length-1].key).split('|')
        let start_time = dateRange[0]
        let end_time = dateRange[1]
        let cateId = $.getUrlParamVal("cateId", arrVal[arrVal.length-1].key)

        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/compete/shop/analysis/index",
            data: {
                data: arrVal[arrVal.length-1].val,
                start_time,
                end_time,
                cateId
            },
            success : function(res) {
                $("#yx-loading").fadeOut()
                
                jdfx_zbdb_table_data = res.data
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        maxmin: true,
                        move: false,
                        title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>竞店分析-关键指标对比<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: `<div class='yx-jkkb'>
                                    <div class='yx-operation'>
                                        <div class='yx-btns'>
                                            <span class='yx-b1 yx_jdfx_down_zbdb'>下载数据</span>
                                            <span class='yx-b2 yx_jdfx_copy_zbdb'>复制数据</span>
                                        </div>
                                        <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_search_scdp_zbdb'></div>
                                    </div>
                                    <table id='jdfx_zbdb_table'></table>
                                </div>`
                    });

                }); 

                layui.use('table', function(){
                    var table = layui.table;
                    
                    //第一个实例
                    jdfx_zbdb_table_render = table.render({
                        id: "jdfx_zbdb_table",
                        elem: '#jdfx_zbdb_table',
                        title: "竞店分析-关键指标对比",
                        page: true, //开启分页
                        limit: 10,
                        limits: [5, 10, 20, 50, 100],
                        data: res.data,
                        cols: [[ //表头
                            // shopArr    
                        // {field: 'shop_type_name', title: '店铺信息', sort: true, unresize: true,},
                        {field: 'shop_type_name', title: '店铺信息', minWidth: "240", templet: function(d){
                            if(d.shop_type == 'self'){
                                return `<div class='yx-a-imgs'><img src=${shopArr[0].img}><span>${shopArr[0].title}</span></div>`
                            }else if(d.shop_type == 'rival1'){
                                return `<div class='yx-a-imgs'><img src=${shopArr[1].img}><span>${shopArr[1].title}</span></div>`
                            }else{
                                return `<div class='yx-a-imgs'><img src=${shopArr[2].img}><span>${shopArr[2].title}</span></div>`
                            }
                        }},
                        {field: 'shop_type_name', title: '店铺类别', minWidth: "120", sort: true, unresize: true,templet: function(d){
                            if(d.shop_type == 'self'){
                                return `<div><span style="background: #3164dd;color:#fff">本店</span></div>`
                            }else if(d.shop_type == 'rival1'){
                                return `<div><span style="background: #eecf4f;color:#fff">竞店1</span></div>`
                            }else{
                                return `<div><span style="background: #df773c;color:#fff">竞店2</span></div>`
                            }
                            
                        }},
                        {field: 'trade_price', title: '交易金额', minWidth: "120", sort: true, unresize: true},
                        {field: 'uv_index', title: '访问人数',  minWidth: "120",sort: true, unresize: true},
                        {field: 'clt_hits', title: '收藏人数',  minWidth: "120",sort: true, unresize: true},
                        {field: 'cart_hits', title: '加购人数',  minWidth: "120",sort: true, unresize: true},
                        {field: 'se_ipv_uv_hits', title: '搜索人数',  minWidth: "120",sort: true, unresize: true},
                        {field: 'pay_rate_index', title: '支付转化率(%)', minWidth: "120", sort: true, unresize: true},
                        { field: 'pay_byr_cnt', title: '客单价',  minWidth: "120",sort: true, unresize: true },
                        { field: 'pay_hits', title: '支付人数',  minWidth: "120",sort: true, unresize: true },
                        { field: 'uv_byr_price', title: 'uv价值',  minWidth: "120",sort: true, unresize: true },
                        { field: 'se_ipv_rate', title: '搜索占比(%)',  minWidth: "120",sort: true, unresize: true },
                        { field: 'clt_rate', title: '收藏率(%)',  minWidth: "120",sort: true, unresize: true },
                        { field: 'cart_rate', title: '加购率(%)',  minWidth: "120",sort: true, unresize: true },
                        ]]
                    });
                });
            },
            error: function (err) {
                console.log(err)
            }
        })
    })

    // 关键指标对比 复制数据 下载数据 搜索数据
    $("body").on("click", ".yx_jdfx_down_zbdb", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(jdfx_zbdb_table_render.config.id, jdfx_zbdb_table_data); //导出数据
        })
    })
    $("body").on("click", ".yx_jdfx_copy_zbdb", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.jdfx_zbdb_table;

            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '店铺类型      交易金额      访问人数      收藏人数      加购人数      搜索人数      支付转化率(%)      客单价\n'
            table.map((v) => {
                str += `\n${v.shop_type_name}      ${v.trade_price}      ${v.uv_index}      ${v.clt_hits}      ${v.cart_hits}      ${v.se_ipv_uv_hits}      ${v.pay_rate_index}      ${v.pay_byr_cnt}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_search_scdp_zbdb", function () { 
        layui.use('table', function () {
            var pieList = jdfx_zbdb_table_data;
            let key = $('#yx_search_scdp_zbdb').val()
            let filter = pieList.filter((v) => {
                let shop_type_name = v.shop_type_name.toString()
                let trade_price = v.trade_price.toString()
                let uv_index = v.uv_index.toString()
                let clt_hits = v.clt_hits.toString()
                let cart_hits = v.cart_hits.toString()
                let se_ipv_uv_hits = v.se_ipv_uv_hits.toString()
                let pay_rate_index = v.pay_rate_index.toString()
                let pay_byr_cnt = v.pay_byr_cnt.toString()
    
                return shop_type_name.includes(key) || trade_price.includes(key) || uv_index.includes(key) || clt_hits.includes(key) || cart_hits.includes(key) || se_ipv_uv_hits.includes(key) || pay_rate_index.includes(key) || pay_byr_cnt.includes(key)
            })

            jdfx_zbdb_table_render.reload({
                data: filter
            });
        })
    })



    // 竞店识别
    $("body").on("click", "#analysis-conver", function () { 
        

        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }

        let store = getStore()
        let start_time, end_time, cateId, data_json, shop_data
        let idarr = $("#drainRecognition .op-mc-shop-recognition-trend-analysis").attr("id").split("-")
        let id = idarr[idarr.length-1]

        for (let key in store) {
            if (key.includes('/mc/ci/shop/trend.json') && key.includes(`userId=${id}`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                data_json = JSON.parse(d).value._d

                let dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
            }
        }
        for (let key in store) {
            if (key.includes('/mc/ci/config/rival/shop/getSingleMonitoredInfo.json') && key.includes(`userId=${id}`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                shop_data = JSON.parse(d).value._d
            }
        }

      
        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/compete/shop/analysis",
            data: {
                data: data_json,
                type: $(".oui-tab-switch-item-active").text() == '高潜竞店识别' ? 'high' : 'loss',
                shop_data: shop_data,
                start_time,
                end_time,
                cateId
            },
            success : function(res) {
                $("#yx-loading").fadeOut()

                jdsb_table_data = res.data.data
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        maxmin: true,
                        move: false,
                        title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>竞店识别<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: `<div class='yx-jkkb'>
                                    <div id='echarts-jdsb'></div>
                                    <div class='yx-operation'>
                                        <div class='yx-btns'>
                                            <span class='yx-b1 yx_jdsb_down'>下载数据</span>
                                            <span class='yx-b2 yx_jdsb_copy'>复制数据</span>
                                        </div>
                                        <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_search_jdsb'></div>
                                    </div>
                                    <table id='jdsb_table'></table>
                                </div>`
                    });

                }); 

                layui.use('table', function(){
                    var table = layui.table;
                    
                    //第一个实例
                    jdsb_table_render = table.render({
                      id: "jdsb_table",
                      elem: '#jdsb_table',
                      title: "竞店识别",
                      page: true, //开启分页
                      limit: 10,
                      limits: [5, 10, 20, 50, 100],
                      data: res.data.data,
                      cols: [[ //表头
                        {field: 'date', title: '日期', sort: true, unresize: true},
                        {field: 'trade_price', title: '交易金额', sort: true, unresize: true},
                        {field: 'uv_index', title: '访问人数', sort: true, unresize: true},
                        {field: 'pay_hits', title: '支付人数', sort: true, unresize: true},
                        {field: 'pay_rate_index', title: '支付转化率(%)', sort: true, unresize: true},
                        {field: 'pay_byr_cnt', title: '客单价', sort: true, unresize: true},
                        {field: 'uv_byr_price', title: 'uv价值', sort: true, unresize: true},
                      ]]
                    });
                });
            },
            error: function (err) {
                console.log(err)
            }
        })

    })

    // 竞店识别 复制数据 下载数据 搜索数据
    $("body").on("click", ".yx_jdsb_down", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(jdsb_table_render.config.id, jdsb_table_data); //导出数据
        })
    })
    $("body").on("click", ".yx_jdsb_copy", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.jdsb_table;

            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '日期      交易金额      访问人数      支付人数      支付转化率(%)      客单价      uv价值\n'
            table.map((v) => {
                str += `\n${v.date}      ${v.trade_price}      ${v.uv_index}      ${v.pay_hits}      ${v.pay_rate_index}      ${v.pay_byr_cnt}      ${v.uv_byr_price}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_search_jdsb", function () { 
        layui.use('table', function () {
            var pieList = jdsb_table_data;
            let key = $('#yx_search_jdsb').val()
            let filter = pieList.filter((v) => {
                let trade_price = v.trade_price.toString()
                let uv_index = v.uv_index.toString()
                let pay_rate_index = v.pay_rate_index.toString()
                let pay_byr_cnt = v.pay_byr_cnt.toString()
    
                return trade_price.includes(key) || uv_index.includes(key) || pay_rate_index.includes(key) || pay_byr_cnt.includes(key)
            })

            jdsb_table_render.reload({
                data: filter
            });
        })
    })






    // 市场大盘 行业趋势
    $("body").on("click", "#trend-conver", function () { 
        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }


        let store = getStore()
        let seIpvUvHits, sePvIndex, uv, pv, cltByrCnt, cltTimes, cartByrCnt, cartTimes, payByrCntIndex, tradeIndex
        let len = 0
        
        let dateRange,start_time,end_time,cateId
        for (let key in store) {
            if (key.includes('/mc/mq/supply/mkt/trend/cate.json') && key.includes(`indexCode=seIpvUvHits`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                seIpvUvHits = JSON.parse(d).value._d

                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
                len++
            }
        }
        for (let key in store) {
            if (key.includes('/mc/mq/supply/mkt/trend/cate.json') && key.includes(`indexCode=sePvIndex`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                sePvIndex = JSON.parse(d).value._d
                
                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
                len++
            }
        }
        for (let key in store) {
            if (key.includes('/mc/mq/supply/mkt/trend/cate.json') && key.includes(`indexCode=uv`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                uv = JSON.parse(d).value._d

                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
                len++
            }
        }
        for (let key in store) {
            if (key.includes('/mc/mq/supply/mkt/trend/cate.json') && key.includes(`indexCode=pv`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                pv = JSON.parse(d).value._d

                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
                len++
            }
        }
        for (let key in store) {
            if (key.includes('/mc/mq/supply/mkt/trend/cate.json') && key.includes(`indexCode=cltByrCnt`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                cltByrCnt = JSON.parse(d).value._d

                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
                len++
            }
        }
        for (let key in store) {
            if (key.includes('/mc/mq/supply/mkt/trend/cate.json') && key.includes(`indexCode=cltTimes`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                cltTimes = JSON.parse(d).value._d

                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
                len++
            }
        }
        for (let key in store) {
            if (key.includes('/mc/mq/supply/mkt/trend/cate.json') && key.includes(`indexCode=cartByrCnt`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                cartByrCnt = JSON.parse(d).value._d

                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
                len++
            }
        }
        for (let key in store) {
            if (key.includes('/mc/mq/supply/mkt/trend/cate.json') && key.includes(`indexCode=cartTimes`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                cartTimes = JSON.parse(d).value._d

                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
                len++
            }
        }
        for (let key in store) {
            if (key.includes('/mc/mq/supply/mkt/trend/cate.json') && key.includes(`indexCode=payByrCntIndex`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                payByrCntIndex = JSON.parse(d).value._d

                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
                len++
            }
        }
        for (let key in store) {
            if (key.includes('/mc/mq/supply/mkt/trend/cate.json') && key.includes(`indexCode=tradeIndex`)) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                tradeIndex = JSON.parse(d).value._d

                dateRange = $.getUrlParamVal("dateRange", key).split('|')
                start_time = dateRange[0]
                end_time = dateRange[1]
                cateId = $.getUrlParamVal("cateId", key)
                len++
            }
        }
        

        

        // console.log(seIpvUvHits, sePvIndex, uv, pv, cltByrCnt, cltTimes, cartByrCnt, cartTimes, payByrCntIndex, tradeIndex)
        $.ajax({
            type : "POST",
            url : window.baseUrl + "/plugin/market/trend",
            // dataType: 'json',
            data: {
                data: {
                    seIpvUvHits,
                    sePvIndex,
                    uv, pv, cltByrCnt, cltTimes, cartByrCnt, cartTimes, payByrCntIndex, tradeIndex
                },
                start_time,
                end_time,
                cateId
            },
            success : function(res) {
                $("#yx-loading").fadeOut()

                scdp_hyqs_table_data = res.data
                layui.use('layer', function(){
                    var layer = layui.layer;
                
                    layer.open({
                        type: 1,
                        maxmin: true,
                        move: false,
                        title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>市场大盘-行业趋势<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                        area: ['80%', '80%'],
                        content: `<div class='yx-jkkb'>
                                    <div class='yx-operation'>
                                        <div class='yx-btns'>
                                            <span class='yx-b1 yx_scdp_down_hyqs'>下载数据</span>
                                            <span class='yx-b2 yx_scdp_copy_hyqs'>复制数据</span>
                                        </div>
                                        <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_search_scdp_hyqs'></div>
                                    </div>
                                    <table id='scdp_hyqs_table'></table>
                                </div>`
                    });

                }); 

                if (len < $(".index-area-multiple-container .alife-one-design-sycm-indexes-trend-index-item-multiple-line-selectable").length) { 
                    layui.use('layer', function(){
                        var layer = layui.layer;
                        layer.msg('提示：您需要点击其他数据才能显示完整数据！');
                    });
                }

                let cols = [
                    {field: 'date', title: '日期', minWidth: "120",sort: true, unresize: true},
                    {field: 'uv', title: '访客数', minWidth: "120",sort: true, unresize: true},
                    {field: 'pv', title: '浏览量', minWidth: "120",sort: true, unresize: true},
                    {field: 'clt_byr_cnt', title: '收藏人数', minWidth: "120",sort: true, unresize: true},
                    {field: 'clt_times', title: '收藏次数', minWidth: "120",sort: true, unresize: true},
                    {field: 'cart_byr_cnt', title: '加购人数', minWidth: "120",sort: true, unresize: true},
                    {field: 'cart_times', title: '加购次数',minWidth: "120", sort: true, unresize: true},
                ]


                
                if (res.data[0].pay_hits) {
                    cols.push(
                        {field: 'pay_hits', title: '支付人数', minWidth: "120",sort: true, unresize: true},
                    )
                }
                if (res.data[0].pay_byr_cnt) { 
                    cols.push(
                        { field: 'pay_byr_cnt', title: '客单价', minWidth: "120", sort: true, unresize: true },
                        {field: 'trade_price', title: '交易金额', minWidth: "120",sort: true, unresize: true},
                        {field: 'se_ipv_uv_hits', title: '搜索人数', minWidth: "120",sort: true, unresize: true},
                        { field: 'se_pv_index', title: '搜索次数', minWidth: "120", sort: true, unresize: true }
                    )
                }

                layui.use('table', function(){
                    var table = layui.table;
                    
                    //第一个实例
                    scdp_hyqs_table_render = table.render({
                      id: "scdp_hyqs_table",
                      elem: '#scdp_hyqs_table',
                      title: "市场大盘-行业趋势",
                      page: true, //开启分页
                      limit: 10,
                      limits: [5, 10, 20, 50, 100],
                      data: res.data,
                      cols: [cols]
                    });
                });
            },
            error: function (err) {
                console.log(err)
            }
        })
    })

    // 市场大盘 行业趋势 复制数据 下载数据 搜索数据
    $("body").on("click", ".yx_scdp_down_hyqs", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(scdp_hyqs_table_render.config.id, scdp_hyqs_table_data); //导出数据
        })
    })
    $("body").on("click", ".yx_scdp_copy_hyqs", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.scdp_hyqs_table;

            let str = ''
            
            if (table[0].pay_byr_cnt) {
                str += plugin_name+"\n"
                str += '\n'
                str += '日期      访客数      浏览量      收藏人数      收藏次数      加购人数      加购次数      支付人数      客单价      交易金额      搜索人数      搜索次数\n'
                table.map((v) => {
                    str += `\n${v.date}      ${v.uv}      ${v.pv}      ${v.clt_byr_cnt}      ${v.clt_times}      ${v.cart_byr_cnt}      ${v.cart_times}      ${v.pay_hits}      ${v.pay_byr_cnt}      ${v.trade_price}      ${v.se_ipv_uv_hits}      ${v.se_pv_index}`
                })
            } else { 
                str += plugin_name+"\n"
                str += '\n'
                str += '日期      访客数      浏览量      收藏人数      收藏次数      加购人数      加购次数      支付人数\n'
                table.map((v) => {
                    str += `\n${v.date}      ${v.uv}      ${v.pv}      ${v.clt_byr_cnt}      ${v.clt_times}      ${v.cart_byr_cnt}      ${v.cart_times}      ${v.pay_hits}`
                })
            }
            

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_search_scdp_hyqs", function () { 
        layui.use('table', function () {
            var pieList = scdp_hyqs_table_data;
            let key = $('#yx_search_scdp_hyqs').val()
            let filter = pieList.filter((v) => {
                // let trade_price = v.trade_price.toString()
                // let se_ipv_uv_hits = v.se_ipv_uv_hits.toString()
                // let se_pv_index = v.se_pv_index.toString()
                let uv = v.uv.toString()
                let pv = v.pv.toString()
                let clt_byr_cnt = v.clt_byr_cnt.toString()
                let clt_times = v.clt_times.toString()
                let cart_byr_cnt = v.cart_byr_cnt.toString()
                let cart_times	 = v.cart_times	.toString()
                // let pay_byr_cnt = v.pay_byr_cnt.toString()
    
                return uv.includes(key) || pv.includes(key) || clt_byr_cnt.includes(key) || clt_times.includes(key) || cart_byr_cnt.includes(key) || cart_times.includes(key)
            })

            scdp_hyqs_table_render.reload({
                data: filter
            });
        })
    })


    // 行业构成
    $("body").on("click", "#cateCons-conver", function () {
        

        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }


        let store = getStore()
        let arr = []
        for (let key in store) {
            if (key.includes('/mc/mq/supply/deal/list.json')) {
                let data = store[key].split("|")[1]
                let d = JSON.parse(`"${data}`)
                arr.push(JSON.parse(d).value._d)

                let dateRange = $.getUrlParamVal("dateRange", key).split('|')
                let start_time = dateRange[0]
                let end_time = dateRange[1]
                let cateId = $.getUrlParamVal("cateId", key)

                $.ajax({
                    type : "POST",
                    url : window.baseUrl + "/plugin/market/constitute",
                    data: {
                        data: arr[arr.length-1],
                        start_time,
                        end_time,
                        cateId
                    },
                    success : function(res) {
                        $("#yx-loading").fadeOut()
                      
                        scdp_hygc_table_data = res.data
                        layui.use('layer', function(){
                            var layer = layui.layer;
                        
                            layer.open({
                                type: 1,
                                maxmin: true,
                                move: false,
                                title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>市场大盘-行业构成<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                                area: ['80%', '80%'],
                                content: `<div class='yx-jkkb'>
                                            <div class='yx-operation'>
                                                <div class='yx-btns'>
                                                    <span class='yx-b1 yx_scdp_down_hygc'>下载数据</span>
                                                    <span class='yx-b2 yx_scdp_copy_hygc'>复制数据</span>
                                                </div>
                                                <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_search_scdp_hygc'></div>
                                            </div>
                                            <table id='scdp_hygc_table'></table>
                                        </div>`
                            });
        
                        }); 
        
                        layui.use('table', function(){
                            var table = layui.table;
                            
                            //第一个实例
                            scdp_hygc_table_render = table.render({
                              id: "scdp_hygc_table",
                              elem: '#scdp_hygc_table',
                              title: "市场大盘-行业构成",
                              page: true, //开启分页
                              limit: 10,
                              limits: [5, 10, 20, 50, 100],
                              data: res.data,
                              cols: [[ //表头
                                {field: 'cate_name', title: '类目名', sort: true, unresize: true},
                                {field: 'trade_price', title: '交易金额', sort: true, unresize: true},
                                {field: 'trade_growth_range', title: '交易增长幅度(%)', sort: true, unresize: true},
                                {field: 'pay_amt_parent_cate_rate', title: '支付金额较父行业占比(%)', sort: true, unresize: true},
                                {field: 'pay_cnt_parent_cate_rate', title: '支付子订单数较父行业占比(%)', sort: true, unresize: true},
                              ]]
                            });
                        });
                    },
                    error: function (err) {
                        console.log(err)
                    }
                })
            }
        }
        // 有时候会出现有多个的情况 取最后一个
    })

    // 市场大盘 行业构成 复制数据 下载数据 搜索数据
    $("body").on("click", ".yx_scdp_down_hygc", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(scdp_hygc_table_render.config.id, scdp_hygc_table_data); //导出数据
        })
    })
    $("body").on("click", ".yx_scdp_copy_hygc", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.scdp_hygc_table;

            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '类目名      交易金额      交易增长幅度(%)      支付金额较父行业占比(%)      支付子订单数较父行业占比(%)\n'
            table.map((v) => {
                str += `\n${v.cate_name}      ${v.trade_price}      ${v.trade_growth_range}      ${v.pay_amt_parent_cate_rate}      ${v.pay_cnt_parent_cate_rate}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_search_scdp_hygc", function () { 
        layui.use('table', function () {
            var pieList = scdp_hygc_table_data;
            let key = $('#yx_search_scdp_hygc').val()
            let filter = pieList.filter((v) => {
                let cate_name = v.cate_name.toString()
                let trade_price = v.trade_price.toString()
                let trade_growth_range = v.trade_growth_range.toString()
                let pay_amt_parent_cate_rate = v.pay_amt_parent_cate_rate.toString()
                let pay_cnt_parent_cate_rate = v.pay_cnt_parent_cate_rate.toString()
    
                return cate_name.includes(key) || trade_price.includes(key) || trade_growth_range.includes(key) || pay_amt_parent_cate_rate.includes(key) || pay_cnt_parent_cate_rate.includes(key)
            })

            scdp_hygc_table_render.reload({
                data: filter
            });
        })
    })

    // 我的监控
    $("body").on("click", "#jkkb-conver", function () {
        

        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }


        $("#yx-loading").fadeIn()
       
        // /mc/live/ci/shop/monitor/list.json 店铺
        // /mc/live/ci/item/monitor/list.json 商品
        // /mc/live/ci/brand/monitor/list.json 品牌
        let pageSize = $('.mc-marketMonitor .oui-page-size .ant-select-selection-selected-value').text()
        let page = $(".mc-marketMonitor .ant-pagination-item-active").text()
        let tabName = $('.mc-marketMonitor .oui-tab-switch-item-active').text()
        

        if (tabName == '店铺') { 
            let store = getStore()
            let data,d,dp,dateRange,start_time,end_time,cateId
            for (let key in store) {
                if (key.includes('/mc/live/ci/shop/monitor/list.json') && key.includes(`pageSize=${pageSize}`) && key.includes(`page=${page}`)) {
                    data = store[key].split("|")[1]
                    d = JSON.parse(`"${data}`)
                    dp = JSON.parse(d)

                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }


            if (!dp) {
                for (let key in store) {
                    if (key.includes('/mc/ci/shop/monitor/list.json') && key.includes(`pageSize=${pageSize}`) && key.includes(`page=${page}`)) {
                        data = store[key].split("|")[1]
                        d = JSON.parse(`"${data}`)
                        dp = JSON.parse(d)
    
                        dateRange = $.getUrlParamVal("dateRange", key).split('|')
                        start_time = dateRange[0]
                        end_time = dateRange[1]
                        cateId = $.getUrlParamVal("cateId", key)
                    }
                }
            }


            $.ajax({
                type : "POST",
                url : window.baseUrl + "/plugin/my/monitor",
                data: {
                    type: "shop",
                    data: dp.value._d,
                    start_time,
                    end_time,
                    cateId
                },
                success : function(res) {
                    $("#yx-loading").fadeOut()
                    jkkb_shop_table_data = res.data
                    layui.use('layer', function(){
                        var layer = layui.layer;
                    
                        layer.open({
                            type: 1,
                            maxmin: true,
                            move: false,
                            title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>我的监控-店铺<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                            area: ['80%', '80%'],
                            content: `<div class='yx-jkkb'>
                                        <div class='yx-operation'>
                                            <div class='yx-btns'>
                                                <span class='yx-b1 yx_jkkb_down_shop'>下载数据</span>
                                                <span class='yx-b2 yx_jkkb_copy_shop'>复制数据</span>
                                            </div>
                                            <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_search_jkkb_shop'></div>
                                        </div>
                                        <table id='jkkb_shop_table'></table>
                                    </div>`
                        });

                    }); 

                    layui.use('table', function(){
                        var table = layui.table;
                        
                        //第一个实例
                        jkkb_shop_table_render = table.render({
                          id: "jkkb_shop_table",
                          elem: '#jkkb_shop_table',
                          title: "我的监控-店铺",
                          page: true, //开启分页
                          limit: 10,
                          limits: [5, 10, 20, 50, 100],
                          data: res.data,
                          cols: [[ //表头
                            // {field: 'shop_uid', title: '店铺ID'},
                            // {field: 'shop_name', title: '店铺名称'},
                            {field: 'shop_logo', title: '店铺信息', minWidth: "240", unresize: true, templet: function(d){
                                return '<div class="yx-shop-logo"><img src='+ d.shop_logo +' class="v-logo" /><span>'+ d.shop_name +'</span></div>'
                            }},
                            // {field: 'shop_link', title: '店铺地址', templet: function(d){
                            //     return '<a href='+ d.shop_link +' class="yx-color-link">店铺地址</a></div>'
                            // }},
                            {field: 'cate_rank_id', title: '行业排名',minWidth: "120", sort: true, unresize: true},
                            {field: 'se_ipv_uv_hits', title: '搜索人数',minWidth: "120", sort: true, unresize: true},
                            {field: 'cart_hits', title: '加购人数',minWidth: "120", sort: true, unresize: true},
                            {field: 'trade_price', title: '交易金额',minWidth: "120", sort: true, unresize: true},
                            {field: 'pay_rate_index', title: '支付转化率(%)',minWidth: "120", sort: true, unresize: true},
                            {field: 'uv_index', title: '访问人数', minWidth: "120",sort: true, unresize: true},
                            { field: 'clt_hits', title: '收藏人数',minWidth: "120", sort: true, unresize: true },
                            { field: 'pay_hits', title: '支付人数', minWidth: "120",sort: true, unresize: true },
                            { field: 'pay_byr_cnt', title: '客单价',minWidth: "120", sort: true, unresize: true },
                            { field: 'uv_byr_price', title: 'UV价值', minWidth: "120",sort: true, unresize: true },
                            { field: 'se_ipv_rate', title: '搜索占比(%)',minWidth: "120", sort: true, unresize: true },
                            { field: 'clt_rate', title: '收藏率(%)', minWidth: "120",sort: true, unresize: true },
                            { field: 'cart_rate', title: '加购率(%',minWidth: "120", sort: true, unresize: true },
                            
                          ]]
                        });
                    });
                },
                error: function (err) {
                    console.log(err)
                }
            })
        }
        if (tabName == '商品') { 
            let store = getStore()
            let data,d,dp,dateRange,start_time,end_time,cateId
            for (let key in store) {
                if (key.includes('/mc/live/ci/item/monitor/list.json') && key.includes(`pageSize=${pageSize}`) && key.includes(`page=${page}`)) {
                    data = store[key].split("|")[1]
                    d = JSON.parse(`"${data}`)
                    dp = JSON.parse(d)

                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }
            if (!dp) { 
                for (let key in store) {
                    if (key.includes('/mc/ci/item/monitor/list.json') && key.includes(`pageSize=${pageSize}`) && key.includes(`page=${page}`)) {
                        data = store[key].split("|")[1]
                        d = JSON.parse(`"${data}`)
                        dp = JSON.parse(d)
    
                        dateRange = $.getUrlParamVal("dateRange", key).split('|')
                        start_time = dateRange[0]
                        end_time = dateRange[1]
                        cateId = $.getUrlParamVal("cateId", key)
                    }
                }
            }
            $.ajax({
                type : "POST",
                url : window.baseUrl + "/plugin/my/monitor",
                data: {
                    type: "goods",
                    data: dp.value._d,
                    start_time,
                    end_time,
                    cateId
                },
                success : function(res) {
                    $("#yx-loading").fadeOut()
                    jkkb_goods_table_data = res.data
                    layui.use('layer', function(){
                        var layer = layui.layer;
                    
                        layer.open({
                            type: 1,
                            maxmin: true,
                            move: false,
                            title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>我的监控-商品<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                            area: ['80%', '80%'],
                            content: `<div class='yx-jkkb'>
                                        <div class='yx-operation'>
                                            <div class='yx-btns'>
                                                <span class='yx-b1 yx_jkkb_down_goods'>下载数据</span>
                                                <span class='yx-b2 yx_jkkb_copy_goods'>复制数据</span>
                                            </div>
                                            <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_search_jkkb_goods'></div>
                                        </div>
                                        <table id='jkkb_goods_table'></table>
                                    </div>`
                        });

                    }); 

                    layui.use('table', function(){
                        var table = layui.table;
                        
                        //第一个实例
                        jkkb_goods_table_render = table.render({
                          id: "jkkb_goods_table",
                          elem: '#jkkb_goods_table',
                          title: "我的监控-商品",
                          page: true, //开启分页
                          limit: 10,
                          limits: [5, 10, 20, 50, 100],
                          data: res.data,
                          cols: [[ //表头
                            {field: 'shop_logo', title: '商品信息', minWidth: "240", unresize: true, templet: function(d){
                                return '<div class="yx-goods-logo"><img src='+ d.goods_logo +' class="yx-goods-img" /><div class="yx-alink"><a href='+d.goods_link+' target="_blank">'+d.goods_name+'</a><span>'+ d.shop_name +'</span></div></div>'
                            }},
                            {field: 'cate_rank_id', title: '行业排名', minWidth: "120",sort: true, unresize: true},
                            {field: 'se_ipv_uv_hits', title: '搜索人数', minWidth: "120", sort: true, unresize: true},
                            {field: 'cart_hits', title: '加购人数', minWidth: "120",sort: true, unresize: true},
                            {field: 'trade_price', title: '交易金额',minWidth: "120", sort: true, unresize: true},
                            {field: 'pay_rate_index', title: '支付转化率(%)', sort: true, unresize: true},
                              { field: 'uv_index', title: '访问人数',minWidth: "120", sort: true, unresize: true },
                              { field: 'clt_hits', title: '收藏人数',minWidth: "120", sort: true, unresize: true },
                              { field: 'pay_hits', title: '支付人数',minWidth: "120", sort: true, unresize: true },
                              { field: 'pay_byr_cnt', title: '客单价', minWidth: "120",sort: true, unresize: true },
                              { field: 'uv_byr_price', title: 'UV价值',minWidth: "120", sort: true, unresize: true },
                              { field: 'se_ipv_rate', title: '搜索占比(%)',minWidth: "120", sort: true, unresize: true },
                              { field: 'clt_rate', title: '收藏率(%)', minWidth: "120",sort: true, unresize: true },
                              { field: 'cart_rate', title: '加购率(%)', minWidth: "120",sort: true, unresize: true },
                          ]]
                        });
                    });
                },
                error: function (err) {
                    console.log(err)
                }
            })
        }
        if (tabName == '品牌') { 
            let store = getStore()
            let data,d,dp,dateRange,start_time,end_time,cateId
            for (let key in store) {
                if (key.includes('/mc/live/ci/brand/monitor/list.json') && key.includes(`pageSize=${pageSize}`) && key.includes(`page=${page}`)) {
                    data = store[key].split("|")[1]
                    d = JSON.parse(`"${data}`)
                    dp = JSON.parse(d)

                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }
            if (!dp) { 
                for (let key in store) {
                    if (key.includes('/mc/ci/brand/monitor/list.json') && key.includes(`pageSize=${pageSize}`) && key.includes(`page=${page}`)) {
                        data = store[key].split("|")[1]
                        d = JSON.parse(`"${data}`)
                        dp = JSON.parse(d)
    
                        dateRange = $.getUrlParamVal("dateRange", key).split('|')
                        start_time = dateRange[0]
                        end_time = dateRange[1]
                        cateId = $.getUrlParamVal("cateId", key)
                    }
                }
            }
            $.ajax({
                type : "POST",
                url : window.baseUrl + "/plugin/my/monitor",
                data: {
                    type: "brand",
                    data: dp.value._d,
                    start_time,
                    end_time,
                    cateId
                },
                success : function(res) {
                    $("#yx-loading").fadeOut()
                    jkkb_brand_table_data = res.data
                    layui.use('layer', function(){
                        var layer = layui.layer;
                    
                        layer.open({
                            type: 1,
                            maxmin: true,
                            move: false,
                            title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>我的监控-商品<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                            area: ['80%', '80%'],
                            content: `<div class='yx-jkkb'>
                                        <div class='yx-operation'>
                                            <div class='yx-btns'>
                                                <span class='yx-b1 yx_jkkb_down_brand'>下载数据</span>
                                                <span class='yx-b2 yx_jkkb_copy_brand'>复制数据</span>
                                            </div>
                                            <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_search_jkkb_brand'></div>
                                        </div>
                                        <table id='jkkb_brand_table'></table>
                                    </div>`
                        });

                    }); 

                    layui.use('table', function(){
                        var table = layui.table;
                        
                        //第一个实例
                        jkkb_brand_table_render = table.render({
                          id: "jkkb_brand_table",
                          elem: '#jkkb_brand_table',
                          title: "我的监控-品牌",
                          page: true, //开启分页
                          limit: 10,
                          limits: [5, 10, 20, 50, 100],
                          data: res.data,
                          cols: [[ //表头
                            {field: 'shop_logo', title: '品牌信息', minWidth: "200", unresize: true, templet: function(d){
                                return '<div class="yx-shop-logo"><div class="yx-logo-over"><img src='+ d.brand_logo +' class="yx-a-logo" /></div><span>'+ d.brand_name +'</span></div>'
                            }},
                            // {field: 'brand_name', title: '品牌信息', sort: true, unresize: true},
                            // {field: 'brand_logo', title: '品牌logo', sort: true, unresize: true},
                            {field: 'brand_id', title: '品牌Id', sort: true, unresize: true},
                            {field: 'trade_price', title: '交易金额', sort: true, unresize: true},
                            {field: 'cate_rank_id', title: '行业排名', sort: true, unresize: true},
                          ]]
                        });
                    });
                },
                error: function (err) {
                    console.log(err)
                }
            })
        }
        
    })

    // 监控看板 店铺 复制数据 下载数据 搜索数据
    $("body").on("click", ".yx_jkkb_down_shop", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(jkkb_shop_table_render.config.id, jkkb_shop_table_data); //导出数据
        })
    })
    $("body").on("click", ".yx_jkkb_copy_shop", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.jkkb_shop_table;

            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '店铺信息      行业排名      搜索人数      加购人数      交易金额      支付转化率      访问人数      收藏人数      支付人数      客单价      UV价值      搜索占比      收藏率      加购率\n'
            table.map((v) => {
                str += `\n${v.shop_name}      ${v.cate_rank_id}      ${v.se_ipv_uv_hits}      ${v.cart_hits}      ${v.trade_price}      ${v.pay_rate_index}      ${v.uv_index}      ${v.clt_hits}      ${v.pay_byr_cnt}      ${v.pay_hits}      ${v.uv_byr_price}      ${v.se_ipv_rate}      ${v.clt_rate}      ${v.cart_rate}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_search_jkkb_shop", function () { 
        layui.use('table', function () {
            var pieList = jkkb_shop_table_data;
            let key = $('#yx_search_jkkb_shop').val()
            let filter = pieList.filter((v) => {
                let shop_name = v.shop_name
                let clt_hits = v.clt_hits.toString()
                let uv_index = v.uv_index.toString()
                let pay_rate_index = v.pay_rate_index.toString()
                let trade_price = v.trade_price.toString()
                let cart_hits = v.cart_hits.toString()
                let se_ipv_uv_hits = v.se_ipv_uv_hits.toString()
                let cate_rank_id = v.cate_rank_id.toString()
    
                return shop_name.includes(key) || clt_hits.includes(key) || uv_index.includes(key) || pay_rate_index.includes(key) || trade_price.includes(key) || cart_hits.includes(key) || se_ipv_uv_hits.includes(key) || cate_rank_id.includes(key)
            })

            jkkb_shop_table_render.reload({
                data: filter
            });
        })
    })

    // 监控看板 商品 复制数据 下载数据 搜索数据
    $("body").on("click", ".yx_jkkb_down_goods", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(jkkb_goods_table_render.config.id, jkkb_goods_table_data); //导出数据
        })
    })
    $("body").on("click", ".yx_jkkb_copy_goods", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.jkkb_goods_table;

            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '商品名称      商品Id      行业排名      搜索人数      加购人数      交易金额      支付转化率      访问人数      收藏人数      支付人数      客单价      UV价值      搜索占比      收藏率      加购率\n'
            table.map((v) => {
                str += `\n${v.goods_name}      ${v.goods_id}      ${v.cate_rank_id}      ${v.se_ipv_uv_hits}      ${v.cart_hits}      ${v.trade_price}      ${v.pay_rate_index}      ${v.uv_index}      ${v.clt_hits}      ${v.pay_byr_cnt}      ${v.pay_hits}      ${v.uv_byr_price}      ${v.se_ipv_rate}      ${v.clt_rate}      ${v.cart_rate}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_search_jkkb_goods", function () { 
        

        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }

        layui.use('table', function () {
            var pieList = jkkb_goods_table_data;
            let key = $('#yx_search_jkkb_goods').val()
            let filter = pieList.filter((v) => {
                let goods_name = v.goods_name
                let shop_name = v.shop_name
                let clt_hits = v.clt_hits.toString()
                let uv_index = v.uv_index.toString()
                let pay_rate_index = v.pay_rate_index.toString()
                let trade_price = v.trade_price.toString()
                let cart_hits = v.cart_hits.toString()
                let se_ipv_uv_hits = v.se_ipv_uv_hits.toString()
                let cate_rank_id = v.cate_rank_id.toString()
    
                return goods_name.includes(key) || shop_name.includes(key) || clt_hits.includes(key) || uv_index.includes(key) || pay_rate_index.includes(key) || trade_price.includes(key) || cart_hits.includes(key) || se_ipv_uv_hits.includes(key) || cate_rank_id.includes(key)
            })

            jkkb_goods_table_render.reload({
                data: filter
            });
        })
    })

    // 监控看板 品牌 复制数据 下载数据 搜索数据
    $("body").on("click", ".yx_jkkb_down_brand", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(jkkb_brand_table_render.config.id, jkkb_brand_table_data); //导出数据
        })
    })
    $("body").on("click", ".yx_jkkb_copy_brand", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.jkkb_brand_table;

            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '品牌信息      品牌Id      交易金额      行业排名\n'
            table.map((v) => {
                str += `\n${v.brand_name}      ${v.brand_id}      ${v.trade_price}      ${v.cate_rank_id}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_search_jkkb_brand", function () { 
        layui.use('table', function () {
            var pieList = jkkb_brand_table_data;
            let key = $('#yx_search_jkkb_brand').val()
            let filter = pieList.filter((v) => {
                let brand_name = v.brand_name
                let brand_id = v.brand_id.toString()
                let trade_price = v.trade_price.toString()
                let cate_rank_id = v.cate_rank_id.toString()
    
                return brand_name.includes(key) || brand_id.includes(key) || trade_price.includes(key) || cate_rank_id.includes(key)
            })

            jkkb_brand_table_render.reload({
                data: filter
            });
        })
    })


    // 行业监控
    $("body").on("click", "#industry-conver", function () { 
        

        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }

        // /mc/mq/monitor/cate/live/showTopShops.json 热门店铺
        // /mc/mq/monitor/cate/live/showTopItems.json 热门商品
        // /mc/mq/monitor/cate/live/showTopBrands.json 热门品牌

        let body = $('.op-mc-market-monitor-industryCard') // 最外层盒子
        let pageSize = $('.op-mc-market-monitor-industryCard .oui-page-size .ant-select-selection-selected-value').text()
        let page = $('.op-mc-market-monitor-industryCard .ant-pagination-item-active').text()
        let tabName = body.find('.oui-tab-switch-item-active').text()

        if (tabName == '热门店铺') { 
            let store = getStore()
            let data,d,dp,dateRange,start_time,end_time,cateId
            for (let key in store) {
                if (key.includes('/mc/mq/monitor/cate/live/showTopShops.json') && key.includes(`pageSize=${pageSize}`) && key.includes(`page=${page}`)) {
                    data = store[key].split("|")[1]
                    d = JSON.parse(`"${data}`)
                    dp = JSON.parse(d)

                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }
            if (!dp) { 
                for (let key in store) {
                    if (key.includes('/mc/mq/monitor/cate/offline/showTopShops.json') && key.includes(`pageSize=${pageSize}`) && key.includes(`page=${page}`)) {
                        data = store[key].split("|")[1]
                        d = JSON.parse(`"${data}`)
                        dp = JSON.parse(d)
    
                        dateRange = $.getUrlParamVal("dateRange", key).split('|')
                        start_time = dateRange[0]
                        end_time = dateRange[1]
                        cateId = $.getUrlParamVal("cateId", key)
                    }
                }
            }

            $.ajax({
                type : "POST",
                url : window.baseUrl + "/plugin/industry/monitor",
                data: {
                    type: "shop",
                    data: dp.value._d,
                    start_time,
                    end_time,
                    cateId
                },
                success : function(res) {
                    $("#yx-loading").fadeOut()

                    hyjk_shop_table_data = res.data
                    layui.use('layer', function(){
                        var layer = layui.layer;
                    
                        layer.open({
                            type: 1,
                            maxmin: true,
                            move: false,
                            title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>行业监控-热门店铺<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                            area: ['80%', '80%'],
                            content: `<div class='yx-jkkb'>
                                        <div class='yx-operation'>
                                            <div class='yx-btns'>
                                                <span class='yx-b1 yx_hyjk_down_shop'>下载数据</span>
                                                <span class='yx-b2 yx_hyjk_copy_shop'>复制数据</span>
                                            </div>
                                            <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_search_hyjk_shop'></div>
                                        </div>
                                        <table id='hyjk_shop_table'></table>
                                    </div>`
                        });

                    }); 

                    layui.use('table', function(){
                        var table = layui.table;
                        
                        //第一个实例
                        hyjk_shop_table_render = table.render({
                          id: "hyjk_shop_table",
                          elem: '#hyjk_shop_table',
                          title: "行业监控-热门店铺",
                          page: true, //开启分页
                          limit: 10,
                          limits: [5, 10, 20, 50, 100],
                          data: res.data,
                          cols: [[ //表头
                            {field: 'rank', title: '热门交易', minWidth: "240", unresize: true, templet: function(d){
                                let img = ['','https://img.alicdn.com/tfs/TB1.dXrRVXXXXbdXVXXXXXXXXXX-22-26.png', 'https://img.alicdn.com/tfs/TB16l8lRVXXXXXvaXXXXXXXXXXX-22-26.png', 'https://img.alicdn.com/tfs/TB1MANcRVXXXXcKaXXXXXXXXXXX-22-26.png']

                                let str = ''
                                let className = ''
                                if(d.cate_rank_cqc == ''){
                                    str = '未上榜'
                                    className = 'rank-trend-flat'
                                }else if(d.cate_rank_cqc > 0){
                                    str = `降${d.cate_rank_cqc}名`
                                    className = 'rank-trend-down'
                                }else if(d.cate_rank_cqc == 0){
                                    str = `持平`
                                    className = 'rank-trend-flat'
                                }else if(d.cate_rank_cqc < 0){
                                    str = `升${Math.abs(d.cate_rank_cqc)}名`
                                    className = 'rank-trend-up'
                                }

                                if(d.cate_rank_id <= 3){
                                    return '<div class="yx-rank"><div class="sycm-rank-td" style="width: 60px;"><span><span class="current-rank enable-top-three-image"><img src="'+img[d.cate_rank_id]+'" class="rank-img"></span><span class="last-rank"><span class="'+className+'">'+str+'</span></span></span></div></div>'
                                }else{
                                    return '<div class="yx-rank"><div class="sycm-rank-td" style="width: 60px;"><span><span class="current-rank outside-top-three-rank">'+d.cate_rank_id+'</span><span class="last-rank"><span class="'+className+'">'+str+'</span></span></span></div></div>'
                                }
                            }},
                            {field: 'shop_logo', title: '店铺信息', minWidth: "240", unresize: true, templet: function(d){
                                return '<div class="yx-shop-logo"><img src='+ d.shop_logo +' class="v-logo" /><span>'+ d.shop_name +'</span></div>'
                            }},
                            {field: 'trade_price', title: '交易金额', sort: true, unresize: true},
                            {field: 'cate_rank_id', title: '行业排名', sort: true, unresize: true},
                          ]]
                        });
                    });
                },
                error: function (err) {
                    console.log(err)
                }
            })
        }
        if (tabName == '热门商品') { 
            let store = getStore()
            let data,d,dp,dateRange,start_time,end_time,cateId
            for (let key in store) {
                if (key.includes('/mc/mq/monitor/cate/live/showTopItems.json') && key.includes(`pageSize=${pageSize}`) && key.includes(`page=${page}`) ) {
                    data = store[key].split("|")[1]
                    d = JSON.parse(`"${data}`)
                    dp = JSON.parse(d)

                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }
            if (!dp) { 
                for (let key in store) {
                    if (key.includes('/mc/mq/monitor/cate/offline/showTopItems.json') && key.includes(`pageSize=${pageSize}`) && key.includes(`page=${page}`)) {
                        data = store[key].split("|")[1]
                        d = JSON.parse(`"${data}`)
                        dp = JSON.parse(d)
    
                        dateRange = $.getUrlParamVal("dateRange", key).split('|')
                        start_time = dateRange[0]
                        end_time = dateRange[1]
                        cateId = $.getUrlParamVal("cateId", key)
                    }
                }
            }
            $.ajax({
                type : "POST",
                url : window.baseUrl + "/plugin/industry/monitor",
                data: {
                    type: "goods",
                    data: dp.value._d,
                    start_time,
                    end_time,
                    cateId
                },
                success : function(res) {
                    $("#yx-loading").fadeOut()
                    hyjk_goods_table_data = res.data
                    layui.use('layer', function(){
                        var layer = layui.layer;
                    
                        layer.open({
                            type: 1,
                            maxmin: true,
                            move: false,
                            title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>行业监控-热门商品<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                            area: ['80%', '80%'],
                            content: `<div class='yx-jkkb'>
                                        <div class='yx-operation'>
                                            <div class='yx-btns'>
                                                <span class='yx-b1 yx_hyjk_down_goods'>下载数据</span>
                                                <span class='yx-b2 yx_hyjk_copy_goods'>复制数据</span>
                                            </div>
                                            <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_search_hyjk_goods'></div>
                                        </div>
                                        <table id='hyjk_goods_table'></table>
                                    </div>`
                        });

                    }); 

                    layui.use('table', function(){
                        var table = layui.table;
                        
                        //第一个实例
                        hyjk_goods_table_render = table.render({
                          id: "hyjk_goods_table",
                          elem: '#hyjk_goods_table',
                          title: "行业监控-热门商品",
                          page: true, //开启分页
                          limit: 10,
                          limits: [5, 10, 20, 50, 100],
                          data: res.data,
                          cols: [[ //表头
                            {field: 'rank', title: '热门交易', minWidth: "240", unresize: true, templet: function(d){
                                let img = ['','https://img.alicdn.com/tfs/TB1.dXrRVXXXXbdXVXXXXXXXXXX-22-26.png', 'https://img.alicdn.com/tfs/TB16l8lRVXXXXXvaXXXXXXXXXXX-22-26.png', 'https://img.alicdn.com/tfs/TB1MANcRVXXXXcKaXXXXXXXXXXX-22-26.png']

                                let str = ''
                                let className = ''
                                if(d.cate_rank_cqc == ''){
                                    str = '未上榜'
                                    className = 'rank-trend-flat'
                                }else if(d.cate_rank_cqc > 0){
                                    str = `降${d.cate_rank_cqc}名`
                                    className = 'rank-trend-down'
                                }else if(d.cate_rank_cqc == 0){
                                    str = `持平`
                                    className = 'rank-trend-flat'
                                }else if(d.cate_rank_cqc < 0){
                                    str = `升${Math.abs(d.cate_rank_cqc)}名`
                                    className = 'rank-trend-up'
                                }

                                if(d.cate_rank_id <= 3){
                                    return '<div class="yx-rank"><div class="sycm-rank-td" style="width: 60px;"><span><span class="current-rank enable-top-three-image"><img src="'+img[d.cate_rank_id]+'" class="rank-img"></span><span class="last-rank"><span class="'+className+'">'+str+'</span></span></span></div></div>'
                                }else{
                                    return '<div class="yx-rank"><div class="sycm-rank-td" style="width: 60px;"><span><span class="current-rank outside-top-three-rank">'+d.cate_rank_id+'</span><span class="last-rank"><span class="'+className+'">'+str+'</span></span></span></div></div>'
                                }
                            }},
                            {field: 'shop_logo', title: '商品信息', minWidth: "240", unresize: true, templet: function(d){
                                return '<div class="yx-goods-logo"><img src='+ d.goods_logo +' class="yx-goods-img" /><div class="yx-alink"><a href='+d.goods_link+' target="_blank">'+d.goods_name+'</a><span>'+ d.shop_name +'</span></div></div>'
                            }},
                            {field: 'cate_rank_id', title: '行业排名', sort: true, unresize: true},
                            {field: 'trade_price', title: '交易金额', sort: true, unresize: true},
                          ]]
                        });
                    });
                },
                error: function (err) {
                    console.log(err)
                }
            })
        }
        if (tabName == '热门品牌') { 
            let store = getStore()
            let data,d,dp,dateRange,start_time,end_time,cateId
            for (let key in store) {
                if (key.includes('/mc/mq/monitor/cate/live/showTopBrands.json') && key.includes(`pageSize=${pageSize}`) && key.includes(`page=${page}`) ) {
                    data = store[key].split("|")[1]
                    d = JSON.parse(`"${data}`)
                    dp = JSON.parse(d)

                    dateRange = $.getUrlParamVal("dateRange", key).split('|')
                    start_time = dateRange[0]
                    end_time = dateRange[1]
                    cateId = $.getUrlParamVal("cateId", key)
                }
            }
            if (!dp) { 
                for (let key in store) {
                    if (key.includes('/mc/mq/monitor/cate/offline/showTopBrands.json') && key.includes(`pageSize=${pageSize}`) && key.includes(`page=${page}`)) {
                        data = store[key].split("|")[1]
                        d = JSON.parse(`"${data}`)
                        dp = JSON.parse(d)
    
                        dateRange = $.getUrlParamVal("dateRange", key).split('|')
                        start_time = dateRange[0]
                        end_time = dateRange[1]
                        cateId = $.getUrlParamVal("cateId", key)
                    }
                }
            }
            $.ajax({
                type : "POST",
                url : window.baseUrl + "/plugin/industry/monitor",
                data: {
                    type: "brand",
                    data: dp.value._d,
                    start_time,
                    end_time,
                    cateId
                },
                success : function(res) {
                    $("#yx-loading").fadeOut()
                    hyjk_brand_table_data = res.data
                    layui.use('layer', function(){
                        var layer = layui.layer;
                    
                        layer.open({
                            type: 1,
                            maxmin: true,
                            move: false,
                            title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>行业监控-热门品牌<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                            area: ['80%', '80%'],
                            content: `<div class='yx-jkkb'>
                                        <div class='yx-operation'>
                                            <div class='yx-btns'>
                                                <span class='yx-b1 yx_hyjk_down_brand'>下载数据</span>
                                                <span class='yx-b2 yx_hyjk_copy_brand'>复制数据</span>
                                            </div>
                                            <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_search_hyjk_brand'></div>
                                        </div>
                                        <table id='hyjk_brand_table'></table>
                                    </div>`
                        });

                    }); 

                    layui.use('table', function(){
                        var table = layui.table;
                        
                        //第一个实例
                        hyjk_brand_table_render = table.render({
                          id: "hyjk_brand_table",
                          elem: '#hyjk_brand_table',
                          title: "行业监控-热门品牌",
                          page: true, //开启分页
                          limit: 10,
                          limits: [5, 10, 20, 50, 100],
                          data: res.data,
                          cols: [[ //表头
                            {field: 'rank', title: '热门交易', minWidth: "240", unresize: true, templet: function(d){
                                let img = ['','https://img.alicdn.com/tfs/TB1.dXrRVXXXXbdXVXXXXXXXXXX-22-26.png', 'https://img.alicdn.com/tfs/TB16l8lRVXXXXXvaXXXXXXXXXXX-22-26.png', 'https://img.alicdn.com/tfs/TB1MANcRVXXXXcKaXXXXXXXXXXX-22-26.png']

                                let str = ''
                                let className = ''
                                if(d.cate_rank_cqc == ''){
                                    str = '未上榜'
                                    className = 'rank-trend-flat'
                                }else if(d.cate_rank_cqc > 0){
                                    str = `降${d.cate_rank_cqc}名`
                                    className = 'rank-trend-down'
                                }else if(d.cate_rank_cqc == 0){
                                    str = `持平`
                                    className = 'rank-trend-flat'
                                }else if(d.cate_rank_cqc < 0){
                                    str = `升${Math.abs(d.cate_rank_cqc)}名`
                                    className = 'rank-trend-up'
                                }

                                if(d.cate_rank_id <= 3){
                                    return '<div class="yx-rank"><div class="sycm-rank-td" style="width: 60px;"><span><span class="current-rank enable-top-three-image"><img src="'+img[d.cate_rank_id]+'" class="rank-img"></span><span class="last-rank"><span class="'+className+'">'+str+'</span></span></span></div></div>'
                                }else{
                                    return '<div class="yx-rank"><div class="sycm-rank-td" style="width: 60px;"><span><span class="current-rank outside-top-three-rank">'+d.cate_rank_id+'</span><span class="last-rank"><span class="'+className+'">'+str+'</span></span></span></div></div>'
                                }
                            }},
                            {field: 'shop_logo', title: '品牌信息', minWidth: "200", unresize: true, templet: function(d){
                                return '<div class="yx-shop-logo"><div class="yx-logo-over"><img src='+ d.brand_logo +' class="yx-a-logo" /></div><span>'+ d.brand_name +'</span></div>'
                            }},
                            {field: 'trade_price', title: '交易金额', sort: true, unresize: true},
                            {field: 'cate_rank_id', title: '行业排名', sort: true, unresize: true},
                          ]]
                        });
                    });
                },
                error: function (err) {
                    console.log(err)
                }
            })
        }
    })


    // 行业监控 店铺 复制数据 下载数据 搜索数据
    $("body").on("click", ".yx_hyjk_down_shop", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(hyjk_shop_table_render.config.id, hyjk_shop_table_data); //导出数据
        })
    })
    $("body").on("click", ".yx_hyjk_copy_shop", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.hyjk_shop_table;

            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '店铺信息      交易金额      行业排名\n'
            table.map((v) => {
                str += `\n${v.shop_name}      ${v.trade_price}      ${v.cate_rank_id}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_search_hyjk_shop", function () { 
        layui.use('table', function () {
            var pieList = hyjk_shop_table_data;
            let key = $('#yx_search_hyjk_shop').val()
            let filter = pieList.filter((v) => {
                let shop_name = v.shop_name
                let trade_price = v.trade_price.toString()
                let cate_rank_id = v.cate_rank_id.toString()
    
                return shop_name.includes(key) || trade_price.includes(key) || cate_rank_id.includes(key)
            })

            hyjk_shop_table_render.reload({
                data: filter
            });
        })
    })

    // 行业监控 商品 复制数据 下载数据 搜索数据
    $("body").on("click", ".yx_hyjk_down_goods", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(hyjk_goods_table_render.config.id, hyjk_goods_table_data); //导出数据
        })
    })
    $("body").on("click", ".yx_hyjk_copy_goods", function () {
        

        if(is_use == 0){
            layui.use('layer', function () {
                var layer = layui.layer;
                layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
                    title: "温馨提示",
                    btn: ['确定','取消'] //按钮
                }, function(){
                    window.open("https://www.yingxiaods.com/user/version", '_blank')
                    layer.close(layer.index)
                }, function(){
                    layer.close(layer.index)
                });
            })
            return
        }

        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.hyjk_goods_table;

            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '商品信息      交易金额      行业排名\n'
            table.map((v) => {
                str += `\n${v.goods_name}      ${v.trade_price}      ${v.cate_rank_id}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_search_hyjk_goods", function () { 
        layui.use('table', function () {
            var pieList = hyjk_goods_table_data;
            let key = $('#yx_search_hyjk_goods').val()
            let filter = pieList.filter((v) => {
                let goods_name = v.goods_name
                let trade_price = v.trade_price.toString()
                let cate_rank_id = v.cate_rank_id.toString()
    
                return goods_name.includes(key) || trade_price.includes(key) || cate_rank_id.includes(key)
            })

            hyjk_goods_table_render.reload({
                data: filter
            });
        })
    })

    // 行业监控 品牌 复制数据 下载数据 搜索数据
    $("body").on("click", ".yx_hyjk_down_brand", function () {
        layui.use('table', function () {
            var table = layui.table;
            table.exportFile(hyjk_brand_table_render.config.id, hyjk_brand_table_data); //导出数据
        })
    })
    $("body").on("click", ".yx_hyjk_copy_brand", function () {
        let str = ''

        layui.use('table', function () {
            var table = layui.table.cache.hyjk_brand_table;

            let str = ''
        
            str += plugin_name+"\n"
            str += '\n'
            str += '商品信息      交易金额      行业排名\n'
            table.map((v) => {
                str += `\n${v.brand_name}      ${v.trade_price}      ${v.cate_rank_id}`
            })

            window.GM_setClipboard(str)
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('复制成功');
            });
        })
    })
    $("body").on("input propertychange", "#yx_search_hyjk_brand", function () { 
        layui.use('table', function () {
            var pieList = hyjk_brand_table_data;
            let key = $('#yx_search_hyjk_brand').val()
            let filter = pieList.filter((v) => {
                let brand_name = v.brand_name
                let trade_price = v.trade_price.toString()
                let cate_rank_id = v.cate_rank_id.toString()
    
                return brand_name.includes(key) || trade_price.includes(key) || cate_rank_id.includes(key)
            })

            hyjk_brand_table_render.reload({
                data: filter
            });
        })
    })


})


$("body").on("click", "#yxclear", function(){
    window.location.reload();
})

$("body").on("click", ".yx-cover-btn2,#yx-userInfo", function(){

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
                                            <img src="https://www.yingxiaods.com/xh/assets/images/gd.png" style="width:20px;height:20px"/>
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





$.getUrlParamVal = function(name, url){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = url.split('?')[1].match(reg);
    if (r!=null) return unescape(r[2]); return null;
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

function getStore() {
    let json = {}
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i); //获取本地存储的Key
        json[key] = localStorage.getItem(key)
    }
    return json
}