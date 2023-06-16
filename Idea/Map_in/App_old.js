import React,{ useState } from 'react';
import { Text, TextInput, View,StyleSheet, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/Screens/LoginScreen';
import MapScreen from './src/Screens/MapScreen';

const Stack = createNativeStackNavigator();


function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator 
  initialRouteName="Map"
  >
        <Stack.Screen options={{
    headerShown: false
  }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{
    headerShown: false,
   
  }} name="Map" component={MapScreen}
  initialParams={{ url:'https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms?service=WMS&tiled=true&version=1.1.1&request=GetMap&layers=india3&bbox={minX},{minY},{maxX},{maxY}&width={width}&height={height}&srs=EPSG%3A900913&format=image%2Fjpeg',
    type:'default'}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles= StyleSheet.create({
    
  textInput:{
    height: 40,
    width:350,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius:10,
    backgroundColor:"white",
    color:"black"
  },
  touchable:{
    width: 350,
    height:40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    margin:10,
    borderRadius:10

  }
 
});
export default App;