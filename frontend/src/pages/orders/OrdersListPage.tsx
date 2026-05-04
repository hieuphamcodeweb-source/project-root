import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Breadcrumbs } from '../../components/common/Breadcrumbs'
import { OrderTable } from '../../components/orders/OrderTable'
import { getOrders, updateOrderStatus } from '../../services/ordersAdminApi'
import type { OrderRecord, OrderStatus } from '../../types'

export function OrdersListPage() {
  const navigate = useNavigate()
  const [rows, setRows] = useState<OrderRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true)
        const result = await getOrders()
        setRows(result.data)
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [])

  async function handleUpdateStatus(id: string, status: OrderStatus) {
    const result = await updateOrderStatus(id, status)
    setRows((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, status: result.data.status, updatedAt: result.data.updatedAt }
          : item
      )
    )
  }

  return (
    <>
      <Breadcrumbs items={['Trang chủ', 'Quản trị', 'Đơn hàng']} />
      <OrderTable rows={rows} loading={loading} onView={(id) => navigate(`/admin/orders/${id}`)} onChangeStatus={handleUpdateStatus} />
    </>
  )
}
