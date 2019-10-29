import React, { useContext } from 'react';
import { Form, Input } from 'antd';
import { FormContext, RecordContext } from '../../../contexts';

const SiteDescriptionField = () => {
  const form = useContext(FormContext);
  const site = useContext(RecordContext);
  const initialValue = site && site.description;

  return (
    <Form.Item label="Description">
      {form.getFieldDecorator('description', {
        initialValue,
      })(<Input.TextArea autoSize={{ minRows: 2, maxRows: 10 }} />)}
    </Form.Item>
  );
};

export default SiteDescriptionField;
