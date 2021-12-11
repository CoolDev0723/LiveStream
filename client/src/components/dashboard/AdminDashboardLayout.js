import { useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { experimentalStyled } from '@material-ui/core/styles';
import DashboardNavbar from './AdminDashboardNavbar';
import DashboardSidebar from './AdminDashboardSidebar';
import useAuth from './../../hooks/useAuth';

const DashboardLayoutRoot = experimentalStyled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  height: '100%',
  overflow: 'hidden',
  width: '100%'
}));

const DashboardLayoutWrapper = experimentalStyled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden',
  paddingTop: '64px',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: '280px'
  }
}));

const DashboardLayoutContainer = experimentalStyled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden'
});

const DashboardLayoutContent = experimentalStyled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto',
  position: 'relative',
  WebkitOverflowScrolling: 'touch'
});

const AdminDashboardLayout = () => {
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const location = useLocation()
  const auth = useAuth();

  // if((location.pathname.includes('broadcaster') && (auth.user.type == 'broadcaster')) || (location.pathname.includes('admin') && (auth.user.type == 'admin'))){

  // } else {
  //   return <Navigate to="/" />
  // }

  return (
    <DashboardLayoutRoot>
      <DashboardNavbar onSidebarMobileOpen={() => setIsSidebarMobileOpen(true)} />
      <DashboardSidebar
        onMobileClose={() => setIsSidebarMobileOpen(false)}
        openMobile={isSidebarMobileOpen}
      />
      <DashboardLayoutWrapper>
        <DashboardLayoutContainer>
          <DashboardLayoutContent>
            <Outlet />
          </DashboardLayoutContent>
        </DashboardLayoutContainer>
      </DashboardLayoutWrapper>
    </DashboardLayoutRoot>
  );
};

export default AdminDashboardLayout;
