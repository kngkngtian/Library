const express = require('express')
const app = express()
// 跨域
// const cors = require('cors')
// app.use(cors())

var bodyParser = require('body-parser');//用于req.body获取值的
app.use(bodyParser.json());
// 创建 application/x-www-form-urlencoded 编码解析
app.use(bodyParser.urlencoded({extended: false}));
// Cookie
const session = require('express-session')
app.use(session({
    secret: "upcDatabase",
    name: "userInfo",
    saveUninitialized: true,
    resave: true
}))
// 数据库
const db = require('./model.js')

// 主页
app.get('/', async (req, res) => {
    return res.send(1)
})
app.all('*', (req, res, next) => {
    if (!req.get("Origin")) return next();
    // use "*" here to accept any origin
    res.set("Access-Control-Allow-Origin", req.headers.origin);
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    res.header('Access-Control-Allow-Credentials', 'true');
    // res.set('Access-Control-Allow-Max-Age', 3600);
    if ("OPTIONS" === req.method) return res.sendStatus(200);
    next();
})

// 路由导入
const user = require('./routes/user')
const admin = require('./routes/admin')
const book = require('./routes/book')
const borrow = require('./routes/borrow')
const card = require('./routes/card')
const payment = require('./routes/payment')
const path = require("path");

app.use('/api/user', user)
app.use('/api/admin', admin)
app.use('/api/book', book)
app.use('/api/payment', payment)
app.use('/api/borrow', borrow)
app.use('/api/card', card)


// 静态文件
// app.use(express.static('public')
app.use('/public', express.static(path.join(__dirname, 'public')))

app.listen(10086, '0.0.0.0', () => {
    console.log('I\'m on 10086')
})