<!-- markdownlint-disable MD033 -->

Ce projet git n'est plus maintenu. Il se trouve maintenant sur githepia.

# VESS

This application allows to perform a Visual Evaluation of Soil Structure (VESS) test [Ball et al. 2007, Guimaraes et al. 2011].

<img src="/docs/vess-icon.png" width="200">

## Installation

1. Install [NodeJS](https://nodejs.org/en/).
2. Install [Ionic](https://ionicframework.com/getting-started#cli).
3. Clone this repository: `git clone https://github.com/MichaelPolla/VESS.git`.
4. Go into the `app` folder (`cd /vess/app`) and run `npm install`.

Mac: if you get the message `gyp: No Xcode or CLT version detected!`, you to need to execute this command line before `npm install`:
`sudo xcode-select -switch /Applications/Xcode.app/Contents/Developer/`

## Build & Run

### Browser

This is the easiest way to try the app. However please note that not all functionalities will be available (e.g. the Camera will not be accessible).

1. Open the `app` folder
2. Run `ionic serve` or `ionic serve --lab`

### Android build

For complete instructions, see the Cordova [Android Platform Guide](https://cordova.apache.org/docs/en/8.x/guide/platforms/android/).  
In summary:

1. Install [Java Development Kit (JDK) 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)

2. Install [Gradle](https://gradle.org/install).
3. Install [Android Studio](https://developer.android.com/studio/). This will also install the Android SDK.
4. Run: `ionic cordova run android`. This will build and run the app on a connected device, or will start the Android emulator.

### iOS build

XCode must be installed.

Install ios-deploy: `npm install -g ios-deploy`  
Build and run on emulator or connected device: `ionic cordova run ios`

## Troubleshooting

### Android build error

Android build: if you keep getting the following message although Android Studio is already installed:

```
UnhandledPromiseRejectionWarning: CordovaError: Could not find an installed version of Gradle either in Android Studio,
or on your system to install the gradle wrapper. Please include gradle
in your path, or install Android Studio
```

=> Install [Gradle](https://gradle.org/install).

### iOS build error

if `npm install ios-deploy -g` fails, run:  
`sudo npm install --global --unsafe-perm ios-deploy` (as suggested [here](https://github.com/ios-control/ios-deploy/issues/109#issuecomment-92589783))

If you need to completely clean XCode cache, delete all the content of `Library/Developer/Xcode/DeriveData/`

## Color palette

<img src="/docs/colorApp.png" width="200px">
