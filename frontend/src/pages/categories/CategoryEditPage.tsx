import { Spin, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { CategoryForm } from '../../components/categories/CategoryForm'
import { getCategoryById, updateCategory } from '../../services/categoriesApi'
import type { CategoryPayload } from '../../types'

export function CategoryEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [initialValues, setInitialValues] = useState<CategoryPayload | null>(null)

  useEffect(() => {
    async function loadCategory() {
      if (!id) {
        navigate('/admin/categories')
        return
      }

      try {
        setLoading(true)
        const result = await getCategoryById(id)
        setInitialValues({
          categoryCode: result.data.categoryCode,
          categoryName: result.data.categoryName,
          status: result.data.status,
          sortOrder: result.data.sortOrder,
        })
      } catch {
        message.error('Cannot load category.')
        navigate('/admin/categories')
      } finally {
        setLoading(false)
      }
    }

    loadCategory()
  }, [id, navigate])

  async function handleUpdate(payload: CategoryPayload) {
    if (!id) return
    await updateCategory(id, payload)
    navigate('/admin/categories')
  }

  return (
    <>
      <Breadcrumbs items={['Home', 'Management', 'Categories', 'Edit']} />
      {loading || !initialValues ? (
        <div className="loading-panel">
          <Spin />
        </div>
      ) : (
        <CategoryForm
          title="Update category"
          submitLabel="Save changes"
          successMessage="Category updated successfully."
          initialValues={initialValues}
          onSubmit={handleUpdate}
        />
      )}
    </>
  )
}
