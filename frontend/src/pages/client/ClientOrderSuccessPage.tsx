import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

export function ClientOrderSuccessPage() {
  const navigate = useNavigate()

  return (
    <section className="client-order-success-page">
      <Result
        status="success"
        title="Chuc mung ban da mua hang thanh cong!"
        subTitle="Don hang COD cua ban da duoc ghi nhan. Chung toi se lien he xac nhan trong som nhat."
        extra={[
          <Button key="products" onClick={() => navigate('/client/products')}>
            Tiep tuc mua sam
          </Button>,
          <Button key="cart" type="primary" onClick={() => navigate('/client/cart', { state: { refreshAt: Date.now() } })}>
            Xem gio hang
          </Button>,
        ]}
      />
    </section>
  )
}
