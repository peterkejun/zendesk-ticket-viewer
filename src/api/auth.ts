import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { domain, email, api_token } from '../creds/api_token.json';

const get_auth_header = (): string => {
    const credential: string = `${email}/token:${api_token}`;
    const base64_credential = Buffer.from(credential).toString('base64');
    return `Basic ${base64_credential}`;
}

const get_axios_config = (): AxiosRequestConfig => {
    return {
        baseURL: domain,
        headers: {
            'Authorization': get_auth_header(),
        },
    };
}

const create_axios_instance = (): AxiosInstance => {
    const config = get_axios_config();
    const instance = Axios.create(config);
    return instance;
}

const axios = create_axios_instance();

export const api_get = axios.get;
export const api_post = axios.post;
export const api_patch = axios.patch;
export const api_delete = axios.delete;
