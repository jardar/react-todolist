import { useForm } from "react-hook-form";
import { useAuth } from './AuthProvider'
import { useNavigate, Link } from 'react-router-dom'
import { MySwal } from './SweatDlg'

function Regist() {
    const { user, setUser } = useAuth()
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "onBlur"
    });
    const onSubmit = data => {
        console.log(data);
        if (data.password !== data.password2) {
            // alert("pass mismatch")
            MySwal.fire({
                icon: 'error',
                title: '密碼不一致，請重試',
            })
            return
        }

        const API = "https://todoo.5xcamp.us/users";
        const body = JSON.stringify({
            user: data
        });
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body
        };
        let isErr = false

        fetch(API, requestOptions)
            .then(response => {
                if (response.ok) {

                    setUser({ uname: data.nickname, token: response.headers.get("authorization") })
                } else {
                    isErr = true
                }
                return response.json();
            })
            .then(responseJson => {
                // {
                //   "message": "註冊成功",
                //   "email": "bb@cc.cc",
                //   "nickname": "bbcccc"
                // }
                // authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzMTM5Iiwic2NwIjoidXNlciIsImF1ZCI6bnVsbCwiaWF0IjoxNjYxNDEyMzg0LCJleHAiOjE2NjI3MDgzODQsImp0aSI6ImRlZmQwNDczLTY2NmEtNDRiMy1hOWNiLTExMjk2ZDI3MTc3NSJ9.1ae2Mjy4bfQhxLKlCbFr6XmXOEYxpAxRi5-VYVomNI8 
                // 錯誤也會跑到這裏
                console.log(responseJson)
                // alert(responseJson.message)
                if (isErr) {
                    MySwal.fire({
                        title: responseJson.message,
                        text: responseJson.error?.[0] || '請重試'
                    })
                } else {
                    console.dir(user)
                    // setUser((pre) => ({ ...user, uname: responseJson.nickname }))
                    console.dir(user)
                    navigate('/todolist')
                }

            })
            .catch((error) => {
                //{
                //   "message": "註冊發生錯誤",
                //   "error": [
                //     "電子信箱 格式有誤"
                //   ]
                // }

                console.log(error);
                // alert(error)
                MySwal.fire({
                    title: error?.message || '錯誤',
                })

            });
    }

    return (
        <div id="signUpPage" className="bg-yellow">
            <div className="conatiner signUpPage vhContainer">
                <div className="side">
                    <Link to="/">
                        <img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt="" />

                    </Link>
                    <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg" />
                </div>
                <div>
                    <form className="formControls" onSubmit={handleSubmit(onSubmit)} >
                        <h2 className="formControls_txt">註冊帳號</h2>
                        <label className="formControls_label" htmlFor="email">Email</label>
                        <input className="formControls_input"
                            type="email"
                            id="email"
                            placeholder="請輸入 email"
                            {...register("email", {
                                required: { value: true, message: "此欄位必填寫" },
                                pattern: {
                                    value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
                                    message: "不符合 Email 規則"
                                }
                            })}
                        />

                        <div className="form-errmsg"> {errors.email?.message}</div>

                        <label className="formControls_label" htmlFor="name">您的暱稱</label>
                        <input className="formControls_input"
                            type="text"
                            name="name"
                            id="name"
                            placeholder="請輸入您的暱稱"
                            {...register("nickname", {
                                required: { value: true, message: "此欄位必填寫" },
                                maxLength: { value: 12, message: "至多為 12 字元" }
                            })}
                        />
                        <div className="form-errmsg"> {errors.nickname?.message}</div>

                        <label className="formControls_label" htmlFor="pwd">密碼</label>
                        <input className="formControls_input"
                            type="password"
                            id="pwd"
                            placeholder="請輸入密碼"
                            {...register("password", {
                                required: { value: true, message: "此欄位必填寫" },
                                minLength: { value: 8, message: "密碼至少為 8 碼" }
                            })}
                        />
                        <div className="form-errmsg"> {errors.password?.message}</div>
                        <label className="formControls_label" htmlFor="pwd">再次輸入密碼</label>
                        <input className="formControls_input"
                            type="password"
                            id="pwd2"
                            placeholder="請再次輸入密碼"
                            {...register("password2", {
                                required: { value: true, message: "此欄位必填寫" },
                                minLength: { value: 8, message: "密碼至少為 8 碼" }
                            })}
                        />
                        <div className="form-errmsg"> {errors.password2?.message}</div>
                        <input className="formControls_btnSubmit" type="submit" value="註冊帳號" />

                        <Link className="formControls_btnLink" to="/">登入</Link>
                    </form>
                </div>
            </div>

        </div>
    )
}

export default Regist