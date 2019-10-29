import React, { useContext } from 'react';
import { Form, InputNumber } from 'antd';
import { FormContext, RecordContext } from '../../../contexts';

const SiteYearField = () => {
  const form = useContext(FormContext);
  const site = useContext(RecordContext);
  const initialValue = site && site.year;

  return (
    <Form.Item label="Year">
      {form.getFieldDecorator('year', {
        initialValue,
        rules: [
          {
            pattern: /^\d{4}$/,
            message: 'Year does not match pattern YYYY',
          },
        ],
      })(<InputNumber />)}
    </Form.Item>
  );
};

export default SiteYearField;
