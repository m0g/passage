//  Created by react-native-create-bridge

import { NativeModules } from 'react-native'

const { SignalProtocol } = NativeModules

function bind2String(array) {
  console.log('array', array);
  const hex = array.map(key => key.slice(6));
  //return String.fromCharCode.apply(String, hex);

  let byteArray = '';
  for (var i=0; i < hex.length; i++) {
      byteArray += String.fromCharCode( parseInt(hex[i], 16).toString(16) );
  }

  var hexarrayout = [];
  for (var i=0; i<byteArray.length; i++) {
      hexarrayout.push(byteArray.charCodeAt(i).toString(16));
  }

  return hexarrayout.join('');
}

export default {
  exampleMethod () {
    return SignalProtocol.exampleMethod()
  },

  generateIdentityKeyPair() {
    return SignalProtocol.generateIdentityKeyPair().then(arr => {
      const pubKey = bind2String(arr[0].split(', '));
      const privKey = bind2String(arr[1].split(', '));

      return { public: pubKey, private: privKey };
    });

  },

  generateRegistrationId() {
    return SignalProtocol.generateRegistrationId();
  },

  EXAMPLE_CONSTANT: SignalProtocol.EXAMPLE_CONSTANT
}
