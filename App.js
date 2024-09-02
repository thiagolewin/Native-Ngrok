import * as React from 'react';
import { Button, TextInput, Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PokemonProvider, usePokemons } from './PokemonContext';
import { EventosProvider, useEventos } from './EventosContext';
import { Ionicons } from '@expo/vector-icons';

const usersDatabase = [
  { username: 'user1', password: 'pass1' },
  { username: 'user2', password: 'pass2' },
];

//
// Pantalla de Login
//
function LoginScreen({ onLogin }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLoginPress = () => {
    onLogin(username, password);
  };

  return (
    <View style={styles.perfilScreen}>
      <Text style={styles.text}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLoginPress} />
    </View>
  );
}

//
// Creación de los stacks
//
const Login = createNativeStackNavigator();
const StackA = createNativeStackNavigator();
const StackB = createNativeStackNavigator();
const StackC = createNativeStackNavigator();

function LoginNavigator({ onLogin }) {
  return (
    <Login.Navigator>
      <Login.Screen name="login1">
        {(props) => <LoginScreen {...props} onLogin={onLogin} />}
      </Login.Screen>
    </Login.Navigator>
  );
}

function StackANavigator() {
  return (
    <StackA.Navigator>
      <StackA.Screen name="ScreenA1" component={ScreenA1} />
      <StackA.Screen name="ScreenA2" component={ScreenA2} />
    </StackA.Navigator>
  );
}

function StackBNavigator() {
  return (
    <StackB.Navigator>
      <StackB.Screen name="ScreenB1" component={ScreenB1} />
      <StackB.Screen name="ScreenB2" component={ScreenB2} />
    </StackB.Navigator>
  );
}

function StackCNavigator() {
  return (
    <StackC.Navigator>
      <StackC.Screen 
        name="ScreenC1" 
        component={ScreenC1} 
        options={{ 
          title: 'Otro Titulo',
          headerStyle: { backgroundColor: 'purple' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
          headerTitleAlign: 'center',
          headerRight: () => (
            <Button
              onPress={() => alert('Hice Click!!')}
              title="Info"
              color="#00cc00"
            />
          ),
          headerTransparent: true 
        }}
      />
      <StackC.Screen 
        name="ScreenC2" 
        component={ScreenC2} 
        options={{ 
          headerShown: false
        }}
      />
    </StackC.Navigator>
  );
}

//
// Creación del BottomTabNavigator
//
const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={StackANavigator} 
      />
      <Tab.Screen 
        name="Buscador" 
        component={StackBNavigator} 
      />
      <Tab.Screen 
        name="Perfil" 
        component={StackCNavigator} 
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

//
// Envolviendo la aplicación en el NavigationContainer
//
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('https://grateful-boar-definitely.ngrok-free.app/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success == true) {
        // Manejar el éxito (por ejemplo, navegación a la pantalla principal)
        setIsLoggedIn(true);
      } else {
        // Manejar el error (por ejemplo, mostrar mensaje de error)
        Alert.alert('Login failed', data.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Login failed', 'An error occurred. Please try again.');
    }
  }

  return (
    <PokemonProvider>
      <EventosProvider>
      <NavigationContainer>
        {isLoggedIn ? (
          <MyTabs />
        ) : (
          <LoginNavigator onLogin={handleLogin} />
        )}
      </NavigationContainer>
      </EventosProvider>
    </PokemonProvider>
  );
}

//
// Screens del Primer Stack
//
function ScreenA1() {
  const navigation = useNavigation();
  return (
    <View style={styles.homeScreen}>
      <Text style={styles.text}>Pokemon Home</Text>
      <Text style={styles.description}>
        App hecha para ver tus pokemons favoritos
      </Text>
      <Button title="Ver Eventos" onPress={() => navigation.navigate('ScreenA2')} />
    </View>
  );
}

function ScreenA2() {
  const { eventos, loading } = useEventos();
  const navigation = useNavigation();

  if (loading) {
    return <Text style={styles.text}>Loading...</Text>;
  }
  return (
    <View style={styles.searchScreen}>
      <Text style={styles.text}>
        {eventos && eventos.length > 0
          ? eventos.map(item => item).join(', ')
          : "No Event data available"}
      </Text>
      <TouchableOpacity onPress={() => alert('Presionaste en el Icono!')}>
        <Ionicons name="search" size={50} color="white" />
      </TouchableOpacity>
    </View>
  );
}

//
// Screens del Segundo Stack
//
function ScreenB1() {
  const { pokemons, loading } = usePokemons();
  const navigation = useNavigation();

  if (loading) {
    return <Text style={styles.text}>Loading...</Text>;
  }
  return (
    <View style={styles.searchScreen}>
      <Text style={styles.text}>
        {pokemons && pokemons.length > 0
          ? pokemons.map(item => item.name).join(', ')
          : "No Pokémon data available"}
      </Text>
      <Button title="Pokemon 1" onPress={() => navigation.navigate('ScreenB2', { itemId: pokemons[0] })} />
      <Button title="Pokemon 2" onPress={() => navigation.navigate('ScreenB2', { itemId: pokemons[1] })} />
      <TouchableOpacity onPress={() => alert('Presionaste en el Icono!')}>
        <Ionicons name="search" size={50} color="white" />
      </TouchableOpacity>
    </View>
  );
}

function ScreenB2({ route }) {
  const { itemId } = route.params;
  const navigation = useNavigation();
  return (
    <View style={styles.searchScreen}>
      <Text style={styles.text}>Pokemon</Text>
      <Text style={styles.text}>Nombre: {itemId.name}</Text>
      <Button title="Todos los pokemons" onPress={() => navigation.navigate('ScreenB1')} />
    </View>
  );
}

//
// Screens del Tercer Stack
//
function ScreenC1() {
  const navigation = useNavigation();
  return (
    <View style={styles.perfilScreen}>
      <Text style={styles.text}>PERFIL</Text>
      <Text style={styles.description}>
        Tercer Stack - Primer Screen
        {'\n\n'}
        * Se modifico la Barra, se centro, se puso un boton! (ver la barra):
        {'\n'}
      </Text>
      <Button title="IR A ScreenC2" onPress={() => navigation.navigate('ScreenC2')} />
    </View>
  );
}

function ScreenC2() {
  const navigation = useNavigation();
  return (
    <View style={styles.perfilScreen}>
      <Text style={styles.text}>PERFIL - EDICION</Text>
      
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
      />

      <Button title="IR A ScreenC1" onPress={() => navigation.navigate('ScreenC1')} />
    </View>
  );
}

//
// Estilos
//
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
  description: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    marginTop: 20,
  },
  homeScreen: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor:'#ff0000' 
  },
  searchScreen: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor:'#044a16' 
  },
  perfilScreen: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor:'#0000ff' 
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '90%',
    color: 'white',
  },
});
