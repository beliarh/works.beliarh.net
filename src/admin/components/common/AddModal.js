import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Form, Modal } from 'antd';
import { FormContext } from '../../contexts';
import { isIE11 } from '../../utils';

const AddModal = ({ form, visible, setVisibility, confirmLoading, onAdd, children }) => {
  const close = useCallback(() => {
    setVisibility(false);

    if (isIE11()) {
      document.body.style.removeProperty('overflow');
    }
  }, [setVisibility]);

  const onOk = useCallback(() => {
    form.validateFields((errors, values) => {
      if (errors) {
        return;
      }

      onAdd(values, () => {
        close();
      });
    });
  }, [form, onAdd, close]);

  const onCancel = useCallback(() => {
    close();
  }, [close]);

  return (
    <FormContext.Provider value={form}>
      <Modal
        visible={visible}
        confirmLoading={confirmLoading}
        width={780}
        okButtonProps={{
          form: 'add-form',
          htmlType: 'submit',
        }}
        destroyOnClose
        onOk={onOk}
        onCancel={onCancel}
      >
        {children}
      </Modal>
    </FormContext.Provider>
  );
};

AddModal.propTypes = {
  form: PropTypes.shape({
    validateFields: PropTypes.func.isRequired,
  }).isRequired,
  visible: PropTypes.bool.isRequired,
  setVisibility: PropTypes.func.isRequired,
  confirmLoading: PropTypes.bool,
  onAdd: PropTypes.func.isRequired,
  children: PropTypes.any,
};

export default Form.create()(AddModal);
