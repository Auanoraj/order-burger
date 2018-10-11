import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-21fc7.firebaseio.com/'
});

export default instance;