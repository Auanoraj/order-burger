import React, { Component } from 'react';
import { connect } from 'react-redux';

import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import { fetchOrders } from '../../store/actions/order';
import Spinner from '../../components/UI/Spinner/Spinner';

class Orders extends Component {
  componentDidMount() {
      const token = this.props.token;
      const userId = this.props.userId;
      this.props.fetchOrders(token, userId);
  }

  render() {
      let orders = <Spinner />;
      if (!this.props.loading) {
        orders = this.props.orders.map(order => (
            <Order 
              key={order.id}
              ingredients={order.ingredients}
              price={+order.price} />
          ))
      }
    return (
      <div>
          {orders}
      </div>
    )
  }
}

const mapStateToProps = state => ({
    orders: state.order.orders,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
})

export default connect(mapStateToProps, { fetchOrders })(withErrorHandler(Orders, axios));