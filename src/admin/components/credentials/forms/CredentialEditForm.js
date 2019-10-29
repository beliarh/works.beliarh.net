import React from 'react';
import PropTypes from 'prop-types';
import EditForm from '../../common/EditForm';
import CredentialLoginField from '../fields/CredentialLoginField';
import CredentialPasswordField from '../fields/CredentialPasswordField';
import CredentialExpirationDateField from '../fields/CredentialExpirationDateField';
import CredentialSitesField from '../fields/CredentialSitesField';

const CredentialEditForm = ({ onSave, onDelete }) => {
  return (
    <EditForm onSave={onSave} onDelete={onDelete}>
      <CredentialLoginField />
      <CredentialPasswordField />
      <CredentialExpirationDateField />
      <CredentialSitesField />
    </EditForm>
  );
};

CredentialEditForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CredentialEditForm;
