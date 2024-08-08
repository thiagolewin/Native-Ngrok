import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import Entypo from 'react-native-vector-icons/Entypo';
import { SafeAreaView } from 'react-native';

SplashScreen.preventAutoHideAsync();
export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [pokemons, Setpokemons] = useState([]);
  useEffect(() => {
    async function prepare() {
      try {
        let pokemons = await fetch("https://pokeapi.co/api/v2/pokemon/").then(res => {
          return res
        }).then(res => {
          return res.json()
        })
        Setpokemons(pokemons)
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start', // Align items to the top
      alignItems: 'center', // Center items horizontally
      paddingTop: 20 // Optional: Adjust padding to move content away from the top edge
    },
    text: {
      textAlign: 'center', // Center text horizontally within the container
      margin: 10 // Optional: Add some margin around the text
    }
  });
  return (
    <SafeAreaView 
    style={styles.container}
    onLayout={onLayoutRootView}>
    <Text style={styles.text}>
      {pokemons.results.map(item => item.name).join(', ')}
    </Text>
  </SafeAreaView>
  );
  
}

