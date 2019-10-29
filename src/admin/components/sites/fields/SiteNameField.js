import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input } from 'antd';
import useUniqueValidator from '../../../hooks/useUniqueValidator';
import { FormContext, RecordContext } from '../../../contexts';

const SiteNameField = () => {
  const form = useContext(FormContext);
  const site = useContext(RecordContext);
  const sites = useSelector(state => state.sites);
  const initialValue = site && site.name;
  const uniqueValidator = useUniqueValidator(sites.list, site && site.id, 'name');

  return (
    <Form.Item label="Name">
      {form.getFieldDecorator('name', {
        initialValue,
        rules: [
          {
            required: true,
            message: 'Name is required',
          },
          {
            whitespace: true,
            message: 'Name cannot be empty',
          },
          {
            validator: uniqueValidator,
            message: 'Name has already been taken',
          },
        ],
      })(<Input />)}
    </Form.Item>
  );
};

export default SiteNameField;
