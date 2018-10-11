import { 
    ADD_INGREDIENT, 
    FETCH_INGREDIENTS_FAILED,
    REMOVE_INGREDIENT,
    SET_INGREDIENTS } from './actionTypes';
import axios from '../../axios-orders';

export const addIngredient = name => ({
    type: ADD_INGREDIENT,
    ingredientName: name
});

export const removeIngredient = name => ({
    type: REMOVE_INGREDIENT,
    ingredientName: name
});

export const initIngredients = () => dispatch => {
    axios.get('https://burger-21fc7.firebaseio.com/ingredients.json')
            .then(res => {
                dispatch({
                    type: SET_INGREDIENTS,
                    ingredients: res.data
                })
            })
            .catch(err => 
                dispatch({
                    type: FETCH_INGREDIENTS_FAILED
                })
            )
}