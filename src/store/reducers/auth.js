import { 
    AUTH_FAIL,
    AUTH_START,
    AUTH_SUCCESS, 
    AUTH_LOGOUT,
    SET_AUTH_REDIRECT_PATH} from '../actions/actionTypes';

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    authRedirectPath: '/'
};

const reducers = (state = initialState, action) => {
    switch (action.type) {
        case AUTH_FAIL:
            return {
                ...state,
                error: action.error,
                loading: false
            }
        case AUTH_LOGOUT: 
            return {
                ...state,
                token: null,
                userId: null
            }
        case AUTH_START:
            return {
                ...state,
                error: null,
                loading: true
            }
        case AUTH_SUCCESS: 
            return {
                ...state,
                token: action.tokenId,
                userId: action.userId,
                loading: false
            }
        case SET_AUTH_REDIRECT_PATH: 
            return {
                ...state,
                authRedirectPath: action.path
            }
        default:
            return state;
    }
}

export default reducers;