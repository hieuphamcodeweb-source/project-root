import { useNavigate } from 'react-router-dom'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { CategoryForm } from '../../components/categories/CategoryForm'
import { createCategory } from '../../services/categoriesApi'
import type { CategoryPayload } from '../../types'

export function CategoryAddPage() {
  const navigate = useNavigate()

  async function handleCreate(payload: CategoryPayload) {
    await createCategory(payload)
    navigate('/admin/categories')
  }

  return (
    <>
      <Breadcrumbs items={['Home', 'Management', 'Categories', 'Add']} />
      <CategoryForm
        title="Create category"
        submitLabel="Add category"
        successMessage="Category created successfully."
        initialValues={{
          categoryCode: '',
          categoryName: '',
          status: 'active',
          sortOrder: 0,
        }}
        onSubmit={handleCreate}
      />
    </>
  )
}
