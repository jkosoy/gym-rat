# Gym Rat

## Android App

- Download and install [Android Studio](https://developer.android.com/studio)
- Go to `Tools > Device Manager` and make sure you have a virtual 1080P Google TV with API 34 on it.
- Add the following to your `.zshrc`

```bash
export PATH="$PATH:/Users/[USERNAME]/Library/Android/sdk/platform-tools"
```

### Deploying

- On your Google TV go to `Settings > Device > About > Build`
- Click multiple times until you get a prompt that says you are a developer.
- Go to `Settings > Preferences > Developer Options`
- Turn on `USB Debugging`. This will also enable WiFi debugging.
- Get the IP address of the device by going to `Settings > Device > Network > Wifi > Network > Status Info`
- Back on your computer, run this command in Android Studio:

```
adb connect [IP Address of Google TV]
```

- Your TV should show a prompt asking if you would like to enable development. Confirm that.
- You should need see the device appears in Android Studio's Device List. 
- Select it and debug and follow instructions to see it install on your TV.

## Web App

To generate appropriate code...

```
yarn run [component|hook|context] [NameOfComponent]
```