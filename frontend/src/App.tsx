import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'
import { ClientLayout } from './components/layout/ClientLayout'
import { LoginPage } from './pages/auth/LoginPage'
import { RegisterPage } from './pages/auth/RegisterPage'
import { CategoryAddPage } from './pages/categories/CategoryAddPage'
import { CategoriesListPage } from './pages/categories/CategoriesListPage'
import { CategoryEditPage } from './pages/categories/CategoryEditPage'
import { ClientProductDetailPage } from './pages/client/ClientProductDetailPage'
import { ClientCartPage } from './pages/client/ClientCartPage'
import { ClientOrderSuccessPage } from './pages/client/ClientOrderSuccessPage'
import { ClientProductsPage } from './pages/client/ClientProductsPage'
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
      <Route path="/" element={<Navigate to="/client/products" replace />} />
      <Route path="/client" element={<ClientLayout />}>
        <Route path="products" element={<ClientProductsPage />} />
        <Route path="products/:id" element={<ClientProductDetailPage />} />
        <Route path="cart" element={<ClientCartPage />} />
        <Route path="order-success" element={<ClientOrderSuccessPage />} />
      </Route>
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin/register" element={<RegisterPage />} />

      <Route
        path="/admin"
        element={(
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        )}
      >
        <Route index element={<Navigate to="/admin/users" replace />} />
        <Route path="users" element={<UsersListPage />} />
        <Route path="users/add" element={<UserAddPage />} />
        <Route path="users/:id/edit" element={<UserEditPage />} />
        <Route path="products" element={<ProductsListPage />} />
        <Route path="products/add" element={<ProductAddPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="products/:id/edit" element={<ProductEditPage />} />
        <Route path="categories" element={<CategoriesListPage />} />
        <Route path="categories/add" element={<CategoryAddPage />} />
        <Route path="categories/:id/edit" element={<CategoryEditPage />} />
      </Route>
    </Routes>
  )
}

export default App
