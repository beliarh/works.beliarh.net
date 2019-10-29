import React, { useContext } from 'react';
import { Form, Switch } from 'antd';
import { FormContext, RecordContext } from '../../../contexts';

const SitePublicField = () => {
  const form = useContext(FormContext);
  const site = useContext(RecordContext);
  const initialValue = site && site.public;

  return (
    <Form.Item label="Public">
      {form.getFieldDecorator('public', {
        initialValue,
        valuePropName: 'checked',
      })(<Switch />)}
    </Form.Item>
  );
};

export default SitePublicField;
