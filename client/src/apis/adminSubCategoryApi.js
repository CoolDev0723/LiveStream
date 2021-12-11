import axios from 'axios';
import { Server } from '../config';

class AdminSubCategoryApi {
    async getAllSubCat() {
        return new Promise((resolve, reject) => {
            axios
                .get(`${Server.baseUrl}/sub_category`)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(new Error(err.response?.data?.msg));
                });
        });
    }
    async createSubCat(name) {
        return new Promise((resolve, reject) => {
            const body = JSON.stringify(name);
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            axios
                .post(`${Server.baseUrl}/sub_category/create_sub_category`, body, config)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(new Error(err.response?.data?.msg));
                });
        });
    }

    async deleteSubCategory(id) {
        return new Promise((resolve, reject) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            axios
                .post(`${Server.baseUrl}/sub_category/delete`, {id}, config)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(new Error(err.response?.data?.msg));
                });
        });
    }

    async editSubCategory(id, category, newName){
        return new Promise((resolve, reject) => {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            axios
                .post(`${Server.baseUrl}/sub_category/edit`, {id, category, newName}, config)
                .then(res => {
                    resolve(res.data);
                })
                .catch(err => {
                    reject(new Error(err.response?.data?.msg));
                });
        });
    }
}

export const adminSubCategoryApi = new AdminSubCategoryApi