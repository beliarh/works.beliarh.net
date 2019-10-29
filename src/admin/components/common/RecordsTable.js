import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { message, notification, Table } from 'antd';
import useRowSelection from '../../hooks/useRowSelection';
import { RecordContext } from '../../contexts';
import ActionBar from './ActionBar';

const RecordsTable = ({
  addForm: AddForm,
  editForm: EditForm,
  error,
  loading,
  records,
  columns,
  transformValues,
  actionCreate,
  actionUpdate,
  actionDelete,
}) => {
  const dispatch = useDispatch();
  const { selectedRowIds, unselectRowIds, rowSelection } = useRowSelection(records);

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Error',
        description: error,
      });
    }
  }, [error]);

  const onAdd = useCallback(
    (values, onSuccess) => {
      if (transformValues) {
        values = transformValues(values);
      }

      dispatch(
        actionCreate([values], () => {
          message.success('Successfully created');

          if (onSuccess) {
            onSuccess();
          }
        })
      );
    },
    [dispatch, transformValues, actionCreate]
  );

  const onSave = useCallback(
    (values, record) => {
      if (transformValues) {
        values = transformValues(values);
      }

      dispatch(
        actionUpdate([{ ...values, id: record.id }], () => {
          message.success('Successfully updated');
        })
      );
    },
    [dispatch, transformValues, actionUpdate]
  );

  const onDelete = useCallback(
    id => {
      dispatch(
        actionDelete([id], () => {
          message.success('Successfully deleted');
          unselectRowIds([id]);
        })
      );
    },
    [dispatch, actionDelete, unselectRowIds]
  );

  const onDeleteSelected = useCallback(() => {
    dispatch(
      actionDelete(selectedRowIds, () => {
        message.success('Successfully deleted');
        unselectRowIds(selectedRowIds);
      })
    );
  }, [dispatch, actionDelete, selectedRowIds, unselectRowIds]);

  const expandedRowRender = useCallback(
    record => (
      <RecordContext.Provider value={record}>
        <EditForm onSave={onSave} onDelete={onDelete} />
      </RecordContext.Provider>
    ),
    [onSave, onDelete]
  );

  return (
    <React.Fragment>
      <ActionBar
        form={AddForm}
        loading={loading}
        deleteDisabled={!selectedRowIds.length}
        onAdd={onAdd}
        onDelete={onDeleteSelected}
      />
      <Table
        columns={columns}
        dataSource={records}
        expandedRowRender={expandedRowRender}
        loading={loading}
        pagination={false}
        rowKey="id"
        rowSelection={rowSelection}
      />
    </React.Fragment>
  );
};

RecordsTable.propTypes = {
  addForm: PropTypes.elementType.isRequired,
  editForm: PropTypes.elementType.isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool,
  records: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  transformValues: PropTypes.func.isRequired,
  actionCreate: PropTypes.func.isRequired,
  actionUpdate: PropTypes.func.isRequired,
  actionDelete: PropTypes.func.isRequired,
};

export default RecordsTable;
