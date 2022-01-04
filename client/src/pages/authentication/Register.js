import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Link,
  Typography,
  Button,
  Grid, 
  Dialog, 
  DialogTitle 
} from '@material-ui/core';
import { RegisterJWT } from '../../components/authentication/register';
import gtm from '../../lib/gtm';
import { styles } from '../../pages/home/styles';
import '../../pages/home/index.scss';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const pages = ['Contact', 'Download', 'Login', 'Registration'];

const Register = () => {
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
        <title>Register</title>
      </Helmet>
      <div className="home-main">
        <div style={styles.pc.viewLogo} className="home-logo">
          <img
            src={'/static/images/home/logo.png'}
            className="home-logo-img-pc"
          />
          <img
            src={'/static/images/home/phone_logo.png'}
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
            minHeight: '45rem',
          }}
        >
          <Container maxWidth="sm" sx={{ py: '30px' }}>
            {/* <Box
              sx={{
                mb: 3,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <RouterLink to="/">
                <img
                  src="/static/images/brand.png"
                  style={{
                    width: 100,
                    height: 150,
                  }}
                />
              </RouterLink>
            </Box> */}
            <Card>
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  p: 4,
                }}
              >
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <Typography color="textPrimary" gutterBottom variant="h4">
                      Register
                    </Typography>
                  </div>
                </Box>
                <RegisterJWT />
                <Divider sx={{ my: 3 }} />
                <Link
                  color="textSecondary"
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  style={{ textAlign: 'center' }}
                >
                  Having an account
                </Link>
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
        <DialogTitle>Send a mail to Hello@MicHeros.com if you have a queston or want some info.</DialogTitle>
      </Dialog>
    </>
  );
};

export default Register;
