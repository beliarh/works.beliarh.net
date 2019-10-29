import React, { useCallback, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Form } from 'antd';
import useUniqueValidator from '../../../hooks/useUniqueValidator';
import { FormContext, RecordContext } from '../../../contexts';
import RandomInput from '../../common/RandomInput';
import { getRandomLogin } from '../../../utils';

const CredentialLoginField = () => {
  const form = useContext(FormContext);
  const credential = useContext(RecordContext);
  const credentials = useSelector(state => state.credentials);
  const login = credential && credential.login;
  const uniqueValidator = useUniqueValidator(credentials.list, credential && credential.id, 'login');

  const getValue = useCallback(() => {
    const excludedLogins = credentials.list.map(credential => credential.login);

    return getRandomLogin(excludedLogins);
  }, [credentials.list]);

  const initialValue = useMemo(() => login || getValue(), [login, getValue]);

  return (
    <Form.Item label="Login">
      {form.getFieldDecorator('login', {
        initialValue,
        rules: [
          {
            required: true,
            message: 'Login is required',
          },
          {
            whitespace: true,
            message: 'Login cannot be empty',
          },
          {
            pattern: /^[a-zA-Z0-9_-]+$/,
            message: 'Login does not match pattern [a-zA-Z0-9_-]+',
          },
          {
            validator: uniqueValidator,
            message: 'Login has already been taken',
          },
        ],
      })(<RandomInput name="login" getValue={getValue} />)}
    </Form.Item>
  );
};

export default CredentialLoginField;
