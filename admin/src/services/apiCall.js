import axios from "axios";

const apiUrl ="http://localhost:3001";

const instance = axios.create({
    baseURL: apiUrl
});
instance.defaults.headers.common["Content-Type"] = `application/json`;

export default instance;