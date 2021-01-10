import {Empty, Input, Radio, Table, Button, Row, Col} from 'antd'
import {useEffect, useState, useCallback} from 'react'
import {getSearchBook, getPageBook} from '../api/book'
import {postBorrowBook} from '../api/borrow'
import Swal from "sweetalert2";

function BookSearch(props) {
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
                <Radio.Button value="bookAuthor">作者</Radio.Button>
                <Radio.Button value="bookClass">分类</Radio.Button>
            </Radio.Group>
            <Search style={{width: '60%', marginLeft: "2.5%"}} size={'large'} placeholder="选择分类后搜索🔍"
                    onSearch={onSearch}
                    enterButton/>
        </>
    )
}

function BookSearchTable(props) {
    const {Column} = Table

    return (<>
        {props.books.length ? <Table dataSource={props.books} style={{width: '100%'}} rowKey="bookId" pagination={props.paginationProps} >
            <Column title={"书号"} dataIndex={"bookId"} width={"15%"}/>
            <Column title={"书名"} dataIndex={"bookName"} width={"15%"}/>
            <Column title={"分类"} dataIndex={"bookClass"} width={"15%"}/>
            <Column title={"作者"} dataIndex={"bookAuthor"} width={"15%"}/>
            <Column title={"余量/总量"} render={(i, r) => (<span>{`${r.bookAllowance}/${r.bookTotal}`}</span>)}
                    width={"15%"}/>
            <Column title={"操作"} width={"25%"} key={(i, r) => r.bookId + r.bookName}
                    render={(i, r) => {
                        let isDisable = false
                        if (r.bookAllowance === 0) isDisable = true
                        const handleApply = async () => {
                            const {isConfirmed} = await Swal.fire({
                                title: `是否借阅 - 《${r.bookName}》`,
                                text: "默认借阅期限为一个月，以管理员审批时间为准",
                                showConfirmButton: true,
                                showCancelButton: true
                            })
                            if (isConfirmed) {
                                let res = await postBorrowBook(r.bookId, localStorage.getItem('cardId'))
                                if (res.status === 200 && res.data.status === 200) {
                                    Swal.fire({
                                        title: '已成功提交申请',
                                        icon: 'success',
                                        showConfirmButton: true
                                    })
                                    props.reSearch()
                                }
                            }
                        }
                        return (
                            <>
                                {/*<Button style={{marginRight: 20}} onClick={handleDetail}>详细信息</Button>*/}
                                <Button disabled={isDisable} onClick={handleApply}>申请借阅</Button></>)
                    }}/>
        </Table> : <Empty style={{width: '100%'}} description={<span>没有查找到数据</span>}/>}</>)
}


export default function UserBook() {
    const [books, setBooks] = useState([])
    const [radio, setRadio] = useState('')
    const [value, setValue] = useState('')
    const [total, setTotal] = useState(0)
    const [cur, setCur] = useState(1)
    const [bookAllowance, setBookAllowance] = useState(0)
    const [bookTotal, setBookTotal] = useState(0)
    const search = useCallback(async () => {
        const res = await getSearchBook(radio, value, cur)
        if (res.data.status === 200) {
            setBooks(res.data.data.data)
            setTotal(res.data.data.total)
            setBookAllowance(res.data.data.bookAllowance)
            setBookTotal(res.data.data.bookTotal)
        }
    }, [radio, value, cur])

    const changePage = async (cur) => {
        setCur(cur)
        const res = await getPageBook(cur)
        if (res.status === 200 && res.data.status === 200) {
            setBooks(res.data.data.data)
        }
    }

    const paginationProps = {
        showSizeChanger: false,
        showQuickJumper: false,
        showTotal: () => `共${bookTotal}本，在册数${bookAllowance}本，共${total}条`,
        pageSize: 15,
        current: cur,
        total: total,
        onChange: (current) => changePage(current),
    }

    useEffect(() => {
        document.title = '书籍查阅'
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
                <BookSearch handleSearch={handleSearch}/>
            </Row>
            <Row>
                <Col span={24} style={{marginTop: 60}}>
                    <BookSearchTable books={books} reSearch={search} paginationProps={paginationProps}/>
                </Col>
            </Row>
        </>
    )
}