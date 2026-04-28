import { Button, Form, Image, Input, InputNumber, Select, Space, message } from 'antd'
import type { ProductPayload, ProductStatus } from '../../types'

interface ProductFormProps {
  title: string
  submitLabel: string
  initialValues: ProductPayload
  onSubmit: (payload: ProductPayload) => Promise<void>
  successMessage: string
}

const statusOptions: ProductStatus[] = ['active', 'inactive', 'draft']
const imageUrlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i

export function ProductForm({ title, submitLabel, initialValues, onSubmit, successMessage }: ProductFormProps) {
  const [form] = Form.useForm<ProductPayload>()

  const thumbnailUrl = Form.useWatch('thumbnailUrl', form)
  const galleryUrls = Form.useWatch('galleryUrls', form) ?? []

  async function handleFinish(values: ProductPayload) {
    try {
      await onSubmit({
        ...values,
        galleryUrls: (values.galleryUrls ?? []).filter(Boolean),
      })
      message.success(successMessage)
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Submit product failed.')
    }
  }

  return (
    <section className="create-user-panel" aria-labelledby="product-form-title">
      <h2 id="product-form-title">{title}</h2>

      <Form<ProductPayload> form={form} className="product-form" layout="vertical" initialValues={initialValues} onFinish={handleFinish}>
        <div className="product-grid">
          <Form.Item
            name="name"
            label="Product name"
            rules={[
              { required: true, message: 'Product name is required.' },
              { min: 2, message: 'Product name must have at least 2 characters.' },
            ]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>

          <Form.Item
            name="sku"
            label="SKU"
            rules={[
              { required: true, message: 'SKU is required.' },
              { min: 2, message: 'SKU must have at least 2 characters.' },
            ]}
          >
            <Input placeholder="e.g. PRD-001" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[
              { required: true, message: 'Category is required.' },
              { min: 2, message: 'Category must have at least 2 characters.' },
            ]}
          >
            <Input placeholder="e.g. Electronics" />
          </Form.Item>

          <Form.Item<ProductPayload> name="status" label="Status" rules={[{ required: true, message: 'Status is required.' }]}>
            <Select options={statusOptions.map((status) => ({ label: status, value: status }))} />
          </Form.Item>

          <Form.Item<ProductPayload>
            name="price"
            label="Price"
            rules={[
              { required: true, message: 'Price is required.' },
              { type: 'number', min: 0, message: 'Price must be non-negative.' },
            ]}
          >
            <InputNumber<number> min={0} precision={2} className="full-width" />
          </Form.Item>

          <Form.Item<ProductPayload>
            name="stock"
            label="Stock quantity"
            rules={[
              { required: true, message: 'Stock is required.' },
              { type: 'number', min: 0, message: 'Stock must be non-negative.' },
              {
                validator: async (_, value: number) => {
                  if (!Number.isInteger(value)) {
                    throw new Error('Stock must be an integer.')
                  }
                },
              },
            ]}
          >
            <InputNumber<number> min={0} precision={0} className="full-width" />
          </Form.Item>
        </div>

        <Form.Item
          name="thumbnailUrl"
          label="Thumbnail image URL"
          rules={[
            { required: true, message: 'Thumbnail URL is required.' },
            { pattern: imageUrlRegex, message: 'Thumbnail URL must be a valid image URL.' },
          ]}
        >
          <Input placeholder="https://example.com/thumbnail.jpg" />
        </Form.Item>

        {thumbnailUrl && imageUrlRegex.test(thumbnailUrl) ? (
          <div className="preview-row">
            <p>Thumbnail preview</p>
            <Image width={120} height={120} src={thumbnailUrl} alt="Thumbnail preview" className="image-preview" />
          </div>
        ) : null}

        <Form.List name="galleryUrls">
          {(fields, { add, remove }) => (
            <div className="gallery-list">
              <div className="gallery-header">
                <h3>Gallery image URLs</h3>
                <Button type="dashed" onClick={() => add('')}>
                  Add image URL
                </Button>
              </div>

              {fields.map((field, index) => (
                <Space key={field.key} align="baseline" className="gallery-item">
                  <Form.Item
                    {...field}
                    label={`Gallery URL #${index + 1}`}
                    rules={[{ pattern: imageUrlRegex, message: 'Must be a valid image URL.' }]}
                    className="gallery-input-item"
                  >
                    <Input placeholder="https://example.com/image.jpg" />
                  </Form.Item>
                  <Button danger onClick={() => remove(field.name)}>
                    Remove
                  </Button>
                </Space>
              ))}
            </div>
          )}
        </Form.List>

        {Array.isArray(galleryUrls) && galleryUrls.filter((url: string) => imageUrlRegex.test(url)).length > 0 ? (
          <div className="preview-row">
            <p>Gallery preview</p>
            <div className="gallery-preview">
              {galleryUrls
                .filter((url: string) => imageUrlRegex.test(url))
                .map((url: string) => (
                  <Image key={url} width={90} height={90} src={url} alt="Gallery preview" className="image-preview" />
                ))}
            </div>
          </div>
        ) : null}

        <Form.Item className="create-user-submit">
          <Button type="primary" htmlType="submit">
            {submitLabel}
          </Button>
        </Form.Item>
      </Form>
    </section>
  )
}
