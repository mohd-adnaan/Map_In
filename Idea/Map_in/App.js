
import React,{ useState,useEffect,useContext } from 'react';
import { Text, TextInput, View,StyleSheet,  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/Screens/LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ShowMap from './src/Screens/ShowMap';
import HistoryScreen from './src/Screens/HistoryScreen';
import MapScreen from './src/Screens/MapScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FormScreen from './src/Screens/FormScreen';
import RegisterScreen from './src/Screens/RegisterScreen';
import UserScreen from './src/Screens/UserScreen';
import SupportScreen from './src/Screens/SupportScreen';
import HomeScreen from './src/Screens/HomeScreen';
import { AuthContext } from './src/components/context';




const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
//const Tab = createMaterialBottomTabNavigator();




function App() {
  
 /* const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken=await AsyncStorage.getItem('userToken')
        // Restore token stored in `SecureStore` or any other encrypted storage
        // userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        await AsyncStorage.setItem('userToken', JSON.stringify(data))
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );*/
 

  const [isSignedIn,setIsSignedIn]=useState()
  useEffect(() => {
    displayData()
  }, []);

  const displayData = async ()=>{  
    try{  
      let status = await AsyncStorage.getItem('IsLoggedIn');  
       setIsSignedIn(status)
       console.log("app status:",status)
    }  
    catch(error){  
      alert(error)  
    }  
  }


  
  return ( 
    //<AuthContext.Provider value={authContext}>
    <NavigationContainer>
      <Tab.Navigator
      cardShadowEnabled={false}
      cardOverlayEnabled={false}
      initialRouteName={isSignedIn?'MapScreen':'HomeScreen'}
      backBehavior={'history'}
     screenOptions={{tabBarShowLabel:false,
        tabBarStyle:{
      elevation:0,
      backgroundColor:'#ffffff',
      
      height:50,
      width:'auto',
      ...styles.shadow,
      
    },
  }
    
  }
    
  
  
  
  

  >
  {!isSignedIn ?(
    <>
  
        
                    
                    <Tab.Screen name='HomeScreen' component={HomeScreen}
                  options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                   
                    headerShown:false,
                    tabBarStyle:{display:'none'}}}/>
                    
                    <Tab.Screen name='LoginScreen' component={LoginScreen}
                  options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                    
                    headerShown:false,
                    tabBarStyle:{display:'none'}}}/>
                     <Tab.Screen name='RegisterScreen' component={RegisterScreen}
                  options={{
                    tabBarButton: () => null,
                    tabBarVisible: false,
                    
                    headerShown:false,
                    tabBarStyle:{display:'none'}}}/>  
                    </>)
                    :
                    (<>
                    <Tab.Screen  
          
                    options={{
                      tabBarIcon:({focused})=>(
                        <View style={{alignItems:'center', justifyContent:'center',backgroundColor:'#ffffff'}}>
                          <FontAwesome5Icon
                          name='map-marked-alt'
                          type={FontAwesome5Icon}
                          color='#000000'
                          size={20}
                          style={{color:focused ? '#4CAF50' : '#748c94'}}></FontAwesome5Icon>
                  
                          <Text style={{color:focused? '#4CAF50' : '#748c94',fontWeight:'bold'}} 
                          >Map</Text>
                  
                        </View>
                          ),
                          
                          headerShown: false
                        }} name="Map" component={MapScreen}
                        initialParams={{ url:'https://a.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg?access_token=pk.eyJ1Ijoib3BlbnN0cmVldG1hcCIsImEiOiJja2w5YWt5bnYwNjZmMnFwZjhtbHk1MnA1In0.eq2aumBK6JuRoIuBMm6Gew',
                            type:'satellite'}} />
            
            
            
                    <Tab.Screen options={{
                      tabBarIcon:({focused})=>(
                        <View style={{alignItems:'center', justifyContent:'center',backgroundColor:'#ffffff'}}>
                          <FontAwesome5Icon
                          name='history'
                          type={FontAwesome5Icon}
                          color='#000000'
                          size={20}
                          style={{color:focused ? '#4CAF50' : '#748c94'}}>
                          </FontAwesome5Icon>      
                          <Text 
                          style={{color:focused? '#4CAF50' : '#748c94',fontWeight:'bold'}} 
                          >History
                          </Text>
                          
                  
                        </View>
                          ),
                          
                          headerShown: false,
                
               
                          }} name="HistoryScreen" component={HistoryScreen}
                           />
                      
                           <Tab.Screen options={{
                      tabBarIcon:({focused})=>(
                        <View style={{alignItems:'center', justifyContent:'center',backgroundColor:'#ffffff'}}>
                          <FontAwesome5Icon
                          name='user'
                          type={FontAwesome5Icon}
                          color='#000000'
                          size={20}
                          style={{color:focused ? '#4CAF50' : '#748c94'}}>
                          </FontAwesome5Icon>      
                          <Text 
                          style={{color:focused? '#4CAF50' : '#748c94',fontWeight:'bold'}} 
                          >Account
                          </Text>
                          
                  
                        </View>
                          ),
                          
                          headerShown: false,
                
               
                          }} name="UserScreen" component={UserScreen}
                           />
                                 <Tab.Screen options={{
                      tabBarIcon:({focused})=>(
                        <View style={{alignItems:'center', justifyContent:'center',backgroundColor:'#ffffff'}}>
                          <FontAwesome5Icon
                          name='info'
                          type={FontAwesome5Icon}
                          color='#000000'
                          size={20}
                          style={{color:focused ? '#4CAF50' : '#748c94'}}>
                          </FontAwesome5Icon>      
                          <Text 
                          style={{color:focused? '#4CAF50' : '#748c94',fontWeight:'bold'}} 
                          >About
                          </Text>
                          
                  
                        </View>
                          ),
                          
                          headerShown: false,
                
               
                          }} name="SupportScreen" component={SupportScreen}
                           />
                           <Tab.Screen name='FormScreen' component={FormScreen}
                              options={{
                                tabBarButton: () => null,
                                tabBarVisible: false,
                                
                                headerShown:false,
                                tabBarStyle:{display:'none'}}}/>
                            <Tab.Screen name='ShowMap' component={ShowMap}
                              options={{
                                tabBarButton: () => null,
                                tabBarVisible: true,
                                
                                headerShown:false,
                                }}/>
                                </>
              )

                      
  
  }
              
      </Tab.Navigator>
                
    
    </NavigationContainer>
    //</AuthContext.Provider>





    
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

  },
  shadow:{
    shadowColor:'#7F5DF0',
    shadowOffset:{
      width:0,
      height:10
    },
    shadowOpacity:0.25,
    shadowRadius:3.5,
    elevation:5
  }
 
});
export default App;