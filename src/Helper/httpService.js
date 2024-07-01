import axios from 'axios';

const httpService = axios.create({
	baseURL: 'http://192.168.1.7:5000/projectAuth'
});

export default httpService;
