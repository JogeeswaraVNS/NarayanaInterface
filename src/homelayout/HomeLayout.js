// Updated HomeLayout component
import React from 'react';
import { Outlet } from 'react-router-dom';
import ProjectNavbar from '../projectnavbar/ProjectNavbar';

function HomeLayout() {
  return (
    <div>
      <div style={{ position: 'fixed', width: '100%' }}>
        <ProjectNavbar />
      </div>
      <div className="" style={{ minHeight: '100vh'}}>
        <Outlet />
      </div>
    </div>
  );
}

export default HomeLayout;
