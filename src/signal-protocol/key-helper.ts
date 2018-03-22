
import { NativeModules } from 'react-native';

const { SignalProtocol } = NativeModules;
const toHex = bytesStr => bytesStr.replace(/\(byte\)0x/g, '');

export default {
  generateIdentityKeyPair() {
    return SignalProtocol.generateIdentityKeyPair().then(key => ({
      pubKey: toHex(key.pubKey),
      privKey: toHex(key.privKey),
    }));
  },

  generateRegistrationId() {
    return SignalProtocol.generateRegistrationId();
  },

  generatePreKeys(startId) {
    return SignalProtocol.generatePreKeys(startId).then(preKeys => {
      return preKeys.map(preKey => ({
        pubKey: toHex(preKey.pubKey),
        privKey: toHex(preKey.privKey),
      }));
    });
  },

  generateSignedPreKey: function (identityKeyPair, signedKeyId) {
    return this.generateIdentityKeyPair().then(keyPair => {
      return SignalProtocol.calculateSignature(identityKeyPair.privKey, keyPair.pubKey)
        .then(function(sig) {
          return {
            keyId      : signedKeyId,
            keyPair    : keyPair,
            signature  : toHex(sig)
          };
        });
    });
  }
};