import { useNavigate } from 'react-router-dom'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { ProductForm } from '../../components/products/ProductForm'
import { createProduct } from '../../services/productsApi'
import type { ProductPayload } from '../../types'

export function ProductAddPage() {
  const navigate = useNavigate()

  async function handleCreate(payload: ProductPayload) {
    await createProduct(payload)
    navigate('/products')
  }

  return (
    <>
      <Breadcrumbs items={['Home', 'Management', 'Products', 'Add']} />
      <ProductForm
        title="Create product"
        submitLabel="Add product"
        successMessage="Product created successfully."
        initialValues={{
          name: '',
          sku: '',
          category: '',
          price: 0,
          stock: 0,
          status: 'active',
          thumbnailUrl: '',
          galleryUrls: [],
        }}
        onSubmit={handleCreate}
      />
    </>
  )
}
