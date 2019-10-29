import { useCallback } from 'react';

const useUniqueValidator = (records, id, columnName) => {
  return useCallback(
    (rule, value) => {
      return !records.some(record => record.id !== id && record[columnName] === value);
    },
    [records, id, columnName]
  );
};

export default useUniqueValidator;
