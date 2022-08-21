import axios from 'axios';

export default function AuthUser() {
    const http = axios.create({
        baseURL: "http://localhost/laravel-pos/public/api",
        headers: {
            "Content-type": "application/json"
        }
    });
    return {
        http
    }
}