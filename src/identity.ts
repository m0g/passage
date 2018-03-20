import Realm from 'realm';

import SignalProtocol from './../SignalProtocolNativeModule';

const IdentitySchema = {
  name: 'Identity',
  properties: {
    pubKey:     'string',
    privKey:     'string',
    registrationId: 'int',
  }
};

//interface Id {
//  pubKey: string;
//}

export default class Identity {
  private realm: Realm;

  constructor() {
    //Realm.deleteFile({schema: [IdentitySchema]});
    this.realm = new Realm({schema: [IdentitySchema]})
  }

  async get() {
    const identity = this.realm.objects('Identity')[0];
    //this.realm.write(() => {
    //  this.realm.delete(this.realm.objects('Identity'));
    //});

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