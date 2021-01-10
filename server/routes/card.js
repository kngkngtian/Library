const express = require('express')
const router = express.Router()
const db = require('../model')
const {Op} = require("sequelize");
const path = require('path')
const multer = require('multer')

const cardUpload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            // 上传文件存在 public/uploads 下
            cb(null, 'public/card')
        },
        filename(req, file, cb) {
            // 使用时间戳作为上传的文件名
            const extname = path.extname(file.originalname)
            cb(null, Date.now() + extname)
        }
    })
})
router.post('/upload/:cardId', cardUpload.single('file'), async (req, res) => {
    const rr = await db.models.card_model.findOne({where: {cardId: req.params.cardId}})
    const {file: {filename, path}} = req
    const rrrr = await rr.update({cardAvatar: path})
    if (rrrr) {
        res.json({
            ok: true,
            message: '图片上传成功',
            data: {
                name: filename,
                url: path
            }
        })
    } else {
        res.json({
            ok: false,
            message: '图片上传失败',
        })
    }
})
router.get('/cardavatar/:cardId', async (req, res) => {
    const rr = await db.models.card_model.findOne({where: {cardId: req.params.cardId}, raw: true})
    if (rr) {
        res.send({status: 200, url: rr.cardAvatar})
    } else {
        res.send({status: 500})
    }
})
router.get('/', (req, res) => {
    res.send(req.params)
})

router.post('/login', async (req, res) => {
    // console.log(req.body)
    let rr = await db.models.card_model.findOne({
        where: {
            [Op.and]: [{cardId: req.body.username ? req.body.username : 'null'}, {cardPwd: req.body.password ? req.body.password : 'null'}]
        },
        raw: true
    })
    // console.log(rr)
    if (rr) {
        let user = await db.models.user_model.findOne({
            where: {
                userId: rr.cardUser
            },
            raw: true
        })
        // req.session.userName = user.userName
        // req.session.userId = user.userId
        // req.session.cardId = rr.cardId
        return res.status(200).send({
            status: 200,
            message: '登陆成功',
            userName: user.userName,
            userId: user.userId,
            cardId: rr.cardId,
            role: 'user'
        })
    } else {
        rr = await db.models.admin_model.findOne({
            where: {
                [Op.and]: [{adminAccount: req.body.username ? req.body.username : 'null'}, {adminPwd: req.body.password ? req.body.password : 'null'}]
            }
        })
        if (rr) {
            return res.send({status: 200, cardId: req.body.userName, role: 'admin'})
        } else {
            return res.send({status: 500})
        }
    }

})

router.post('/total', async (req, res) => {
    const card = await db.models.card_model.findOne({where: {cardId: req.body.cardId}})
    const rr = card.update({cardTotal: req.body.cardTotal})
    if (rr) return res.send({status: 200})
    else return res.send({status: 500})
})

router.post('/deletecard/:cardId', async (req, res) => {
    const rr = await db.models.card_model.findOne({where: {cardId: req.params.cardId}})
    if (!rr) return res.send({status: 500})
    else {
        const rrrr = await db.models.card_model.destroy({where: {cardId: req.params.cardId}})
        if (rrrr) return res.send({status: 200})
        else return res.send({status: 500})
    }
})

module.exports = router