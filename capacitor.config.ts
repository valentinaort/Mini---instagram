import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tuapp.miniinstagram',
  appName: 'Mini Instagram',
  webDir: 'www',
  plugins: {
    Camera: {
      presentationStyle: 'fullscreen'
    }
  }
};

export default config;