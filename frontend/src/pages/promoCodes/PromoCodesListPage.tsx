import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { PromoCodeTable } from '../../components/promoCodes/PromoCodeTable'
import { deletePromoCode, getPromoCodes } from '../../services/promoCodesApi'
import type { PromoCodeRecord } from '../../types'

export function PromoCodesListPage() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<PromoCodeRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const result = await getPromoCodes()
        setRows(result.data)
      } finally {
        setLoading(false)
      }
    }

    void load()
  }, [])

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      await deletePromoCode(id)
      setRows((prev) => prev.filter((item) => item._id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <Breadcrumbs items={['Home', 'Management', 'Promo codes']} />
      <PromoCodeTable
        rows={rows}
        loading={loading}
        deletingId={deletingId}
        onAdd={() => navigate('/admin/promo-codes/add')}
        onEdit={(id) => navigate(`/admin/promo-codes/${id}/edit`)}
        onDelete={handleDelete}
      />
    </>
  )
}
