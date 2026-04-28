import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { CategoryTable } from '../../components/categories/CategoryTable'
import { deleteCategory, getCategories } from '../../services/categoriesApi'
import type { CategoryRecord } from '../../types'

export function CategoriesListPage() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<CategoryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true)
        const result = await getCategories()
        setRows(result.data)
      } finally {
        setLoading(false)
      }
    }

    loadCategories()
  }, [])

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deleteCategory(id)
      setRows((prev) => prev.filter((item) => item._id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <Breadcrumbs items={['Home', 'Management', 'Categories']} />
      <CategoryTable rows={rows} loading={loading} deletingId={deletingId} onEdit={(id) => navigate(`/admin/categories/${id}/edit`)} onDelete={handleDelete} />
    </>
  )
}
