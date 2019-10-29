import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';

const AddForm = ({ children, ...props }) => (
  <Form id="add-form" {...props}>
    {children}
  </Form>
);

AddForm.propTypes = {
  children: PropTypes.any,
};

export default AddForm;
