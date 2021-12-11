import { Box, Button, Grid, Typography } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import gtm from '../../lib/gtm';
import { styles } from './styles';
import './index.scss';

const pages = ['LOREM', 'IPSUM', 'DOLOR', 'SIT', 'AMET'];

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const goToLogin = () => {
    navigate('/login');
  };

  const goToRegister = () => {
    navigate('/register');
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
              <div className="txt-sub-title">
                Pellentesque non auctor nisl, eget euismod purus.
              </div>
              <div className="txt-sub-desc">
                <br />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
                interdum porta mauris ac ultrices. Morbi euismod nibh vel urna
                aliquam interdum sit amet a leo. Sed ac sollicitudin eros. Nulla
                interdum vel libero vitae fringilla. Curabitur a fringilla
                ligula, sed aliquam risus.
                <br />
                <br />
                <b>
                  Maecenas mattis lectus id ligula volutpat, vel volutpat magna
                  porta.
                </b>{' '}
                Ut ac neque auctor, dapibus turpis sed, molestie sem. Nam
                scelerisque mi lectus, vel posuere enim accumsan in. Nam tortor
                diam, sagittis a suscipit ut, sagittis at lectus. Donec vitae
                vestibulum mi. Donec in
              </div>
              <div className="black-box">
                <div className="btn-desc">
                  <div className="btn-google-desc-txt">
                    MADMICS.LIVE APP IS NOW AVAILABLE!
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '50%',
                    height: '100%',
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
              <div className="txt-sub-title">
                Integer tempus finibus. Aenean eu luctus ligula
              </div>
              <div className="txt-sub-desc">
                <br />
                <b style={{ color: '#d9461d' }}>
                  Nulla sollicitudin et quam vitae dictum. Nullam vel dignissim
                  neque. Donec ut eleifend diam. Praesent sed est velit.{' '}
                </b>
                <br />
                <br />
                Aliquam eget eros iaculis, vehicula dui vel, accumsan enim.
                Vivamus non hendrerit velit. Phasellus id dui ac dui fringilla
                tincidunt. Nulla vel nulla at orci cursus laoreet quis pharetra
                urna. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Nulla sit amet convallis tellus, ornare tincidunt augue. Nulla
                eros dolor, vehicula non luctus a, malesuada at felis.
                Pellentesque elit lacus, varius eu lectus id, molestie vehicula
                elit.
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
                >
                  {page}
                </Button>
                <img src="/static/images/home/nav_layer.png" />
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
