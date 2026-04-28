import { Spin, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { ProductForm } from '../../components/products/ProductForm'
import { getProductById, updateProduct } from '../../services/productsApi'
import type { ProductPayload } from '../../types'

export function ProductEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [initialValues, setInitialValues] = useState<ProductPayload | null>(null)

  useEffect(() => {
    async function loadProduct() {
      if (!id) {
        navigate('/products')
        return
      }

      try {
        setLoading(true)
        const result = await getProductById(id)
        setInitialValues({
          name: result.data.name,
          sku: result.data.sku,
          category: result.data.category,
          price: result.data.price,
          stock: result.data.stock,
          status: result.data.status,
          thumbnailUrl: result.data.thumbnailUrl,
          galleryUrls: result.data.galleryUrls ?? [],
        })
      } catch {
        message.error('Cannot load product.')
        navigate('/products')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [id, navigate])

  async function handleUpdate(payload: ProductPayload) {
    if (!id) return
    await updateProduct(id, payload)
    navigate('/products')
  }

  return (
    <>
      <Breadcrumbs items={['Home', 'Management', 'Products', 'Edit']} />
      {loading || !initialValues ? (
        <div className="loading-panel">
          <Spin />
        </div>
      ) : (
        <ProductForm
          title="Update product"
          submitLabel="Save changes"
          successMessage="Product updated successfully."
          initialValues={initialValues}
          onSubmit={handleUpdate}
        />
      )}
    </>
  )
}
