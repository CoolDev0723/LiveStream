import axios from 'axios';
import { Server } from '../config';
class AdminCategoryApi {
    async getAllCat() {
        return new Promise((resolve, reject) => {
            axios
                .get(`${Server.baseUrl}/category`)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(new Error(err.response?.data?.msg));
                });
        });
    }
    async createCat(name) {
        return new Promise((resolve, reject) => {
            const body = JSON.stringify(name);
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            axios
                .post(`${Server.baseUrl}/category/create_category`, body, config)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(new Error(err.response?.data?.msg));
                });
        });
    }

    async deleteCategory(name) {
        return new Promise((resolve, reject) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            axios
                .post(`${Server.baseUrl}/category/delete`, {name}, config)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(new Error(err.response?.data?.msg));
                });
        });
    }

    async editCategory(name, newName){
        return new Promise((resolve, reject) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            axios
                .post(`${Server.baseUrl}/category/edit`, {name, newName}, config)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(new Error(err.response?.data?.msg));
                });
        });
    }
}

export const adminCategoryApi = new AdminCategoryApi;