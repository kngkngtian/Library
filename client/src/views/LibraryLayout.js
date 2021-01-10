import {Menu} from "antd";
import Layout, {Content, Footer, Header} from "antd/es/layout/layout";
import {Link, Route, Switch as Switcher} from 'react-router-dom'
import './Layout.css'
import UserInfo from './UserInfo'
import UserBook from './UserBook'
import {useState} from "react";
import AdminSub from './AdminSub'
import AdminBook from "./AdminBook";
import AdminUser from "./AdminUser";
import AdminBorrow from "./AdminBorrow";

const onLogout = () => {
    localStorage.clear()
}

function UserMenu(props) {
    const [cur, setCur] = useState(1)
    const whenClick = (e) => {
        setCur(e.key)
    }
    return (<Menu theme="dark" mode="horizontal" defaultSelectedKeys={[cur]} onClick={whenClick}>
        <Menu.Item key="1">
            <Link to={"/user/info"}>用户信息</Link>
        </Menu.Item>
        <Menu.Item key="2">
            <Link to={"/user/book"}>书籍查阅</Link>
        </Menu.Item>
        <Menu.Item key="3">
            <Link to={"/login"} onClick={onLogout}>退出</Link>
        </Menu.Item>
    </Menu>)
}

function AdminMenu(props) {
    const [cur, setCur] = useState('1')
    const whenClick = (e) => {
        setCur(e.key)
    }
    return (<Menu theme="dark" mode="horizontal" defaultSelectedKeys={[cur]} onClick={whenClick}>
        <Menu.Item key="1">
            <Link to={"/admin/sub"}>借阅管理</Link>
        </Menu.Item>
        <Menu.Item key="2">
            <Link to={"/admin/book"}>书籍管理</Link>
        </Menu.Item>
        <Menu.Item key="3">
            <Link to={"/admin/user"}>用户管理</Link>
        </Menu.Item>
        <Menu.Item key="4">
            <Link to={"/admin/borrow"}>借阅信息</Link>
        </Menu.Item>
        <Menu.Item key="5">
            <Link to={"/login"} onClick={onLogout}>退出</Link>
        </Menu.Item>
    </Menu>)
}

function ChekRole() {
    if (localStorage.getItem('role') === 'user') return <Route path={'/user'}>
        <Route exact path={"/user/info"} component={UserInfo}/>
        <Route exact path={"/user/book"} component={UserBook}/>
    </Route>
    else if (localStorage.getItem('role') === 'admin') return <Route path={'/admin'}>
        <Route exact path={"/admin/sub"} component={AdminSub}/>
        <Route exact path={"/admin/book"} component={AdminBook}/>
        <Route exact path={"/admin/user"} component={AdminUser}/>
        <Route exact path={"/admin/borrow"} component={AdminBorrow}/>
    </Route>
}


export default function LibraryLayout(props) {
    return (
        <Layout>
            <Header className="header">
                <div className="logo">📙📖📚</div>
                {localStorage.getItem('role') === 'user' ? <UserMenu/> : <AdminMenu/>}
            </Header>
            <Content
                className={"full"}
                style={{
                    paddingLeft: 30,
                    paddingRight: 30,
                    marginTop: 30,
                    width: '80%',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}>
                <Switcher>
                    <Switcher>
                        <ChekRole/>
                    </Switcher>
                </Switcher>
            </Content>

            <Footer style={{marginTop: 30}}>UPC图书借阅管理系统 Made By React Antd</Footer>
        </Layout>
    )
}