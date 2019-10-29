import React from 'react';
import { useSelector } from 'react-redux';
import { Layout, Tabs } from 'antd';
import Auth from './common/Auth';
import Header from './common/Header';
import SitesTable from './sites/SitesTable';
import CredentialsTable from './credentials/CredentialsTable';

const App = () => {
  const user = useSelector(state => state.user);
  const isAuthorized = useSelector(state => state.isAuthorized);

  return (
    <Layout>
      {isAuthorized && <Header />}
      <Layout.Content>
        {isAuthorized ? (
          <Tabs animated={false}>
            <Tabs.TabPane tab="Sites" key="sites">
              <SitesTable />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Credentials" key="credentials">
              <CredentialsTable />
            </Tabs.TabPane>
          </Tabs>
        ) : (
          <Auth demoOnly={!!user} />
        )}
      </Layout.Content>
    </Layout>
  );
};

export default App;
