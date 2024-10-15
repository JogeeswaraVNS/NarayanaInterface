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
      <div className="bg- text-white" style={{ minHeight: '100vh', paddingTop: '3.8rem',backgroundColor:'black' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default HomeLayout;
