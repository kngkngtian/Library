const express = require('express')
const router = express.Router()
const db = require('../model')
const dayjs = require("./day");

router.get('/', (req, res) => {
    res.send('hello world')
})
router.get('/query/:cardId', async (req, res) => {
    // let rr = await db.models.payment_model.findAll({
    //     where: {payCard: req.params.cardId, payIsPay: 0},
    //     raw: true
    // })
    // if (!(rr instanceof Array)) rr = [rr]
    const rr = await db.query(`SELECT
\tpayment.payId, 
\tborrow.borId, 
\tborrow.borBook, 
\tborrow.borStart, 
\tborrow.borEnd, 
\tborrow.borRealtime, 
\tpayment.payMoney, 
\tbook.bookName, 
\tpayment.payCard
FROM
\tpayment
\tINNER JOIN
\tborrow
\tINNER JOIN
\tbook
\tON 
\t\tborrow.borBook = book.bookId AND
\t\tpayment.payBook = book.bookId
WHERE
\tpayment.payBor = borrow.borId AND
\t(
\t\tpayment.payIsPay = 0
\t) AND
\tpayment.payBook = book.bookId`)
    let tmp = []
    for (let i = 0; i < rr[0].length; i++) {
        let tt = rr[0][i]
        tt.borStart = tt.borStart ? dayjs(tt.borStart).format('YYYY-MM-DD HH:mm:ss') : ''
        tt.borEnd = tt.borEnd ? dayjs(tt.borEnd).format('YYYY-MM-DD HH:mm:ss') : ''
        tt.borRealtime = tt.borRealtime ? dayjs(tt.borRealtime).format('YYYY-MM-DD HH:mm:ss') : ''
        tmp.push(tt)
    }
    return res.send({status: 200, data: tmp})
})
router.post('/pay/:payId', async (req, res) => {
    const rr = await db.models.payment_model.findOne({
        where: {payId: req.params.payId}
    })
    const rrrr = rr.update({...req.body, payIsPay: 1})
    if (rrrr) return res.send({status: 200})
    else return res.send({status: 500})
})

module.exports = router