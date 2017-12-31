import {AsyncStorage} from 'react-native';
import keypair from 'keypair';
import shajs from 'sha.js';

export default class KeyPair {
  constructor() {
  }

  generate() {
    const pair = keypair();
    const hashId = shajs('sha256').update(pair.public).digest('hex');

    return AsyncStorage
      .multiSet([
        ['@Passage:privateKey', pair.private],
        ['@Passage:publicKey', pair.public],
        ['@Passage:hashId', hashId]
      ])
      .then(() => hashId);
  }

  getHashId() {
    return AsyncStorage.getItem('@Passage:hashId')
      .then(hashId => {
        if (hashId)
          return hashId;
        else
          return this.generate();
      });
  }

  flush() {
    return AsyncStorage.multiRemove([
      '@Passage:privateKey',
      '@Passage:publicKey',
      '@Passage:hashId'
    ]);
  }
}
