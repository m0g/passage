//  Created by react-native-create-bridge

import React, { Component } from 'react'
import { requireNativeComponent } from 'react-native'

const SignalProtocol = requireNativeComponent('SignalProtocol', SignalProtocolView)

export default class SignalProtocolView extends Component {
  render () {
    return <SignalProtocol {...this.props} />
  }
}

SignalProtocolView.propTypes = {
  exampleProp: React.PropTypes.any
}
