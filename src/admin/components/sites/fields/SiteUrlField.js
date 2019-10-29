import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input } from 'antd';
import useUniqueValidator from '../../../hooks/useUniqueValidator';
import { FormContext, RecordContext } from '../../../contexts';

const SiteUrlField = () => {
  const form = useContext(FormContext);
  const site = useContext(RecordContext);
  const sites = useSelector(state => state.sites);
  const initialValue = site && site.url;
  const uniqueValidator = useUniqueValidator(sites.list, site && site.id, 'url');

  return (
    <Form.Item label="URL">
      {form.getFieldDecorator('url', {
        initialValue,
        rules: [
          {
            required: true,
            message: 'URL is required',
          },
          {
            whitespace: true,
            message: 'URL cannot be empty',
          },
          {
            pattern: /^http[s]?:\/\/.+/,
            message: 'URL does not match pattern',
          },
          {
            validator: uniqueValidator,
            message: 'URL has already been taken',
          },
        ],
      })(<Input type="url" />)}
    </Form.Item>
  );
};

export default SiteUrlField;
