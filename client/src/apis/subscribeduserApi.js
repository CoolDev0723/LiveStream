import { Server } from '../config';
import axios from 'axios';

class SubscribedUserApi{
    async registerUserMailAddress(body){
        return new Promise((resolve, reject) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            axios.post(`${Server.baseUrl}/subscribedusers/addUserMailAddress`, body, config)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(new Error(err.response?.data?.msg));
                });
        });
    }
}

export const subscribeduserApi = new SubscribedUserApi
