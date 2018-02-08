import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Zeroconf from 'react-native-zeroconf'

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
    let isExisting = false;
    let state = this.state;

    state.devices.forEach(device => {
      if (device.host === data.host)
        isExisting = true;
    });

    if (!isExisting) {
      state.devices.push(data);
      this.setState(state);
    }
  }

  componentDidMount() {
    const zeroconf = new Zeroconf()
    zeroconf.register();
    zeroconf.scan();
    zeroconf.on('start', () => {
      console.log('The scan has started.', zeroconf.getServices())
    });
    zeroconf.on('resolved', this.onDeviceResolved.bind(this));
    zeroconf.on('error', data => console.log('error', data));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to Passage.</Text>
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
