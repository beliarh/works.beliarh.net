import React from 'react';
import PropTypes from 'prop-types';
import EditForm from '../../common/EditForm';
import SiteNameField from '../fields/SiteNameField';
import SiteDescriptionField from '../fields/SiteDescriptionField';
import SiteImagesField from '../fields/SiteImagesField';
import SiteYearField from '../fields/SiteYearField';
import SiteUrlField from '../fields/SiteUrlField';
import SiteGithubField from '../fields/SiteGithubField';
import SiteStackField from '../fields/SiteStackField';
import SitePublicField from '../fields/SitePublicField';
import SiteCredentialsField from '../fields/SiteCredentialsField';

const SiteEditForm = ({ onSave, onDelete }) => {
  return (
    <EditForm onSave={onSave} onDelete={onDelete}>
      <SiteNameField />
      <SiteDescriptionField />
      <SiteImagesField />
      <SiteYearField />
      <SiteUrlField />
      <SiteGithubField />
      <SiteStackField />
      <SitePublicField />
      <SiteCredentialsField />
    </EditForm>
  );
};

SiteEditForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default SiteEditForm;
