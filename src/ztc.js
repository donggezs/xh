let $ = window.$;
let echarts = window.echarts
let layui = window.layui
let tbToken = null // 淘宝token
let is_use = 0 // 是否有权限用

let isLogin = false // 是否登录了小黄账号
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
                check_plugin: 1
            },
            success : function(res) {
                if(res.code == 0){
                    isLogin = true
                    clearInterval(timer)
                    sessionStorage.setItem('yxToken', res.data.token)

                    let is_manage = res.data.is_manage
                    if(is_manage == 1){ // 万能
                        is_use = 1
                    }else{
                        is_use = res.data.plugin[2].is_use
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
                check_plugin: 1
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
                        is_use = res.data.plugin[2].is_use
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

    $("body").on("click", '.yx_logout_label', function(){
        layui.use('layer', function () {
            var layer = layui.layer;
            
            layer.close(layer.index)
            layer.msg("已注销登录")
        })
        isLogin = false
        is_use = 0
        localStorage.removeItem('yxTelPhone')
        localStorage.removeItem('yxPassword')
        sessionStorage.removeItem('yxToken')

    })
})





$(function () {
    $.ajax({
        type: "POST",
        url: "https://subway.simba.taobao.com/bpenv/getLoginUserInfo.htm",
        success: function (res) {
            tbToken = res.result.token
        }
    })
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

$("body").append("<link rel='stylesheet' href='https://www.zhaidh.cn/xh/assets/css/common.css'>");
$("body").append("<link rel='stylesheet' href='https://www.zhaidh.cn/xh/assets/layer/theme/default/layer.css?v=3.1.1'>");
$("body").append("<link rel='stylesheet' href='https://www.zhaidh.cn/xh/assets/layui/css/layui.css'>");
$("body").append("<div id='yx-loading'><img src='https://www.zhaidh.cn/xh/assets/images/loading.png' class='loading-img' /></div>")


let plugin_name = ""
// 前台分类弹出
$.ajax({
    type : "POST",
    url : window.baseUrl + "/plugin/setting",
    success : function(res) {
        plugin_name = res.data.plugin_name
        window.yxInfo = res.data
        let yingxiao = `<div id='yx-yy'>
        <div id='yx'>
        <img src='https://www.zhaidh.cn/xh/assets/images/reduce.png' alt='' class='yx-off'>
        <img src='${ res.data.logo }' alt='' class='yx-logo'>
        <p class='yx-name'>${ res.data.plugin_name }</p>
        <div class='yx-category'>
            <div class='yx-item' id='sycm'>生意参谋</div>
            <div class='yx-item' id='toTaobao'>前台</div>
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
                            <img id="yx-pass-type" src="data:image/png;base64,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">
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
                                        clearInterval(timer)
                                        sessionStorage.setItem('yxToken', res.data.token)

                                        if(is_manage == 1){ // 万能
                                            is_use = 1
                                        }else{
                                            is_use = res.data.plugin[2].is_use
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


$("body").on("click", '#version', function(){
    window.open(`https://www.zhaidh.cn/#/user/version`, "_blank")
})

$("body").on("click", '#share', function(){
    window.open(`https://www.zhaidh.cn/user/share`, "_blank")
})

$("body").on("click", '#yx-help', function(){
    window.open(`https://www.zhaidh.cn/help/0 `, "_blank")
})

$("body").on("click", '#toTaobao', function(){
    window.open("https://www.taobao.com", "_blank")
})

$("body").on("click", '#sycm', function(){
    window.location.href = "https://sycm.taobao.com/mc/mq/market_monitor"
})


$("body").on("click", '.yx-caiji-content', function(){
    window.open(`https://www.zhaidh.cn/`, "_blank")
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

$("body").on("click", ".yx-cover-btn2,#yx-userInfo", function(){

    if(!isLogin){
        login()
        return
    }

    let user = window.yxUser

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

$("body").on('mouseenter', '.yx-gd', function(){
    $(".yx-shop-list").fadeIn()
})
$("body").on('mouseleave', '.yx-gd', function(){
    $(".yx-shop-list").fadeOut()
})



const script1 = document.createElement("script");
script1.charset = "UTF-8";
script1.src = "https://www.zhaidh.cn/xh/assets/china.js";
document.documentElement.appendChild(script1);


let ddd = setInterval(() => {
    if (window.location.href.includes("subway.simba.taobao.com/#!/manage/adgroup/detail") && $("#adgroup-conver").length == 0) {
        $("article").eq(2).append(`<div class="seeAdgroup" id="adgroup-conver">查看推广数据</div>`)
    }
}, 100)

// 监控看板
let cardTimer = setInterval(() => {
    if ($("#J_bidwords_rank #J_SwDataType").length > 0 && $("#market_cover").length == 0) {
        $("#J_bidwords_rank #J_SwDataType").next().after(`<div class="yx-conversion" style="margin-right:10px">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='market_cover'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
    }
}, 100)

// 推广词下载
let relatedTimer = setInterval(() => {
    if ($(".recommend-bidwords  .mb5").length > 0 && $("#related_cover").length == 0) {
        $(".recommend-bidwords #selectDate1").after(`<div class="yx-conversion" style="margin-right:10px">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='related_cover'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        $(".table-expand").css({"marginTop": "10px"})
        $(".recommend-bidwords #selectDate1").css({"float": "right"})
    }
}, 100)

// 相关类目热门词
let bidwordListTimer = setInterval(() => {
    if ($(".recommend-bidwords  .mb5").length > 0 && $("#bidword_cover").length == 0) {
        $(".recommend-bidwords #selectDate2").after(`<div class="yx-conversion" style="margin-right:10px">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='bidword_cover'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
        $(".table-expand").css({"marginTop": "10px"})
        $(".recommend-bidwords #selectDate2").css({"float": "right"})
    }
}, 100)

let relatedWordsTimer = setInterval(() => {
    if ($("h2").length > 1 && $("h2").eq(1).text().includes("相关词推荐") && $("#relatedWords_cover").length == 0) {
        $("h2").eq(1).append(`<div class="yx-conversion" style="margin-right:10px">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='relatedWords_cover'>缓存数据</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
    }
}, 100)

let keywordsTimer = setInterval(() => {
    if ($(".J-scroll-operation").length > 0 && window.location.href.includes("https://subway.simba.taobao.com/#!/manage/adgroup/detail") && $("#keywords_cover").length == 0) {
        $(".J-scroll-operation").prepend(`<div class="yx-conversion" style="margin-top: 20px;margin-left: 20px;margin-right:10px">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='keywords_cover'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
    }
}, 100)


let trendTimer = setInterval(() => {
    if ($("h2").length > 0 && $("h2").eq(0).text().includes("市场趋势") && $("#trend_cover").length == 0) {
        $("h2").eq(0).append(`<div class="yx-conversion">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='trend_cover'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
    }
}, 100)


// 地域透视
let areaTimer = setInterval(() => {
    if ($(".mb5 .fb").text().includes("地域透视") && $("#area_cover").length == 0) {
        $(".mb5 .fb").each((i,v)=>{
            if($(v).text() == '地域透视'){
                $(v).parent().append(`<div class="yx-conversion" style="margin-right:10px">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='area_cover'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
            }
        })
    }
}, 100)

// 小黄洞察
let dc = setInterval(() => {
    let has = false
    $(".header-menu li").each((i,v)=>{
        if($(v).text().includes('小黄洞察')){
            has = true
        }
    })
    if (!has) {
        $(".header-menu").append(`<li>
            <a class="" href="https://subway.simba.taobao.com/#!/insight/entry/index">小黄洞察</a>
        </li>`)
    }
}, 100)

// 竞争透视
let perTimer = setInterval(() => {
    if ($(".mb5 .fb").text().includes("竞争透视") && $("#perspective_cover").length == 0) {
        $(".mb5 .fb").each((i,v)=>{
            if($(v).text() == '竞争透视'){
                $(v).parent().append(`<div class="yx-conversion" style="margin-right:10px">${ plugin_name }:<div class="yx-cover-btn"><span class="yx-cover-btn1" id='perspective_cover'>一键转化</span><span class="yx-cover-btn2">用户信息</span></div></div>`)
            }
        })
    }
}, 100)


function isUse(){
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.confirm(`您的${plugin_name}插件使用权已到期，请前往官网续费`,{
            title: "温馨提示",
            btn: ['确定','取消'] //按钮
        }, function(){
            window.open("https://www.zhaidh.cn/user/version", '_blank')
            layer.close(layer.index)
        }, function(){
            layer.close(layer.index)
        });
    })
}

$.getUrlParamVal = function(name, url){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = url.split('?')[1].match(reg);
    if (r!=null) return unescape(r[2]); return null;
}

let adgroup_table_render = null
let adgroup_table_data = []

let keywords_table_render = null
let keywords_table_data = []



$("body").on("click", "#trend_cover", function () {
    layui.use('layer', function () {
        var layer = layui.layer;
        layer.confirm(`请使用老版本的流量解析！`,{
            title: "温馨提示",
            btn: ['确定','取消'] //按钮
        }, function(){
            window.open("https://subway.simba.taobao.com/#!/tools/insight/index", '_blank')
            layer.close(layer.index)
        }, function(){
            layer.close(layer.index)
        });
    })
})

$("body").on("click", "#keywords_cover", function () { 
    let data = []
    let keyArr = []
    $("#J_subway_manage_keyword_detail_table_table .freeze-td .bp-table tr").each(function (i) { 
        if (i != 0) { 
            let keyword = $(this).find("td").eq(3).find(".keyword-text").attr("title")
            keyArr.push(keyword)
        }
    })

    $("#J_subway_manage_keyword_detail_table_table .table-content table>tbody>tr").each(function (i) { 
        if (i != 0) { 
            let uv_index = $(this).find("td").eq(6).find("span").eq(0).text()
            let click_hits = $(this).find("td").eq(7).find("span").eq(0).text()
            let click_rate = $(this).find("td").eq(8).find("span").eq(0).text()
            let spend_price = $(this).find("td").eq(9).find("span").eq(0).text()
            let avg_price = $(this).find("td").eq(10).find("span").eq(0).text()
            let click_rate_index = $(this).find("td").eq(12).find("span").eq(0).text()

            data.push({
                uv_index,
                click_hits,
                click_rate,
                spend_price,
                avg_price,
                click_rate_index
            })
        }
    })

    keyArr.map((v,i) => { 
        data[i].keyword = v
    })

    let ad_group_id = $.getUrlParamVal("adGroupId", window.location.href)
    $.ajax({
        type: "POST",
        url: window.baseUrl + "/plugin/through_train/category/keyword/lists",
        data: {
            data,
            ad_group_id
        },
        success: function (res) {
            keywords_table_data = res.data
            
        
            layui.use('layer', function(){
                var layer = layui.layer;
            
                layer.open({
                    type: 1,
                    maxmin: true,
                    move: false,
                    title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>关键词转化<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                    area: ['80%', '80%'],
                    content: `<div class='yx-jkkb'>
                                <div class='yx-operation'>
                                    <div class='yx-btns'>
                                        <span class='yx-b1 keywords_down'>下载数据</span>
                                        <span class='yx-b2 keywords_copy'>复制数据</span>
                                    </div>

                                    <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_keywords_rank'></div>
                                </div>
                                <table id='keywords_table'></table>
                            </div>`
                });

            });


            layui.use('table', function(){
                var table = layui.table;
                
                //第一个实例
                keywords_table_render = table.render({
                    id: "keywords_table",
                    elem: '#keywords_table',
                    title: "关键词转化",
                    page: true, //开启分页
                    limit: 10,
                    limits: [5, 10, 20, 50, 100],
                    data: res.data,
                    cols: [[
                    {field: 'type', title: '类型',minWidth: "120", sort: true, unresize: true,templet: function(d){
                        if(d.type == '本店'){
                            return `<div><span style="background: #3164dd;color:#fff">本店</span></div>`
                        }else{
                            return `<div><span style="background: #eecf4f;color:#fff">行业</span></div>`
                        }
                    }},
                    {field: 'keyword', title: '关键词',minWidth: "120", sort: true, unresize: true},
                    {field: 'uv_index', title: '展现量',minWidth: "120", sort: true, unresize: true},
                    {field: 'click_hits', title: '点击量',minWidth: "120", sort: true, unresize: true},
                    {field: 'click_rate', title: '点击率',minWidth: "120", sort: true, unresize: true},
                    {field: 'spend_price', title: '花费',minWidth: "120", sort: true, unresize: true},
                    {field: 'avg_price', title: '平均花费',minWidth: "120", sort: true, unresize: true},
                        { field: 'click_rate_index', title: '点击转化率', minWidth: "120", sort: true, unresize: true }
                    ]]
                });
            });
        }
    })
    
})

// 顾客流失 复制数据 下载数据 搜索数据
$("body").on("click", ".keywords_down", function () {
    layui.use('table', function () {
        var table = layui.table;
        table.exportFile(keywords_table_render.config.id, keywords_table_data); //导出数据
    })
})
$("body").on("click", ".keywords_copy", function () {
    let str = ''

    layui.use('table', function () {
        var table = layui.table.cache.keywords_table;
        let str = ''
    
        str += plugin_name+"\n"
        str += '\n'
        str += '类型      关键词      展现量      点击量      点击率      花费      平均花费      点击转化率\n'
        table.map((v) => {
            str += `\n${v.type}      ${v.keyword}      ${v.uv_index}      ${v.click_hits}      ${v.click_rate}      ${v.spend_price}      ${v.avg_price}      ${v.click_rate_index}`
        })

        window.GM_setClipboard(str)
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.msg('复制成功');
        });
    })
})
$("body").on("input propertychange", "#yx_adgroup_rank", function () { 
    layui.use('table', function () {
        var pieList = adgroup_table_data;
        let key = $('#yx_adgroup_rank').val()
        let filter = pieList.filter((v) => {
            
            let keyword = v.keyword.toString()
            let type = v.type.toString()
            let uv_index = v.uv_index.toString()
            let click_hits = v.click_hits.toString()
            let spend_price = v.spend_price.toString()
           

            return keyword.includes(key) || type.includes(key) || uv_index.includes(key) || click_hits.includes(key) || spend_price.includes(key)
        })

        keywords_table_render.reload({
            data: filter
        });
    })
})










$("body").on("click", "#relatedWords_cover", function () {
    let data = []
    $("table").eq(0).find("tbody>tr").each(function () { 
        let keyword = $(this).find("td").eq(1).text()
        let uv_index = $(this).find("td").eq(4).text()
        let click_hits = $(this).find("td").eq(5).text()
        let click_rate = $(this).find("td").eq(6).text()
        let click_rate_index = $(this).find("td").eq(7).text()
        let compete = $(this).find("td").eq(8).text()
        let avg_price = $(this).find("td").eq(9).text()

        data.push({
            keyword,
            uv_index,
            click_hits,
            click_rate,
            click_rate_index,
            compete,
            avg_price
        })
    })

    let ad_group_id = $.getUrlParamVal("adgroupId", window.location.href)
    $.ajax({
        type: "POST",
        url: window.baseUrl + "/plugin/through_train/category/keyword/collect",
        data: {
            data,
            ad_group_id
        },
        success: function (res) {
            layui.use('layer', function(){
                var layer = layui.layer;
                layer.msg('缓存相关词推荐数据成功');
            });
        }
    })
})

$("body").on("click", "#adgroup-conver", function () {
    let href = $("article").eq(2).find(".gray-dark").eq(0).attr("href")
    let item_id = $.getUrlParamVal("id", href)

    let start_time = $(".hYME_ldtio").eq(1).text().split(" ")[1]
    let end_time = $(".hYME_ldtio").eq(2).text().split(" ")[1]

    $.ajax({
        type : "POST",
        url : window.baseUrl + "/plugin/through_train/live/keyword/lists",
        data: {
            item_id,
            page: 1,
            pageSize: 9999,
            start_time,
            end_time
        },
        success: function (res) {
          
            adgroup_table_data = res.data.record
            
        
            layui.use('layer', function(){
                var layer = layui.layer;
            
                layer.open({
                    type: 1,
                    maxmin: true,
                    move: false,
                    title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>店铺实时报表<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                    area: ['80%', '80%'],
                    content: `<div class='yx-jkkb'>
                                <div class='yx-operation'>
                                    <div class='yx-btns'>
                                        <span class='yx-b1 adgroup_down'>下载数据</span>
                                        <span class='yx-b2 adgroup_copy'>复制数据</span>
                                    </div>

                                    <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_adgroup_rank'></div>
                                </div>
                                <table id='adgroup_table'></table>
                            </div>`
                });

            });


            layui.use('table', function(){
                var table = layui.table;
                
                //第一个实例
                adgroup_table_render = table.render({
                    id: "adgroup_table",
                    elem: '#adgroup_table',
                    title: "店铺实时报表",
                    page: true, //开启分页
                    limit: 10,
                    limits: [5, 10, 20, 50, 100],
                    data: res.data.record,
                    cols: [[{field: 'device_type', title: '访问设备来源',minWidth: "120", sort: true, unresize: true, templet: function(d){
                        if(d.device_type == 1){
                            return '<span>无线</span>'
                        }else{
                            return '<span>PC</span>'
                        }
                    }},
                    {field: 'keyword', title: '访问关键词',minWidth: "120", sort: true, unresize: true},
                    {field: 'time', title: '访问时间',minWidth: "120", sort: true, unresize: true},
                    {field: 'location', title: '访客位置',minWidth: "120", sort: true, unresize: true},
                    {field: 'number', title: '访客编号',minWidth: "120", sort: true, unresize: true},]]
                });
            });
        }
    })
})

// 顾客流失 复制数据 下载数据 搜索数据
$("body").on("click", ".adgroup_down", function () {
    layui.use('table', function () {
        var table = layui.table;
        table.exportFile(adgroup_table_render.config.id, adgroup_table_data); //导出数据
    })
})
$("body").on("click", ".adgroup_copy", function () {
    let str = ''

    layui.use('table', function () {
        var table = layui.table.cache.adgroup_table;
        let str = ''
    
        str += plugin_name+"\n"
        str += '\n'
        str += '访问设备来源      访问关键词      访问时间      访客位置      访客编号\n'
        table.map((v) => {
            str += `\n${v.device_type == 1 ? '无线' : 'PC'}      ${v.keyword}      ${v.time}      ${v.location}      ${v.number}`
        })

        window.GM_setClipboard(str)
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.msg('复制成功');
        });
    })
})
$("body").on("input propertychange", "#yx_adgroup_rank", function () { 
    layui.use('table', function () {
        var pieList = adgroup_table_data;
        let key = $('#yx_adgroup_rank').val()
        let filter = pieList.filter((v) => {
            
            let keyword = v.keyword.toString()
            let device_type = v.device_type.toString()
            let time = v.time.toString()
            let number = v.number.toString()
            let location = v.location.toString()
            let device_type_name = key == '无线' ? 1 : 2

            return keyword.includes(key) || time.includes(key) || location.includes(key) || number.includes(key) || device_type.includes(device_type_name)
        })

        adgroup_table_render.reload({
            data: filter
        });
    })
})


let perspective_table_data = []
let perspective_table_render = null
// 顾客流失 复制数据 下载数据 搜索数据
$("body").on("click", ".perspective_down", function () {
    layui.use('table', function () {
        var table = layui.table;
        table.exportFile(perspective_table_render.config.id, perspective_table_data); //导出数据
    })
})
$("body").on("click", ".perspective_copy", function () {
    let str = ''

    layui.use('table', function () {
        var table = layui.table.cache.perspective_table;
        let str = ''
    
        str += plugin_name+"\n"
        str += '\n'
        str += '关键词      平均展现量      宝贝数量\n'
        table.map((v) => {
            str += `\n${v.word}      ${v.avgImpression}      ${v.competition}`
        })

        window.GM_setClipboard(str)
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.msg('复制成功');
        });
    })
})
$("body").on("input propertychange", "#yx_perspective_rank", function () { 
    layui.use('table', function () {
        var pieList = perspective_table_data;
        let key = $('#yx_perspective_rank').val()
        let filter = pieList.filter((v) => {
            
            let word = v.word.toString()
            let avgImpression = v.avgImpression.toString()
            let competition = v.competition.toString()

            return avgImpression.includes(key) || word.includes(key) || competition.includes(key)
        })

        perspective_table_render.reload({
            data: filter
        });
    })
})
$("body").on("click", "#perspective_cover", function () {
    if(!isLogin){
        login()
        return
    }

    if(is_use == 0){
        isUse()
        return
    }

    let day = $("#selectDate").val()
    let startDate = null
    let endDate = null
    let bidwordstr = $("#J_SelectKW .current").text()

    if (day == '-1') {
        day = 1
    } else if (day == '-2') { 
        day = 2
    } else if (day == '-7') { 
        day = 7
    }

    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * day);
    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
    
    startDate = $.formatDateTime(start, 1)
    endDate = $.formatDateTime(end, 1)

    $.ajax({
        type: "POST",
        url: `https://subway.simba.taobao.com/report/getCompetitionPerspective.htm?startDate=${startDate}&endDate=${endDate}&bidwordstr=${encodeURIComponent(bidwordstr)}`,
        data: {
            sla: 'json',
            isAjaxRequest: true,
            token: tbToken
        },
        success: function (res) {

            $.ajax({
                type: "POST",
                url : window.baseUrl + "/plugin/through_train/data/competition/perspective/keyword/collect",
                data: {
                    data: res.result,
                    shop_name: $(".header-nickname-out .header-nickname-inside").eq(0).text()
                }
            })
            
            let arr = []
            res.result.map(v=>{
                arr.push({
                    hpPrice: v.hpPrice,
                    word: v.inRecordBaseDTO.bidwordstr,
                    priceDistribution: (v.inRecordBaseDTO.priceDistribution / 100) + '~' + ((v.inRecordBaseDTO.priceDistribution * 1 + 4 * 1) / 100).toFixed(2),
                    competition: v.inRecordBaseDTO.competition,
                    avgImpression: v.inRecordBaseDTO.avgImpression,
                    total:  v.inRecordBaseDTO.avgImpression * v.inRecordBaseDTO.competition,
                    price: v.hpPrice / 100
                })
            })

            perspective_table_data = arr
                    
                
            layui.use('layer', function(){
                var layer = layui.layer;
            
                layer.open({
                    type: 1,
                    maxmin: true,
                    move: false,
                    title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>数据透视-竞争透视<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                    area: ['80%', '80%'],
                    content: `<div class='yx-jkkb'>
                                <div id="main23"></div>
                                <div class='yx-operation'>
                                    <div class='yx-btns'>
                                        <span class='yx-b1 perspective_down'>下载数据</span>
                                        <span class='yx-b2 perspective_copy'>复制数据</span>
                                    </div>

                                    <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_perspective_rank'></div>
                                </div>
                                <table id='perspective_table'></table>
                            </div>`
                });

            });

            let xData = []
            let ser1 = []
            let ser2 = []
            arr.map(v=>{
                xData.push(v.price)
                ser1.push(v.competition)
                ser2.push(v.avgImpression)
            })


            var myChart = echarts.init(document.getElementById('main23'));
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'   
                    }
                },
                legend: {
                    data: ['宝贝数量', '平均展现量']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: xData,
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                    },
                    {
                        type: 'value',
                    }
                ],
                series: [
                    {
                        name: '宝贝数量',
                        type: 'bar',
                        barWidth: '40%',
                        itemStyle: {
                            normal: {
                                color: '#4169E1' //柱子的颜色
                            }
                        },

                        yAxisIndex: 0,
                        data: ser1
                    },
                    {
                        name: '平均展现量',
                        type: 'line',

                        yAxisIndex: 1,
                        lineStyle: {
                            normal: {
                                color: '#D2691E'  //折线颜色
                            }
                        },
                        data: ser2
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);




            layui.use('table', function(){
                var table = layui.table;
                
                //第一个实例
                perspective_table_render = table.render({
                    id: "perspective_table",
                    elem: '#perspective_table',
                    title: "数据透视-竞争透视",
                    page: true, //开启分页
                    limit: 10,
                    limits: [5, 10, 20, 50, 100],
                    data: arr,
                    cols: [[ //表头
                        {field: 'word', title: '关键词', sort: true, unresize: true},
                        {field: 'total', title: '总展现量', sort: true, unresize: true},
                        {field: 'avgImpression', title: '平均展现量', sort: true, unresize: true},
                        {field: 'competition', title: '宝贝数量', sort: true, unresize: true},
                        {field: 'priceDistribution', title: '价格', sort: true, unresize: true},
                    ]]
                });
            });

        }
    })
})



let area_table_data = []
let area_table_render = null
// 顾客流失 复制数据 下载数据 搜索数据
$("body").on("click", ".area_down", function () {
    layui.use('table', function () {
        var table = layui.table;
        table.exportFile(area_table_render.config.id, area_table_data); //导出数据
    })
})
$("body").on("click", ".area_copy", function () {
    let str = ''

    layui.use('table', function () {
        var table = layui.table.cache.area_table;
        let str = ''
    
        str += plugin_name+"\n"
        str += '\n'
        str += '地区名称      点击数      点击率      点击转化率      市场均价      消费总金额      展现量      竞争度      成交笔数\n'
        table.map((v) => {
            str += `\n${v.word}      ${v.click}      ${v.ctr}      ${v.cvr}      ${v.avgPrice}      ${v.price}      ${v.impression}      ${v.avgPrice}      ${v.price}      ${v.competition}      ${v.pay_hits}`
        })

        window.GM_setClipboard(str)
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.msg('复制成功');
        });
    })
})
$("body").on("input propertychange", "#yx_area_rank", function () { 
    layui.use('table', function () {
        var pieList = area_table_data;
        let key = $('#yx_area_rank').val()
        let filter = pieList.filter((v) => {
            
            let word = v.word.toString()
            let click = v.click.toString()
            let ctr = v.ctr.toString()
            let cvr = v.cvr.toString()
            let avgPrice = v.avgPrice.toString()
            let impression = v.impression.toString()
            let price = v.price.toString()
            let competition = v.competition.toString()

            return word.includes(key) || impression.includes(key) || click.includes(key) || ctr.includes(key) || cvr.includes(key) || avgPrice.includes(key) || price.includes(key) || competition.includes(key)
        })

        area_table_render.reload({
            data: filter
        });
    })
})


$("body").on("click", "#area_cover", function () {
    if(!isLogin){
        login()
        return
    }

    if(is_use == 0){
        isUse()
        return
    }
    let day = $("#selectDate").val()
    let startDate = null
    let endDate = null
    let bidwordstr = $("#J_SelectKW .current").text()

    if (day == '-1') {
        day = 1
    } else if (day == '-2') { 
        day = 2
    } else if (day == '-7') { 
        day = 7
    }

    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * day);
    end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
    
    startDate = $.formatDateTime(start, 1)
    endDate = $.formatDateTime(end, 1)

    $.ajax({
        type: "POST",
        url: `https://subway.simba.taobao.com/report/getAreaPerspective.htm?startDate=${startDate}&endDate=${endDate}&bidwordstr=${encodeURIComponent(bidwordstr)}`,
        data: {
            sla: 'json',
            isAjaxRequest: true,
            token: tbToken
        },
        success: function (res) {
            $.ajax({
                type : "POST",
                url : window.baseUrl + "/plugin/through_train/area/data/perspective",
                data: {
                    data: res.result,
                    word: bidwordstr,
                    start_time: startDate,
                    end_time: endDate,
                },
                success: function (res2) {
                    area_table_data = res2.data
                    
                
                    layui.use('layer', function(){
                        var layer = layui.layer;
                    
                        layer.open({
                            type: 1,
                            maxmin: true,
                            move: false,
                            title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>数据透视-地域透视<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                            area: ['80%', '80%'],
                            content: `<div class='yx-jkkb'>
                                        <div id='areaMap'></div>
                                        <div class='yx-operation'>
                                            <div class='yx-btns'>
                                                <span class='yx-b1 area_down'>下载数据</span>
                                                <span class='yx-b2 area_copy'>复制数据</span>
                                            </div>
    
                                            <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_area_rank'></div>
                                        </div>
                                        <table id='area_table'></table>
                                    </div>`
                        });
    
                    });

                    let mydata = [{
                        name: '台湾',
                        value: '0'
                    },{
                        name: '南海诸岛',
                        value: '0'
                    },]

                    res2.data.map(v=>{
                        if(v.word == '内蒙'){
                            mydata.push({
                                name: '内蒙古',
                                value: v.impression
                            })
                        }else{
                            mydata.push({
                                name: v.word,
                                value: v.impression
                            })
                        }
                    })
                    

                    let option = {
                        tooltip: {
                            formatter: function (params, ticket, callback) {
                                return params.seriesName + '<br />' + params.name + '：' + params.value
                            }
                        },
                        visualMap: {
                            min: 0,
                            max: 1500,
                            left: 'left',
                            top: 'bottom',
                            text: ['高', '低'],
                            inRange: {
                                color: ['#e0ffff', '#006edd']
                            },
                            show: true
                        },
                        geo: {
                            map: 'china',
                            roam: false,
                            zoom: 1.23,
                            label: {
                                normal: {
                                    show: true,
                                    fontSize: '10',
                                    color: 'rgba(0,0,0,0.7)'
                                }
                            },
                            itemStyle: {
                                normal: {
                                    borderColor: 'rgba(0, 0, 0, 0.2)'
                                },
                                emphasis: {
                                    areaColor: '#F3B329',
                                    shadowOffsetX: 0,
                                    shadowOffsetY: 0,
                                    shadowBlur: 20,
                                    borderWidth: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        },
                        series: [
                            {
                                name: '展现量',
                                type: 'map',
                                geoIndex: 0,
                                data: mydata
                            }
                        ]
                    };
                    //初始化echarts实例
                    var myChart = echarts.init(document.getElementById('areaMap'));
        
                    //使用制定的配置项和数据显示图表
                    myChart.setOption(option);

    
                    layui.use('table', function(){
                        var table = layui.table;
                        
                        //第一个实例
                        area_table_render = table.render({
                            id: "area_table",
                            elem: '#area_table',
                            title: "数据透视-地域透视",
                            page: true, //开启分页
                            limit: 10,
                            limits: [5, 10, 20, 50, 100],
                            data: res2.data,
                            cols: [[ //表头
                                {field: 'word', title: '地区名称', sort: true, unresize: true},
                                {field: 'click', title: '点击数', sort: true, unresize: true},
                                {field: 'ctr', title: '点击率(%)', sort: true, unresize: true},
                                {field: 'cvr', title: '点击转化率(%)', sort: true, unresize: true},
                                {field: 'avgPrice', title: '市场均价', sort: true, unresize: true},
                                {field: 'price', title: '消费总金额', sort: true, unresize: true},
                                {field: 'impression', title: '展现量', sort: true, unresize: true},
                                {field: 'competition', title: '竞争度', sort: true, unresize: true},
                                {field: 'pay_hits', title: '成交笔数', sort: true, unresize: true},
                            ]]
                        });
                    });
                }
            })
        }
    })
})





let bidword_table_data = []
let bidword_table_render = null
// 顾客流失 复制数据 下载数据 搜索数据
$("body").on("click", ".bidword_down", function () {
    layui.use('table', function () {
        var table = layui.table;
        table.exportFile(bidword_table_render.config.id, bidword_table_data); //导出数据
    })
})
$("body").on("click", ".bidword_copy", function () {
    let str = ''

    layui.use('table', function () {
        var table = layui.table.cache.bidword_table;
        let str = ''
    
        str += plugin_name+"\n"
        str += '\n'
        str += '日期      关键词      点击数      点击率      点击转化率      市场均价      消费总金额      展现量      竞争度      成交笔数\n'
        table.map((v) => {
            str += `\n${v.date}      ${v.word}      ${v.click}      ${v.ctr}      ${v.cvr}      ${v.avgPrice}      ${v.price}      ${v.impression}      ${v.avgPrice}      ${v.price}      ${v.competition}      ${v.pay_hits}`
        })

        window.GM_setClipboard(str)
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.msg('复制成功');
        });
    })
})
$("body").on("input propertychange", "#yx_bidword_rank", function () { 
    layui.use('table', function () {
        var pieList = bidword_table_data;
        let key = $('#yx_bidword_rank').val()
        let filter = pieList.filter((v) => {
            
            let date = v.date.toString()
            let word = v.word.toString()
            let click = v.click.toString()
            let ctr = v.ctr.toString()
            let cvr = v.cvr.toString()
            let avgPrice = v.avgPrice.toString()
            let impression = v.impression.toString()
            let price = v.price.toString()
            let competition = v.competition.toString()

            return date.includes(key) || word.includes(key) || impression.includes(key) || click.includes(key) || ctr.includes(key) || cvr.includes(key) || avgPrice.includes(key) || price.includes(key) || competition.includes(key)
        })

        bidword_table_render.reload({
            data: filter
        });
    })
})

$("body").on("click", "#bidword_cover", function () {
    if(!isLogin){
        login()
        return
    }

    if(is_use == 0){
        isUse()
        return
    }

    let idx = $("#J_catlistall .subTree:visible").index()
    if(idx == -1){
        layui.use('layer', function () {
            var layer = layui.layer;
            layer.msg('请先展开一个分类');
        })

        return
    }

    let ol = 0
    if(idx % 2 == 1){
        ol = Math.floor(idx/2)
    }else{
        ol = idx / 2
    }

    let day = $("#selectDate2").val()
    let endDate = ''
    let bidwordstr = $(".chart-top-panel .current").text()

    
    if (day == '-1') {
        day = 1
    } else if (day == '-2') { 
        day = 2
    } else if (day == '-7') { 
        day = 7
    }
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * day);
    
    endDate = $.formatDateTime(start, 1)
    

    $.ajax({
        type: "POST",
        url: `https://subway.simba.taobao.com/report/getRelativeCat.htm?theDate=${endDate}&bidwordstr=${encodeURIComponent(bidwordstr)}`,
        data: {
            sla: 'json',
            isAjaxRequest: true,
            token: tbToken
        },
        success: function (res) {
            let id = res.result[ol].id

            $.ajax({
                type: "POST",
                url: `https://subway.simba.taobao.com/report/getBidwordListByCatId.htm?theDate=${endDate}&catId=${id}&bidwordType=1&orderBy=&order=desc`,
                data: {
                    sla: 'json',
                    isAjaxRequest: true,
                    token: tbToken
                },
                success: function (res1) {
                    $.ajax({
                        type : "POST",
                        url : window.baseUrl + "/plugin/through_train/share/category/word/analysis",
                        data: {
                            category: res.result,
                            data: res1.result,
                            word: bidwordstr,
                            end_time: endDate,
                        },
                        success: function (res2) {
                            bidword_table_data = res2.data
                            
                        
                            layui.use('layer', function(){
                                var layer = layui.layer;
                            
                                layer.open({
                                    type: 1,
                                    maxmin: true,
                                    move: false,
                                    title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>推广词表下载-相关类目热门词<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                                    area: ['80%', '80%'],
                                    content: `<div class='yx-jkkb'>
                                                <div class='yx-operation'>
                                                    <div class='yx-btns'>
                                                        <span class='yx-b1 bidword_down'>下载数据</span>
                                                        <span class='yx-b2 bidword_copy'>复制数据</span>
                                                    </div>
            
                                                    <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_bidword_rank'></div>
                                                </div>
                                                <table id='bidword_table'></table>
                                            </div>`
                                });
            
                            });
        
            
                            layui.use('table', function(){
                                var table = layui.table;
                                
                                //第一个实例
                                bidword_table_render = table.render({
                                    id: "bidword_table",
                                    elem: '#bidword_table',
                                    title: "推广词表下载-相关类目热门词",
                                    page: true, //开启分页
                                    limit: 10,
                                    limits: [5, 10, 20, 50, 100],
                                    data: res2.data,
                                    cols: [[ //表头
                                        {field: 'date', title: '日期', sort: true, unresize: true},
                                        {field: 'word', title: '关键词', sort: true, unresize: true},
                                        {field: 'click', title: '点击数', sort: true, unresize: true},
                                        {field: 'ctr', title: '点击率(%)', sort: true, unresize: true},
                                        {field: 'cvr', title: '点击转化率(%)', sort: true, unresize: true},
                                        {field: 'avgPrice', title: '市场均价', sort: true, unresize: true},
                                        {field: 'price', title: '消费总金额', sort: true, unresize: true},
                                        {field: 'impression', title: '展现量', sort: true, unresize: true},
                                        {field: 'competition', title: '竞争度', sort: true, unresize: true},
                                        {field: 'pay_hits', title: '成交笔数', sort: true, unresize: true},
                                    ]]
                                });
                            });
                        }
                    })
                }
            })
        }
    })
})

let related_table_data = []
let related_table_render = null


// 顾客流失 复制数据 下载数据 搜索数据
$("body").on("click", ".related_down", function () {
    layui.use('table', function () {
        var table = layui.table;
        table.exportFile(related_table_render.config.id, related_table_data); //导出数据
    })
})
$("body").on("click", ".related_copy", function () {
    let str = ''

    layui.use('table', function () {
        var table = layui.table.cache.related_table;
        let str = ''
    
        str += plugin_name+"\n"
        str += '\n'
        str += '日期      关键词      点击数      点击率      点击转化率      市场均价      消费总金额      展现量      竞争度      成交笔数\n'
        table.map((v) => {
            str += `\n${v.date}      ${v.word}      ${v.click}      ${v.ctr}      ${v.cvr}      ${v.avgPrice}      ${v.price}      ${v.impression}      ${v.avgPrice}      ${v.price}      ${v.competition}      ${v.pay_hits}`
        })

        window.GM_setClipboard(str)
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.msg('复制成功');
        });
    })
})
$("body").on("input propertychange", "#yx_related_rank", function () { 
    layui.use('table', function () {
        var pieList = related_table_data;
        let key = $('#yx_related_rank').val()
        let filter = pieList.filter((v) => {
            
            let date = v.date.toString()
            let word = v.word.toString()
            let click = v.click.toString()
            let ctr = v.ctr.toString()
            let cvr = v.cvr.toString()
            let avgPrice = v.avgPrice.toString()
            let impression = v.impression.toString()
            let price = v.price.toString()
            let competition = v.competition.toString()

            return date.includes(key) || word.includes(key) || impression.includes(key) || click.includes(key) || ctr.includes(key) || cvr.includes(key) || avgPrice.includes(key) || price.includes(key) || competition.includes(key)
        })

        related_table_render.reload({
            data: filter
        });
    })
})

$("body").on("click", "#related_cover", function () {

    if(!isLogin){
        login()
        return
    }

    if(is_use == 0){
        isUse()
        return
    }

    let day = $("#selectDate1").val()
    let endDate = ''
    let bidwordstr = $(".chart-top-panel .current").text()

    
    if (day == '-1') {
        day = 1
    } else if (day == '-2') { 
        day = 2
    } else if (day == '-7') { 
        day = 7
    }
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * day);
    
    endDate = $.formatDateTime(start, 1)
    

    $.ajax({
        type: "POST",
        url: `https://subway.simba.taobao.com/report/getRelatedBidwordList.htm?theDate=${endDate}&bidwordstr=${encodeURIComponent(bidwordstr)}`,
        data: {
            sla: 'json',
            isAjaxRequest: true,
            token: tbToken
        },
        success: function (res) {

            $.ajax({
                type : "POST",
                url : window.baseUrl + "/plugin/through_train/share/word/analysis",
                data: {
                    data: res.result,
                    word: bidwordstr,
                    end_time: endDate,
                },
                success: function (res) {
                    
                    related_table_data = res.data
                    
                
                    layui.use('layer', function(){
                        var layer = layui.layer;
                    
                        layer.open({
                            type: 1,
                            maxmin: true,
                            move: false,
                            title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>推广词表下载-相关词分析<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                            area: ['80%', '80%'],
                            content: `<div class='yx-jkkb'>
                                        <div class='yx-operation'>
                                            <div class='yx-btns'>
                                                <span class='yx-b1 related_down'>下载数据</span>
                                                <span class='yx-b2 related_copy'>复制数据</span>
                                            </div>
    
                                            <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_related_rank'></div>
                                        </div>
                                        <table id='related_table'></table>
                                    </div>`
                        });
    
                    });

    
                    layui.use('table', function(){
                        var table = layui.table;
                        
                        //第一个实例
                        related_table_render = table.render({
                        id: "related_table",
                        elem: '#related_table',
                        title: "推广词表下载-相关词分析",
                        page: true, //开启分页
                        limit: 10,
                        limits: [5, 10, 20, 50, 100],
                        data: res.data,
                        cols: [[ //表头
                            {field: 'date', title: '日期', sort: true, unresize: true},
                            {field: 'word', title: '关键词', sort: true, unresize: true},
                            {field: 'click', title: '点击数', sort: true, unresize: true},
                            {field: 'ctr', title: '点击率(%)', sort: true, unresize: true},
                            {field: 'cvr', title: '点击转化率(%)', sort: true, unresize: true},
                            {field: 'avgPrice', title: '市场均价', sort: true, unresize: true},
                            {field: 'price', title: '消费总金额', sort: true, unresize: true},
                            {field: 'impression', title: '展现量', sort: true, unresize: true},
                            {field: 'competition', title: '竞争度', sort: true, unresize: true},
                            {field: 'pay_hits', title: '成交笔数', sort: true, unresize: true},
                        ]]
                        });
                    });
                }
            })
        }
    })
})


let market_table_data = []
let market_table_render = null

// 顾客流失 复制数据 下载数据 搜索数据
$("body").on("click", ".market_down", function () {
    layui.use('table', function () {
        var table = layui.table;
        table.exportFile(market_table_render.config.id, market_table_data); //导出数据
    })
})
$("body").on("click", ".market_copy", function () {
    let str = ''

    layui.use('table', function () {
        var table = layui.table.cache.market_table;
        let str = ''
    
        str += plugin_name+"\n"
        str += '\n'
        str += '日期      关键词      展现量      点击数      点击率      点击转化率      市场均价      消费总金额      成交笔数\n'
        table.map((v) => {
            str += `\n${v.date}      ${v.word}      ${v.impression}      ${v.click}      ${v.ctr}      ${v.cvr}      ${v.avgPrice}      ${v.price}      ${v.pay_hits}`
        })

        window.GM_setClipboard(str)
        layui.use('layer', function(){
            var layer = layui.layer;
            layer.msg('复制成功');
        });
    })
})
$("body").on("input propertychange", "#yx_market_rank", function () { 
    layui.use('table', function () {
        var pieList = market_table_data;
        let key = $('#yx_market_rank').val()
        let filter = pieList.filter((v) => {
            
            let date = v.date.toString()
            let word = v.word.toString()
            let impression = v.impression.toString()
            let click = v.click.toString()
            let ctr = v.ctr.toString()
            let cvr = v.cvr.toString()
            let avgPrice = v.avgPrice.toString()
            let price = v.price.toString()

            return date.includes(key) || word.includes(key) || impression.includes(key) || click.includes(key) || ctr.includes(key) || cvr.includes(key) || avgPrice.includes(key) || price.includes(key)
        })

        market_table_render.reload({
            data: filter
        });
    })
})

$("body").on("click", "#market_cover", function () {
    if(!isLogin){
        login()
        return
    }

    if(is_use == 0){
        isUse()
        return
    }

    let dateVal = $("#J_table_time_filter>span").text()
    let startDate = null
    let endDate = null

    let bidwordstr = []

    $(".chart-helper>li:not('.hidden')").each((i ,v) => { 
        bidwordstr.push($(v).find("span").eq(1).text())
    })

    if (dateVal.includes("至")) {
        let dateArr = dateVal.split(" 至 ")
        startDate = dateArr[0]
        endDate = dateArr[1]
    } else { 
        let day = 0
        if (dateVal.includes('7天')) {
            day = 7
        } else if (dateVal.includes('30天')) { 
            day = 30
        } else if (dateVal.includes('90天')) { 
            day = 90
        } else if (dateVal.includes('半年')) { 
            day = 180
        } else if (dateVal.includes('一年')) { 
            day = 365
        }

        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * day);
        end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
        
        startDate = $.formatDateTime(start, 1)
        endDate = $.formatDateTime(end, 1)
    }
    
    $.ajax({
        type: "POST",
        url: `https://subway.simba.taobao.com/report/getMarketAnalysis.htm?startDate=${startDate}&endDate=${endDate}&bidwordstr=${encodeURIComponent(JSON.stringify(bidwordstr))}`,
        data: {
            sla: 'json',
            isAjaxRequest: true,
            token: tbToken
        },
        success: function (res) {

            $.ajax({
                type : "POST",
                url : window.baseUrl + "/plugin/through_train/market/analysis",
                data: {
                    data: res.result,
                    start_time: startDate,
                    end_time: endDate,
                },
                success: function (res) {
                    
                    market_table_data = res.data
                    
                
                    layui.use('layer', function(){
                        var layer = layui.layer;
                    
                        layer.open({
                            type: 1,
                            maxmin: true,
                            move: false,
                            title: `<div class='yx-caiji-content'><img src=${window.yxInfo.logo}><span class='yx-plugin-name'>${window.yxInfo.plugin_name}</span>流量解析-查询结果<span class='yx-time'> - ${window.time}</span><span class='yx-brief_introduction'>[${window.yxInfo.brief_introduction}]</span></div>`,
                            area: ['80%', '80%'],
                            content: `<div class='yx-jkkb'>
                                        <div id="echarts_market"></div>
                                        <div class='yx-operation'>
                                            <div class='yx-btns'>
                                                <span class='yx-b1 market_down'>下载数据</span>
                                                <span class='yx-b2 market_copy'>复制数据</span>
                                            </div>
    
                                            <div class='yx-fr'>搜索<input type='text' class='inp yx-search-inp' id='yx_market_rank'></div>
                                        </div>
                                        <table id='market_table'></table>
                                    </div>`
                        });
    
                    });

                    let xA = []
                    let series = []

                    market_table_data.map(j=>{
                        j.time = new Date(j.date).getTime()
                    })
                    market_table_data = market_table_data.sort(function (a, b){
                        return a - b
                    })


                    let a1 = [],a2 = [],a3 = [],a4 = [],a5 = [],a6 = []
                    market_table_data.map(v=>{
                        xA.push(v.date)

                        a1.push(v.impression)
                        a2.push(v.click)
                        a3.push(v.ctr)
                        a4.push(v.cvr)
                        a5.push(v.avgPrice)
                        a6.push(v.price)
                    })

                    series.push({
                        name: '展现量',
                        type: 'line',
                        data: a1,
                        smooth: true,
                        yAxisIndex: 0,
                        symbol: 'none',
                    })
                    series.push({
                        name: '点击数',
                        type: 'line',
                        data: a2,
                        smooth: true,
                        yAxisIndex: 1,
                        symbol: 'none',
                    })
                    series.push({
                        name: '点击率',
                        type: 'line',
                        data: a3,
                        smooth: true,
                        yAxisIndex: 2,
                        symbol: 'none',
                    })
                    series.push({
                        name: '点击转化率',
                        type: 'line',
                        data: a4,
                        smooth: true,
                        yAxisIndex: 3,
                        symbol: 'none',
                    })
                    series.push({
                        name: '市场均价',
                        type: 'line',
                        data: a5,
                        smooth: true,
                        yAxisIndex: 4,
                        symbol: 'none',
                    })
                    series.push({
                        name: '消费总金额',
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
                            data: ['展现量', '点击数', '点击率', '点击转化率', '市场均价', '消费总金额'],
                            selected: {
                                '点击转化率': false,
                                '市场均价': false,
                                '消费总金额': false
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
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
                                max: 2000000
                            },
                            {
                                type: 'value',
                                show: false,
                                max: 10000
                            },
                            {
                                type: 'value',
                                show: false,
                                max: 10
                            },
                            {
                                type: 'value',
                                show: false,
                                max: 1
                            },
                            {
                                type: 'value',
                                show: false,
                                max: 10
                            },
                            {
                                type: 'value',
                                show: false,
                                max: 10000
                            }
                        ],
                        series
                    };

                    // 使用刚指定的配置项和数据显示图表。
                    myChart.setOption(option);
    
                    
    
                    layui.use('table', function(){
                        var table = layui.table;
                        
                        //第一个实例
                        market_table_render = table.render({
                        id: "market_table",
                        elem: '#market_table',
                        title: "竞品识别-搜索流失竞品推荐",
                        page: true, //开启分页
                        limit: 10,
                        limits: [5, 10, 20, 50, 100],
                        data: res.data,
                        cols: [[ //表头
                            {field: 'date', title: '日期', sort: true, unresize: true},
                            {field: 'word', title: '关键词', sort: true, unresize: true},
                            {field: 'impression', title: '展现量', sort: true, unresize: true},
                            {field: 'click', title: '点击数', sort: true, unresize: true},
                            {field: 'ctr', title: '点击率(%)', sort: true, unresize: true},
                            {field: 'cvr', title: '点击转化率(%)', sort: true, unresize: true},
                            {field: 'avgPrice', title: '市场均价', sort: true, unresize: true},
                            {field: 'price', title: '消费总金额', sort: true, unresize: true},
                            {field: 'pay_hits', title: '成交笔数', sort: true, unresize: true},
                        ]]
                        });
                    });
                }
            })
        }
    })
})























$.getUrlParam = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

$.formatDateTime = function (inputTime, type) {
    var date = new Date(inputTime);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    if (type == 1) {
        return y + '-' + m + '-' + d
    }
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
}