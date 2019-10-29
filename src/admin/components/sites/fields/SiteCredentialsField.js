import React, { useContext, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Form, Select } from 'antd';
import { FormContext, RecordContext } from '../../../contexts';
import { getRecordById } from '../../../utils';

const filterOption = (inputValue, { props: { login } }) => {
  return login.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1;
};

const SiteCredentialsField = () => {
  const form = useContext(FormContext);
  const site = useContext(RecordContext);
  const credentials = useSelector(state => state.credentials);
  const id = site && site.id;

  const initialValue = useMemo(() => {
    if (!id) {
      return [];
    }

    return credentials.list.filter(credential => credential.siteIds.includes(id)).map(credential => credential.id);
  }, [credentials.list, id]);

  useEffect(() => {
    if (!id) {
      return;
    }

    const credentialIds = form.getFieldValue('credentialIds');
    const filteredCredentialIds = credentialIds.filter(id => getRecordById(credentials.list, id));

    if (credentialIds.length !== filteredCredentialIds.length) {
      form.setFieldsValue({
        credentialIds: filteredCredentialIds,
      });
    }
  }, [form, credentials.list, id]);

  return (
    <Form.Item label="Credentials" extra="Only for sites on the same domain">
      {form.getFieldDecorator('credentialIds', {
        initialValue,
      })(
        <Select mode="multiple" filterOption={filterOption} allowClear>
          {credentials.list.map(({ id, login }) => (
            <Select.Option key={id} value={id} login={login}>
              {login}
            </Select.Option>
          ))}
        </Select>
      )}
    </Form.Item>
  );
};

export default SiteCredentialsField;
