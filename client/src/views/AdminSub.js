import {Button, Col, Empty, Row, Table} from "antd";
import Swal from "sweetalert2";
import {useState, useEffect} from 'react'
import {getReturnBooks, getBorrowBooks, allowReturn, allowBorrow, refuseBorrow} from '../api/borrow'

// const paginationProps = {
//
// }

function BookTable(props) {
    const {Column} = Table
    return (<>
        {props.books.length ? <Table dataSource={props.books} style={{width: '100%'}} rowKey="borId">
            <Column title={"书号"} dataIndex={"bookId"} width={"15%"}/>
            <Column title={"书名"} dataIndex={"bookName"} width={"15%"}/>
            <Column title={"出版社"} dataIndex={"bookPress"} width={"15%"}/>
            <Column title={"借阅者"} dataIndex={"cardId"} width={"15%"}/>
            <Column title={"作者"} dataIndex={"bookAuthor"} width={"15%"}/>
            <Column title={"操作"} width={"25%"} key={(i, r) => r.bookId + r.bookName}
                    render={(i, r) => {
                        const onClick = () => {
                            props.onApprove(i, r)
                        }
                        const onRefused = props.onRefused ? () => {
                            props.onRefused(i, r)
                        } : null
                        return (<><Button onClick={onClick}>允许</Button>{onRefused ?
                            <Button style={{marginLeft: 20}} onClick={onRefused}>拒绝</Button> : null}</>)
                    }}/>
        </Table> : <Empty style={{width: '100%'}} description={<span>没有查找到数据</span>}/>}
    </>)
}


export default function AdminSub(props) {
    const [returnBooks, setReturnBooks] = useState([])
    const [borrowBooks, setBorrowBooks] = useState([])

    const fetchReturnBooks = async () => {
        const res = await getReturnBooks()
        if (res.status === 200 && res.data.status === 200) {
            setReturnBooks(res.data.data)
        }
    }
    const fetchBorrowBooks = async () => {
        const res = await getBorrowBooks()
        if (res.status === 200 && res.data.status === 200) {
            setBorrowBooks(res.data.data)
        }
    }
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    const onReturnApprove = async (i, r) => {
        const res = await allowReturn(i.borId)
        if (res.status === 200 && res.data.status === 200) {
            Toast.fire({icon: 'success', title: '批准还书'})
            fetchReturnBooks()
        } else {
            Toast.fire({icon: 'error', title: '发生错误'})
        }
    }
    const onBorrowApprove = async (i, r) => {
        const res = await allowBorrow(i.borId)
        if (res.status === 200 && res.data.status === 200) {
            Toast.fire({icon: 'success', title: '批准借书'})
            fetchBorrowBooks()
        } else {
            Toast.fire({icon: 'error', title: '发生错误'})
        }
    }
    const onRefused = async (i, r) => {
        const res = await refuseBorrow(i.borId)
        if (res.status === 200 && res.data.status === 200) {
            Toast.fire({icon: 'success', title: '拒绝借书'})
            fetchBorrowBooks()
        } else {
            Toast.fire({icon: 'error', title: '发生错误'})
        }
    }

    useEffect(() => {
        document.title = '借阅管理'
        fetchBorrowBooks().catch()
        fetchReturnBooks().catch()
    }, [])

    return (<>
        <Row>
            <Col style={{fontSize: 30}} push={0}>借阅申请</Col>
        </Row>
        <Row>
            <Col span={24} push={0} style={{minHeight: 300}}>
                <BookTable books={borrowBooks} onApprove={onBorrowApprove} onRefused={onRefused}
                />
            </Col>
        </Row>
        <Row>
            <Col style={{fontSize: 30}} push={0}>还书申请</Col>
        </Row>
        <Row>
            <Col span={24} push={0} style={{minHeight: 300}}>
                <BookTable books={returnBooks} onApprove={onReturnApprove}
                />
            </Col>
        </Row>
    </>)
}