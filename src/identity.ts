import Realm from 'realm';

import { KeyHelper } from './signal-protocol';

const identityKeyPairSchema = {
  name: 'IdentityKeyPair',
  properties: {
    pubKey:     'string',
    privKey:     'string',
    registrationId: 'int',
  }
};

const preKeySchema = {
  name: 'PreKeys',
  properties: {
    pubKey: 'string',
    privKey: 'string',
  }
};

const signedPreKeySchema = {
  name: 'SignedPreKey',
  properties: {
    keyId: 'int',
    pubKey: 'string',
    privKey: 'string',
    signature: 'string',
  }
};

interface KeyPair {
  pubKey: string;
  privKey: string;
}

export default class Identity {
  private realm: Realm;

  constructor() {
    // Realm.deleteFile({schema: [
    //   identityKeyPairSchema,
    //   preKeySchema,
    //   signedPreKeySchema
    // ]});

    this.realm = new Realm({schema: [
      identityKeyPairSchema,
      preKeySchema,
      signedPreKeySchema
    ]});

    if (!this.realm.objects('IdentityKeyPair')[0]) {
      this.generateIdentity();
    }
  }

  async generateIdentity() {
    const identityKeyPair = await KeyHelper.generateIdentityKeyPair();
    const registrationId = await KeyHelper.generateRegistrationId();
    const preKeys = await KeyHelper.generatePreKeys(100);
    const signedPreKey = await KeyHelper.generateSignedPreKey(identityKeyPair, 5);

    console.log('identity', identityKeyPair, registrationId, preKeys, signedPreKey);

    this.realm.write(() => {
      this.realm.create('IdentityKeyPair', {
        pubKey: identityKeyPair.pubKey,
        privKey: identityKeyPair.privKey,
        registrationId: registrationId
      });

      preKeys.forEach(preKey => {
        this.realm.create('PreKeys', {
          pubKey: preKey.pubKey,
          privKey: preKey.privKey,
        });
      });

      this.realm.create('SignedPreKey', {
        keyId: signedPreKey.keyId,
        pubKey: signedPreKey.keyPair.pubKey,
        privKey: signedPreKey.keyPair.privKey,
        signature: signedPreKey.signature,
      });
    });
  }

  getPubKey() {
    const identityKeyPair = <KeyPair>this.realm.objects('IdentityKeyPair')[0];

    return identityKeyPair.pubKey;
  }
}
