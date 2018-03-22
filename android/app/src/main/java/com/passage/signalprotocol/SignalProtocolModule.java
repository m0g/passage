//  Created by react-native-create-bridge

package com.passage.signalprotocol;

import android.support.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Promise;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.whispersystems.curve25519.Curve25519;
import org.whispersystems.curve25519.Curve25519KeyPair;

import org.whispersystems.libsignal.IdentityKeyPair;
import org.whispersystems.libsignal.IdentityKey;
import org.whispersystems.libsignal.ecc.ECKeyPair;
import org.whispersystems.libsignal.ecc.Curve;
import org.whispersystems.libsignal.ecc.ECKeyPair;
import org.whispersystems.libsignal.util.Hex;
import org.whispersystems.libsignal.util.KeyHelper;
import org.whispersystems.libsignal.state.PreKeyRecord;
import org.whispersystems.libsignal.state.SignedPreKeyRecord;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

import static org.whispersystems.curve25519.Curve25519.BEST;

public class SignalProtocolModule extends ReactContextBaseJavaModule {
    public static final String REACT_CLASS = "SignalProtocol";
    private static ReactApplicationContext reactContext = null;

    public SignalProtocolModule(ReactApplicationContext context) {
        // Pass in the context to the constructor and save it so you can emit events
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
        super(context);

        reactContext = context;
    }

    @Override
    public String getName() {
        // Tell React the name of the module
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
        return REACT_CLASS;
    }

    @Override
    public Map<String, Object> getConstants() {
        // Export any constants to be used in your native module
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
        final Map<String, Object> constants = new HashMap<>();
        constants.put("EXAMPLE_CONSTANT", "example");

        return constants;
    }

    @ReactMethod
    public void exampleMethod () {
        // An example native method that you will expose to React
        // https://facebook.github.io/react-native/docs/native-modules-android.html#the-toast-module
    }

    @ReactMethod
    public void generateIdentityKeyPair (final Promise promise) {
        IdentityKeyPair keyPair = KeyHelper.generateIdentityKeyPair();
        WritableMap keyPairMap = new WritableNativeMap();

        keyPairMap.putString("pubKey", keyPair.getPublicKey().getFingerprint());
        keyPairMap.putString("privKey", Hex.toString(keyPair.getPrivateKey().serialize()));

        promise.resolve(keyPairMap);
    }

    @ReactMethod
    public void generateRegistrationId (final Promise promise) {
      int key = KeyHelper.generateRegistrationId(false);

      promise.resolve(key);
    }

    @ReactMethod
    public void generatePreKeys (int startId, final Promise promise) {
        WritableArray arr = new WritableNativeArray();
        List<PreKeyRecord> preKeys = KeyHelper.generatePreKeys(startId, 15);
        int i = 0;

        while (i < preKeys.size()) {
            ECKeyPair keyPair = preKeys.get(i).getKeyPair();
            WritableMap preKeyMap = new WritableNativeMap();

            preKeyMap.putString("pubKey", Hex.toString(keyPair.getPublicKey().serialize()));
            preKeyMap.putString("privKey", Hex.toString(keyPair.getPrivateKey().serialize()));
            arr.pushMap(preKeyMap);
            i++;
        }

        promise.resolve(arr);
    }

    // public static byte[] hexStringToByteArray(String s) {
    //     int len = s.length();
    //     byte[] data = new byte[len / 2];
    //     for (int i = 0; i < len; i += 2) {
    //         data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
    //                             + Character.digit(s.charAt(i+1), 16));
    //     }
    //     return data;
    // }

    @ReactMethod
    public void calculateSignature (String privKeyHex, String pubKeyHex, final Promise promise) {
        try {
            byte[] privKey = Hex.fromStringCondensed(privKeyHex);
            byte[] pubKey = Hex.fromStringCondensed(pubKeyHex);

            promise.resolve(Curve25519.getInstance(BEST).calculateSignature(privKey, pubKey));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // @ReactMethod
    // public void generateSignedPreKey (byte[] privKey, byte[] pubKey, int signedPreKeyId, final Promise promise) {
    //     ECKeyPair keyPair   = Curve.generateKeyPair();
    //     byte[]    signature = Curve.calculateSignature((ECPrivateKey) privKey, pubKey);
    //     SignedPreKeyRecord signedPreKey = new SignedPreKeyRecord(signedPreKeyId, System.currentTimeMillis(), keyPair, signature);
    //     ECKeyPair signedPreKeyPair = signedPreKey.getKeyPair();
    //     WritableMap keyPairMap = new WritableNativeMap();

    //     keyPairMap.putString("pubKey", signedPreKeyPair.getPublicKey().getFingerprint());
    //     keyPairMap.putString("privKey", Hex.toString(signedPreKeyPair.getPrivateKey().serialize()));

    //     promise.resolve(keyPairMap);
    // }

    private static void emitDeviceEvent(String eventName, @Nullable WritableMap eventData) {
        // A method for emitting from the native side to JS
        // https://facebook.github.io/react-native/docs/native-modules-android.html#sending-events-to-javascript
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, eventData);
    }
}
