//  Created by react-native-create-bridge

import { NativeModules } from 'react-native'

const { SignalProtocol } = NativeModules

export default {
  exampleMethod () {
    return SignalProtocol.exampleMethod()
  },

  generateIdentityKeyPair() {
		console.log('sp', SignalProtocol.generateIdentityKeyPair());
    return SignalProtocol.generateIdentityKeyPair();
  },

  generateRegistrationId() {
    return SignalProtocol.generateRegistrationId();
  },

  EXAMPLE_CONSTANT: SignalProtocol.EXAMPLE_CONSTANT
}
