import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import keypair from 'keypair';
import QRCode from 'react-native-qrcode';

interface State {
  pair: { public: string, private: string };
}

export default class App extends React.Component<State> {
  public state: State;

  constructor(props) {
    super(props);

    const pair = keypair();
    console.log(pair);
    this.state = { pair: pair };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to Passage.</Text>
        <QRCode
          value={this.state.pair.public}
          size={200}
          bgColor='purple'
          fgColor='white'/>
        <Text>{this.state.pair.public}</Text>
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
