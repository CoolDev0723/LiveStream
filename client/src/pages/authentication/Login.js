import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Box, Card, CardContent, Container, Link, Typography, Button, Grid, Dialog, DialogTitle } from '@material-ui/core';
import {
  LoginJWT
} from '../../components/authentication/login';
import gtm from '../../lib/gtm';
import { styles } from '../../pages/home/styles';
import '../../pages/home/index.scss';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const pages = ['Contact', 'Download', 'Login', 'Registration'];

const Login = () => {
  const navigate = useNavigate();
  const [showContactDlg, setShowContactDlg] = React.useState(false);

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const goToLogin = () => {
    navigate('/login');
  };

  const goToRegister = () => {
    navigate('/register');
  };

  const goToAction= (page) => {
    if(page == 'Contact'){
      setShowContactDlg(true);
    }
    if(page == 'Download'){
      window.location.href = "https://play.google.com/store/apps/details?id=com.micheros";
    }
    if(page == 'Login'){
      goToLogin();
    }
    if(page == 'Registration'){
      goToRegister();
    }
  }

  const closeContactDlg = () => {
    setShowContactDlg(false);
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="home-main">
        <div style={styles.pc.viewLogo} className="home-logo">
          <img
            src={'/static/images/home/mobile_logo.png'}
            className="home-logo-img-pc"
          />
          <img
            src={'/static/images/home/mobile_logo.png'}
            className="home-logo-img-phone"
          />
        </div>
        <div className="nav-bar">
          <Grid container spacing={0} direction="column" alignItems="center">
            <Grid item>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page, index) => (
                  <>
                    {index == 0 && (
                      <img src="/static/images/home/nav_layer.png" />
                    )}
                    <Button
                      key={page}
                      sx={{
                        color: 'white',
                        display: 'inherit',
                        fontSize: 30,
                        justifyContent: 'center',
                        fontWeight: 'bold',
                      }}
                      onClick={() => {
                        goToAction(page);
                      }}
                    >
                      {page}
                    </Button>
                    <img src="/static/images/home/nav_layer.png" />
                  </>
                ))}
              </Box>
            </Grid>
          </Grid>
        </div>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '40rem',
          }}
        >
          <Container
            maxWidth="sm"
            sx={{ py: 7 }}
          >
            {/* <Box
              sx={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <img
                src="/static/images/brand.png"
                style={{
                  width: 100,
                  height: 150
                }}
              />
            </Box> */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 8
              }}
            />
            <Card>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  p: 4
                }}
              >
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 3
                  }}
                >
                  <div>
                    <Typography
                      color="textPrimary"
                      gutterBottom
                      variant="h4"
                    >
                      Log in
                    </Typography>
                  </div>
                </Box>
                <Box
                  sx={{
                    flexGrow: 1,
                    mt: 3
                  }}
                >
                  <LoginJWT />
                </Box>
                <Box sx={{ my: 3 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Link
                    color="textSecondary"
                    component={RouterLink}
                    to="/register"
                    variant="body2"
                  >
                    Create new account
                  </Link>
                  {/* <Link
                    color="textSecondary"
                    component={RouterLink}
                    to="/password-recovery"
                    variant="body2"
                  >
                    Forgot password
                  </Link> */}
                </Box>
              </CardContent>
            </Card>
          </Container>
        </Box>
        <div className="bottom-nav">
          <div className="bottom-content">
            {pages.map((page, index) => (
              <>
                {index == 0 && <img src="/static/images/home/nav_layer.png" />}
                <Button
                  key={page}
                  sx={{
                    color: 'white',
                    display: 'inherit',
                    fontSize: 15,
                    justifyContent: 'center',
                    fontWeight: 'bold',
                  }}
                  onClick={() => {
                    goToAction(page);
                  }}
                >
                  {page}
                </Button>
                <img src="/static/images/home/nav_layer.png" />
              </>
            ))}
          </div>
        </div>
      </div>
      <Dialog
        fullWidth
        sx={{ maxWidth: 500, margin: 'auto' }}
        open={showContactDlg}
        keepMounted
        onClose={closeContactDlg}
      >
        <DialogTitle>Send a mail to Hello@michero.live if you have a queston or want some info.</DialogTitle>
      </Dialog>
    </>
  );
};

export default Login;
