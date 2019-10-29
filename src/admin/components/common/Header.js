import React from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Layout, Menu } from 'antd';

const Header = () => {
  const user = useSelector(state => state.user);
  const title = <Avatar icon="user" src={user && user.picture} />;

  return (
    <Layout.Header>
      <Menu mode="horizontal" theme="dark" selectable={false}>
        <Menu.SubMenu title={title}>
          <Menu.Item>
            <a href="/admin/logout.php">Log Out</a>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    </Layout.Header>
  );
};

export default Header;
