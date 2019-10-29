import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Form, Select } from 'antd';
import { FormContext, RecordContext } from '../../../contexts';

const filterOption = (inputValue, { props: { name } }) => {
  inputValue = inputValue.trim().toLowerCase();

  if (!inputValue) {
    return false;
  }

  return name.toLowerCase().indexOf(inputValue) !== -1;
};

const CredentialSitesField = () => {
  const form = useContext(FormContext);
  const credential = useContext(RecordContext);
  const sites = useSelector(state => state.sites);
  const initialValue = (credential && credential.siteIds) || [];

  return (
    <Form.Item label="Sites" extra="Only for sites on the same domain">
      {form.getFieldDecorator('siteIds', {
        initialValue,
      })(
        <Select mode="multiple" filterOption={filterOption} allowClear>
          {sites.list.map(({ id, name }) => (
            <Select.Option key={id} value={id} name={name}>
              {name}
            </Select.Option>
          ))}
        </Select>
      )}
    </Form.Item>
  );
};

export default CredentialSitesField;
