import Zeroconf from 'react-native-zeroconf'
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';
import DeviceInfo from 'react-native-device-info';

const msgPassage = 'PASSAGE';

export default class Networking {
  private zeroconf: Zeroconf;
  private socket: dgram.createSocket;
  private isSocketBound: boolean;
  private ip: string;

  public onPeerFound: ({ address: string }) => void;

  constructor() {
    this.zeroconf = new Zeroconf();
    this.socket = dgram.createSocket('udp4');
    this.isSocketBound = false;

    DeviceInfo.getIPAddress().then(ip => {
      console.log(ip);
      this.ip = ip
    });
  }

  onBoundSocket() {
    this.isSocketBound = true;
  }

  onDeviceResolved(data) {
    const buf = new Buffer(msgPassage);

    if (this.isSocketBound && this.ip !== data.addresses[0]) {
      setTimeout(() => {
        this.socket.send(buf, 0, buf.length, data.port, data.addresses[0], this.onMsgSent);
      }, 1000);
    }

    console.log('resolved', data)
  }

  onMsgSent() {
    console.log('MSG sent');
  }

  onReceivedMessage(msg, rinfo) {
    const decodedMsg = new Buffer(msg, 'hex').toString('utf8');
    console.log('rinfo', rinfo);

    if (this.ip !== rinfo.address && decodedMsg === msgPassage) {
      this.onPeerFound({ address: rinfo.address });
    }
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
