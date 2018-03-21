import Zeroconf from 'react-native-zeroconf'
import dgram from 'react-native-udp';
import { Buffer } from 'buffer';
import DeviceInfo from 'react-native-device-info';
import { ToastAndroid } from 'react-native';

import Peer from './interfaces/peer';

const msgPassage = 'PASSAGE';

export default class Networking {
  private zeroconf: Zeroconf;
  private socket: dgram.createSocket;
  private isSocketBound: boolean;
  private ip: string;
  private peers: Peer[];
  private passagePeers: Peer[];

  public onPeersFound: ([]) => void;

  constructor() {
    this.zeroconf = new Zeroconf();
    this.socket = dgram.createSocket('udp4');
    this.isSocketBound = false;
    this.peers = [];
    this.passagePeers = [];
    this.pingLocalPeers = this.pingLocalPeers.bind(this);

    DeviceInfo.getIPAddress().then(ip => {
      this.ip = ip
    });
  }

  onBoundSocket() {
    this.isSocketBound = true;
  }

  addLocalPeer(newPeer: Peer) {
    let isPeerExisting = false;

    this.peers.forEach(peer => {
      if (peer.ip === newPeer.ip) {
        isPeerExisting = true;
      }
    });

    if (!isPeerExisting) {
      this.peers.push(newPeer);
    }

    return isPeerExisting;
  }

  addPassagePeer(newPeer: Peer) {
    let isPeerExisting = false;

    this.passagePeers.forEach(peer => {
      if (peer.ip === newPeer.ip) {
        isPeerExisting = true;
      }
    });

    if (!isPeerExisting) {
      this.passagePeers.push(newPeer);
    }

    return isPeerExisting;
  }


  getPeerFromHost(host) {
    let foundPeer = { host: '', ip: '', port: 0 }

    this.peers.forEach(peer => {
      if (peer.host === host) {
        foundPeer = peer;
      }
    });

    return foundPeer;
  }

  onDeviceResolved(data) {
    if (this.isSocketBound && this.ip !== data.addresses[0]) {
      this.addLocalPeer({ host: data.host, ip: data.addresses[0], port: data.port });
    }
  }

  onMsgSent() {
  }

  onReceivedMessage(msg, rinfo) {
    const decodedMsg = new Buffer(msg, 'hex').toString('utf8');
    const peer = this.getPeerFromHost(rinfo.address);

    ToastAndroid.show(`incoming ${rinfo.address} ${decodedMsg}`, ToastAndroid.SHORT);

    if (peer.host !== '' && this.ip !== peer.ip && decodedMsg === msgPassage) {
      this.addPassagePeer(peer);
      this.onPeersFound(this.passagePeers);
    }
  }

  pingLocalPeers() {
    ToastAndroid.show(`Ping local peers ${this.peers.length}`, ToastAndroid.SHORT);

    const buf = new Buffer(msgPassage);

    this.peers.forEach(peer => {
      this.socket.send(buf, 0, buf.length, peer.port, peer.ip, this.onMsgSent);
    });

    setTimeout(this.pingLocalPeers, 5000);
  }

  discover() {
    this.socket.bind(9999)
    this.socket.once('listening', this.onBoundSocket.bind(this));
    this.socket.on('message', this.onReceivedMessage.bind(this));

    this.zeroconf.register();
    this.zeroconf.scan();
    this.zeroconf.on('resolved', this.onDeviceResolved.bind(this));
    this.zeroconf.on('error', data => console.log('error', data));

    this.pingLocalPeers();
  }
};
