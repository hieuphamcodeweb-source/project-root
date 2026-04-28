import { Button, Form, Input, InputNumber, Select, message } from 'antd'
import type { CategoryPayload, CategoryStatus } from '../../types'

interface CategoryFormProps {
  title: string
  submitLabel: string
  successMessage: string
  initialValues: CategoryPayload
  onSubmit: (payload: CategoryPayload) => Promise<void>
}

const statusOptions: CategoryStatus[] = ['active', 'inactive', 'draft']

export function CategoryForm({ title, submitLabel, successMessage, initialValues, onSubmit }: CategoryFormProps) {
  const [form] = Form.useForm<CategoryPayload>()

  async function handleFinish(values: CategoryPayload) {
    try {
      await onSubmit(values)
      message.success(successMessage)
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Submit category failed.')
    }
  }

  return (
    <section className="create-user-panel" aria-labelledby="category-form-title">
      <h2 id="category-form-title">{title}</h2>

      <Form<CategoryPayload> form={form} className="category-form" layout="vertical" initialValues={initialValues} onFinish={handleFinish}>
        <div className="category-grid">
          <Form.Item
            label="Category code"
            name="categoryCode"
            rules={[
              { required: true, message: 'Category code is required.' },
              { min: 2, message: 'Category code must have at least 2 characters.' },
            ]}
          >
            <Input placeholder="e.g. CAT-001" />
          </Form.Item>

          <Form.Item
            label="Category name"
            name="categoryName"
            rules={[
              { required: true, message: 'Category name is required.' },
              { min: 2, message: 'Category name must have at least 2 characters.' },
            ]}
          >
            <Input placeholder="e.g. Electronics" />
          </Form.Item>

          <Form.Item<CategoryPayload> label="Status" name="status" rules={[{ required: true, message: 'Status is required.' }]}>
            <Select options={statusOptions.map((status) => ({ label: status, value: status }))} />
          </Form.Item>

          <Form.Item<CategoryPayload>
            label="Sort order"
            name="sortOrder"
            rules={[
              { required: true, message: 'Sort order is required.' },
              { type: 'number', min: 0, message: 'Sort order must be non-negative.' },
              {
                validator: async (_, value: number) => {
                  if (!Number.isInteger(value)) {
                    throw new Error('Sort order must be an integer.')
                  }
                },
              },
            ]}
          >
            <InputNumber<number> min={0} precision={0} className="full-width" />
          </Form.Item>
        </div>

        <Form.Item className="create-user-submit">
          <Button type="primary" htmlType="submit">
            {submitLabel}
          </Button>
        </Form.Item>
      </Form>
    </section>
  )
}
