import {Row, Col, Avatar, Button, Empty, Table, Upload, message} from 'antd'
import {UserOutlined, UploadOutlined} from "@ant-design/icons";
import {
    getUserInfo,
    getUserBook,
    updateUserInfo,
    XQBook,
    returnBook,
    getPaymentBook,
    payForbook,
    getCardAvatar
} from '../api/userinfo'
import {useState, useEffect} from "react";
import './User.css'
import Swal from 'sweetalert2'
import dayjs from '../api/day'
import {Link} from "react-router-dom";
import {url} from "../api/fetch";


const BookTable = (props) => {
    const {Column} = Table;
    // const [bookAll, setBookAll] = useState([])
    const convertTime = (time) => Math.ceil((dayjs() - dayjs(time)) / 86400000)
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
                <Column title="操作" key="methods" render={(text, record) => {
                    const onClickXQ = async () => {
                        const newTime = dayjs(record.end).add(1, 'month').format(`YYYY-MM-DD HH:mm:ss`)
                        const {isConfirmed} = await Swal.fire({
                            title: `续期 -《${record.name}》`,
                            text: `续期之后归还时间将为${newTime}`,
                            showConfirmButton: true,
                            showCancelButton: true
                        })
                        if (isConfirmed) {
                            let res = await XQBook(record.borId, newTime)
                            if (res.status === 200) {
                                Swal.fire({
                                    title: '续期成功',
                                    icon: 'success',
                                    showConfirmButton: true
                                })
                                await props.refreshBooks()
                            }
                        }
                    }
                    const onClickReturn = async () => {
                        const newTime = dayjs().format(`YYYY-MM-DD HH:mm:ss`)
                        const {isConfirmed} = await Swal.fire({
                            title: `归还 - 《${record.name}》`,
                            text: dayjs().isAfter(dayjs(record.end)) ?
                                `已超期${convertTime(record.end)}天，需要缴纳罚款${(record.bookMoney * convertTime(record.end) / 30).toFixed(2)}元，管理员审批后缴纳`
                                : `未超期，请等待管理员审批`
                        })
                        if (isConfirmed) {
                            const res = await returnBook(record.borId, newTime)
                            if (res.status === 200 && res.data.status === 200) {
                                Swal.fire({
                                    title: '申请成功',
                                    icon: 'success',
                                    showConfirmButton: true
                                })
                                props.refreshBooks()
                            }
                        }
                    }
                    return (<><Button onClick={onClickXQ}
                                      disabled={!record.borIsBorrowApprove || record.borIsReturn}>续期</Button><Button
                        style={{marginLeft: 20}}
                        onClick={onClickReturn}
                        disabled={!record.borIsBorrowApprove || record.borIsReturn}>还书</Button></>)
                }}/>
                {/*   TODO lianjie */}
            </Table> : <Empty description={<span>🤦‍你还没有借阅书籍🤦</span>}><Button><Link
                to={'/user/book'}>去借书</Link></Button></Empty>}
        </>)
}
const PayTable = (props) => {
    const {Column} = Table;
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
                <Column title="操作" key="methods" render={(text, record) => {
                    const onClick = async () => {
                        const newTime = dayjs(record.end).add(1, 'month').format(`YYYY-MM-DD HH:mm:ss`)
                        const {isConfirmed} = await Swal.fire({
                            title: `结清 -《${record.bookName}》罚款？`,
                            text: `共需要缴纳${record.payMoney}元`,
                            showConfirmButton: true,
                            showCancelButton: true
                        })
                        if (isConfirmed) {
                            //console.log(record)
                            const res = await payForbook(record.payId, newTime)
                            if (res.status === 200 && res.data.status === 200) {
                                Swal.fire({
                                    title: '缴费成功',
                                    showConfirmButton: true,
                                    icon: 'success'
                                })
                                props.refreshPayments()
                            } else {
                                Swal.fire({
                                    title: '缴费失败',
                                    icon: 'error',
                                    showConfirmButton: true
                                })
                            }
                        }
                    }
                    return <Button onClick={onClick}>缴纳</Button>
                }}/>
            </Table> : <Empty description={<span>🎉没有罚款需要缴纳🎉</span>}/>}
        </>)
}

export default function UserInfo() {
    const onClickTel = async () => {
        const {value: telephone} = await Swal.fire({
            title: '输入你的新手机号',
            input: 'text',
            inputLabel: 'Telephone Number',
            inputValue: tel,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return '必须输入有效值'
                }
            }
        })
        const res = await updateUserInfo(localStorage.getItem('userId'), {'userTel': telephone}).catch((res) => {
            return {data: ''}
        })
        if (res.data.status === 200) {
            Swal.fire(
                {
                    title: '修改成功',
                    icon: 'success'
                }
            )
            setTel(telephone)
        } else {
            Swal.fire({
                title: '服务器错误',
                icon: 'error'
            })
        }
    }
    const [tel, setTel] = useState('')
    const [address, setAddress] = useState('')
    const [avatar, setAvatar] = useState('')
    const onClickAddress = async () => {
        const {value: addr} = await Swal.fire({
            title: '输入你的新地址',
            input: 'text',
            inputLabel: 'Address',
            inputValue: address,
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return '必须输入有效值'
                }
            }
        })
        const res = await updateUserInfo(localStorage.getItem('userId'), {'userAddress': addr}).catch((res) => {
            return {data: ''}
        })
        if (res.data.status === 200) {
            Swal.fire(
                {
                    title: '修改成功',
                    icon: 'success'
                }
            )
            setAddress(addr)
        } else {
            Swal.fire({
                title: '服务器错误',
                icon: 'error'
            })
        }
    }
    const [books, setBooks] = useState([])
    const fetchBooks = async () => {
        let res = await getUserBook(localStorage.getItem('cardId'))
        if (res.data.status === 200) {
            setBooks(res.data.data)
        }
    }
    const [payments, setPayments] = useState([])
    const fetchPayments = async () => {
        let res = await getPaymentBook(localStorage.getItem('cardId'))
        if (res.data.status === 200) {
            setPayments(res.data.data)
        }
    }
    const fetchUserInfo = async () => {
        const userid = localStorage.getItem('userId')
        const cardId = localStorage.getItem('cardId')
        let res = await getCardAvatar(cardId, 'cardAvatar')
        if (res.status === 200 && res.data.status === 200) {
            setAvatar(url + `/` + res.data.url)
        }
        res = await getUserInfo(userid, 'userTel')
        if (res.status === 200 && res.data.status === 200) {
            setTel(res.data.userTel)
        }
        res = await getUserInfo(userid, 'userAddress')
        if (res.status === 200 && res.data.status === 200) {
            setAddress(res.data.userAddress)
        }
    }

    useEffect(() => {
        document.title = '用户信息'
        fetchPayments()
        fetchUserInfo()
        fetchBooks()
    }, [])


    const props = {
        name: 'file',
        action: url + '/api/card/upload/' + localStorage.getItem('cardId'),
        showUploadList: false,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                //console.log(info.file);
            }
            if (info.file.status === 'done') {
                message.success(`头像上传成功`);
                setAvatar(url + '/' + info.file.response.data.url)
            } else if (info.file.status === 'error') {
                message.error(`头像上传失败`);
            }
        },
        beforeUpload(file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                message.error('只能上传 JPG/PNG 文件!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('图片必须小于 2MB!');
            }
            return isJpgOrPng && isLt2M;
        }
    };
    return (<>
        <Row align={'bottom'} gutter={[16, 24]} style={{justifyContent: 'center',}}>
            <Col span={8} push={0}>
                <Row>
                    <Avatar shape="square" size={256} icon={<UserOutlined/>} src={avatar}/>
                </Row>
                <Row>
                    <Upload {...props}>
                        <Button icon={<UploadOutlined/>} style={{width: 256}}>点击更换头像</Button>
                    </Upload>
                </Row>
            </Col>
            <Col span={10} style={{fontSize: 24}}>
                <Row>姓名：{localStorage.getItem('userName')}</Row>
                <Row>
                    <Col span={16} style={{fontSize: 24}}>电话：{tel}</Col>
                    <Col span={3}><Button onClick={onClickTel}>修改</Button></Col>
                </Row>
                <Row>
                    <Col span={16}>地址：{address}</Col>
                    <Col span={3}><Button onClick={onClickAddress}>修改</Button></Col>
                </Row>
            </Col>
        </Row>
        <Row>
            <Col style={{fontSize: 30}} push={0}>已借阅书籍</Col>
        </Row>
        <Row>
            <Col span={24} push={0} style={{minHeight: 300}}>
                <BookTable books={books} refreshBooks={fetchBooks}/>
            </Col>
        </Row>
        {/*超期书籍*/}
        <Row>
            <Col style={{fontSize: 30}} push={0}>超期罚款书籍</Col>
        </Row>
        <Row>
            <Col span={24} push={0} style={{minHeight: 300}}>
                <PayTable payments={payments} refreshPayments={fetchPayments}/>
            </Col>
        </Row>

    </>)
}