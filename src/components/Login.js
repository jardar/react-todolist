import { useForm } from "react-hook-form";
import { useAuth } from './AuthProvider'
import { useNavigate, Link } from 'react-router-dom'
import { MySwal } from './SweatDlg'

function Login() {
    // {
    //   "message": "登入成功",
    //   "email": "aa@bb.cc",
    //   "nickname": "aabbcc"
    // }
    // Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzMTM4Iiwic2NwIjoidXNlciIsImF1ZCI6bnVsbCwiaWF0IjoxNjYxNDEyNDQ0LCJleHAiOjE2NjI3MDg0NDQsImp0aSI6ImM1YjUxMmQ4LTg0ZWUtNGM0OS1hNGRjLTQyM2RmNzk1YWZjZiJ9.I9G743y1wvx1Y5Avv0z6m1vhtJ-4xoy4x8eENYgOip4 

    const { setUser } = useAuth()
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "onBlur"
    });
    const onSubmit = data => {
        console.log(data);


        const API = "https://todoo.5xcamp.us/users/sign_in";
        const body = JSON.stringify({
            user: data
        });
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body
        };
        let isErr = false
        let token = ''
        fetch(API, requestOptions)
            .then(response => {
                console.dir(response)
                if (response.ok) {
                    token = response.headers.get("authorization")
                } else {
                    isErr = true
                }

                return response.json();
            })
            .then(responseJson => {
                // 錯誤也會跑到這裏
                console.dir(responseJson)
                // alert(responseJson.message)
                if (isErr) {
                    MySwal.fire({
                        icon: 'error',
                        title: responseJson.message,
                    })
                } else {
                    setUser({ uname: responseJson.nickname, token: token })
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
                MySwal.fire({
                    icon: 'error',
                    title: error?.message || '錯誤',
                })
            });
    }



    return (
        <div className="bg-yellow">
            <div className="conatiner loginPage vhContainer ">
                <div className="side">
                    <Link to="/">
                        <img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt="" />
                    </Link>
                    <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg" />
                </div>
                <div>
                    <form className="formControls" onSubmit={handleSubmit(onSubmit)} >
                        <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>
                        <label className="formControls_label" htmlFor="email">Email</label>
                        <input className="formControls_input"
                            type="text"
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

                        <label className="formControls_label" htmlFor="pwd">密碼</label>
                        <input className="formControls_input"
                            type="password"
                            name="pwd"
                            id="pwd"
                            placeholder="請輸入密碼"
                            {...register("password", {
                                required: { value: true, message: "此欄位必填寫" },
                                // minLength: { value: 8, message: "密碼至少為 8 碼" }
                            })}
                        />
                        <div className="form-errmsg"> {errors.password?.message}</div>

                        <input className="formControls_btnSubmit" type="submit" value="登入" />
                        <Link className="formControls_btnLink" to="/reg">註冊帳號</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login