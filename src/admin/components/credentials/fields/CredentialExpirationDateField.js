import moment from 'moment';
import React, { useContext, useMemo } from 'react';
import { Form, DatePicker } from 'antd';
import { FormContext, RecordContext } from '../../../contexts';

const CredentialExpirationDateField = () => {
  const form = useContext(FormContext);
  const credential = useContext(RecordContext);
  const expirationDate = credential && credential.expirationDate;

  const initialValue = useMemo(() => {
    return expirationDate ? moment(expirationDate) : moment().add(14, 'days');
  }, [expirationDate]);

  return (
    <Form.Item label="Expiration date">
      {form.getFieldDecorator('expirationDate', {
        initialValue,
        rules: [
          {
            required: true,
            message: 'Expiration date is required',
          },
        ],
      })(<DatePicker placeholder="" />)}
    </Form.Item>
  );
};

export default CredentialExpirationDateField;
