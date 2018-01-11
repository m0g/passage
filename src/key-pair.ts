import {AsyncStorage} from 'react-native';
import keypair from 'keypair';
import shajs from 'sha.js';

export default class KeyPair {
  constructor() {}

  generate() {
    const pair = keypair();
    const hashId = shajs('sha256').update(pair.public).digest('hex');
    console.log('sha256', hashId);

    return AsyncStorage
      .multiSet([
        ['@Passage:privateKey', pair.private],
        ['@Passage:publicKey', pair.public],
        ['@Passage:hashId', hashId]
      ])
      .then(() => hashId);
  }

  async getHashId() {
    try {
      console.log('getting hash');
      const hashId = await AsyncStorage.getItem('@Passage:hashId');

      console.log('HASH', hashId);
      if (hashId) {
        return hashId;
      } else {
        return this.generate();
      }
    } catch(err) {
      console.log(err);
    }
  }

  flush() {
    console.log('Flushing...');
    return AsyncStorage.multiRemove([
      '@Passage:privateKey',
      '@Passage:publicKey',
      '@Passage:hashId'
    ]);
  }
}
