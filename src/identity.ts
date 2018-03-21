import Realm from 'realm';

import SignalProtocol from './signal-protocol-native-module';

const identitySchema = {
  name: 'Identity',
  properties: {
    pubKey:     'string',
    privKey:     'string',
    registrationId: 'int',
  }
};

export default class Identity {
  private realm: Realm;

  constructor() {
    //Realm.deleteFile({schema: [IdentitySchema]});
    this.realm = new Realm({schema: [identitySchema]});
  }

  async get() {
    const identity = this.realm.objects('Identity')[0];
    //this.realm.write(() => {
    //  this.realm.delete(this.realm.objects('Identity'));
    //});

    SignalProtocol.generatePreKeys(100).then(preKeys => {
      console.log('pre keys', preKeys);
    })

    if (identity) {
      return identity;
    } else {
      const keys = await SignalProtocol.generateIdentityKeyPair();
      const id = await SignalProtocol.generateRegistrationId();

      this.realm.write(() => {
        this.realm.create('Identity', {
          pubKey: keys.public,
          privKey: keys.private,
          registrationId: id
        });
      });

      return this.realm.objects('Identity')[0];
    }
  }
}
