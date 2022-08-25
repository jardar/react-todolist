
import { useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { useNavigate, Link } from 'react-router-dom';
import { MySwal } from './SweatDlg'

const ToDoListStatistics = function ({ filter, todos = [], cleanDone }) {

    return (
        <div className="todoList_statistics">
            <p> {filter === 2 ? todos.filter(item => item.done).length + ' 個已完成' : todos.filter(item => !item.done).length + ' 個待完成'} 項目</p>
            <button className="btn-link" type="button" onClick={(e) => cleanDone()}>
                清除已完成項目
            </button>
        </div>
    );
};
const ToDoListItem = function ({ todo, toggleDone, deleteTodo }) {
    const { id, done, data } = todo;

    return (
        <>
            <label className="todoList_label">
                <input className="todoList_input" type="checkbox" checked={done} onChange={e => toggleDone(id)} />
                <span>{data}</span>
            </label>
            <button type="button" className="btn-link todoList_delbtn" onClick={e => deleteTodo(id)}>
                <i className="fa fa-times"></i>
            </button>
        </>
    );
};

const ToDoListItems = function ({ todos, setTodos, filter }) {
    const { user } = useAuth()
    // console.log(todos)
    const cleanDone = function () {
        console.log('Do Clean done')
        todos.forEach(item => {
            if (!item.done) {
                return
            }
            deleteTodo(item.id)
        })
        // setTodos((prev) => prev.filter(item => item.done === false))
    }
    const deleteTodo = function (id) {
        console.log(`delete todo =${id}`)
        const _url = `https://todoo.5xcamp.us/todos/${id}`;
        let isErr = false
        fetch(_url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': user.token
            }
        })
            .then(res => {
                console.log(res)
                isErr = !res.ok

                return res.json()
            })
            .then(res => {
                console.log(res)
                if (isErr) {
                    MySwal.fire({
                        icon: 'error',
                        title: res?.message || '錯誤',
                    })
                } else {
                    setTodos((prev) => prev.filter(item => item.id !== id))
                    MySwal.fire({
                        position: 'top',
                        title: '成功刪除',
                        showConfirmButton: false,
                        timer: 1500
                    })
                }
            })
            .catch((error) => {

                console.log(error);
                // alert(error)
                MySwal.fire({
                    icon: 'error',
                    title: error?.message || '錯誤',
                })
            });

    }


    const toggleDone = function (id) {
        // console.log(`DO toggleDone id=${id}`)
        // console.log('toggle done of setTodos()')
        // const found = todos.find(item => item.id === id)
        // if (found) {
        //     console.log(`found id=${found.id}`)
        //     found.done = !found.done
        // }
        // console.log(todos)

        // setTodos([...todos])


        console.log('toggle done of setTodos()')
        const _url = `https://todoo.5xcamp.us/todos/${id}/toggle`;
        let isErr = false
        fetch(_url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'authorization': user.token
            }
        })
            .then(res => {
                console.log(res)
                isErr = !res.ok

                return res.json()
            })
            .then(res => {
                //{
                //   "id": "9c4cab24d9b0e80e4372ddb2ef67bff2",
                //   "content": "job1",
                //   "completed_at": null //or date string
                // }
                console.log(res)
                if (isErr) {
                    MySwal.fire({
                        icon: 'error',
                        title: res?.message || '錯誤',
                    })
                } else {
                    setTodos((prev) => {
                        const found = prev.find(item => item.id === id)
                        if (found) {
                            console.log(`found id=${found.id}`)
                            found.done = !found.done
                        }
                        console.log(prev)
                        return [...prev]
                    })
                }
            })
            .catch((error) => {

                console.log(error);
                // alert(error)
                MySwal.fire({
                    icon: 'error',
                    title: error?.message || '錯誤',
                })
            });
    }

    let rows = []
    if (filter === 1) {
        rows = todos.filter(item => item.done === false)
    } else if (filter === 2) {
        rows = todos.filter(item => item.done === true)
    } else {
        rows = [...todos]
    }

    return (
        <div className="todoList_items">
            <ul className="todoList_item">
                {rows.map((item) => {
                    return <li key={item.id}><ToDoListItem todo={item} toggleDone={toggleDone} deleteTodo={deleteTodo} /></li>
                })}
            </ul>
            <ToDoListStatistics filter={filter} todos={todos} cleanDone={cleanDone} />
        </div>
    );
};

const EmptyItems = function () {
    return (
        <div className="empty_items">

            <h3 className="todoList_empty_items">目前尚無代辦事項</h3>
            <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg"></img>
        </div>
    )
}

const ToDoList = function ({ todos, setTodos }) {
    const [filter, setFilter] = useState(0) // 0: all , 1: to be done , 2: done

    return (
        <div className="todoList_list">
            {
                todos.length > 0 ?
                    <div>
                        <ul className="todoList_tab">
                            <li>
                                <button type="button" className={filter === 0 ? "active" : ""} onClick={e => setFilter(0)}>
                                    全部
                                </button>
                            </li>
                            <li>
                                <button type="button" className={filter === 1 ? "active" : ""} onClick={e => setFilter(1)}>待完成</button>
                            </li>
                            <li>
                                <button type="button" className={filter === 2 ? "active" : ""} onClick={e => setFilter(2)}>已完成</button>
                            </li>
                        </ul>
                        <ToDoListItems todos={todos} setTodos={setTodos} filter={filter} />
                    </div>
                    : <EmptyItems />}


        </div>
    );
};

const InputBox = function ({ handleAdd }) {
    // version 2 , put private logic here
    const [todo, setTodo] = useState('')
    const onAddClick = function (e) {
        if (todo === '') {
            return
        }
        handleAdd(todo)
        setTodo('')
    }

    return (
        <div className="inputBox">
            <input type="text" placeholder="請輸入待辦事項" value={todo} onChange={e => setTodo(e.target.value)} />
            <button type="button" onClick={onAddClick} >
                <i className="fa fa-plus"></i>
            </button>
        </div>
    )
}

function TodoListPage() {
    // {
    //     "id": "9c4cab24d9b0e80e4372ddb2ef67bff2",
    //     "content": "job1",
    //     "completed_at": null // "2022-08-25T16:41:02.457+08:00"
    //   }
    const [todos, setTodos] = useState([
        // { id: 1, done: true, data: "把冰箱發霉的檸檬拿去丟啦" },
        // { id: 2, done: false, data: "打電話叫媽媽匯款給我" },
        // { id: 3, done: false, data: "整理電腦資料夾" },
        // { id: 4, done: false, data: "繳電費水費瓦斯費" },
        // { id: 5, done: false, data: "約vicky禮拜三泡溫泉" },
        // { id: 6, done: false, data: "約ada禮拜四吃晚餐" },

    ])

    const { user, setUser } = useAuth()
    const navigate = useNavigate()

    const handleAdd = function (todo) {

        const _url = "https://todoo.5xcamp.us/todos";
        let isErr = false

        fetch(_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': user.token
            },
            body: JSON.stringify({
                todo: {
                    content: todo
                }
            })

        })
            .then(res => {
                isErr = !res.ok
                return res.json()
            })
            .then(res => {
                //{
                //   "id": "9c4cab24d9b0e80e4372ddb2ef67bff2",
                //   "content": "job1"
                // }
                console.log(res)
                if (isErr) {
                    MySwal.fire({
                        icon: 'error',
                        title: res?.message || '錯誤',
                    })
                } else {
                    setTodos(prev => [...prev, { id: res.id, data: res.content, done: false }])
                }
            })
            .catch((error) => {

                console.log(error);
                // alert(error)
                MySwal.fire({
                    icon: 'error',
                    title: error?.message || '錯誤',
                })
            });
    }


    const handleLogout = (e) => {
        e.preventDefault()

        const _url = "https://todoo.5xcamp.us/users/sign_out";
        let isErr = false

        fetch(_url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': user.token
            }
        })
            .then(res => {
                isErr = !res.ok
                return res.json()
            })
            .then(res => {
                console.log(res)
                if (isErr) {
                    MySwal.fire({
                        position: 'top',
                        title: '遠端登出 失敗',
                        showConfirmButton: false,
                        timer: 1500
                    })
                } else {

                }

            })
            .catch((error) => {
                MySwal.fire({
                    position: 'top',
                    title: '遠端登出 失敗',
                    showConfirmButton: false,
                    timer: 1500
                })
            })
            .finally(() => {
                setUser(null)
                navigate('/')
            })

    }

    const getTodos = () => {
        const _url = "https://todoo.5xcamp.us/todos";
        let isErr = false
        fetch(_url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authorization': user.token
            }
        })
            .then(res => {
                isErr = !res.ok
                return res.json()
            })
            .then(res => {
                console.log(res)
                if (isErr) {
                    MySwal.fire({
                        icon: 'error',
                        title: res?.message || '錯誤',
                    })
                } else {
                    const updateTodos = res.todos.map(item => {
                        return {
                            ...item,
                            done: item.completed_at ? true : false,
                            data: item.content
                        }
                    })
                    setTodos(updateTodos)
                }
            })
    }

    useEffect(() => {
        getTodos()
    }, [])

    return (
        <div className="bg-half">
            <nav>
                <h1>
                    <Link to="/todolist">ONLINE TODO LIST</Link>
                </h1>
                <ul className="info-grid">
                    <li className="todo_sm"><Link to="/todolist"><span>{user?.uname} 的代辦</span></Link></li>

                    <li><button className="btn-logout" type="button" onClick={handleLogout}>登出</button> </li>
                </ul>
            </nav>
            <div className="conatiner todoListPage vhContainer">
                <div className="todoList_Content">
                    <InputBox handleAdd={handleAdd} />
                    <ToDoList todos={todos} setTodos={setTodos} />
                </div>
            </div>
        </div >
    );

}

export default TodoListPage