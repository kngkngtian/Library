const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.send('hello world')
})

router.get('/query/:userid/:key', async (req, res) => {
    const db = require('../model')
    // console.log(req.headers)
    if (req.params.userid) {
        const rr = await db.models.user_model.findOne(
            {
                where: {userId: req.params.userid},
                raw: true
            }
        )
        let body = {status: 500}
        let key = req.params.key
        if (rr) {
            body.status = 200
            if (key === 'all') {
                body = {...body, ...rr}
            } else {
                body[key] = rr[key]
            }
        }
        return res.send(body)
    }
})

router.post('/update/:userId', async (req, res) => {
    const db = require('../model')
    // const rr = await db.models.user_model.query(
    //     `UPDATE \`user\` set \`${req.body.key[0]} = ${req.body[req.body.key[0]]}\` WHERE userId= ${req.params.userId}`
    // )
    const rr = await db.models.user_model.update(req.body, {where: {'userId': req.params.userId}})
    if (rr[0] === 1) return res.send({status: 200})
})

router.get('/alluser/:cur?', async (req, res) => {
    const db = require('../model')
    const {cur = 1, count = 15} = req.params
    const offset = (cur - 1) * count
    const rr = await db.query(`
    SELECT
\tcard.cardId, 
\tcard.cardPwd, 
\t\`user\`.userId, 
\t\`user\`.userName, 
\t\`user\`.userTel, 
\tcard.cardTotal, 
\tcard.cardAllowance, 
\t\`user\`.userAddress
FROM
\tcard
\tINNER JOIN
\t\`user\`
\tON 
\t\tcard.cardUser = \`user\`.userId
\tLIMIT ${count}
\t\tOFFSET ${offset}
    `)
    const tot = await db.models.card_model.count()
    return res.send({status: 200, data: {data: rr[0], total: tot}})
})

router.get('/searchuser/:radio/:value/:cur?', async (req, res) => {
        const db = require('../model')
        const {Op} = require("sequelize");
        const obj = {}
        const {cur = 1, count = 15} = req.params
        const offset = (cur - 1) * count
        const rr = await db.query(`
    SELECT
\tcard.cardId, 
\tcard.cardPwd, 
\tcard.cardUser, 
\tcard.cardTotal, 
\tcard.cardAllowance, 
\t\`user\`.userId, 
\t\`user\`.userName, 
\t\`user\`.userTel, 
\t\`user\`.userAddress
FROM
\t\`user\`
\tINNER JOIN
\tcard
\tON 
\t\t\`user\`.userId = card.cardUser
WHERE
\t\`${req.params.radio === 'cardId' ? 'card' : 'user'}\`.${req.params.radio} LIKE '%${req.params.value}%' AND
\t\`user\`.userId = card.cardUser
\tlimit ${count}
\toffset ${offset}
`)
        const rrrr = await db.query(`SELECT
\tcard.cardId, 
\tcard.cardPwd, 
\tcard.cardUser, 
\tcard.cardTotal, 
\tcard.cardAllowance, 
\t\`user\`.userId, 
\t\`user\`.userName, 
\t\`user\`.userTel, 
\t\`user\`.userAddress
FROM
\t\`user\`
\tINNER JOIN
\tcard
\tON 
\t\t\`user\`.userId = card.cardUser
WHERE
\t\`${req.params.radio === 'cardId' ? 'card' : 'user'}\`.${req.params.radio} LIKE '%${req.params.value}%' AND
\t\`user\`.userId = card.cardUser`)
        return res.send({status: 200, data: {data: rr[0], total: rrrr[0].length}})
    }
)

router.post('/edit', async (req, res) => {
    const db = require('../model')
    const user = await db.models.user_model.findOne({where: {userId: req.body.userId}})

    const rr = user.update({
        userTel: req.body.userTel,
        userAddress: req.body.userAddress,
        userName: req.body.userName
    })
    if (rr) return res.send({status: 200})
    return res.send({status: 500})
})

router.post('/create', async (req, res) => {
    const db = require('../model')
    const body = req.body
    await db.models.user_model.findOrCreate({
        where: {userId: body.userId},
        defaults: {userId: body.userId, userName: body.userName, userAddress: body.userAddress, userTel: body.userTel}
    })
    const rrrr = await db.models.card_model.findOrCreate({
        where: {cardId: body.cardId},
        defaults: {
            cardId: body.cardId,
            cardTotal: body.cardTotal,
            cardPwd: body.cardPwd,
            cardUser: body.userId,
            cardAllowance: body.cardTotal
        }
    })
    if (rrrr[1] === false) return res.send({status: 500})
    return res.send({status: 200})
})


module.exports = router