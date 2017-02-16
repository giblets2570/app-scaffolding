# Payn Mobile App

The Payn mobile app is an Ionic application for Cordova

## Installation

Use the following commands to install `ionic` on node `v6.9.0`

```
npm install -g cordova ionic
```

## Platform

Installing the ionic platforms is a little more complicated and one should refer to the [Cordova Android Platform Guide](http://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html) and the [Cordova iOS Platform Guide](http://cordova.apache.org/docs/en/latest/guide/platforms/ios/index.html).

After installation run the following commands to add the desired platforms.

```
ionic platform add ios
ionic platform add android
```

Android SDK

```
~/Library/Android/tools/android update sdk --no-ui --all
~/Library/Android/sdk/platform-tools/adb devices
```

## Images

Create `ios` and `android` images automatically using `resources/image.png` and `resources/splash.png` as templates for creating all other sizes.

```
ionic resources
```

## Build

Build the ionic application code using the following commands.

```
grunt build:ios
cordova build android --release
```

## Emulate

```
telnet localhost console-port
Library/Android/sdk/tools/emulator -avd Intel -debug adb
```

## Run

Run the ionic application code using the following commands.

```
ionic run ios
ionic run android
```

## Debug

If there are problems running the app on your phone then use the following command

```
ionic state reset
```



## Testing

In order to test the app 

```
./ngrok http 5984
```

ngrok will create a random url, eg http://53afa401.ngrok.io
With this, we can build and run the project using this as the couchdb url as follows:

```
grunt build --couchUrl="http://53afa401.ngrok.io/"
ionic run ios
```

## Notes

If this is an update to an existing application that did not specify an "AndroidPersistentFileLocation" you may need to add:

```
"<preference name="AndroidPersistentFileLocation" value="Compatibility" />"
```
