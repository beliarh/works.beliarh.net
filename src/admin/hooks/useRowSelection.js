import { useCallback, useEffect, useState } from 'react';
import { getRecordById } from '../utils';

const useRowSelection = dataSource => {
  const [selectedRowIds, setSelectedRowIds] = useState([]);

  const onChange = useCallback(ids => {
    setSelectedRowIds(ids);
  }, []);

  const unselectRowIds = useCallback(
    ids => {
      setSelectedRowIds(selectedRowIds.filter(id => !ids.includes(id)));
    },
    [selectedRowIds]
  );

  useEffect(() => {
    const deletedRowIds = selectedRowIds.filter(id => !getRecordById(dataSource, id));

    if (deletedRowIds.length) {
      unselectRowIds(deletedRowIds);
    }
  }, [selectedRowIds, dataSource, unselectRowIds]);

  return {
    selectedRowIds,
    setSelectedRowIds,
    unselectRowIds,
    rowSelection: {
      onChange,
      selectedRowKeys: selectedRowIds,
    },
  };
};

export default useRowSelection;
