import {AsyncStorage} from 'react-native';
import keypair from 'keypair';

export default class KeyPair {
  constructor() {
  }

  generate() {
    const pair = keypair();

    return AsyncStorage
      .multiSet([['@Passage:privateKey', pair.private], ['@Passage:publicKey', pair.public]])
      .then(() => pair.public);
  }

  getPub() {
    return AsyncStorage.getItem('@Passage:publicKey')
      .then(pubKey => {
        if (pubKey)
          return pubKey;
        else
          return this.generate();
      });
  }

  flush() {
    return AsyncStorage.multiRemove(['@Passage:privateKey', '@Passage:publicKey']);
  }
}
