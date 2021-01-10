import {Empty, Input, Radio, Table, Button, Row, Col, Modal, Form,} from 'antd'
import {useEffect, useState, useCallback} from 'react'
import {getPageBook} from '../api/book'
import {
    getSearchUser,
    editCardTotal,
    editUser,
    addUser,
    getUserBook,
    getPaymentBook,
    deleteCard
} from '../api/userinfo'
import Swal from "sweetalert2";
import {AppstoreAddOutlined} from "@ant-design/icons";
import dayjs from "../api/day";
import {allowBorrow, allowReturn, refuseBorrow} from "../api/borrow";

function UserSearch(props) {
    const {Search} = Input
    const [radio, setRadio] = useState('cardId')

    function onChange(e) {
        setRadio(e.target.value)
    }

    const onSearch = (value) => {
        props.handleSearch(radio, value)
    }

    return (
        <>
            <Radio.Group onChange={onChange} defaultValue="cardId">
                <Radio.Button value="cardId">卡号</Radio.Button>
                <Radio.Button value="userId">身份证</Radio.Button>
                <Radio.Button value="userAddress">地址</Radio.Button>
                <Radio.Button value="userTel">电话</Radio.Button>
            </Radio.Group>
            <Search style={{width: '60%', marginLeft: "2.5%"}} size={'large'} placeholder="选择分类后搜索🔍"
                    onSearch={onSearch}
                    enterButton/>
        </>
    )
}

function UserSearchTable(props) {
    const {Column} = Table
    return (<>
        {props.users.length ?
            <Table dataSource={props.users} style={{width: '100%'}} rowKey="cardId" pagination={props.paginationProps}>
                <Column title={"卡号"} dataIndex={"cardId"}/>
                <Column title={"身份证"} dataIndex={"userId"}/>
                <Column title={"姓名"} dataIndex={"userName"}/>
                <Column title={"联系电话"} dataIndex={"userTel"}/>
                <Column title={"家庭住址"} dataIndex={"userAddress"}/>
                <Column title={"已借/可借"} render={(i, r) => `${i.cardAllowance}/${i.cardTotal}`}/>
                <Column title={"操作"} key={(i, r) => r.cardId + r.userId}
                        render={(i, r) => {
                            const handleApply = async () => {
                                props.onClickEditButton({...i, cardTotalOld: i.cardTotal})
                            }
                            const handleDetail = async () => {
                                props.onClickDetailButton(i.cardId)
                            }
                            const handleDelete = async () => {
                                props.onClickDeleteButton(i)
                            }
                            return (
                                <>
                                    <Button onClick={handleApply}>编辑用户</Button>
                                    <Button onClick={handleDetail} style={{marginLeft: '10px'}}>借阅情况</Button>
                                    <Button onClick={handleDelete} style={{marginLeft: '10px'}} danger>删除</Button>
                                </>)
                        }}/>
            </Table> : <Empty style={{width: '100%'}} description={<span>没有查找到数据</span>}/>}</>)
}

const BookTable = (props) => {
    const {Column} = Table;
    console.log(props.books)
    return (
        <>
            {props.books.length ? <Table dataSource={props.books} style={{marginTop: 30}}
                                         pagination={false} rowKey="borId">
                <Column title="书号" dataIndex="id"/>
                <Column title="书名" dataIndex="name"/>
                <Column title="分类" dataIndex="class"/>
                <Column title="借阅日期" dataIndex="start"/>
                <Column title="应还日期" dataIndex="end"/>
                <Column title="状态" render={(text, record) => {
                    switch (record.borIsBorrowApprove) {
                        default:
                            return
                        case 0:
                            return <span>待批准⏱</span>
                        case 1:
                            if (dayjs().isAfter(dayjs(record.end))) return (<span>已超期❌</span>)
                            else if (record.borIsReturn === 1) return <span>待归还⏱</span>
                            else
                                return <span>借阅中📖</span>
                    }
                }} key="status"/>
                <Column title={"操作"} width={"25%"} key={(i, r) => r.bookId + r.bookName}
                        render={(i, r) => {
                            const onClick = () => {
                                props.onApprove(i, r)
                            }
                            const onRefused = props.onRefused ? () => {
                                props.onRefused(i, r)
                            } : null
                            const onreturn = () => {
                                props.onReturn(i, r)
                            }
                            return (<>{!i.borIsBorrowApprove ?
                                <Button onClick={onClick}>允许借阅</Button> : null}{!i.borIsBorrowApprove ?
                                <Button style={{marginLeft: 20}}
                                        onClick={onRefused}>拒绝借阅</Button> : null}{i.borIsReturnApprove !== 1 && i.borIsReturn === 1 ?
                                <Button style={{marginLeft: 20}} onClick={onreturn}>批准还书</Button> : null}</>)
                        }}/>
            </Table> : <Empty description={<span>🤦‍该用户没有借阅书籍🤦</span>}/>}
        </>)
}
const PayTable = (props) => {
    const
        {
            Column
        }
            = Table;
    return (
        <>
            {props.payments.length ? <Table dataSource={props.payments} style={{marginTop: 30}}
                                            pagination={false} rowKey="borId"
            >
                <Column title="书名" dataIndex="bookName"/>
                <Column title="借阅日期" dataIndex="borStart"/>
                <Column title="应还日期" dataIndex="borEnd"/>
                <Column title="实还日期" dataIndex="borRealtime"/>
                <Column title="罚款金额" dataIndex="payMoney"/>
            </Table> : <Empty description={<span>🎉没有超期图书🎉</span>}/>}
        </>
    )
}

export default function AdminUser() {
    const [users, setUsers] = useState([])
    const [radio, setRadio] = useState('')
    const [value, setValue] = useState('')
    const [total, setTotal] = useState(0)
    const [cur, setCur] = useState(1)
    const [addVisible, setAddVisible] = useState(false)
    const [detailVisible, setDetailVisible] = useState(false)
    useEffect(() => {
        document.title = '用户管理'
    }, [])
    const search = useCallback(async () => {
        const res = await getSearchUser(radio, value, cur)
        if (res.data.status === 200) {
            setUsers(res.data.data.data)
            setTotal(res.data.data.total)
        }
    }, [radio, value, cur])

    useEffect(() => {
        search()
    }, [search])
    const [editVisible, setEditVisible] = useState(false)
    const [initValue, setInitValue] = useState({})
    const onClickEditButton = (i) => {
        setInitValue(i)
        setEditVisible(true)
    }

    async function handleSearch(radio, value) {
        setValue(value)
        setRadio(radio)
        setCur(1)
    }

    const onAddSubmit = async (values) => {
        let res = null
        res = await addUser(values.user, {userId: values.user.userId, ...values.card}).catch({status: 500})
        if (res.status === 200 && res.data.status === 200) {
            Swal.fire({
                title: '添加成功',
                icon: 'success',
                showConfirmButton: true
            })
            setAddVisible(false)
            search().catch()
        } else if (res.status === 200 && res.data.status === 500) {
            Swal.fire({
                title: '发生错误',
                text: '表单填写错误，请检查内容',
                icon: 'error',
                showConfirmButton: true,
            })
        } else {
            Swal.fire({
                title: '发生错误',
                text: '服务器错误或网络连接错误',
                icon: 'error',
                showConfirmButton: true
            })
        }
    }
    const onEditSubmit = async (values) => {
        let res = null
        if (values.cardTotal !== values.cardTotalOld) {
            res = await editCardTotal({cardTotal: values.cardTotal, cardId: values.cardId}).catch({status: 500})
        }
        res = await editUser(values).catch({status: 500})
        if (res.status === 200 && res.data.status === 200) {
            Swal.fire({
                title: '修改成功',
                icon: 'success',
                showConfirmButton: true
            })
            search().catch()
            setEditVisible(false)
        } else if (res.status === 200 && res.data.status === 500) {
            Swal.fire({
                title: '发生错误',
                text: '表单填写错误，请检查内容',
                icon: 'error',
                showConfirmButton: true,
            })
        } else {
            Swal.fire({
                title: '发生错误',
                text: '服务器错误或网络连接错误',
                icon: 'error',
                showConfirmButton: true
            })
        }

    }
    const onClickAddButton = () => {
        setAddVisible(true)

    }
    const changePage = async (cur) => {
        setCur(cur)
        const res = await getPageBook(cur)
        if (res.status === 200 && res.data.status === 200) {
            setUsers(res.data.data.data)
        }
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
    const fetchBooks = async (cardId) => {
        let res = await getUserBook(cardId)
        if (res.data.status === 200) {
            setBooks(res.data.data)
        }
    }
    const fetchPayments = async (cardId) => {
        let res = await getPaymentBook(cardId)
        if (res.data.status === 200) {
            setPayments(res.data.data)
        }
    }
    const [books, setBooks] = useState([])
    const [payments, setPayments] = useState([])
    const onClickDetailButton = async (cardId) => {
        setDetailVisible(true)
        fetchBooks(cardId)
        fetchPayments(cardId)
    }
    const onClickDeleteButton = async (i) => {
        if (i.cardAllowance !== i.cardTotal) {
            Swal.fire({
                title: '未全部归还',
                text: '请等待全部归还后删除本用户',
                icon: 'error',
                showConfirmButton: true
            })
        } else {
            const {isConfirmed} = await Swal.fire({
                title: `确定要删除 - ${i.cardId}`,
                icon: 'question',
                showConfirmButton: true,
                showCancelButton: true
            })
            if (isConfirmed) {
                let res = await deleteCard(i.cardId)
                if (res.data && res.data.status === 200) {
                    Swal.fire({
                        title: '删除成功',
                        icon: 'success',
                        showConfirmButton: true
                    })
                    search()
                } else {
                    Swal.fire({
                        title: '删除失败',
                        icon: 'error',
                        showConfirmButton: true
                    })
                }
            }
        }
    }
    const onReturnApprove = async (i, r) => {
        const res = await allowReturn(i.borId)
        if (res.status === 200 && res.data.status === 200) {
            Toast.fire({icon: 'success', title: '批准还书'})
            fetchBooks(i.borCard)
        } else {
            Toast.fire({icon: 'error', title: '发生错误'})
        }
    }
    const onBorrowApprove = async (i, r) => {
        const res = await allowBorrow(i.borId)
        if (res.status === 200 && res.data.status === 200) {
            Toast.fire({icon: 'success', title: '批准借书'})
            console.log(i)
            fetchBooks(i.borCard)
        } else {
            Toast.fire({icon: 'error', title: '发生错误'})
        }
    }
    const onRefused = async (i, r) => {
        const res = await refuseBorrow(i.borId)
        if (res.status === 200 && res.data.status === 200) {
            Toast.fire({icon: 'success', title: '拒绝借书'})
            fetchBooks(i.borCard)
        } else {
            Toast.fire({icon: 'error', title: '发生错误'})
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


    return (
        <>
            <Row style={{alignItems: 'center', justifyContent: 'center', display: "flex", flexWrap: "warp"}}>
                <UserSearch handleSearch={handleSearch}/>
            </Row>
            <Row style={{marginTop: 60, justifyContent: 'flex-end'}}>
                <Button type="primary" shape="round" icon={<AppstoreAddOutlined/>} onClick={onClickAddButton}
                        size={"large"}>
                    添加用户
                </Button>
            </Row>
            <Row style={{marginTop: 20}}>
                <Col span={24}>
                    <UserSearchTable users={users} reSearch={search} onClickEditButton={onClickEditButton}
                                     paginationProps={paginationProps} onClickDetailButton={onClickDetailButton}
                                     onClickDeleteButton={onClickDeleteButton}
                    />
                </Col>
            </Row>
            <Modal visible={addVisible}
                   destroyOnClose
                   footer={null}
                   onCancel={() => {
                       setAddVisible(false)
                       Modal.destroyAll()
                   }}
                   title={<span style={{fontWeight: "bold", fontSize: "24px", lineHeight: '24px'}}>添加用户👦</span>}>
                <Form
                    labelCol={{span: 4}}
                    wrapperCol={{span: 14}}
                    layout="horizontal"
                    initialValues={{size: "large"}}
                    size={"large"}
                    onFinish={onAddSubmit}
                    name={"addbook"}
                >

                    <Form.Item label="卡号" name={["card", "cardId"]} rules={[{required: true, message: '需要输入有效信息'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="密码" name={["card", "cardPwd"]} rules={[{required: true, message: '需要输入有效信息'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="可借阅量" name={["card", "cardTotal"]}
                               rules={[{required: true, message: '需要输入有效信息'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="身份证号" name={["user", "userId"]} rules={[{required: true, message: '需要输入有效信息'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="姓名" name={["user", "userName"]} rules={[{required: true, message: '需要输入有效信息'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="电话" name={["user", 'userTel']} rules={[{required: true, message: '需要输入有效信息'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="住址" name={["user", "userAddress"]}
                               rules={[{required: true, message: '需要输入有效信息'}]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal visible={editVisible}
                   destroyOnClose
                   footer={null}
                   onCancel={() => {
                       setEditVisible(false)
                       Modal.destroyAll()
                   }}
                   title={<span
                       style={{
                           fontWeight: "bold",
                           fontSize: "24px",
                           lineHeight: '24px'
                       }}>编辑用户🖊</span>}>
                <Form
                    labelCol={{span: 4}}
                    wrapperCol={{span: 14}}
                    layout="horizontal"
                    initialValues={initValue}
                    size={"large"}
                    onFinish={onEditSubmit}
                    name={"editbook"}
                >
                    <div style={{display: 'none'}}>
                        <Form.Item label="总量" name={"cardTotalOld"}>
                            <Input disabled/>
                        </Form.Item>
                    </div>
                    <Form.Item label="卡号" name={"cardId"}>
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item label="身份证" name={"userId"}>
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item label="姓名" name={"userName"}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="可借阅量" name={"cardTotal"}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="家庭住址" name={"userAddress"}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="联系电话" name={"userTel"}>
                        <Input/>
                    </Form.Item>

                    <Form.Item style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal visible={detailVisible}
                   width={"1200px"}
                   destroyOnClose
                   footer={null}
                   onCancel={() => {
                       setDetailVisible(false)
                       Modal.destroyAll()
                   }}
                   title={<span
                       style={{
                           fontWeight: "bold",
                           fontSize: "24px",
                           lineHeight: '24px'
                       }}>用户借阅情况</span>}>
                <div><span style={{lineHeight: '24px', fontSize: '22px', fontWeight: 'bold'}}>借阅情况</span>
                    <BookTable books={books} onApprove={onBorrowApprove} onRefused={onRefused}
                               onReturn={onReturnApprove}/></div>
                <div style={{marginTop: '30px'}}>
                    <span style={{
                        lineHeight: '24px',
                        fontSize: '22px',
                        fontWeight: 'bold',
                        marginTop: '30px'
                    }}>罚款情况</span>
                    <PayTable payments={payments}/>
                </div>
            </Modal>
        </>
    )
}
