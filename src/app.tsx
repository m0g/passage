import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode';

import KeyPair from './key-pair';

interface State {
  pair: { pubKey: string };
}

export default class App extends React.Component<State> {
  public state: State;

  constructor(props) {
    super(props);

    this.state = { pair: { pubKey: '' } };
  }

  componentDidMount() {
    let state = this.state;

    const keyPair = new KeyPair();
    //keyPair.flush();

    keyPair.getPub().then(pubKey => {
      console.log(pubKey);
      state.pair.pubKey = pubKey;
      this.setState(state);
    });
  }

  render() {
    let code = <Text>Loading...</Text>;

    if (this.state.pair.pubKey.length > 0) {
      code = (<QRCode
        value={this.state.pair.pubKey}
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
