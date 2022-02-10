import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { AppBar, Box, IconButton, Toolbar, Button } from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import toast from 'react-hot-toast';
import MenuIcon from '../../icons/Menu';
import useAuth from '../../hooks/useAuth';

const DashboardNavbarRoot = experimentalStyled(AppBar)(({ theme }) => ({
  ...(theme.palette.mode === 'light' && {
    backgroundColor: theme.palette.primary.main,
    boxShadow: 'none',
    color: theme.palette.primary.contrastText
  }),
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none'
  }),
  zIndex: theme.zIndex.drawer + 100
}));

const BroadCasterDashboardNavbar = (props) => {
  const { onSidebarMobileOpen, ...other } = props;

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error('Unable to logout.');
    }
  };

  return (
    <DashboardNavbarRoot {...other}>
      <Toolbar sx={{ minHeight: 64, backgroundColor:"black"}}>
        <IconButton
          color="inherit"
          onClick={onSidebarMobileOpen}
          sx={{
            display: {
              lg: 'none'
            }
          }}
        >
          <MenuIcon fontSize="small" />
        </IconButton>
        <Box sx={{justifyContent: 'center', marginTop: 1}}>
          <img
            src="/static/images/logo.png" 
            style={{
              width: 21.25,
            }}
          />
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            ml: 2,
            textAlign: 'center',
          }}
        >
          Welcome!
        </Box>
        <Box sx={{ ml: 2 }}>
          <Button
              color="whiteBg"
              fullWidth
              onClick={handleLogout}
              variant="outlined"
            >
              Logout
            </Button>
        </Box>
      </Toolbar>
    </DashboardNavbarRoot>
  );
};

BroadCasterDashboardNavbar.propTypes = {
  onSidebarMobileOpen: PropTypes.func
};

export default BroadCasterDashboardNavbar;
