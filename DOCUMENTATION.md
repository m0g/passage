# Passage instant messenger

## Introduction
Passage IM is an open source distributed & decentralized instant messaging android application. It is written in javascript and relies on react-native. Its communications are end-to-end encrypted using the libsignal protocol.

### functionalities
* The same account should be accessible from multiple devices (a la telegram)
* Group conversations
* GIFs support

## Usage
Upon first firing the app, the user will be invited to generate a unique RSA key pair used an identifiant on the network. this will translate into a text id as well as a QR code that the user can safely use over the network.


## Technical description

### Authentication on the network 
Upon firing the app for the time, a pair of private/public keys as well as a hash ID of the public key will be created. the hash ID will then be used as the address/id of the node on the network. Phone numbers should not be used as means of identification.

### Peer discovery
Peer discovery (or bootstrapping node) will be in a first time designed around a peer discovery server. Each node upon getting online will announce itself to the CENTRAL peer discover server by sending its current address and port alongside a timestamp.

#### LAN discovery
Before attempting to find peers over the internet, passage will first attempt to find node over the LAN network.

### Direct/synchronous communication between nodes
If node A wants to communicate to node B and they are both available at the same time on the network, they will be able to communicate directly to each other via a WebRTC connection using end-to-end encryption.

### Indirect/asynchronous communication between nodes
~~If node wants to communicate with node B, however the latter is currently not online, we need to find a way to pass along the message from node A through node C,D,E... in order to have a node online to pass the message when C will come up online. However since passage will be mostly designed to run on portable devices it is critical to keep battery consumption in mind.~~

If user A wants to communicate with user B, however the latter is currently not online, we will rely on a distributed hash table (DHT) storing the encrypted sent message on the network via a key value store, they key will in this case be the public key of the recipient of the message (in this case user B). 
Upon joining the network user B will broadcast a message, looking for any new message addressed to him, and use crawl through the network until retrieving the targeted message. 
Once the message has been retrieved, it will be deleted from the network and decrypted by user B.

## Technical stack