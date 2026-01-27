import React from 'react';
import Header from '../components/Header';
import AppSwitcher from '../components/AppSwitcher';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <Header />
      <main>
        <AppSwitcher />
      </main>
    </div>
  );
};

export default Dashboard;
