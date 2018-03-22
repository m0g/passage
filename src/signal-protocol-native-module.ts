import { NativeModules } from 'react-native';

const { SignalProtocol } = NativeModules;

function bind2String(key: string) {
  const array = key.split(', ');
  const hex = array.map(key => key.slice(6));

  let byteArray = '';
  for (let i = 0; i < hex.length; i++) {
    const charCode = parseInt(hex[i], 16);
    byteArray += String.fromCharCode(charCode);
  }

  let hexarrayout = [];
  for (let i = 0; i < byteArray.length; i++) {
      hexarrayout.push(byteArray.charCodeAt(i).toString(16));
  }

  return hexarrayout.join('');
}

export default {
  exampleMethod () {
    return SignalProtocol.exampleMethod();
  },

  generateIdentityKeyPair() {
    return SignalProtocol.generateIdentityKeyPair().then(keyPair => ({
      public: bind2String(keyPair.pubKey),
      private: bind2String(keyPair.privKey),
    }));
  },

  generateRegistrationId() {
    return SignalProtocol.generateRegistrationId();
  },

  generatePreKeys(startId) {
    return SignalProtocol.generatePreKeys(startId).then(keys => {
      return keys.map(keyPair => ({
        pubKey: bind2String(keyPair.pubKey),
        privKey: bind2String(keyPair.privKey),
      }));
    })
  },

  EXAMPLE_CONSTANT: SignalProtocol.EXAMPLE_CONSTANT
};
