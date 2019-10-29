import React, { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Form, Select } from 'antd';
import { FormContext, RecordContext } from '../../../contexts';

const filterOption = (inputValue, { props: { children } }) => {
  inputValue = inputValue.trim().toLowerCase();

  if (!inputValue) {
    return false;
  }

  return (
    children
      .toString()
      .toLowerCase()
      .indexOf(inputValue) !== -1
  );
};

const SiteStackField = () => {
  const form = useContext(FormContext);
  const site = useContext(RecordContext);
  const sites = useSelector(state => state.sites);
  const initialValue = (site && site.stack) || [];

  const options = useMemo(
    () => Array.from(new Set(sites.list.reduce((options, site) => options.concat(site.stack), []).sort())),
    [sites.list]
  );

  return (
    <Form.Item label="Stack">
      {form.getFieldDecorator('stack', {
        initialValue,
      })(
        <Select mode="tags" filterOption={filterOption} allowClear>
          {options.map(option => (
            <Select.Option key={option}>{option}</Select.Option>
          ))}
        </Select>
      )}
    </Form.Item>
  );
};

export default SiteStackField;
