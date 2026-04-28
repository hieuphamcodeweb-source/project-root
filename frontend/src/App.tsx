import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { ProductAddPage } from './pages/products/ProductAddPage'
import { ProductDetailPage } from './pages/products/ProductDetailPage'
import { ProductEditPage } from './pages/products/ProductEditPage'
import { ProductsListPage } from './pages/products/ProductsListPage'
import { UserAddPage } from './pages/users/UserAddPage'
import { UserEditPage } from './pages/users/UserEditPage'
import { UsersListPage } from './pages/users/UsersListPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<UsersListPage />} />
        <Route path="/users/add" element={<UserAddPage />} />
        <Route path="/users/:id/edit" element={<UserEditPage />} />
        <Route path="/products" element={<ProductsListPage />} />
        <Route path="/products/add" element={<ProductAddPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/products/:id/edit" element={<ProductEditPage />} />
      </Route>
    </Routes>
  )
}

export default App
