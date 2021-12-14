
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { Server } from '../config';

class AuthApi {
  async login(email) {
    return new Promise((resolve, reject) => {
      try {
        const body = JSON.stringify({ email });
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };

        console.log("correct ---")
        axios
          .post(`${Server.baseUrl}/auth/login`, body, config)
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error('[Auth Api]: ', err.response?.data?.msg);
            reject(new Error(err.response?.data?.msg));
            return
          });

      } catch (err) {
        console.error('[Auth Api]: ', err.msg);
        reject(new Error('Internal server error'));
      }
    });
  }

  async register({ email, name, phone, country, timezone }) {

    return new Promise((resolve, reject) => {
      try {
        const body = JSON.stringify({ email, name, phone, country, timezone, type: 'broadcaster' });
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };

        axios
          .post(`${Server.baseUrl}/auth/register`, body, config)
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error('[Auth Api]: ', err.response?.data?.msg);
            reject(new Error(err.response?.data?.msg));
            return
          });

      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async activateEmail(token, isLogin) {
    return new Promise((resolve, reject) => {
      try {
        const body = JSON.stringify({ token, isLogin });
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };

        axios
          .post(`${Server.baseUrl}/auth/activate-account`, body, config)
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error('[Auth Api]: ', err.response?.data?.msg);
            reject(new Error(err.response?.data?.msg));
            return
          });

      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  async passwordRecovery(email) {
    return new Promise((resolve, reject) => {
      try {
        const body = JSON.stringify({ email });
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };

        axios
          .post(`${Server.baseUrl}/auth/forgot-password`, body, config)
          .then(res => {
            resolve(res.data);
          })
          .catch(err => {
            console.error('[Auth Api]: ', err.response?.data?.msg);
            reject(new Error(err.response?.data?.msg));
            return
          });

      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }

  me(accessToken) {
    return new Promise((resolve, reject) => {
      try {
        // Decode access token
        const decodedToken = jwt.verify(accessToken, 'sl_myJwtSecret');
        resolve(decodedToken);

      } catch (err) {
        console.error('[Auth Api]: ', err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const authApi = new AuthApi();

// Setup config/headers and token
export const tokenConfig = (getState) => {
  // Get token from localstorage
  const token = getState().auth.token;

  // Headers
  const config = {
    headers: {
      'Content-type': 'application/json'
    }
  };

  // If token, add to headers
  if (token) {
    config.headers['x-auth-token'] = token;
  }

  return config;
};
