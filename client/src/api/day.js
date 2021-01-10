import customParseFormat from 'dayjs/plugin/customParseFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import * as dayjs from 'dayjs'

dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)

export default dayjs