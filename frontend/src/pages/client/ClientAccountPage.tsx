import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Empty,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Spin,
  Switch,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, logout } from '../../services/auth'
import {
  createMyAddress,
  deleteMyAddress,
  fetchMyProfile,
  updateMyAddress,
  type MyProfile,
  type SavedAddress,
  type SavedAddressPayload,
} from '../../services/authApi'
import { VietnamProvinceWardFields } from '../../components/client/VietnamProvinceWardFields'
import { formatAddressLines } from '../../utils/addressFormat'
import { resolveVnAddressCodes } from '../../utils/resolveVnAddressCodes'
import { getProvinces, getWardsByProvince } from 'vn-provinces-wards'

function roleLabel(role: string) {
  if (role === 'Admin') return 'Administrator'
  if (role === 'Staff') return 'Staff'
  if (role === 'Member') return 'Member'
  if (role === 'User') return 'Customer'
  return role
}

function statusTag(status: string) {
  const color =
    status === 'active' ? 'green' : status === 'pending' ? 'gold' : status === 'banned' ? 'red' : 'default'
  return <Tag color={color}>{status}</Tag>
}

function formatDate(value?: string) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString()
}

type AddressModalMode = 'create' | 'edit'

type AddressModalFormValues = SavedAddressPayload & {
  isDefault?: boolean
  provinceCode?: string
  wardCode?: string
}

export function ClientAccountPage() {
  const navigate = useNavigate()
  const sessionUser = getCurrentUser()
  const [profile, setProfile] = useState<MyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [addressModalOpen, setAddressModalOpen] = useState(false)
  const [addressModalMode, setAddressModalMode] = useState<AddressModalMode>('create')
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addressSubmitting, setAddressSubmitting] = useState(false)
  const [form] = Form.useForm<AddressModalFormValues>()

  const loadProfile = useCallback(async () => {
    const data = await fetchMyProfile()
    setProfile(data)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        await loadProfile()
      } catch (e) {
        if (!cancelled) {
          message.error(e instanceof Error ? e.message : 'Could not load profile.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [loadProfile])

  function openCreateAddress() {
    setAddressModalMode('create')
    setEditingAddressId(null)
    setAddressModalOpen(true)
    // Modal uses destroyOnHidden: Form is unmounted while closed — init fields after it mounts.
    window.setTimeout(() => {
      form.resetFields()
      form.setFieldsValue({
        label: '',
        recipientName: '',
        phone: '',
        street: '',
        provinceCode: undefined,
        wardCode: undefined,
        isDefault: !(profile?.addresses?.length),
      })
    }, 0)
  }

  function openEditAddress(addr: SavedAddress) {
    setAddressModalMode('edit')
    setEditingAddressId(addr.id)
    const codes = resolveVnAddressCodes(addr)
    setAddressModalOpen(true)
    window.setTimeout(() => {
      form.setFieldsValue({
        label: addr.label,
        recipientName: addr.recipientName,
        phone: addr.phone,
        street: addr.street,
        provinceCode: codes.provinceCode,
        wardCode: codes.wardCode,
        isDefault: addr.isDefault,
      })
    }, 0)
  }

  async function submitAddressModal() {
    try {
      const values = await form.validateFields()
      setAddressSubmitting(true)

      const provinces = getProvinces()
      const prov = provinces.find((p) => p.code === values.provinceCode)
      const wards = values.provinceCode ? getWardsByProvince(values.provinceCode) : []
      const w = wards.find((x) => x.code === values.wardCode)
      if (!prov || !w) {
        message.error('Please select a valid province and ward.')
        setAddressSubmitting(false)
        return
      }

      const payload: SavedAddressPayload = {
        label: values.label,
        recipientName: values.recipientName,
        phone: values.phone,
        street: values.street,
        ward: w.full_name || w.name,
        district: '',
        province: prov.name,
        isDefault: values.isDefault,
      }

      if (addressModalMode === 'create') {
        await createMyAddress(payload)
        message.success('Address saved.')
      } else if (editingAddressId) {
        await updateMyAddress(editingAddressId, payload)
        message.success('Address updated.')
      }

      setAddressModalOpen(false)
      await loadProfile()
    } catch (e) {
      if (e && typeof e === 'object' && 'errorFields' in e) return
      message.error(e instanceof Error ? e.message : 'Could not save address.')
    } finally {
      setAddressSubmitting(false)
    }
  }

  async function handleDeleteAddress(id: string) {
    Modal.confirm({
      title: 'Remove this address?',
      okText: 'Remove',
      okType: 'danger',
      onOk: async () => {
        try {
          const next = await deleteMyAddress(id)
          message.success('Address removed.')
          setProfile((prev) => (prev ? { ...prev, addresses: next } : prev))
        } catch (e) {
          message.error(e instanceof Error ? e.message : 'Could not remove address.')
        }
      },
    })
  }

  function handleLogout() {
    logout()
    message.success('You have been logged out.')
    navigate('/client/products', { replace: true })
  }

  const addresses = profile?.addresses ?? []

  return (
    <div className="client-account-page">
      <div className="client-account-hero">
        <Typography.Title level={2} style={{ margin: 0 }}>
          My account
        </Typography.Title>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 0, maxWidth: 640 }}>
          Manage your profile and saved shipping addresses. Use an address at checkout (cart or buy now).
        </Typography.Paragraph>
      </div>

      <Row gutter={[24, 24]} className="client-account-grid">
        <Col xs={24} lg={7}>
          <Card className="client-account-side-card" loading={loading}>
            {!loading && profile ? (
              <>
                <div className="client-account-avatar-ring">
                  <span aria-hidden>{(sessionUser?.username ?? profile.username).slice(0, 2).toUpperCase()}</span>
                </div>
                <Typography.Title level={4} className="client-account-side-name">
                  {sessionUser?.username ?? profile.username}
                </Typography.Title>
                <Space wrap size={[4, 4]}>
                  <Tag>ID #{profile.id}</Tag>
                  {sessionUser?.role === 'admin' ? <Tag color="purple">Admin session</Tag> : <Tag color="blue">Customer</Tag>}
                </Space>
                <Divider style={{ margin: '16px 0' }} />
                <Space orientation="vertical" style={{ width: '100%' }} size="small">
                  <Button block onClick={() => navigate('/client/products')}>
                    Continue shopping
                  </Button>
                  <Button block danger type="primary" onClick={handleLogout}>
                    Log out
                  </Button>
                </Space>
              </>
            ) : null}
          </Card>
        </Col>

        <Col xs={24} lg={17}>
          <Card className="client-account-main-card">
            {loading ? (
              <div className="client-account-loading">
                <Spin size="large" />
              </div>
            ) : (
              <Tabs
                className="client-account-tabs"
                defaultActiveKey="profile"
                items={[
                  {
                    key: 'profile',
                    label: 'Profile',
                    children: profile ? (
                      <Descriptions
                        bordered
                        column={1}
                        size="middle"
                        layout="horizontal"
                        className="client-account-descriptions"
                        styles={{
                          label: {
                            width: 200,
                            minWidth: 160,
                            maxWidth: '42%',
                            whiteSpace: 'normal',
                            verticalAlign: 'top',
                          },
                          content: {
                            minWidth: 0,
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            verticalAlign: 'top',
                          },
                        }}
                      >
                        <Descriptions.Item key="username" label="Username">
                          {profile.username}
                        </Descriptions.Item>
                        <Descriptions.Item key="displayName" label="Display name">
                          {sessionUser?.fullName ?? '—'}
                        </Descriptions.Item>
                        <Descriptions.Item key="role" label="Account role">
                          {roleLabel(profile.role)}
                        </Descriptions.Item>
                        <Descriptions.Item key="status" label="Status">
                          {statusTag(profile.status)}
                        </Descriptions.Item>
                        <Descriptions.Item key="registered" label="Registered on">
                          {profile.dateRegistered}
                        </Descriptions.Item>
                        <Descriptions.Item key="created" label="Record created">
                          {formatDate(profile.createdAt)}
                        </Descriptions.Item>
                        <Descriptions.Item key="updated" label="Last updated">
                          {formatDate(profile.updatedAt)}
                        </Descriptions.Item>
                      </Descriptions>
                    ) : null,
                  },
                  {
                    key: 'addresses',
                    label: (
                      <span key="tab-shipping-label">
                        Shipping addresses
                        {addresses.length > 0 ? (
                          <Badge count={addresses.length} style={{ marginLeft: 8 }} color="#1677ff" />
                        ) : null}
                      </span>
                    ),
                    children: (
                      <div className="client-account-addresses">
                        <div className="client-account-addresses-toolbar">
                          <Typography.Text type="secondary">
                            These addresses appear when you check out. Mark one as default for a quicker selection.
                          </Typography.Text>
                          <Button type="primary" onClick={openCreateAddress}>
                            Add address
                          </Button>
                        </div>

                        {addresses.length === 0 ? (
                          <Empty description="No saved addresses yet." image={Empty.PRESENTED_IMAGE_SIMPLE}>
                            <Button type="primary" onClick={openCreateAddress}>
                              Add your first address
                            </Button>
                          </Empty>
                        ) : (
                          <div className="client-address-card-list">
                            {addresses.map((addr) => (
                              <Card
                                key={addr.id}
                                size="small"
                                className="client-address-card"
                                title={(
                                  <Space>
                                    <span>{addr.label?.trim() || addr.recipientName}</span>
                                    {addr.isDefault ? <Tag color="blue">Default</Tag> : null}
                                  </Space>
                                )}
                                extra={(
                                  <Space>
                                    <Button size="small" onClick={() => openEditAddress(addr)}>
                                      Edit
                                    </Button>
                                    <Button size="small" danger onClick={() => void handleDeleteAddress(addr.id)}>
                                      Delete
                                    </Button>
                                  </Space>
                                )}
                              >
                                <Typography.Paragraph strong style={{ marginBottom: 4 }}>
                                  {addr.recipientName} · {addr.phone}
                                </Typography.Paragraph>
                                <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                                  {formatAddressLines(addr)}
                                </Typography.Paragraph>
                              </Card>
                            ))}
                          </div>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Modal
        title={addressModalMode === 'create' ? 'Add shipping address' : 'Edit shipping address'}
        open={addressModalOpen}
        onCancel={() => setAddressModalOpen(false)}
        onOk={() => void submitAddressModal()}
        confirmLoading={addressSubmitting}
        destroyOnHidden
        width={640}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
          <Form.Item name="label" label="Label (optional)">
            <Input placeholder="e.g. Home, Office" maxLength={80} />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="recipientName" label="Recipient name" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="Full name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Phone" rules={[{ required: true, message: 'Required' }]}>
                <Input placeholder="Phone number" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="street" label="Street / number" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="House number, street" />
          </Form.Item>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 8, fontSize: 13 }}>
            Pick province, then ward (data: vn-provinces-wards).
          </Typography.Paragraph>
          <VietnamProvinceWardFields form={form} />
          <Form.Item name="isDefault" label="Default address" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
