const request = require('request')
const cheerio = require("cheerio")
const nodemailer = require("nodemailer")

let transport = nodemailer.createTransport({
    host : 'smtp.qq.com', //QQ邮箱的 smtp 服务器地址
    secure : true, //使用 SSL 协议
    secureConnection : false, //是否使用对 https 协议的安全连接
    port : 465, //QQ邮件服务所占用的端口
    auth : {
        user : 'xxx@', //开启 smtp 服务的发件人邮箱，用于发送邮件给其他人
        pass : 'pwd' //SMTP 服务授权码
    }
})

let mailOption = {
    from: 'xxx@',
    to: 'xxx@',
    subject: '成绩通知',
    html: '通知已发布'
}


let http = (uri) => {
    return new Promise((resove, reject) => {
        request({
            uri: uri,
            method: 'GET'
        }, (err, res, body) => {
            if (err) {
                console.log(err)
            }
            resove(body)
        })
    })
}
function getScore () {
    let target = "http://www.baomingpingtai.net/Version2/Account/Login.aspx";
    http(target).then(html => {
        const $ = cheerio.load(html);
        let msg = $('td.CommonLink');
        msg.each((index, item) => {
            let content = $(item).text();
            if (content.search("成绩") >= 0) {
                transport.sendMail(mailOption, function (err, res) {
                    if (err) {
                        console.log("mailerr：" + err)
                    } else {
                        console.log("mailRes：" + res)
                    }
                    transport.close();
                })
                
                console.log('find');
            } else {
                console.log('没错，依旧没有发公告');
            }
            
        })
    })   
}
setInterval(getScore, 300000);

