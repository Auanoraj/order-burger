import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'

import { onLogout } from '../../../store/actions/auth';

class Logout extends Component {
    componentDidMount() {
        this.props.onLogout()
    }
  render() {
    return <Redirect to="/" />
  }
}

export default connect(null, { onLogout })(Logout);