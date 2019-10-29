import React from 'react';
import AddForm from '../../common/AddForm';
import SiteNameField from '../fields/SiteNameField';
import SiteDescriptionField from '../fields/SiteDescriptionField';
import SiteImagesField from '../fields/SiteImagesField';
import SiteYearField from '../fields/SiteYearField';
import SiteUrlField from '../fields/SiteUrlField';
import SiteGithubField from '../fields/SiteGithubField';
import SiteStackField from '../fields/SiteStackField';
import SitePublicField from '../fields/SitePublicField';
import SiteCredentialsField from '../fields/SiteCredentialsField';

const SiteAddForm = () => (
  <AddForm labelCol={{ span: 3 }} wrapperCol={{ span: 21 }}>
    <SiteNameField />
    <SiteDescriptionField />
    <SiteImagesField />
    <SiteYearField />
    <SiteUrlField />
    <SiteGithubField />
    <SiteStackField />
    <SitePublicField />
    <SiteCredentialsField />
  </AddForm>
);

export default SiteAddForm;
