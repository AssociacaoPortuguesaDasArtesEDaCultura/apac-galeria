import axios, { Axios, AxiosError, AxiosResponse } from 'axios';
import { ProductType } from './types/product';
import { NestedPartial } from './types/nestedPartial';
import { Result, err, ok } from './types/result';
import { User } from './types/user';
import { decodeToken } from 'react-jwt';
import { StringKeyframeTrack } from 'three';
//import mime from 'mime';

const BASE_URL = 'http://localhost';
export const API_URL = BASE_URL + ':11000/';
export const API_URL_USER = BASE_URL + ':11000/user';
export const API_URL_PROD = BASE_URL + ':11000/product';
export const API_URL_MAIL = BASE_URL + ':11000/email';
export const API_URL_SHIP = BASE_URL + ':11000/shipment';
export const API_URL_NOTIF = BASE_URL + ':11000/notification';
export const API_URL_PAY = BASE_URL + ':11000/payment';
export const AUTH_URL = BASE_URL + ':11001';
//export const BASE_URL = 'http:/192.168.1.68:8000/api';

export const loginUser = async (email: string, password: string) => {
    console.log('Logging in user');
    console.log('credentials: ', email, '|', password);
    try {
        const response = await axios.post(`${AUTH_URL}/login`, {
            username: email,
            password,
        });
        console.log('resposta: ', response.data);
        return response.data;
    } catch (err) {
        console.log('Error during login: ' + err.message);
        return err.response;
    }
};

export const fetchUser = async (id: string, level: string, token: string) => {
    console.log('Fetching user ' + email);

    if (level === 'admin' || level === 'client') {
        try {
            const response = await axios.get(
                `${API_URL_USER}/client/${id}?token=${token}`
            );
            return response.data;
        } catch (err) {
            console.log('Error fetching client: ' + err.message);
            throw err.message;
        }
    } else if (level === 'admin' || level === 'seller') {
        try {
            const response = await axios.get(
                `${API_URL_USER}/seller/${id}?token=${token}`
            );
            return response.data;
        } catch (err) {
            console.log('Error fetching artist: ' + err.message);
            throw err.message;
        }
    }
};

export const registerUser = async (body: FormData) => {
    console.log('Registering user');
    console.log('body: ', body);
    var object = {};
    body.forEach(function (value, key) {
        object[key] = value;
    });
    var json = JSON.stringify(object);
    console.log('json: ', object);

    try {
        const response = await axios.post(`${AUTH_URL}/registo`, object);
        console.log('resposta: ', response.data);
        return response.data;
    } catch (err) {
        console.log('Error during register: ' + err.message);
        throw err.response;
    }
};

export async function createOrder(body: [{ id: string; amount: number }]) {
    console.log('Creating Order');
    console.log('body: ', body);

    const json = JSON.stringify(body);
    console.log('json: ', json);

    try {
        const response = await axios.post(`${AUTH_URL}/paypal/orders`, json);
        console.log('resposta: ', response.data);
        return response.data;
    } catch (err) {
        console.log('Error during register: ' + err.message);
        throw err.response;
    }
}

export async function onApprove(data) {
    console.log('Capturing Order');
    console.log('data: ', data);

    const json = JSON.stringify({
        payPalOrderId: data.orderID,
    });
    console.log('json: ', json);

    try {
        const response = await axios.post(
            `${AUTH_URL}/paypal/orders/${data.orderID}/capture`,
            json
        );
        console.log('resposta: ', response.data);
        return response.data;
    } catch (err) {
        console.log('Error during register: ' + err.message);
        throw err.response;
    }
}
export const getProduct = async (id: string) => {
    console.log('Fetching product with id ' + id);

    try {
        const response = await axios.get(`${API_URL_PROD}/${id}`);
        console.log('response: ', response.data);
        return response.data;
    } catch (err) {
        console.log('Error fetching product: ' + err.message);
        throw err.response;
    }
};

export const uploadProductPhotos = async (
    token: string,
    id: string,
    photos: FileList
): Promise<Result<string, Error>> => {
    try {
        const data: FormData = new FormData();
        for (const photo of photos) {
            data.append('files', photo);
        }

        const response = await axios.post(
            `${API_URL_PROD}/${id}/photos`,
            data,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
                params: {
                    token: token,
                },
            }
        );
        return ok(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return err(error);
        } else {
            return err(new Error('Unexpected error'));
        }
    }
};

export const sendEmail = async (toEmail, subject, message) => {
    try {
        const response = await axios.post(`${API_URL_MAIL}/send`, {
            email: toEmail,
            subject: '[Contacto Site] ' + subject,
            text: message + '\n\n Enviado por: ' + toEmail,
        });
        return response.data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export const getMaxPrice = async () => {
    try {
        const response = await axios.get(`${API_URL_PROD}/maxPrice`);
        return response.data;
    } catch (error) {
        console.error('Error getting max price:', error);
        throw error;
    }
};

export const getApiUsers = async (token: string, query: object) => {
    try {
        const response = await axios.get(`${API_URL_USER}`, {
            params: {
                limit: 0,
                ...query,
                token: token,
            },
        });
        console.log('API Users:', response.data.results);
        return response.data.results;
    } catch (error) {
        console.error('Error getting users:', error);
        throw error;
    }
};

export const getAuthUsers = async (token: string) => {
    try {
        const response = await axios.get(`${AUTH_URL}/notAdmin`, {
            params: {
                token: token,
            },
        });
        console.log('Auth Users:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error getting users:', error);
        throw error;
    }
};

export const getShipments = async (token: string) => {
    try {
        const response = await axios.get(`${API_URL_SHIP}`, {
            params: {
                token: token,
                limit: 0,
            },
        });
        console.log('Shipments:', response.data.results);
        return response.data.results;
    } catch (error) {
        console.error('Error getting shipments:', error);
        throw error;
    }
};

export const addProduct = async (
    product: NestedPartial<ProductType>,
    token: string
): Promise<Result<object, Error>> => {
    if (product.price == null) product.price = 0;

    try {
        const response = await axios.post(`${API_URL_PROD}`, product, {
            params: {
                token: token,
            },
        });
        return ok(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return err(error);
        } else {
            return err(new Error('Unexpected error'));
        }
    }
};

export const updateProduct = async (
    product: NestedPartial<ProductType>,
    token: string,
    productId: string
): Promise<Result<object, Error>> => {
    if (product.price == null) product.price = 0;

    try {
        const response = await axios.patch(`${API_URL_PROD}`, product, {
            params: {
                token: token,
            },
        });
        return ok(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return err(error);
        } else {
            return err(new Error('Unexpected error'));
        }
    }
};

export const createUser = async (
    userInfo: NestedPartial<User>,
    token: string
): Promise<Result<object, Error>> => {
    try {
        const response = await axios.post(
            `${AUTH_URL}/admin/registo`,
            userInfo,
            {
                params: {
                    token: token,
                },
            }
        );
        return ok(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return err(error);
        } else {
            return err(new Error('Unexpected error'));
        }
    }
};

export const updateUser = async (
    userInfo: NestedPartial<User>,
    token: string
): Promise<Result<string, Error>> => {
    try {
        const decodedToken = decodeToken(token);
        const response = await axios.patch(
            `${API_URL_USER}/${(decodedToken as { _id: string })._id}`,
            userInfo,
            {
                params: {
                    token: token,
                },
            }
        );
        return ok(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return err(error);
        } else {
            return err(new Error('Unexpected error'));
        }
    }
};

export const uploadPhoto = async (
    token: string,
    id: string,
    photo: File
): Promise<Result<string, Error>> => {
    try {
        const data: FormData = new FormData();
        data.append('file', photo);
        const response = await axios.post(
            `${API_URL_USER}/${id}/avatar`,
            data,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
                params: {
                    token: token,
                },
            }
        );
        return ok(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return err(error);
        } else {
            return err(new Error('Unexpected error'));
        }
    }
};

export const checkLink = (link) => {
    const regex = new RegExp('^(http|https)://', 'i');
    if (regex.test(link)) return link;
    else return API_URL + link;
};

export const getNotifications = async (token: string) => {
    try {
        const response = await axios.get(`${API_URL_NOTIF}`, {
            params: {
                token: token,
            },
        });
        console.log('Notifications:', response.data.results);
        return response.data.results;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
