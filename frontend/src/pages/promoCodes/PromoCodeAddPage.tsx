import { useNavigate } from 'react-router-dom'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { PromoCodeForm, defaultPromoCodeFormValues } from '../../components/promoCodes/PromoCodeForm'
import { createPromoCode } from '../../services/promoCodesApi'
import type { PromoCodePayload } from '../../types'

export function PromoCodeAddPage() {
  const navigate = useNavigate()

  async function handleCreate(payload: PromoCodePayload) {
    await createPromoCode(payload)
    navigate('/admin/promo-codes')
  }

  return (
    <>
      <Breadcrumbs items={['Home', 'Management', 'Promo codes', 'Add']} />
      <PromoCodeForm
        title="Create promo code"
        submitLabel="Create"
        successMessage="Promo code created."
        initialValues={defaultPromoCodeFormValues}
        onSubmit={handleCreate}
      />
    </>
  )
}
