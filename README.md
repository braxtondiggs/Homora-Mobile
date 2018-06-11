# Homora Mobile

We are revolutionizing the rental market by giving you the information you need. Homora was born by the realization that other websites don't offer the detail needed to find the perfect group home, apartment or house for you.

## Getting Started

### Prerequisites
- [Node.js and npm](nodejs.org) Node ^4.2.3, npm ^2.14.7


## Development server
Run `ionic serve` for a dev server. Navigate to `http://localhost:8100/`. The app will automatically reload if you change any of the source files.

Build on local device:`ionic cordova run android --device`

Install all Plugins & Platforms -> `ionic cordova prepare`

To generate a release build for Android, we can use the following cordova cli command:

`ionic cordova build --release android`

`jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk alias_name`

`../zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk Homora.apk`
