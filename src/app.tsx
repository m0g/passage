import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Networking from './networking';

import Peer from './interfaces/peer';

interface State {
  hashId: string;
  listening: string;
  peers: Peer[];
}

export default class App extends React.Component<State> {
  public state: State;

  constructor(props) {
    super(props);

    this.state = { hashId: '', listening: '', peers: [] };
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
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to Passage.</Text>
        <Text>{this.state.listening}</Text>
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
