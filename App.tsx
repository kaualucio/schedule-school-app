import { NativeBaseProvider, StatusBar } from 'native-base';
import React from 'react';
import {gestureHandlerRootHOC} from 'react-native-gesture-handler';
import { THEME } from './src/styles/theme';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto'
import { Routes } from './src/routes';
import { LinearGradient } from 'expo-linear-gradient';
import { RefetchContextProvider } from './src/context/RefetchContext';

const CONFIG = {
  dependencies: {
    'linear-gradient': LinearGradient
  },
};

function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })
  
  if(!fontsLoaded) {
    return null
  }

  return (
    <NativeBaseProvider theme={THEME} config={CONFIG}>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <RefetchContextProvider>
        <Routes />
      </RefetchContextProvider>
    </NativeBaseProvider> 
  );
}

export default gestureHandlerRootHOC(App)