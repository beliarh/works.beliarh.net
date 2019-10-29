import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'antd';
import { isExpiredDate } from '../../../utils';

const CredentialExpirationDateCell = ({ expirationDate }) => {
  return <Badge status={!isExpiredDate(expirationDate) ? 'success' : 'error'} text={expirationDate} />;
};

CredentialExpirationDateCell.propTypes = {
  expirationDate: PropTypes.string.isRequired,
};

export default CredentialExpirationDateCell;
