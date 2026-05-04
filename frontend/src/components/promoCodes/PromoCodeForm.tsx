import { Button, Form, Input, InputNumber, Select, Switch, Typography, message } from 'antd'
import type { PromoCodePayload, PromoCodeRecord, PromoDiscountType } from '../../types'

export interface PromoCodeFormValues {
  code: string
  description: string
  discountType: PromoDiscountType
  value: number
  minOrderAmount: number
  maxDiscountAmount?: number | null
  isActive: boolean
  perUserUsageLimit?: number | null
  startsAtLocal: string
  endsAtLocal: string
}

export const defaultPromoCodeFormValues: PromoCodeFormValues = {
  code: '',
  description: '',
  discountType: 'percent',
  value: 10,
  minOrderAmount: 0,
  maxDiscountAmount: undefined,
  isActive: true,
  perUserUsageLimit: undefined,
  startsAtLocal: '',
  endsAtLocal: '',
}

function localDatetimeToIso(local: string): string | null {
  if (!local?.trim()) return null
  const d = new Date(local)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

export function isoToLocalDatetime(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function recordToFormValues(record: PromoCodeRecord): PromoCodeFormValues {
  return {
    code: record.code,
    description: record.description ?? '',
    discountType: record.discountType,
    value: record.value,
    minOrderAmount: record.minOrderAmount ?? 0,
    maxDiscountAmount: record.maxDiscountAmount ?? undefined,
    isActive: record.isActive,
    perUserUsageLimit: record.perUserUsageLimit ?? record.usageLimit ?? undefined,
    startsAtLocal: isoToLocalDatetime(record.startsAt),
    endsAtLocal: isoToLocalDatetime(record.endsAt),
  }
}

export function formValuesToPayload(values: PromoCodeFormValues): PromoCodePayload {
  const maxDiscountAmount =
    values.discountType === 'percent' && values.maxDiscountAmount != null && Number(values.maxDiscountAmount) > 0
      ? Number(values.maxDiscountAmount)
      : null

  return {
    code: values.code.trim().toUpperCase(),
    description: (values.description ?? '').trim(),
    discountType: values.discountType,
    value: Number(values.value),
    minOrderAmount: Number(values.minOrderAmount ?? 0),
    maxDiscountAmount,
    isActive: Boolean(values.isActive),
    perUserUsageLimit:
      values.perUserUsageLimit === undefined || values.perUserUsageLimit === null
        ? null
        : Number(values.perUserUsageLimit),
    startsAt: localDatetimeToIso(values.startsAtLocal),
    endsAt: localDatetimeToIso(values.endsAtLocal),
  }
}

const discountTypeOptions: PromoDiscountType[] = ['percent', 'fixed']

interface PromoCodeFormProps {
  title: string
  submitLabel: string
  successMessage: string
  initialValues: PromoCodeFormValues
  onSubmit: (payload: PromoCodePayload) => Promise<void>
}

export function PromoCodeForm({ title, submitLabel, successMessage, initialValues, onSubmit }: PromoCodeFormProps) {
  const [form] = Form.useForm<PromoCodeFormValues>()
  const discountType = Form.useWatch('discountType', form) as PromoDiscountType | undefined

  async function handleFinish(values: PromoCodeFormValues) {
    try {
      await onSubmit(formValuesToPayload(values))
      message.success(successMessage)
    } catch (error) {
      message.error(error instanceof Error ? error.message : 'Submit failed.')
    }
  }

  return (
    <section className="create-user-panel" aria-labelledby="promo-code-form-title">
      <h2 id="promo-code-form-title">{title}</h2>

      <Form<PromoCodeFormValues>
        form={form}
        className="category-form"
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleFinish}
      >
        <div className="category-grid">
          <Form.Item
            label="Code"
            name="code"
            rules={[
              { required: true, message: 'Code is required.' },
              { min: 2, message: 'Code must be at least 2 characters.' },
            ]}
          >
            <Input placeholder="e.g. SUMMER10" style={{ textTransform: 'uppercase' }} />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input placeholder="Internal note or customer-facing text" />
          </Form.Item>

          <Form.Item label="Discount type" name="discountType" rules={[{ required: true }]}>
            <Select options={discountTypeOptions.map((t) => ({ label: t, value: t }))} />
          </Form.Item>

          <Form.Item
            label={discountType === 'fixed' ? 'Amount off ($)' : 'Percent off (%)'}
            name="value"
            rules={[
              { required: true, message: 'Value is required.' },
              {
                validator: async (_, v: number) => {
                  const n = Number(v)
                  if (!Number.isFinite(n) || n <= 0) throw new Error('Must be a positive number.')
                  if (discountType === 'percent' && n > 100) throw new Error('Percent cannot exceed 100.')
                },
              },
            ]}
          >
            <InputNumber<number> min={0.01} max={discountType === 'percent' ? 100 : undefined} className="full-width" />
          </Form.Item>

          <Form.Item
            label="Minimum order ($)"
            name="minOrderAmount"
            rules={[{ required: true, type: 'number', min: 0, message: 'Must be ≥ 0.' }]}
          >
            <InputNumber<number> min={0} className="full-width" />
          </Form.Item>

          {discountType === 'percent' ? (
            <Form.Item label="Max discount cap ($)" name="maxDiscountAmount" tooltip="Optional cap on percent discount">
              <InputNumber<number> min={0} className="full-width" placeholder="No cap" />
            </Form.Item>
          ) : (
            <div />
          )}

          <Form.Item label="Active" name="isActive" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item
            label="Số lần tối đa / tài khoản"
            name="perUserUsageLimit"
            tooltip="Mỗi user chỉ được áp mã thành công từng này lần. Để trống = không giới hạn theo user."
          >
            <InputNumber<number> min={1} precision={0} className="full-width" placeholder="Không giới hạn" />
          </Form.Item>

          <Form.Item label="Starts at (local)" name="startsAtLocal">
            <Input type="datetime-local" />
          </Form.Item>

          <Form.Item label="Ends at (local)" name="endsAtLocal">
            <Input type="datetime-local" />
          </Form.Item>
        </div>

        <Typography.Paragraph type="secondary" style={{ marginTop: 0 }}>
          Hệ thống đếm theo đơn hàng đã đặt (trừ đơn đã hủy). User khác vẫn dùng được cùng mã nếu còn lượt của họ.
        </Typography.Paragraph>

        <Form.Item className="create-user-submit">
          <Button type="primary" htmlType="submit">
            {submitLabel}
          </Button>
        </Form.Item>
      </Form>
    </section>
  )
}
