import React from 'react';
import { useSelector } from 'react-redux';
import { sitesCreate, sitesUpdate, sitesDelete } from '../../redux/sites/actions';
import { Badge } from 'antd';
import RecordsTable from '../common/RecordsTable';
import SiteAddForm from './forms/SiteAddForm';
import SiteEditForm from './forms/SiteEditForm';
import SiteUrlCell from './cells/SiteUrlCell';
import { getUrlsFromFileList } from '../../utils';

const transformValues = values => ({
  ...values,
  images: getUrlsFromFileList(values.images),
});

const renderUrl = url => <SiteUrlCell url={url} />;
const renderGithub = github => <SiteUrlCell url={github} prefix="https://github.com/" />;
const renderActive = active => <Badge status={active ? 'success' : 'error'} text={active ? 'Yes' : 'No'} />;
const renderPublic = isPublic => <Badge status={isPublic ? 'success' : 'error'} text={isPublic ? 'Yes' : 'No'} />;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 180,
    ellipsis: true,
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: 'Year',
    dataIndex: 'year',
    width: 90,
    ellipsis: true,
    sorter: (a, b) => (a.year || 0) - (b.year || 0),
  },
  {
    title: 'URL',
    dataIndex: 'url',
    width: 180,
    ellipsis: true,
    render: renderUrl,
    sorter: (a, b) => a.url.localeCompare(b.url),
  },
  {
    title: 'GitHub',
    dataIndex: 'github',
    width: 180,
    ellipsis: true,
    render: renderGithub,
    sorter: (a, b) => (a.github || '').localeCompare(b.github || ''),
  },
  {
    title: 'Active',
    dataIndex: 'active',
    width: 100,
    render: renderActive,
    sorter: (a, b) => a.active - b.active,
  },
  {
    title: 'Public',
    dataIndex: 'public',
    width: 100,
    render: renderPublic,
    sorter: (a, b) => a.public - b.public,
  },
];

const SitesTable = () => {
  const sites = useSelector(state => state.sites);

  return (
    <RecordsTable
      addForm={SiteAddForm}
      editForm={SiteEditForm}
      error={sites.error}
      loading={sites.loading}
      records={sites.list}
      columns={columns}
      transformValues={transformValues}
      actionCreate={sitesCreate}
      actionUpdate={sitesUpdate}
      actionDelete={sitesDelete}
    />
  );
};

export default SitesTable;
