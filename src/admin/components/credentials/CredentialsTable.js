import moment from 'moment';
import React from 'react';
import { useSelector } from 'react-redux';
import { credentialsCreate, credentialsUpdate, credentialsDelete } from '../../redux/credentials/actions';
import RecordsTable from '../common/RecordsTable';
import CredentialAddForm from './forms/CredentialAddForm';
import CredentialEditForm from './forms/CredentialEditForm';
import CredentialExpirationDateCell from './cells/CredentialExpirationDateCell';
import { formatDate } from '../../utils';

const transformValues = values => ({
  ...values,
  expirationDate: formatDate(values.expirationDate),
});

const renderExpirationDate = expirationDate => <CredentialExpirationDateCell expirationDate={expirationDate} />;

const columns = [
  {
    title: 'Login',
    dataIndex: 'login',
    width: 275,
    sorter: (a, b) => a.login.localeCompare(b.login),
  },
  {
    title: 'Password',
    dataIndex: 'password',
    width: 275,
    sorter: (a, b) => a.password.localeCompare(b.password),
  },
  {
    title: 'Expiration date',
    dataIndex: 'expirationDate',
    width: 280,
    render: renderExpirationDate,
    sorter: (a, b) => moment(a.expirationDate).diff(b.expirationDate),
  },
];

const CredentialsTable = () => {
  const credentials = useSelector(state => state.credentials);

  return (
    <RecordsTable
      addForm={CredentialAddForm}
      editForm={CredentialEditForm}
      error={credentials.error}
      loading={credentials.loading}
      records={credentials.list}
      columns={columns}
      transformValues={transformValues}
      actionCreate={credentialsCreate}
      actionUpdate={credentialsUpdate}
      actionDelete={credentialsDelete}
    />
  );
};

export default CredentialsTable;
