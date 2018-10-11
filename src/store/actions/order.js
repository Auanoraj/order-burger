import { 
    FETCH_ORDERS_FAIL,
    FETCH_ORDERS_START,
    FETCH_ORDERS_SUCCESS,
    PURCHASE_BURGER_FAIL,
    PURCHASE_INIT,
    PURCHASE_BURGER_START, 
    PURCHASE_BURGER_SUCCESS } from './actionTypes'; 
import axios from '../../axios-orders';

export const onOrderBurger = (orderData, token) => dispatch => {
    dispatch(purchaseBurgerStart());
    axios.post('/orders.json?auth=' + token, orderData)
            .then(res => {
                dispatch({
                    type: PURCHASE_BURGER_SUCCESS,
                    orderId: res.data.name,
                    orderData: orderData
                })
            })
            .catch(err => {
                dispatch({
                    type: PURCHASE_BURGER_FAIL
                })
            });
        }   

export const purchaseBurgerStart = () => ({
    type: PURCHASE_BURGER_START
});

export const purchaseInit = ()  => ({
    type: PURCHASE_INIT
});

export const fetchOrders = (token, userId) => dispatch => {
    dispatch(fetchOrdersStart());
    const queryParams = '?auth=' +token + '&orderBy="userId"&equalTo="' + userId + '"';
    axios.get('/orders.json' + queryParams)
        .then(res => {
            const fetchedOrders = [];
            for (let key in res.data) {
                fetchedOrders.push({
                    ...res.data[key],
                    id: key
                });
            }
            dispatch({
                type: FETCH_ORDERS_SUCCESS,
                orders: fetchedOrders
            })
        })
        .catch(err => {
            dispatch({
                type: FETCH_ORDERS_FAIL,
                error: err
            })
        });
}

export const fetchOrdersStart = () => {
    return {
        type: FETCH_ORDERS_START
    };
};