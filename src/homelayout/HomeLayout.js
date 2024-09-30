// Updated HomeLayout component
import React from 'react';
import { Outlet } from 'react-router-dom';
import ProjectNavbar from '../projectnavbar/ProjectNavbar';

function HomeLayout() {
  return (
    <div>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, width: '100%' }}>
        <ProjectNavbar />
      </div>
      <div className="bg-dark text-white" style={{ minHeight: '100vh', paddingTop: '3.8rem' }}>
        <Outlet />
      </div>
    </div>
  );
}

export default HomeLayout;
