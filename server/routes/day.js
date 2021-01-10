const customParseFormat = require('dayjs/plugin/customParseFormat')
const relativeTime = require('dayjs/plugin/relativeTime')
const dayjs = require('dayjs')

dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)

module.exports = dayjs