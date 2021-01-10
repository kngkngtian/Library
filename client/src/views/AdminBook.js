import {Empty, Input, Radio, Table, Button, Row, Col, Modal, Form, Select,} from 'antd'
import {useEffect, useState, useCallback, useRef} from 'react'
import {getSearchBook, addBook, editBook, getPageBook, deleteBook, getClass} from '../api/book'
import Swal from "sweetalert2";
import {AppstoreAddOutlined} from "@ant-design/icons";

const {Option} = Select

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
        {props.books.length ?
            <Table dataSource={props.books} style={{width: '100%'}} rowKey="bookId" pagination={props.paginationProps}>
                <Column title={"书号"} dataIndex={"bookId"}/>
                <Column title={"书名"} dataIndex={"bookName"}/>
                <Column title={"分类"} dataIndex={"bookClass"}/>
                <Column title={"作者"} dataIndex={"bookAuthor"}/>
                <Column title={"出版社"} dataIndex={"bookPress"}/>
                <Column title={"余量/总量"} render={(i, r) => (<span>{`${r.bookAllowance}/${r.bookTotal}`}</span>)}
                />
                <Column title={"操作"} key={(i, r) => r.bookId + r.bookName}
                        render={(i, r) => {
                            const handleApply = async () => {
                                props.onClickEditButton(i)
                            }
                            const handleDelete = async () => {
                                props.onClickDeleteButton(i)
                            }
                            return (
                                <>
                                    {/*<Button style={{marginRight: 20}} onClick={handleDetail}>详细信息</Button>*/}
                                    <Button onClick={handleApply}>编辑书籍</Button>
                                    <Button onClick={handleDelete} danger style={{marginLeft: '10px'}}>删除</Button>
                                </>)
                        }}/>
            </Table> : <Empty style={{width: '100%'}} description={<span>没有查找到数据</span>}/>}</>)
}

// function BookAdd(props) {
//     return (<>
//
//     </>)
// }


export default function AdminBook() {
    const [books, setBooks] = useState([])
    const [radio, setRadio] = useState('')
    const [value, setValue] = useState('')
    const [total, setTotal] = useState(0)
    const [cur, setCur] = useState(1)
    const [addVisible, setAddVisible] = useState(false)
    useEffect(() => {
        document.title = '书籍管理'
    }, [])
    const [bookAllowance, setBookAllowance] = useState(0)
    const [bookTotal, setBookTotal] = useState(0)
    const search = useCallback(async () => {
        const res = await getSearchBook(radio, value, cur)
        fetchClass()
        if (res.data.status === 200) {
            setBooks(res.data.data.data)
            setTotal(res.data.data.total)
            setBookAllowance(res.data.data.bookAllowance)
            setBookTotal(res.data.data.bookTotal)
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

    const form = useRef(null)


    const onAddSubmit = async (values) => {
        const res = await addBook({bookAllowance: values.bookTotal, ...values}).catch({status: 500})
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
        const res = await editBook(values).catch({status: 500})
        if (res.status === 200 && res.data.status === 200) {
            Swal.fire({
                title: '添加成功',
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
    const onClickDeleteButton = async (i) => {
        if (i.bookAllowance !== i.bookTotal) {
            Swal.fire({
                title: '未全部归还',
                text: '请等待全部归还后删除本书籍',
                icon: 'error',
                showConfirmButton: true
            })
        } else {
            const {isConfirmed} = await Swal.fire({
                title: `确定要删除 - ${i.bookName}`,
                icon: 'question',
                showConfirmButton: true,
                showCancelButton: true
            })
            if (isConfirmed) {
                let res = await deleteBook(i.bookId)
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

    const [className, setClassName] = useState([])
    const fetchClass = async () => {
        const res = await getClass()
        if (res.data.status === 200) {
            setClassName(res.data.data)
        }
    }
    const [options, setOptions] = useState([])
    useEffect(() => {
        const option = className.map(d => <Option key={d.className}>{d.className}</Option>)
        setOptions(option)
    }, [className])

    function onChange(value) {
        form.current.setFieldsValue({bookClass: value})
    }

    return (
        <>
            <Row style={{alignItems: 'center', justifyContent: 'center', display: "flex", flexWrap: "warp"}}>
                <BookSearch handleSearch={handleSearch}/>
            </Row>
            <Row style={{marginTop: 60, justifyContent: 'flex-end'}}>
                <Button type="primary" shape="round" icon={<AppstoreAddOutlined/>} onClick={onClickAddButton}
                        size={"large"}>
                    添加书籍
                </Button>
            </Row>
            <Row style={{marginTop: 20}}>
                <Col span={24}>
                    <BookSearchTable books={books} reSearch={search} onClickEditButton={onClickEditButton}
                                     paginationProps={paginationProps} onClickDeleteButton={onClickDeleteButton}/>
                </Col>
            </Row>
            <Modal visible={addVisible}
                   destroyOnClose
                   footer={null}
                   onCancel={() => {
                       setAddVisible(false)
                       Modal.destroyAll()
                   }}
                   title={<span style={{fontWeight: "bold", fontSize: "24px", lineHeight: '24px'}}>添加书籍📕</span>}>
                <Form
                    ref={form}
                    labelCol={{span: 4}}
                    wrapperCol={{span: 14}}
                    layout="horizontal"
                    initialValues={{size: "large"}}
                    size={"large"}
                    onFinish={onAddSubmit}
                    name={"addbook"}

                >
                    <Form.Item label="书号" name={"bookId"}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="书名" name={"bookName"}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="分类" name="bookClass">
                        <Select
                            showSearch
                            style={{}}
                            placeholder="选择或创建一个分类"
                            optionFilterProp="children"
                            onChange={onChange}
                            filterOption={(input, option) =>
                                option.children.indexOf(input) >= 0
                            }
                        >
                            {options}
                        </Select>,
                    </Form.Item>
                    <Form.Item label="出版商" name={"bookPress"}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="作者" name={"bookAuthor"}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="价格" name={"bookMoney"}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="总量" name={"bookTotal"}>
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
                       }}>编辑书籍🖊</span>}>
                <Form
                    ref={form}
                    labelCol={{span: 4}}
                    wrapperCol={{span: 14}}
                    layout="horizontal"
                    initialValues={initValue}
                    size={"large"}
                    onFinish={onEditSubmit}
                    name={"editbook"}

                >
                    <Form.Item label="书号" name={"bookId"}>
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item label="书名" name={"bookName"}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="分类" name="bookClass">
                        <Select
                            showSearch
                            style={{}}
                            placeholder="选择或创建一个分类"
                            optionFilterProp="children"
                            onChange={onChange}
                            filterOption={(input, option) =>
                                option.children.indexOf(input) >= 0
                            }
                        >
                            {options}
                        </Select>
                    </Form.Item>
                    <Form.Item label="出版商" name={"bookPress"}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="作者" name={"bookAuthor"}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label="总量" name={"bookTotal"}>
                        <Input/>
                    </Form.Item>

                    <Form.Item style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

        </>
    )
}
