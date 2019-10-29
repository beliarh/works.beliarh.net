import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Button, Card, Typography } from 'antd';

const Auth = ({ demoOnly }) => {
  const authUrl = useSelector(state => state.authUrl);
  const title = <Typography.Title>Admin Panel</Typography.Title>;

  return (
    <div className="auth">
      <Card title={title}>
        <Button type="primary" size="large" icon="google" href={authUrl} disabled={demoOnly}>
          Log In
        </Button>
        <Button type="primary" size="large" href="/admin/?demo">
          Try demo
        </Button>
        {demoOnly && (
          <p>
            <Typography.Text type="danger">Access denied</Typography.Text>
          </p>
        )}
      </Card>
    </div>
  );
};

Auth.propTypes = {
  demoOnly: PropTypes.bool,
};

export default Auth;
