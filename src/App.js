
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider, RequireAuth } from './components/AuthProvider'
import Login from './components/Login';
import Regist from './components/Regist';
import TodoList from './components/TodoList';

function App() {

  return (
    <AuthProvider>

      <h1>Auth Example123</h1>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="reg" element={<Regist />} />
        <Route
          path="/todolist"
          element={
            <RequireAuth>
              <TodoList />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

    </AuthProvider>
  );
}
function NotFound() {
  return <h1>找不到網頁</h1>
}

export default App;
