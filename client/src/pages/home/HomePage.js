import { Box, Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import gtm from '../../lib/gtm';
import { styles } from './styles';
import './index.scss';
import React from 'react';
import { subscribeduserApi } from '../../apis/subscribeduserApi';

const pages = ['Contact', 'Download', 'Login', 'Registration'];

const HomePage = () => {
  const navigate = useNavigate();
  const [showContactDlg, setShowContactDlg] = React.useState(false);
  const [showInputMailAddressDlg, setShowInputMailAddressDlg] = React.useState(false);
  const [userMailAddress, setUserMailAddress] = React.useState("");
  const [registerResultMessage, setRegisterResultMessage] = React.useState("");
  const [registerResult, setRegisterResult] = React.useState(false);

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

  const closeInputMailAddressDlgAndRegister = async() =>{
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let error = false;
    let message = "";
    if(userMailAddress == ""){
      message = "Email is required";
      error = true;
    } else if (userMailAddress.match(validRegex)) {
      const res = await subscribeduserApi.registerUserMailAddress({
        email: userMailAddress,
      });
      if(res.success == 1){
        message = "Congratulation! You are registered successfully!";
      } else if(res.exist == 1){
        message = "Email already exists";
      } else {
        message = "Something went wrong adding the user";
        error = true;
      }
    } else {
      message = "Must be a valid email";
      error = true;
    }
    setRegisterResult(error);
    setRegisterResultMessage(message);
  }

  const handleChangeUserMailAddress = (e) =>{
    let value = e.target.value;
    setUserMailAddress(value.length > 255 ? userMailAddress : value);
  }

  return (
    <>
      <Helmet>
        <title>HomePage</title>
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
        <div className="home-content">
          <div className="sub-content">
            <div className="view-sub-left-content">
              <div className="txt-sub-title">Choose your own <br /> live commentator!</div>
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
                <div
                  className='google-play-box'
                  onClick={() => {
                    goToAction("Download");
                  }}
                >
                  <img
                    src={'/static/images/home/google_play.png'}
                    className="pc-google-play"
                  />
                  <img
                    src={'/static/images/home/google_play.png'}
                    className="phone-google-play"
                  />
                </div>
                <div
                  className='app-store-box'
                  onClick={() => {
                    setShowInputMailAddressDlg(true);
                  }}
                >
                  <img
                    src={'/static/images/home/appstore.png'}
                    className="pc-google-play"
                  />
                  <img
                    src={'/static/images/home/appstore.png'}
                    className="phone-google-play"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="sub-content">
            <div className="view-sub-right-content">
              <div className="txt-sub-title">Become a <br /> live commentator!</div>
              <div className="txt-sub-desc">
                <br />
                <b style={{ color: '#d9461d' }}>
                  Do you have knowledge about sports in general or a specific
                  team? Give you commentary then live. Others can hear you and
                  combine it with a TV/video feed so they can hear the commentary they like.
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
        <DialogTitle>Send a mail to Hello@michero.live if you have a queston or want some info.</DialogTitle>
      </Dialog>
      <Dialog
        fullWidth
        sx={{ maxWidth: 500, margin: 'auto' }}
        open={showInputMailAddressDlg}
        keepMounted
      >
        <DialogTitle>iOS version will be available soon. Fill in your email address an we will in form you when it is available.</DialogTitle>
        <DialogContent>
          <TextField
            error={registerResult}
            fullWidth
            helperText={registerResultMessage}
            label="Email Address"
            margin="normal"
            name="email"
            // onBlur={handleBlur}
            onChange={handleChangeUserMailAddress}
            type="email"
            value={userMailAddress}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShowInputMailAddressDlg(false);
              setRegisterResult(false);
              setRegisterResultMessage("");
              setUserMailAddress("");
            }}
            color="primary"
          >
            Close
          </Button>
          <Button onClick={closeInputMailAddressDlgAndRegister} color="primary">
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HomePage;
