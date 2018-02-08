import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Zeroconf from 'react-native-zeroconf'
//import KeyPair from './key-pair';

//function randomPort() {
//  return Math.random() * 60536 | 0 + 5000 // 60536-65536
//}

interface State {
  hashId: string;
  listening: string;
  devices: {host: string}[];
}

export default class App extends React.Component<State> {
  public state: State;

  constructor(props) {
    super(props);

    this.state = { hashId: '', listening: '', devices: [] };
  }

  onDeviceResolved(data) {
    console.log('resolved', data)

    let state = this.state;
    state.devices.push(data);
    this.setState(state);
  }

  componentDidMount() {
    const zeroconf = new Zeroconf()
    zeroconf.register();
    zeroconf.scan();
    zeroconf.on('start', () => {
      console.log('The scan has started.', zeroconf.getServices())
    });
    //zeroconf.on('update', () => console.log('Update'));
    //zeroconf.on('found', data => console.log('found', data));
    zeroconf.on('resolved', this.onDeviceResolved.bind(this));
    zeroconf.on('error', data => console.log('error', data));
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
        {this.state.devices.map((device, i) =>
          <Text key={i}>{device.host}</Text>
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
