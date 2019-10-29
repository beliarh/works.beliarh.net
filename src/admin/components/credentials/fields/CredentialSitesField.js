import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Select } from 'antd';
import { FormContext, RecordContext } from '../../../contexts';
import { getRecordById } from '../../../utils';

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
  const id = credential && credential.id;
  const initialValue = (credential && credential.siteIds) || [];

  useEffect(() => {
    if (!id) {
      return;
    }

    const siteIds = form.getFieldValue('siteIds');
    const filteredSiteIds = siteIds.filter(id => getRecordById(sites.list, id));

    if (siteIds.length !== filteredSiteIds.length) {
      form.setFieldsValue({
        siteIds: filteredSiteIds,
      });
    }
  }, [form, sites.list, id]);

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
