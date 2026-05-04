import { Spin, message } from 'antd'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { PromoCodeForm, recordToFormValues, type PromoCodeFormValues } from '../../components/promoCodes/PromoCodeForm'
import { getPromoCodeById, updatePromoCode } from '../../services/promoCodesApi'
import type { PromoCodePayload } from '../../types'

export function PromoCodeEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [initialValues, setInitialValues] = useState<PromoCodeFormValues | null>(null)

  useEffect(() => {
    async function load() {
      if (!id) {
        navigate('/admin/promo-codes')
        return
      }

      try {
        setLoading(true)
        const result = await getPromoCodeById(id)
        setInitialValues(recordToFormValues(result.data))
      } catch {
        message.error('Cannot load promo code.')
        navigate('/admin/promo-codes')
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [id, navigate])

  async function handleUpdate(payload: PromoCodePayload) {
    if (!id) return
    await updatePromoCode(id, payload)
    navigate('/admin/promo-codes')
  }

  return (
    <>
      <Breadcrumbs items={['Home', 'Management', 'Promo codes', 'Edit']} />
      {loading || !initialValues ? (
        <div className="loading-panel">
          <Spin />
        </div>
      ) : (
        <PromoCodeForm
          key={id}
          title="Edit promo code"
          submitLabel="Save changes"
          successMessage="Promo code updated."
          initialValues={initialValues}
          onSubmit={handleUpdate}
        />
      )}
    </>
  )
}
