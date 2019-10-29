import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown, Icon, Menu, Modal } from 'antd';
import AddModal from './AddModal';

const ActionBar = ({ form: Form, loading, deleteDisabled, onAdd, onDelete }) => {
  const [modalVisible, setModalVisibility] = useState(false);

  const onClickAdd = useCallback(() => {
    setModalVisibility(true);
  }, []);

  const onClickMenu = useCallback(
    ({ key }) => {
      if (key === 'deleteSelected') {
        Modal.confirm({
          title: 'Are you sure you want to delete selected sites?',
          onOk: onDelete,
        });
      }
    },
    [onDelete]
  );

  const overlay = (
    <Menu onClick={onClickMenu}>
      <Menu.Item key="deleteSelected" disabled={deleteDisabled}>
        Delete selected
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="action-bar">
      <Button type="primary" onClick={onClickAdd}>
        Add
      </Button>
      <Dropdown overlay={overlay} disabled={deleteDisabled}>
        <Button>
          Actions <Icon type="down" />
        </Button>
      </Dropdown>
      <AddModal visible={modalVisible} setVisibility={setModalVisibility} confirmLoading={loading} onAdd={onAdd}>
        <Form />
      </AddModal>
    </div>
  );
};

ActionBar.propTypes = {
  form: PropTypes.elementType.isRequired,
  loading: PropTypes.bool,
  deleteDisabled: PropTypes.bool.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ActionBar;
