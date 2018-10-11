import React, { Component } from 'react';
import { connect } from 'react-redux';

import axios from '../../../src/axios-orders';
import Aux from '../../hoc/Auxx/auxx';
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { setAuthRedirectPath } from '../../store/actions/auth';
import { addIngredient, initIngredients, removeIngredient } from '../../store/actions/burgerBuilder';
import { purchaseInit } from '../../store/actions/order';

class BurgerBuilder extends Component { 
    state = {
        purchasing: false
    }

  componentDidMount() {
      this.props.initIngredients();
  }

  updatePurchaseState = (ingredients) => {
      const sum = Object.keys(ingredients)
      .map(igKey => {
          return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum  + el;
      }, 0);
      return sum > 0;
  }

  purchaseHandler = () => {
      if (this.props.isAuthenticated) {
          this.setState({ purchasing: true });
      } else {
          this.props.setAuthRedirectPath('/checkout');
          this.props.history.push('/auth');
      }
  }

  purchaseCancelHandler = () => {
      this.setState({ purchasing: false });
  }

  purchaseContinueHandler = () => {
    this.props.purchaseInit();
    this.props.history.push('/checkout');
  }

  render() { 
      const disabledInfo = {
          ...this.props.ings
      };
      for (let key in disabledInfo) {
          disabledInfo[key] = disabledInfo[key] <= 0
      }

      let orderSummary = null;
      let burger = this.props.error ? <p style={{ textAlign: 'center' }}>Ingredients can't be loaded.</p> : <Spinner />;

      if (this.props.ings) {
        burger = (
            <Aux>
              <Burger ingredients={this.props.ings} />
                  <BuildControls 
                  ingredientAdded={this.props.addIngredient}
                  ingredientRemoved={this.props.removeIngredient}
                  disabled={disabledInfo}
                  purchasable={this.updatePurchaseState(this.props.ings)}
                  ordered={this.purchaseHandler}
                  isAuth={this.props.isAuthenticated}
                  price={this.props.price} />
           </Aux>
           );
           orderSummary = <OrderSummary 
                            ingredients={this.props.ings}
                            totalPrice={this.props.price}
                            purchaseCancelled={this.purchaseCancelHandler}
                            purchaseContinued={this.purchaseContinueHandler} />
      }

    return (
        <Aux>
            <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                {orderSummary}
            </Modal>
                {burger}
        </Aux>
    )
  }
}

const mapStateToProps = state => ({
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
});

export default connect(mapStateToProps, 
    { addIngredient, 
        initIngredients, 
        removeIngredient, 
        purchaseInit,
        setAuthRedirectPath })(withErrorHandler(BurgerBuilder, axios));