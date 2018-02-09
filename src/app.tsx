import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Networking from './networking';

interface State {
  hashId: string;
  listening: string;
  devices: {host: string}[];
  peers: {address: string}[];
}

export default class App extends React.Component<State> {
  public state: State;

  constructor(props) {
    super(props);

    this.state = { hashId: '', listening: '', devices: [], peers: [] };
  }

  onPeerFound(peer) {
    let state = this.state;
    state.peers.push(peer);
    this.setState(peer);
  };

  componentDidMount() {
    const networking = new Networking();

    networking.discover();
    networking.onPeerFound = this.onPeerFound.bind(this);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to Passage.</Text>
        <Text>{this.state.listening}</Text>
        <Text>Available hosts (including yourself).</Text>
        {this.state.devices.map((device, i) =>
          <Text key={i}>{device.host}</Text>
        )}
        <Text>Peers:</Text>
        {this.state.peers.map((peer, i) =>
          <Text key={i}>{peer.address}</Text>
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
