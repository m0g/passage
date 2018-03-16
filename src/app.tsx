import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode';

import Networking from './networking';
import SignalProtocol from './../SignalProtocolNativeModule';
import Peer from './interfaces/peer';

interface State {
  pubKey: string;
  privKey: string;
  listening: string;
  peers: Peer[];
}

export default class App extends React.Component<State> {
  public state: State;

  constructor(props) {
    super(props);

    this.state = { pubKey: '', listening: '', peers: [] };
  }

  onPeerFound(peers) {
    let state = this.state;
    state.peers = peers;
    this.setState(state);
  };

  componentDidMount() {
    const networking = new Networking();

    networking.discover();
    networking.onPeersFound = this.onPeerFound.bind(this);

    SignalProtocol.generateIdentityKeyPair().then(keys => {
      console.log('Key pari', keys);
      let state = this.state;
      state.pubKey = keys.public;
      state.privKey = keys.private;
      this.setState(state);
    });

    console.log('registration id', SignalProtocol.generateRegistrationId());

  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to Passage.</Text>
        <Text>{this.state.listening}</Text>
        <Text>Public key: {this.state.pubKey}</Text>
        <QRCode
          value={this.state.pubKey}
          size={200}
          bgColor='purple'
          fgColor='white'/>
        <Text>Peers:</Text>
        {this.state.peers.map((peer, i) =>
          <Text key={i}>{peer.host}</Text>
        )}
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
