import React from 'react';
import AddForm from '../../common/AddForm';
import CredentialLoginField from '../fields/CredentialLoginField';
import CredentialPasswordField from '../fields/CredentialPasswordField';
import CredentialExpirationDateField from '../fields/CredentialExpirationDateField';
import CredentialSitesField from '../fields/CredentialSitesField';

const CredentialAddForm = () => (
  <AddForm labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
    <CredentialLoginField />
    <CredentialPasswordField />
    <CredentialExpirationDateField />
    <CredentialSitesField />
  </AddForm>
);

export default CredentialAddForm;
