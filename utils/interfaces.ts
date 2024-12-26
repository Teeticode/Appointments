

export enum QUERY_CACHE_KEYS {
    FETCH_USER_PROFILE = "FETCH_USER_PROFILE",
    GET_IF_USER_EXISTS = "GET_IF_USER_EXISTS"
}

export interface CreateUserPayload {
    username: string,
    email: string,
    password: string,
    phone: string
}

export interface LoginUserPayload {
    email: string,
    password: string
}

export interface KejaUser {
    access_token: string;

    refresh_token: string;
    user: User;
}

export interface User {
    email: string;
    uid: string;
}
