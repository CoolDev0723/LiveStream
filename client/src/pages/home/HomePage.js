import { Box, Button, Grid, Dialog, DialogTitle } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import gtm from '../../lib/gtm';
import { styles } from './styles';
import './index.scss';
import React from 'react';

const pages = ['Contact', 'Download', 'Login', 'Registration'];

const HomePage = () => {
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
        <title>HomePage</title>
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
        <div className="home-content">
          <div className="sub-content">
            <div className="view-sub-left-content">
              <div className="txt-sub-title">Choose your own commentator!</div>
              <div className="txt-sub-desc">
                <b>It is free!</b> <br />
                <br />
                Enjoy your favorite games with a commentator you like. Download
                the app, select the language and choose your favorite
                commentator. You can synchronize the commentator with any
                tv/video stream.
                <br />
                <br />
              </div>
              <div className="black-box">
                <div className="btn-desc">
                  <div className="btn-google-desc-txt">
                    MicHeroS APP is now availlable!
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '50%',
                    height: '100%',
                    cursor:'pointer'
                  }}
                  onClick={() => {
                    goToAction("Download");
                  }}
                >
                  <img
                    src={'/static/images/home/google_play.png'}
                    className="pc-google-play"
                  />
                  <img
                    src={'/static/images/home/phone_google_play.png'}
                    className="phone-google-play"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="sub-content">
            <div className="view-sub-right-content">
              <div className="txt-sub-title">Become commentator yourself.</div>
              <div className="txt-sub-desc">
                <br />
                <b style={{ color: '#d9461d' }}>
                  Do you have knowledge about sports in general or a specific
                  team? Give you commentary then live. Others can hear you and
                  combine it a feed so they can hear the commentary they like.
                  Register yourself and start your feed when your team/sport is
                  live.{' '}
                </b>
                <br />
                <br />
                You only need a great voice, a computer and a good microphone.
                And if you have a large group of fans listening to you, you can
                earn money too. Do not wait any longer and register now! You can
                start your first live stream soon.
              </div>
              <div className="black-box">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <div className="login-btn">
                    <Button
                      sx={{
                        color: 'black',
                        flex: 1,
                      }}
                      onClick={() => {
                        goToLogin();
                      }}
                    >
                      LOGIN
                    </Button>
                  </div>
                  <div className="login-btn">
                    <Button
                      sx={{
                        color: 'black',
                        flex: 1,
                      }}
                      onClick={() => {
                        goToRegister();
                      }}
                    >
                      REGISTER
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default HomePage;
