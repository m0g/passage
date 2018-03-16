//  Created by react-native-create-bridge

package com.passage.signalprotocol;

import android.support.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import org.whispersystems.libsignal.util.KeyHelper;
import org.whispersystems.libsignal.IdentityKeyPair;
import org.whispersystems.libsignal.IdentityKey;
import com.facebook.react.bridge.Promise;
import org.whispersystems.libsignal.util.Hex;

import java.util.HashMap;
import java.util.Map;

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
      WritableArray arr = new WritableNativeArray();

      arr.pushString(keyPair.getPublicKey().getFingerprint());
      arr.pushString(Hex.toString(keyPair.getPrivateKey().serialize()));

      promise.resolve(arr);
      //    keyPair.getPublicKey().getFingerprint(),
      //    keyPair.getPrivateKey().getFingerprint()
      //);
    }

    @ReactMethod
    public int generateRegistrationId () {
      return KeyHelper.generateRegistrationId(false);
    }

    private static void emitDeviceEvent(String eventName, @Nullable WritableMap eventData) {
        // A method for emitting from the native side to JS
        // https://facebook.github.io/react-native/docs/native-modules-android.html#sending-events-to-javascript
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, eventData);
    }
}
