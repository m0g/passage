import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
//import QRCode from 'react-native-qrcode';
import dgram from 'react-native-udp';

//import KeyPair from './key-pair';

//function randomPort() {
//  return Math.random() * 60536 | 0 + 5000 // 60536-65536
//}

interface State {
  hashId: string;
  listening: string;
}

export default class App extends React.Component<State> {
  public state: State;

  constructor(props) {
    super(props);

    this.state = { hashId: '', listening: '' };
  }

  componentDidMount() {
    //const keyPair = new KeyPair();

    //keyPair.flush();
    //keyPair.getHashId().then(hashId => {
    //  let state = this.state;
    //  console.log(hashId);
    //  state.hashId = hashId;
    //  this.setState(state);
    //});

    let a = dgram.createSocket('udp4');
    //let aPort = randomPort();

    //console.log(aPort);
    a.bind(7053);

    a.on('listening', (err) => {
      console.log(err);
      const address = a.address();
      let state = this.state;
      state.listening = `server listening ${address.address}:${address.port}`;
      this.setState(state);
    });
  }

  render() {
    let code = <Text>Loading...</Text>;

    //if (this.state.hashId.length > 0) {
    //  code = (<QRCode
    //    value={this.state.hashId}
    //    size={200}
    //    bgColor='purple'
    //    fgColor='white'/>);
    //}

    return (
      <View style={styles.container}>
        <Text>Welcome to Passage.</Text>
        {code}
        <Text>{this.state.listening}</Text>
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
