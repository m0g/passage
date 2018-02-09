import Zeroconf from 'react-native-zeroconf'
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';

export default class Networking {
  private zeroconf: Zeroconf;
  private socket: dgram.createSocket;
  private isSocketBound: boolean;

  public onPeerFound: ({ address: string }) => void;

  constructor() {
    this.zeroconf = new Zeroconf();
    this.socket = dgram.createSocket('udp4');
    this.isSocketBound = false;
  }

  onBoundSocket() {
    this.isSocketBound = true;
  }

  onDeviceResolved(data) {
    console.log('resolved', data)
    console.log('is socket bound', this.isSocketBound);
    //let isExisting = false;
    //let state = this.state;
    const buf = new Buffer('excellent!')
    this.socket.send(buf, 0, buf.length, data.port, data.addresses[0], this.onMsgSent);

    //state.devices.forEach(device => {
    //  if (device.host === data.host)
    //    isExisting = true;
    //});

    //if (!isExisting) {
    //  state.devices.push(data);
    //  this.setState(state);
    //}

    //this.socket.bind(9999)
    //this.socket.once('listening', () => {
    //  var buf = new Buffer('excellent!')
    //  this.socket.send(buf, 0, buf.length, data.port, data.addresses[0], function(err) {
    //    if (err) throw err

    //    console.log('message was sent')
    //  })
    //})

    //this.socket.on('message', (msg, rinfo) => {
    //  console.log('message was received', msg, rinfo);
    //  //let state = this.state;
    //  //state.incomings.push(rinfo);
    //  //this.setState(state);
    //})
  }

  onMsgSent() {
    console.log('MSG sent');
  }

  onReceivedMessage(msg, rinfo) {
    console.log('message was received', msg, rinfo);
    this.onPeerFound({ address: rinfo.address });
  }

  discover() {
    this.socket.bind(9999)
    this.socket.once('listening', this.onBoundSocket.bind(this));
    this.socket.on('message', this.onReceivedMessage.bind(this));

    this.zeroconf.register();
    this.zeroconf.scan();
    this.zeroconf.on('resolved', this.onDeviceResolved.bind(this));
    this.zeroconf.on('error', data => console.log('error', data));
  }
};
