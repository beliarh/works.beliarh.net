import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { Icon, Input } from 'antd';
import { FormContext } from '../../contexts';

const RandomInput = React.forwardRef(({ name, getValue, ...restProps }, ref) => {
  const form = useContext(FormContext);

  const onMouseDown = useCallback(event => {
    event.preventDefault();
  }, []);

  const onClick = useCallback(() => {
    form.setFieldsValue({
      [name]: getValue(),
    });
  }, [form, name, getValue]);

  const suffix = (
    <Icon className="random-input-icon" type="reload" tabIndex="-1" onMouseDown={onMouseDown} onClick={onClick} />
  );

  return <Input suffix={suffix} ref={ref} {...restProps} />;
});

RandomInput.displayName = 'RandomInput';

RandomInput.propTypes = {
  name: PropTypes.string.isRequired,
  getValue: PropTypes.func.isRequired,
};

export default RandomInput;
