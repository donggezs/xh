
window.baseUrl = 'https://www.zhaidh.cn//api'
let date = new Date()
let year = date.getFullYear()
let month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0'+(date.getMonth() + 1)
let day = date.getDate() >= 10 ? date.getDate() : '0'+date.getDate()
window.time = year+'-'+month+'-'+day

let href = window.location.href

if (href.includes("detail.tmall.com")) {
    require('./tmall'); // tmall
} else if (href.includes("tmall.hk")) { 
    require('./hk'); // tmall
}else if (href.includes("item.taobao.com")) { 
    require('./taobao'); // 淘宝
}else if (href.includes("sycm.taobao.com")) { 
    require('./sycm'); // 生意参谋
} else if (href.includes("simba.taobao.com")) {
    require('./ztc'); // 生意参谋
}
