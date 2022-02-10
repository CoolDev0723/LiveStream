import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Card, CardContent, Container, Box, Button } from '@material-ui/core';
import { broadcasterEventApi } from '../../../apis/broadcasterEventApi';
import { WebRTCAdaptor } from './../../../lib/webrtc-js/webrtc_adaptor';
import { useLocation } from 'react-router-dom';
import './index.scss';
import AudioAnalyser from './AudioAnalyser';
import React from 'react';

var newWebRTCAdapter = null;
var isBack = false;
var isUnMounted = false;

const BroadCastHome = () => {
  const navigate = useNavigate();
  const [isPublishing, setPublish] = useState(false);
  const { state } = useLocation();
  const [streamId, setStreamID] = useState(state ? state.streamId : '');
  const [selectedEvent] = useState(state ? state.selectedEvent : '');
  const [audio, setAudio] = useState(null);
  const [viewerCount, setViewerCount] = useState(0);
  const [rating, setRating] = React.useState(0);

  const pc_config = {
    iceServers: [
      {
        urls: 'stun:stun1.l.google.com:19302',
      },
    ],
  };

  const sdpConstraints = {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true,
  };

  const mediaConstraints = {
    video: false,
    audio: true,
  };

  var appName = '/WebRTCAppEE';
  var hostAddress = 'antmedia.micheros.com';
  var websocketURL =
    'ws://' + '137.184.4.191' + ':5080' + appName + '/websocket';

  if (window.location.protocol.startsWith('https')) {
    websocketURL = 'wss://' + hostAddress + ':5443' + appName + '/websocket';
  }

  useEffect(async() => {
    const user = window.localStorage.getItem('user')
    console.log("user", user)
    if(user){
      const userObj = JSON.parse(user)
      try{
        const data = await broadcasterEventApi.getRate(userObj.id, state ? state.selectedEvent : '');
        if(data.rating){
          setRating(data.rating);
        }
      } catch (err) {
      }
    }
    newWebRTCAdapter = new WebRTCAdaptor({
      websocket_url: websocketURL,
      mediaConstraints: mediaConstraints,
      peerconnection_config: pc_config,
      sdp_constraints: sdpConstraints,
      localVideoId: 'localVideo',
      debug: true,
      callback: function (info, description) {
        if (isUnMounted) {
          isUnMounted = false;
          endPublish();
          return;
        }
        if (info == 'initialized') {
          console.log('initialized');
        } else if (info == 'publish_started') {
          //stream is being published
          setPublish(true);
          startPublish();
          console.log('publish started');
        } else if (info == 'publish_finished') {
          //stream is being finished
          setPublish(false);
          endPublish();
          console.log('publish finished');
        } else if (info == 'closed') {
          console.log('Connection closed');
          setPublish(false);
          endPublish();
          if (typeof description != 'undefined') {
            console.log('Connecton closed: ' + JSON.stringify(description));
          }
        }
      },
      callbackError: function (error, message) {
        if (isUnMounted) {
          console.log(
            'callbackError-------------------------------------------'
          );
          endPublish();
          return;
        }
        setPublish(false);
        console.log('error callback: ' + JSON.stringify(error));
        var errorMessage = JSON.stringify(error);
        if (typeof message != 'undefined') {
          errorMessage = message;
        }
        var errorMessage = JSON.stringify(error);
        if (error.indexOf('NotFoundError') != -1) {
          errorMessage =
            'Camera or Mic are not found or not allowed in your device';
        } else if (
          error.indexOf('NotReadableError') != -1 ||
          error.indexOf('TrackStartError') != -1
        ) {
          errorMessage =
            'Camera or Mic is being used by some other process that does not let read the devices';
        } else if (
          error.indexOf('OverconstrainedError') != -1 ||
          error.indexOf('ConstraintNotSatisfiedError') != -1
        ) {
          errorMessage =
            'There is no device found that fits your video and audio constraints. You may change video and audio constraints';
        } else if (
          error.indexOf('NotAllowedError') != -1 ||
          error.indexOf('PermissionDeniedError') != -1
        ) {
          errorMessage = 'You are not allowed to access camera and mic.';
        } else if (error.indexOf('TypeError') != -1) {
          errorMessage = 'Video/Audio is required';
        }

        console.log(errorMessage);
      },
    });

    endPublish();

    window.addEventListener('beforeunload', (ev) => {
      //tab close
      ev.preventDefault();
      return onEndPublish();
    });

    return () => {
      isUnMounted = true;
      onEndPublish();
    };
  }, []);

  useEffect(() => {
    const checkViewerCountInterval = setInterval(async () => {
      const curViewerCount = await broadcasterEventApi.getViewerCounter(
        streamId
      );
      setViewerCount(curViewerCount);
    }, 1000 * 3);
    return () => clearInterval(checkViewerCountInterval);
  }, []);

  const onStartPublish = async () => {
    if (newWebRTCAdapter) {
      newWebRTCAdapter.publish(streamId);
    }
    const audio = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    setAudio(audio);
  };

  const startPublish = async () => {
    try {
      const data = await broadcasterEventApi.startBroadcast({
        streamId,
        selectedEvent,
      });
      if (data.success) {
        const audioPlayer = document.getElementById('localVideo');
        if (audioPlayer) {
          audioPlayer.play();
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onEndPublish = () => {
    if (newWebRTCAdapter) {
      newWebRTCAdapter.stop(streamId);
    }
  };

  const goBack = () => {
    isBack = true;
    onEndPublish();
  };

  const endPublish = async () => {
    try {
      const data = await broadcasterEventApi.stopBroadcast({
        streamId,
        selectedEvent,
      });
      if (data.success) {
        const audioPlayer = document.getElementById('localVideo');
        if (audioPlayer) audioPlayer.pause();
        if (isBack) {
          isBack = false;
          navigate(-1);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Helmet>
        <title>BroadCast</title>
      </Helmet>
      <Container sx={{ width: '100%', height: '80%', mt: 8 }}>
        <Card sx={{ width: '100%', height: '100%' }}>
          <CardContent>
            <Box>
              <div>Score : {rating}</div>
              <p id="player">
                <audio id="localVideo" controls muted></audio>
              </p>
              {isPublishing ? (
                <>
                  <Button
                    color={'error'}
                    type="submit"
                    variant="contained"
                    sx={{ height: 40, mr: 6 }}
                    onClick={goBack}
                  >
                    End Publishing
                  </Button>
                  <div>
                    <AudioAnalyser audio={audio} />
                  </div>
                  <div>
                    Number of listeners :{' '}
                    <span style={{ color: viewerCount > 0 ? 'red' : '' }}>
                      {viewerCount}
                    </span>
                  </div>
                </>
              ) : (
                <Button
                  color="primary"
                  type="submit"
                  variant="contained"
                  sx={{ height: 40, mr: 6 }}
                  onClick={onStartPublish}
                >
                  Start Publish
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default BroadCastHome;
