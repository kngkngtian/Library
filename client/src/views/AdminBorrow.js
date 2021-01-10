import {Empty, Input, Radio, Table, Button, Row, Col} from 'antd'
import {useEffect, useState, useCallback} from 'react'
import {getSearchBorrow, getPageBorrow} from '../api/book'
import dayjs from "../api/day";

function BorrowSearch(props) {
    const {Search} = Input
    const [radio, setRadio] = useState('bookName')

    function onChange(e) {
        setRadio(e.target.value)
    }

    const onSearch = (value) => {
        props.handleSearch(radio, value)
    }

    return (
        <>
            <Radio.Group onChange={onChange} defaultValue="bookName">
                <Radio.Button value="bookId">书号</Radio.Button>
                <Radio.Button value="bookName">书名</Radio.Button>
                <Radio.Button value="borCard">卡号</Radio.Button>
            </Radio.Group>
            <Search style={{width: '60%', marginLeft: "2.5%"}} size={'large'} placeholder="选择分类后搜索🔍"
                    onSearch={onSearch}
                    enterButton/>
        </>
    )
}

function BorrowSearchTable(props) {
    const {Column} = Table
    //console.log(props)
    return (<>
        {props.borrows.length ?
            <Table dataSource={props.borrows} style={{marginTop: 30}}
                   pagination={false} rowKey="borId">
                <Column title="书号" dataIndex="bookId"/>
                <Column title="书名" dataIndex="bookName"/>
                <Column title="卡号" dataIndex="cardId"/>
                <Column title="借阅日期" dataIndex="borStart"/>
                <Column title="应还日期" dataIndex="borEnd"/>
                <Column title="状态" render={(text, record) => {
                    switch (record.borIsBorrowApprove) {
                        default:
                            return
                        case 0:
                            return <span>待批准⏱</span>
                        case 1:
                            if (dayjs().isAfter(dayjs(record.borEnd))) return (<span>已超期❌</span>)
                            else if (record.borIsReturn === 1) return <span>待归还⏱</span>
                            else
                                return <span>借阅中📖</span>
                    }
                }} key="status"/>
            </Table> : <Empty style={{width: '100%'}} description={<span>没有查找到数据</span>}/>}</>)
}

export default function AdminBorrow() {
    const [borrows, setBorrows] = useState([])
    const [radio, setRadio] = useState('')
    const [value, setValue] = useState('')
    const [total, setTotal] = useState(0)
    const [cur, setCur] = useState(1)
    const search = useCallback(async () => {
        const res = await getSearchBorrow(radio, value, cur)
        if (res.data.status === 200) {
            setBorrows(res.data.data.data)
            setTotal(res.data.data.total)
        }
    }, [radio, value, cur])

    const changePage = async (cur) => {
        setCur(cur)
    }

    const paginationProps = {
        showSizeChanger: false,
        showQuickJumper: false,
        showTotal: () => `共${total}条`,
        pageSize: 15,
        current: cur,
        total: total,
        onChange: (current) => changePage(current),
    }

    useEffect(() => {
        document.title = '借阅信息'
    }, [])
    useEffect(() => {
        search()
    }, [search])

    async function handleSearch(radio, value) {
        setValue(value)
        setRadio(radio)
        setCur(1)
    }


    return (
        <>
            <Row style={{alignItems: 'center', justifyContent: 'center', display: "flex", flexWrap: "warp"}}>
                <BorrowSearch handleSearch={handleSearch}/>
            </Row>
            <Row>
                <Col span={24} style={{marginTop: 60}}>
                    <BorrowSearchTable borrows={borrows} reSearch={search} paginationProps={paginationProps}/>
                </Col>
            </Row>
        </>
    )
}