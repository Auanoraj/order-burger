import axios from 'axios';

import { 
    AUTH_FAIL, 
    AUTH_LOGOUT,
    AUTH_START, 
    AUTH_SUCCESS, 
    SET_AUTH_REDIRECT_PATH} from './actionTypes';

export const authStart = () => ({
        type: AUTH_START
});

export const onAuth = (authData, isSignup) => dispatch => {
   dispatch(authStart());
   let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBhTLirkug1Y2DQXOhpacnQnRu03sl-L3E';
   if (!isSignup) {
       url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBhTLirkug1Y2DQXOhpacnQnRu03sl-L3E'
   }
   axios.post(url, authData)
            .then(res => {
                const expirationDate = new Date(new Date().getTime() + res.data.expiresIn * 1000);
                localStorage.setItem('token', res.data.idToken);
                localStorage.setItem('expirationDate', expirationDate)
                localStorage.setItem('userId', res.data.localId);
                dispatch({
                    type: AUTH_SUCCESS,
                    tokenId: res.data.idToken,
                    userId: res.data.localId
                })
                dispatch(checkAuthTimeout(res.data.expiresIn))
            })
            .catch(err => {
                console.log(err.response.data.error.message);
                dispatch({
                    type: AUTH_FAIL,
                    error: err.response.data.error
                })
        })
}

export const onLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    return {
        type: AUTH_LOGOUT
}};

export const checkAuthTimeout = (expirationTime) => dispatch => {
    setTimeout(() => {
        dispatch(onLogout())
    }, expirationTime * 1000)
}

export const setAuthRedirectPath = (path) => ({
    type: SET_AUTH_REDIRECT_PATH,
    path
});

export const onTryAutoSignup = () => dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
        dispatch(onLogout());
    } else {
        const expirationDate = new Date(localStorage.getItem('expirationDate'));
        if (expirationDate <= new Date()) {
            dispatch(onLogout());
        } else {
            const userId = localStorage.getItem('userId');
            dispatch({
                type: AUTH_SUCCESS,
                tokenId: token,
                userId: userId
            });
            dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
        }
    }
}