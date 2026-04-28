import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { UserAddPage } from './pages/users/UserAddPage'
import { UsersListPage } from './pages/users/UsersListPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<UsersListPage />} />
        <Route path="/users/add" element={<UserAddPage />} />
      </Route>
    </Routes>
  )
}

export default App
