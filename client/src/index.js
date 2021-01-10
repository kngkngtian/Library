import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.min.css'
import {BrowserRouter, Route, Redirect, Switch} from "react-router-dom";
// import App from './App';
import Login from './views/Login'
import LibraryLayout from "./views/LibraryLayout";

// function MyRedirect(prop) {
//     switch (localStorage.getItem('role')) {
//         case 'user':
//             return localStorage.getItem('cardId') ? <Redirect to={'/user/book'}/> : null
//         case 'admin':
//             return localStorage.getItem('cardId') ? <Redirect to={'/admin/sub'}/> : null
//         default:
//             return <Redirect to={'/login'}/>
//     }
// }

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path={"/login"} component={Login}/>
            <Route path={"/"} component={LibraryLayout}>
                {/*<MyRedirect/>*/}
            </Route>
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
