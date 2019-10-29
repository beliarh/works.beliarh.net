import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Modal } from 'antd';
import { FormContext, RecordContext } from '../../contexts';

const EditForm = ({ form, onSave, onDelete, children }) => {
  const record = useContext(RecordContext);

  const onSubmit = useCallback(
    event => {
      event.preventDefault();

      form.validateFields((errors, values) => {
        if (errors) {
          return;
        }

        onSave(values, record);
      });
    },
    [form, record, onSave]
  );

  const onClickDelete = useCallback(() => {
    Modal.confirm({
      title: 'Are you sure you want to delete?',
      onOk() {
        onDelete(record.id);
      },
    });
  }, [record.id, onDelete]);

  return (
    <FormContext.Provider value={form}>
      <Form labelCol={{ span: 3 }} wrapperCol={{ span: 16 }} onSubmit={onSubmit}>
        {children}
        <Form.Item wrapperCol={{ sm: { offset: 3, span: 16 } }}>
          <Button type="primary" htmlType="submit" disabled={!form.isFieldsTouched()}>
            Save
          </Button>
          <Button type="danger" ghost onClick={onClickDelete}>
            Delete
          </Button>
        </Form.Item>
      </Form>
    </FormContext.Provider>
  );
};

EditForm.propTypes = {
  form: PropTypes.shape({
    isFieldsTouched: PropTypes.func.isRequired,
    validateFields: PropTypes.func.isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  children: PropTypes.any,
};

export default Form.create()(EditForm);
