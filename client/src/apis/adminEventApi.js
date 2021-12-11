import axios from 'axios';
import { Server } from '../config';

class AdminEventApi{
  async getAllEvent() {
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

  async deleteEvent(eventId) {
    return new Promise((resolve, reject) => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        axios
            .post(`${Server.baseUrl}/event/delete`, {id: eventId}, config)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(new Error(err.response?.data?.msg));
            });
    });
  }

  async createEvent(event) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(event);
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        console.log(body);
        axios
            .post(`${Server.baseUrl}/event/add`, body, config)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(new Error(err.response?.data?.msg));
            });
    });
  }

  async updateEvent(event) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(event);
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        console.log(body);
        axios
            .post(`${Server.baseUrl}/event/edit`, body, config)
            .then(res => {
                resolve(res.data);
            })
            .catch(err => {
                reject(new Error(err.response?.data?.msg));
            });
    });
  }
}

export const adminEventApi = new AdminEventApi;