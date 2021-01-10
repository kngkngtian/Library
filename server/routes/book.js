const express = require('express')
const router = express.Router()
const db = require('../model')
const {Op} = require("sequelize");


router.get('/', (req, res) => {
    res.send('hello world')
})

router.get('/card/:cardId', async (req, res) => {
    const rr = await db.query(`SELECT
\tborrow.borBook AS id, 
\tborrow.borEnd AS \`end\`, 
\tborrow.borIsReturn, 
\tborrow.borIsBorrowApprove, 
\tborrow.borStart AS \`start\`, 
\tborrow.borEnd AS \`end\`, 
\tborrow.borId, 
\tborrow.borCard, 
\tbook.bookMoney, 
\tbook.bookName AS \`name\`, 
\tbook.bookClass AS class
FROM
\tborrow
\tINNER JOIN
\tbook
\tON 
\t\tborrow.borBook = book.bookId
WHERE
\tborrow.borCard = ${req.params.cardId} AND
\tborrow.borIsReturnApprove = 0 And
\tborrow.borIsBorrowApprove <> 2`)
    if (rr) {
        const dayjs = require('./day')
        let tmp = [];
        for (let i = 0; i < rr[0].length; i++) {
            let tt = rr[0][i]
            tt.start = tt.start ? dayjs(tt.start).format('YYYY-MM-DD HH:mm:ss') : ''
            tt.end = tt.end ? dayjs(tt.end).format('YYYY-MM-DD HH:mm:ss') : ''
            tmp.push(tt)
        }
        return res.send({
            status: 200,
            data: tmp
        })
    } else {
        return res.send({status: 500})
    }

})

router.get('/randombook', async (req, res) => {
    const rr = await db.query(`SELECT * FROM \`book\` WHERE bookAllowance > 0 ORDER BY  'bookId' LIMIT 10;`)
    return res.send({status: 200, data: rr[0]})
})
router.get('/allbook/:cur?', async (req, res) => {
    const {cur = 1, count = 15} = req.params
    const offset = (cur - 1) * count
    const rr = await db.models.book_model.findAndCountAll({
        limit: parseInt(count),
        offset,
    }).then(res => {
        let result = {}
        result.data = res.rows
        result.total = res.count
        return result
    })
    const total = await db.models.book_model.sum('bookTotal')
    const allowance = await db.models.book_model.sum('bookAllowance')
    rr.bookTotal = total
    rr.bookAllowance = allowance
    return res.send({status: 200, data: rr})
})

router.get('/searchbook/:radio/:value/:cur?', async (req, res) => {
    const obj = {}
    const {cur = 1, count = 15} = req.params
    const offset = (cur - 1) * count
    obj[req.params.radio] = {[Op.like]: `%${req.params.value}%`}
    const rr = await db.models.book_model.findAndCountAll({
        limit: parseInt(count),
        where: obj,
        offset,
    }).then(res => {
        let result = {}
        result.data = res.rows
        result.total = res.count
        return result
    })
    const total = await db.models.book_model.sum('bookTotal', {where: obj})
    const allowance = await db.models.book_model.sum('bookAllowance', {where: obj})
    rr.bookTotal = total
    rr.bookAllowance = allowance
    //console.log(rr)
    return res.send({status: 200, data: rr})
})

router.post('/admin/addbook', async (req, res) => {
    const rr = await db.models.book_model.findOne({where: {bookId: req.body.bookId}, raw: true})
    if (rr) return res.send({status: 500})
    else {
        const rrrr = await db.models.book_model.create(req.body)
        if (rrrr) return res.send({status: 200})
        else return res.send({status: 500})
    }
})

router.post('/admin/editbook', async (req, res) => {
    const rr = await db.models.book_model.findOne({where: {bookId: req.body.bookId}})
    if (!rr) return res.send({status: 500})
    else {
        const rrrr = await rr.update(req.body)
        if (rrrr) return res.send({status: 200})
        else return res.send({status: 500})
    }
})

router.post('/deletebook/:bookId', async (req, res) => {
    const rr = await db.models.book_model.findOne({where: {bookId: req.params.bookId}})
    if (!rr) return res.send({status: 500})
    else {
        const rrrr = await db.models.book_model.destroy({where: {bookId: req.params.bookId}})
        if (rrrr) return res.send({status: 200})
        else return res.send({status: 500})
    }
})

router.get('/class', async (req, res) => {
    const classNames = await db.query(`SELECT
\tclass.className
FROM
\tclass`)
    return res.send({status: 200, data: classNames[0]})
})

module.exports = router