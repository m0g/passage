import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
var keypair = require('keypair');
 
var pair = keypair();
console.log(pair);
export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to Passage.</Text>
        <Text>{pair.public}</Text>
        <Text>{pair.private}</Text>
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
