import React, { useContext, useMemo } from 'react';
import { Form } from 'antd';
import { FormContext, RecordContext } from '../../../contexts';
import RandomInput from '../../common/RandomInput';
import { getRandomPassword } from '../../../utils';

const CredentialPasswordField = () => {
  const form = useContext(FormContext);
  const credential = useContext(RecordContext);
  const password = credential && credential.password;
  const initialValue = useMemo(() => password || getRandomPassword(), [password]);

  return (
    <Form.Item label="Password">
      {form.getFieldDecorator('password', {
        initialValue,
        rules: [
          {
            required: true,
            message: 'Password is required',
          },
          {
            whitespace: true,
            message: 'Password cannot be empty',
          },
        ],
      })(<RandomInput name="password" getValue={getRandomPassword} />)}
    </Form.Item>
  );
};

export default CredentialPasswordField;
