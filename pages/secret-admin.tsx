import React from 'react';
import AdminDashboard from './admin-dashboard';

// Hidden admin route - only accessible by direct URL
const SecretAdmin: React.FC = () => {
  return <AdminDashboard />;
};

export default SecretAdmin;