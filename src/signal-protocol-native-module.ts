import { NativeModules } from 'react-native';

const { SignalProtocol } = NativeModules;

// function bind2String(key: string) {
//   const array = key.split(', ');
//   const hex = array.map(el => el.slice(6));

//   let byteArray = '';
//   for (let i = 0; i < hex.length; i++) {
//     const charCode = parseInt(hex[i], 16);
//     byteArray += String.fromCharCode(charCode);
//   }

//   let hexarrayout = [];
//   for (let i = 0; i < byteArray.length; i++) {
//       hexarrayout.push(byteArray.charCodeAt(i).toString(16));
//   }

//   return hexarrayout.join('');
// }

// function buf2hex(buffer) { // buffer is an ArrayBuffer
//   return Array.prototype.map.call(
//     new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)
//   ).join('');
// }

// function hex2buf(hex) {
//   return new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
//     return parseInt(h, 16)
//   }))
// }

export default {
  exampleMethod () {
    return SignalProtocol.exampleMethod();
  },

  generateIdentityKeyPair() {
    return SignalProtocol.generateIdentityKeyPair();
    // return SignalProtocol.generateIdentityKeyPair().then(keyPair => ({
    //   public: bind2String(keyPair.pubKey),
    //   private: bind2String(keyPair.privKey),
    // }));
  },

  generateRegistrationId() {
    return SignalProtocol.generateRegistrationId();
  },

  generatePreKeys(startId) {
    return SignalProtocol.generatePreKeys(startId);
    // return SignalProtocol.generatePreKeys(startId).then(keys => {
    //   return keys.map(keyPair => ({
    //     pubKey: bind2String(keyPair.pubKey),
    //     privKey: bind2String(keyPair.privKey),
    //   }));
    // });
  },

  generateSignedPreKey: function (identityKeyPair, signedKeyId) {
    // const identityKeyPair = {
    //   privKey: hex2buf(identityKeyPairHex.privKey),
    //   pubKey: hex2buf(identityKeyPairHex.pubKey),
    // };

    // Convert identityKeyPair to array buffer
    return this.generateIdentityKeyPair().then(keyPair => {
      console.log('priv', identityKeyPair.privKey);
      console.log('pub', keyPair.pubKey);

      return SignalProtocol.calculateSignature(identityKeyPair.privKey, keyPair.pubKey)
        .then(function(sig) {
          return {
            keyId      : signedKeyId,
            keyPair    : keyPair,
            signature  : sig
          };
        });
    });
  },

  EXAMPLE_CONSTANT: SignalProtocol.EXAMPLE_CONSTANT
};
