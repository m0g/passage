import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Zeroconf from 'react-native-zeroconf'
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';
//import net from 'react-native-tcp';
//import { RTCPeerConnection } from 'react-native-webrtc';

interface State {
  hashId: string;
  listening: string;
  devices: {host: string}[];
  incomings: {address: string}[];
}

export default class App extends React.Component<State> {
  public state: State;

  constructor(props) {
    super(props);

    this.state = { hashId: '', listening: '', devices: [], incomings: [] };
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

    var socket = dgram.createSocket('udp4')
    socket.bind(9999)
    socket.once('listening', () => {
      var buf = new Buffer('excellent!')
      socket.send(buf, 0, buf.length, data.port, data.addresses[0], function(err) {
        if (err) throw err

        console.log('message was sent')
      })
    })

    socket.on('message', (msg, rinfo) => {
      console.log('message was received', msg, rinfo);
      let state = this.state;
      state.incomings.push(rinfo);
      this.setState(state);
    })
    //let server = net.createServer((socket) => {
    //  console.log('server', server);
    //  console.log('socket', socket);
    //}).listen(9999);
  }

  componentDidMount() {
    const zeroconf = new Zeroconf()
    zeroconf.register();
    zeroconf.scan();
    //zeroconf.on('start', () => {
    //  console.log('The scan has started.', zeroconf.getServices())
    //});
    zeroconf.on('resolved', this.onDeviceResolved.bind(this));
    zeroconf.on('error', data => console.log('error', data));

    //var configuration = {"iceServers": [{"url": "stun:stun.l.google.com:19302"}]};
    //var pc = new RTCPeerConnection(configuration);

    //pc.createOffer()
    //  .then(pc.setLocalDescription)
    //  .then(() => {
    //    console.log(pc);
    //    // Send pc.localDescription to peer
    //  })
    //  .catch(err => {
    //    console.error(err);
    //  });

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
        <Text>Incoming Messages.</Text>
        {this.state.incomings.map((incoming, i) =>
          <Text key={i}>{incoming.address}</Text>
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
