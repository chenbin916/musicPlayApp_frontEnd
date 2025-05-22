import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.musicplayer.app',
  appName: 'Music Player',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: 'music-player.keystore',
      keystorePassword: 'your-keystore-password',
      keystoreAlias: 'music-player',
      keystoreAliasPassword: 'your-alias-password'
    }
  }
};

export default config; 