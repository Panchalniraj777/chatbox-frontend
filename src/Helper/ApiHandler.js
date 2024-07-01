import axios from 'axios';
import CODES from './StatusCodes';

const METHOD = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    PATCH: 'patch',
    DELETE: 'delete',
};

const BASEURL = process.env.REACT_APP_API_URL;

class Api {
    constructor() {
        this.baseURL = BASEURL;
        this.getAuthenticationInfo();
    }

    getAuthenticationInfo() {
        if (localStorage.getItem('isLoggedIn')) {
            this.isLoggedIn = true;
            this.accessToken = localStorage.getItem('accessToken');
        }
    }

    get(url, data) {
        return new Promise((resolve, reject) => {
            this.api(METHOD.GET, url, data)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    post(url, data) {
        return new Promise((resolve, reject) => {
            this.api(METHOD.POST, url, data)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    put(url, data) {
        return new Promise((resolve, reject) => {
            this.api(METHOD.PUT, url, data)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    console.log(error);
                });
        });
    }

    patch(url, data) {
        return new Promise((resolve, reject) => {
            this.api(METHOD.PATCH, url, data)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    delete(url, data) {
        return new Promise((resolve, reject) => {
            this.api(METHOD.DELETE, url, data)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    api(method, url, data) {
        return new Promise((resolve, reject) => {
            let axiosConfig = {};
            axiosConfig.method = method;

            axiosConfig.url = this.baseURL + url;

            axiosConfig.headers = this.setHeaders(data);
            if (data) {
                if (data.params) axiosConfig.params = data.params;

                if (data.data) axiosConfig.data = data.data;
            }

            axios(axiosConfig)
                .then(response => {
                    resolve(response);
                })
                .catch(error => {
                    if (error && error.response) {
                        if (error.response.status === CODES.NOT_FOUND) {
                            if (!data?.skipErrorHandling) {
                                console.log(error.response?.data?.message);
                            }
                            reject(error);
                        } else if (error.response.status === CODES.UNAUTHORIZED) {
                            console.log(error.response?.data?.message);
                        } else if (error.response.status === CODES.SERVER_ERROR) {
                            if (data && !data.skipToast) console.log('Internal Server Error');

                            if (data && data?.skipErrorHandling) reject(error.response);
                        } else {
                            if (data && data?.skipErrorHandling) return resolve(error.response);
                            if (data?.returnError) {
                                console.log(error.response?.data?.message);
                                return resolve(error?.response);
                            }
                            !data?.skipToast && console.log(error.response?.data?.message);

                            reject(error);
                        }
                    } else {
                        reject(error);
                    }
                });
        });
    }

    setHeaders(data) {
        let headers = {};
        headers['accept-language'] = 'en';
        headers['Content-Type'] = 'application/json';
        headers['DeviceLanguage'] = 'en';

        if (data) {
            if (data.isMultipart) {
                headers['Content-Type'] = 'multipart/form-data';
            }

            if (data.headers) {
                for (var key in data.headers) {
                    if (data.headers.hasOwnProperty(key)) {
                        headers[key] = data.headers[key];
                    }
                }
            }
        }

        if (this.isLoggedIn) {
            headers['AccessToken'] = this.accessToken;
        }

        return headers;
    }
}

export default Api;
