import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode';
import dgram from 'react-native-udp';

import KeyPair from './key-pair';

function randomPort() {
  return Math.random() * 60536 | 0 + 5000 // 60536-65536
}

interface State {
  hashId: string;
}

export default class App extends React.Component<State> {
  public state: State;

  constructor(props) {
    super(props);

    this.state = { hashId: '' };
  }

  componentDidMount() {
    const keyPair = new KeyPair();
    let state = this.state;

    keyPair.getHashId().then(hashId => {
      console.log(hashId);
      state.hashId = hashId;
      this.setState(state);
    });

    //keyPair.flush();

    let a = dgram.createSocket('udp4');
    let aPort = randomPort();

    a.bind(aPort, function(err) {
      if (err) throw err;
      console.log(err);
    })

    a.on('listening', () => {
      const address = a.address();
      console.log(`server listening ${address.address}:${address.port}`);
    });
  }

  render() {
    let code = <Text>Loading...</Text>;

    if (this.state.hashId.length > 0) {
      code = (<QRCode
        value={this.state.hashId}
        size={200}
        bgColor='purple'
        fgColor='white'/>);
    }

    return (
      <View style={styles.container}>
        <Text>Welcome to Passage.</Text>
        {code}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
