import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode';

import KeyPair from './key-pair';

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
