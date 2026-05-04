import { Alert, Select, Typography } from 'antd'
import { Link } from 'react-router-dom'
import type { SavedAddress } from '../../services/authApi'
import { formatAddressLines } from '../../utils/addressFormat'

interface ShippingAddressPickerProps {
  addresses: SavedAddress[]
  loading?: boolean
  value: string | null
  onChange: (id: string) => void
}

export function ShippingAddressPicker({ addresses, loading, value, onChange }: ShippingAddressPickerProps) {
  if (!addresses.length) {
    return (
      <Alert
        type="warning"
        showIcon
        title="Add a shipping address"
        description={(
          <>
            <Typography.Paragraph style={{ marginBottom: 8 }}>
              Save at least one address in My account before you can place a COD order.
            </Typography.Paragraph>
            <Link to="/client/account">Open My account</Link>
          </>
        )}
      />
    )
  }

  return (
    <div className="client-shipping-picker">
      <Typography.Text strong className="client-shipping-picker-label">
        Ship to
      </Typography.Text>
      <Select
        className="client-shipping-select"
        loading={loading}
        placeholder="Choose delivery address"
        value={value ?? undefined}
        onChange={onChange}
        options={addresses.map((a) => ({
          value: a.id,
          label: (
            <div className="client-shipping-option">
              <div className="client-shipping-option-title">
                <strong>{a.recipientName}</strong>
                {a.isDefault ? <span className="client-shipping-default-badge">Default</span> : null}
              </div>
              <div className="client-shipping-option-sub">{a.phone}</div>
              <div className="client-shipping-option-sub">{formatAddressLines(a)}</div>
            </div>
          ),
        }))}
      />
    </div>
  )
}
