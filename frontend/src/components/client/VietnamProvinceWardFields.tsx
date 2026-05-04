import { Form, Select, type FormInstance } from 'antd'
import { useMemo } from 'react'
import { getProvinces, getWardsByProvince } from 'vn-provinces-wards'

interface VietnamProvinceWardFieldsProps {
  form: FormInstance
}

export function VietnamProvinceWardFields({ form }: VietnamProvinceWardFieldsProps) {
  const provinces = useMemo(() => getProvinces(), [])
  const provinceCode = Form.useWatch('provinceCode', form) as string | undefined

  const wardOptions = useMemo(() => {
    if (!provinceCode) return []
    return getWardsByProvince(provinceCode).map((w) => ({
      key: w.code,
      value: w.code,
      label: w.full_name || w.name,
    }))
  }, [provinceCode])

  return (
    <>
      <Form.Item
        name="provinceCode"
        label="Province / city"
        rules={[{ required: true, message: 'Select a province or centrally governed city.' }]}
      >
        <Select
          showSearch
          allowClear
          placeholder="Select province or city"
          optionFilterProp="label"
          options={provinces.map((p) => ({
            key: p.code,
            value: p.code,
            label: `${p.name} (${p.unit})`,
          }))}
          onChange={() => {
            form.setFieldsValue({ wardCode: undefined })
          }}
        />
      </Form.Item>
      <Form.Item
        name="wardCode"
        label="Ward / commune"
        rules={[{ required: true, message: 'Select a ward or commune.' }]}
      >
        <Select
          showSearch
          allowClear
          placeholder={provinceCode ? 'Select ward or commune' : 'Select province first'}
          disabled={!provinceCode}
          optionFilterProp="label"
          options={wardOptions}
        />
      </Form.Item>
    </>
  )
}
