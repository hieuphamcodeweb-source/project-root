import { Button, Result, Typography } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

export function ClientOrderSuccessPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const orderCode = (location.state as { orderCode?: string } | null)?.orderCode

  return (
    <section className="client-order-success-page">
      <Result
        status="success"
        title="Đặt hàng thành công!"
        subTitle={
          <div>
            <Typography.Paragraph style={{ marginBottom: 8 }}>
              Đơn COD của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.
            </Typography.Paragraph>
            {orderCode ? (
              <Typography.Paragraph strong style={{ marginBottom: 0 }}>
                Mã đơn hàng: <Typography.Text code>{orderCode}</Typography.Text>
              </Typography.Paragraph>
            ) : null}
          </div>
        }
        extra={[
          <Button key="products" onClick={() => navigate('/client/products')}>
            Tiếp tục mua sắm
          </Button>,
          <Button key="cart" type="primary" onClick={() => navigate('/client/cart', { state: { refreshAt: Date.now() } })}>
            Xem giỏ hàng
          </Button>,
        ]}
      />
    </section>
  )
}
