import './Login.css'
import anime from 'animejs'
import {useState, useCallback, useRef, useEffect} from 'react'
import {notification,} from "antd";
import {postLogin} from "../api/login";

export default function Login(props) {
    let current = null;
    const [info, setInfo] = useState({
        username: '',
        password: '',
    })
    const history = props.history
    const cur = useRef(null)
    const focusme = useRef(null)
    const submit = useRef(null)
    useEffect(() => {
        document.title = '登录'
        focusme.current.focus()
    },[])


    const onSub = useCallback(async () => {
        let res = await postLogin(info)
        if (res.data.status === 200) {
            if (res.data.role === 'user') {
                notification.open({
                    message: "用户登陆成功🎉",
                    description:
                        '即将自动跳转到首页',
                    placement: "topRight",
                })
                localStorage.setItem("userName", res.data.userName)
                localStorage.setItem("userId", res.data.userId)
                localStorage.setItem("cardId", res.data.cardId)
                localStorage.setItem("role", res.data.role)
                history.push('/user/info')
            } else {
                notification.open({
                    message: "管理员登陆成功🎉",
                    description:
                        '即将自动跳转到首页',
                    placement: "topRight",
                })
                localStorage.setItem("cardId", res.data.cardId)
                localStorage.setItem('role', res.data.role)
                history.push('/admin/sub')
            }
        } else {
            notification.open({
                message: "登陆失败🤦‍♂",
                description:
                    '账号或密码错误',
                placement: "topRight"
            })
            cur.current.focus()
        }
    }, [info, history])

    return (
        <div className="bodyf" onKeyUp={(e) => {
            if (e.code === 'Enter') {
                submit.current.focus()
                submit.current.click()
            }
        }}>
            <div className="page">
                <div className="container">
                    <div className="left">
                        <div className="login">图书馆📚</div>
                        <div className="eula">请使用借阅卡登录，若没有借阅卡请前往管理员处申请🤝。
                        </div>
                    </div>
                    <div className="right">
                        <svg viewBox="0 0 320 300" className="svgf pathf">
                            <defs>
                                <linearGradient
                                    inkscapecollect="always"
                                    id="linearGradient"
                                    x1="13"
                                    y1="193.49992"
                                    x2="307"
                                    y2="193.49992"
                                    gradientUnits="userSpaceOnUse">
                                    <stop
                                        style={{'stopColor': '#ff00ff'}}
                                        offset="0"
                                        id="stop876"/>
                                    <stop
                                        style={{'stopColor': '#ff0000'}}
                                        offset="1"
                                        id="stop878"/>
                                </linearGradient>
                            </defs>
                            <path
                                d="m 40,120.00016 239.99984,-3.2e-4 c 0,0 24.99263,0.79932 25.00016,35.00016 0.008,34.20084 -25.00016,35 -25.00016,35 h -239.99984 c 0,-0.0205 -25,4.01348 -25,38.5 0,34.48652 25,38.5 25,38.5 h 215 c 0,0 20,-0.99604 20,-25 0,-24.00396 -20,-25 -20,-25 h -190 c 0,0 -20,1.71033 -20,25 0,24.00396 20,25 20,25 h 168.57143"/>
                        </svg>
                        <div className="form">
                            <label htmlFor="username" className={"labelf"}>Username</label>
                            <input
                                ref={focusme}
                                className={"inputf"} type="username" id="username"
                                onFocus={(e) => {
                                    if (current) current.pause();
                                    current = anime({
                                        targets: 'path',
                                        strokeDashoffset: {
                                            value: 0,
                                            duration: 700,
                                            easing: 'easeOutQuart'
                                        },
                                        strokeDasharray: {
                                            value: '240 1386',
                                            duration: 700,
                                            easing: 'easeOutQuart'
                                        }
                                    });
                                }}
                                value={info.username}
                                onChange={(e) => {
                                    setInfo({
                                        ...info,
                                        username: e.target.value
                                    })
                                }}/>
                            <label htmlFor="password" className={"labelf"}>Password</label>
                            <input
                                ref={cur}
                                className={"inputf"} type="password" id="password"
                                onFocus={(e) => {
                                    if (current) current.pause();
                                    current = anime({
                                        targets: 'path',
                                        strokeDashoffset: {
                                            value: -336,
                                            duration: 700,
                                            easing: 'easeOutQuart'
                                        },
                                        strokeDasharray: {
                                            value: '240 1386',
                                            duration: 700,
                                            easing: 'easeOutQuart'
                                        }
                                    });
                                }}
                                onChange={(e) => setInfo({
                                    ...info,
                                    password: e.target.value
                                })}
                                value={info.password}
                            />
                            <input
                                ref={submit}
                                className={"inputf"}
                                type="submit" id="submit" value="Submit"
                                onFocus={(e) => {
                                    if (current) current.pause();
                                    current = anime({
                                        targets: 'path',
                                        strokeDashoffset: {
                                            value: -730,
                                            duration: 700,
                                            easing: 'easeOutQuart'
                                        },
                                        strokeDasharray: {
                                            value: '530 1386',
                                            duration: 700,
                                            easing: 'easeOutQuart'
                                        }
                                    });
                                }}
                                onClick={onSub}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

