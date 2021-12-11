import { Server } from '../config';
import axios from 'axios';

class BroadCasterEventApi{
    async getAllEvent(){
      return new Promise((resolve, reject) => {
        axios
            .get(`${Server.baseUrl}/event`)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(new Error(err.response?.data?.msg));
            });
      });
    }

    async getRate(userId, eventId){
        return new Promise((resolve, reject) => {
          axios
              .get(`${Server.baseUrl}/users/rate`, { params: { userId, eventId } })
              .then(res => {
                  resolve(res.data);
              })
              .catch(err => {
                reject(new Error(err.response?.data?.msg));
              });
        });
      }

    async getLanguage(){
        return new Promise((resolve, reject) => {
          axios
              .get(`${Server.baseUrl}/language`)
              .then(res => {
                  resolve(res.data);
              })
              .catch(err => {
                reject(new Error(err.response?.data?.msg));
              });
        });
      }

    async createBroadcastChannel(body){
        console.log("createBroadcastChannel_param", body)
        return new Promise((resolve, reject) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
                };
            axios.post(`${Server.baseUrl}/event/broadcastChannel`, body, config)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(new Error(err.response?.data?.msg));
                });
        });
    }

    async startBroadcast(body){
        console.log("startBroadcast", body)
        return new Promise((resolve, reject) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
                };
            axios.post(`${Server.baseUrl}/event/startBroadcast`, body, config)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(new Error(err.response?.data?.msg));
                });
        });
    }

    async stopBroadcast(body){
        console.log("stopBroadcast", body)
        return new Promise((resolve, reject) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
                };
            axios.post(`${Server.baseUrl}/event/stopBroadcast`, body, config)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(new Error(err.response?.data?.msg));
                });
        });
    }
}

export const broadcasterEventApi = new BroadCasterEventApi
