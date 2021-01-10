const Sequelize = require('sequelize')
const db = new Sequelize('数据库名称', '数据库用户', '数据库密码', {
  host: 'localhost', //数据库地址,默认本机
  port: '3306',
  dialect: 'mysql',
  pool: {
    //连接池设置
    max: 100, //最大连接数
    min: 0, //最小连接数
    idle: 10000,
  },
  define: {
    timestamps: false,
  },
  timezone: '+08:00',
})
require('./models/admin')(db)
require('./models/user')(db)
require('./models/borrow')(db)
require('./models/payment')(db)
require('./models/book')(db)
require('./models/card')(db)

// db.models.payment_model.findOne(
//     {
//         where: {
//             payUser: 444
//         },
//         raw: true
//     }
// ).then((err, res) => console.log(err))

module.exports = db
