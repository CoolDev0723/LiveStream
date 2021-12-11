import wait from '../utils/wait';
import axios from 'axios';
import { Server } from '../config';

class AdminUserApi {
    async getAllUser() {
        return new Promise((resolve, reject) => {
            axios
                .get(`${Server.baseUrl}/users`)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(new Error(err.response?.data?.msg));
                    return
                });
        });
    }
}

export const adminUserApi = new AdminUserApi
