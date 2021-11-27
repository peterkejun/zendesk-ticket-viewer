import Axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { domain, email, api_token } from '../creds/api_token.json';

/**
 * Create the Authorization header value using email and API token
 * @returns the value of authorization header
 * @see https://developer.zendesk.com/api-reference/ticketing/introduction/#api-token
 */
const get_auth_header = (): string => {
    const credential: string = `${email}/token:${api_token}`;
    const base64_credential = Buffer.from(credential).toString('base64');
    return `Basic ${base64_credential}`;
}

/**
 * Create axios instance config object
 * @returns axios instance config object
 */
const get_axios_config = (): AxiosRequestConfig => {
    return {
        baseURL: domain,
        headers: {
            'Authorization': get_auth_header(),
        },
    };
}

/**
 * Create an axios instance with authentication and base url already configured
 * @returns axios instance
 * @see https://axios-http.com/docs/instance
 */
const create_axios_instance = (): AxiosInstance => {
    const config = get_axios_config();
    const instance = Axios.create(config);
    return instance;
}

// create axios instance
const axios = create_axios_instance();

// export common HTTP methods, piped to axios methods
export const api_get = axios.get;
export const api_post = axios.post;
export const api_patch = axios.patch;
export const api_delete = axios.delete;
