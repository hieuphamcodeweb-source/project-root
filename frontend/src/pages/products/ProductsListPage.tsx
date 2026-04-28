import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { ProductTable } from '../../components/products/ProductTable'
import { deleteProduct, getProducts } from '../../services/productsApi'
import type { ProductRecord } from '../../types'

export function ProductsListPage() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<ProductRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true)
        const result = await getProducts()
        setRows(result.data)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deleteProduct(id)
      setRows((prev) => prev.filter((item) => item._id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <Breadcrumbs items={['Home', 'Management', 'Products']} />
      <ProductTable
        rows={rows}
        loading={loading}
        deletingId={deletingId}
        onView={(id) => navigate(`/products/${id}`)}
        onEdit={(id) => navigate(`/products/${id}/edit`)}
        onDelete={handleDelete}
      />
    </>
  )
}
