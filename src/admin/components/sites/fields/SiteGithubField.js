import React, { useContext } from 'react';
import { Form, Input } from 'antd';
import { FormContext, RecordContext } from '../../../contexts';

const SiteGithubField = () => {
  const form = useContext(FormContext);
  const site = useContext(RecordContext);
  const initialValue = site && site.github;

  return (
    <Form.Item label="GitHub">
      {form.getFieldDecorator('github', {
        initialValue,
        rules: [
          {
            pattern: /^https:\/\/github.com\/.+/,
            message: 'GitHub URL must start with "https://github.com/"',
          },
        ],
      })(<Input type="url" />)}
    </Form.Item>
  );
};

export default SiteGithubField;
