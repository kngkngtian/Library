const express = require('express')
const router = express.Router()
const db = require('../model')
const {Op} = require('sequelize')
const dayjs = require('./day')

router.get('/', (req, res) => {
    res.send('hello world')
})

router.post('/xq/:borId', async (req, res) => {
    const rr = await db.models.borrow_model.findOne({
        where: {borId: req.params.borId},
    })
    rr.update({borEnd: req.body.newTime})
    return res.send(1)
})

router.post('/sq/:bookId/:cardId', async (req, res) => {
    // console.log({
    //     borBook: req.params.bookId,
    //     borCard: req.params.cardId,
    // })
    const rr = await db.models.borrow_model.create({
        borBook: req.params.bookId,
        borCard: req.params.cardId,
    })
    return res.send({status: 200, data: rr})
})

router.get('/borrow', async (req, res) => {
    let rr = await db.query(`select * from booktoborrow`)
    return res.send({status: 200, data: rr[0]})
})
router.get('/return', async (req, res) => {
    let rr = await db.query(`select * from booktoreturn`)
    return res.send({status: 200, data: rr[0]})
})

router.post('/admin/allowborrow/:borId', async (req, res) => {
    const rr = await db.models.borrow_model.findOne({where: {borId: req.params.borId}})
    let rrrr = await rr.update({
        borIsBorrowApprove: 1,
        borStart: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        borEnd: dayjs().add(1, 'month').format("YYYY-MM-DD HH:mm:ss")
    }).catch(res => null)
    if (rrrr) return res.send({status: 200, data: rrrr})
    else return res.status(500)
})

router.post('/admin/allowreturn/:borId', async (req, res) => {
    const rr = await db.models.borrow_model.findOne({where: {borId: req.params.borId}})
    let rrrr = await rr.update({borIsReturnApprove: 1}).catch(res => null)
    if (dayjs(rrrr.dataValues.borRealtime).isAfter(rrrr.dataValues.end)) {
        const book = await db.models.book_model.findOne({where: {bookId: rrrr.dataValues.borBook}, raw: true})
        const tt = await db.models.payment_model.create({
            payCard: rrrr.dataValues.borCard,
            payMoney: (book.bookMoney * (Math.ceil((dayjs(rrrr.dataValues.borRealtime) - dayjs(rrrr.dataValues.end)) / 86400000)) / 30).toFixed(2),
            payBook: rrrr.dataValues.borBook,
            payBor: rrrr.dataValues.borId
        })
        //console.log(tt)
    }
    if (rrrr) return res.send({status: 200, data: rrrr})
    else return res.status(500)

})

router.post('/admin/refuseborrow/:borId', async (req, res) => {
    const rr = await db.models.borrow_model.findOne({where: {borId: req.params.borId}})
    let rrrr = await rr.update({borIsBorrowApprove: 2}).catch(res => null)
    if (rrrr) return res.send({status: 200, data: rrrr})
    else return res.status(500)
})

router.post('/user/return/:borId', async (req, res) => {
    const rr = await db.models.borrow_model.findOne({where: {borId: req.params.borId}})
    const rrrr = await rr.update({borRealtime: req.body.realTime, borIsReturn: 1})
    if (rrrr) return res.send({status: 200})
})

router.get('/allborrow/:cur?', async (req, res) => {
    const {cur = 1, count = 15} = req.params
    const offset = (cur - 1) * count
    const rr = await db.query(`
    SELECT
\tcard.cardId, 
\tbook.bookName, 
\tborrow.borStart, 
\tborrow.borEnd, 
\tborrow.borIsReturn, 
\tborrow.borId,
\tborrow.borIsBorrowApprove, 
\tborrow.borIsReturnApprove, 
\tbook.bookId
FROM
\tcard
\tINNER JOIN
\tborrow
\tON 
\t\tcard.cardId = borrow.borCard
\tINNER JOIN
\tbook
\tON 
\t\tborrow.borBook = book.bookId
WHERE
\tborrow.borIsReturnApprove = 0 and
\tborrow.borIsBorrowApprove <> 2
\tLIMIT ${count}
\tOFFSET ${offset}
`)

    const borrowTotal = await db.models.borrow_model.count({where: {borIsReturnApprove: 0}})
    let tmp = []
    for (let i = 0; i < rr[0].length; i++) {
        let tt = rr[0][i]
        tt.borStart = tt.borStart ? dayjs(tt.borStart).format('YYYY-MM-DD HH:mm:ss') : ''
        tt.borEnd = tt.borEnd ? dayjs(tt.borEnd).format('YYYY-MM-DD HH:mm:ss') : ''
        tmp.push(tt)
    }
    return res.send({status: 200, data: {data: tmp, total: borrowTotal}})
})

router.get('/searchborrow/:radio/:value/:cur?', async (req, res) => {
        const obj = {}
        const {cur = 1, count = 15} = req.params
        const offset = (cur - 1) * count
        const radio = req.params.radio === 'cardId' ? 'card' : (req.params.radio === 'bookId' || req.params.radio === 'bookName' ? 'book' : 'borrow')
        // obj[radio] = {[Op.like]: `%${req.params.value}%`}
        const rr = await db.query(`
    SELECT
\tcard.cardId, 
\tbook.bookName, 
\tborrow.borStart, 
\tborrow.borEnd, 
\tborrow.borId,
\tborrow.borIsReturn, 
\tborrow.borIsBorrowApprove, 
\tborrow.borIsReturnApprove, 
\tbook.bookId
FROM
\tcard
\tINNER JOIN
\tborrow
\tON 
\t\tcard.cardId = borrow.borCard
\tINNER JOIN
\tbook
\tON 
\t\tborrow.borBook = book.bookId
WHERE
\tborrow.borIsReturnApprove = 0 AND
\t\`${radio}\`.${req.params.radio} LIKE '%${req.params.value}%' and
\tborrow.borIsBorrowApprove <> 2
\tLIMIT ${count}
\tOFFSET ${offset}
 `)
        let tmp = []
        for (let i = 0; i < rr[0].length; i++) {
            let tt = rr[0][i]
            tt.borStart = tt.borStart ? dayjs(tt.borStart).format('YYYY-MM-DD HH:mm:ss') : ''
            tt.borEnd = tt.borEnd ? dayjs(tt.borEnd).format('YYYY-MM-DD HH:mm:ss') : ''
            tmp.push(tt)
        }
        let borrowTotal = 0
        if (req.params.radio === 'borCard') borrowTotal = await db.models.borrow_model.count({
            where: {
                borIsReturnApprove: 0,
                borCard: {[Op.like]: `%${req.params.value}%`}
            }
        })
        else {
            obj[req.params.radio] = req.params.value
            let rrrr = await db.models.book_model.findOne({where: obj, raw: true})
            borrowTotal = await db.models.borrow_model.count({borBook: {[Op.like]: `%${rrrr.bookId}%`}})
        }

        return res.send({status: 200, data: {data: tmp, total: borrowTotal}})
    }
)

module.exports = router

