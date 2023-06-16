import React,{ useState,useEffect } from 'react';
import { ImageBackground } from 'react-native';
import * as Animatable  from 'react-native-animatable';
import { Text, TextInput, View,StyleSheet, Alert, Image, TouchableOpacity, ActivityIndicator,Modal,Pressable } from 'react-native';
import './global.js';
import NetInfo  from "@react-native-community/netinfo";
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../components/context'
import RNRestart from 'react-native-restart';
export default function LoginScreen({route,navigation}){
    
    let url = global.server_url+"login.php";
    const [mobile,setMobile]=useState('')
    const [IsOffline,setIsOffline]=useState(false)
    const [isLoading,setIsLoading]=useState(false)
    useEffect(() => {
      const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
        const offline = !(state.isConnected && state.isInternetReachable);
        console.log("offline:",offline)
        setIsOffline(offline);
      });
    
    
      return () => removeNetInfoSubscription();
    }, []);
    
  
    const requestOptions = {
      method: 'POST',
      headers: { 'Accept': 'application/json',
          'Content-Type': 'application/json' },
          body:JSON.stringify({mobile:mobile})
    };
  const login = async () => {
    
    try { 
            
       fetch(
          url, requestOptions,100)
          .then((response) => 
              response.json())
                  .then( async response => {
                      console.log("Message: ", 
                      response.Message);
                      if(response.status=="Success"){
                        await AsyncStorage.setItem("IsLoggedIn",JSON.stringify(true))
                        await AsyncStorage.setItem("name",response.name)
                        await AsyncStorage.setItem("email",response.email)
                        await AsyncStorage.setItem("mobile",response.mobile)
                        await AsyncStorage.setItem("address",response.address)
                        await AsyncStorage.setItem("city",response.city)
                        await AsyncStorage.setItem("state",response.state)
                        await AsyncStorage.setItem("pincode",response.pincode)
                        
                        setMobile('');
                        setIsLoading(false);
                        RNRestart.Restart()
                      
                      }
                      else{alert(response.Message)
                        setIsLoading(false)
                        setMobile('');
                       }
                     
                  }               
                  )
                  .catch((error)=>{
                    alert(error)
                    console.log(error)
                    setIsLoading(false)
                    setMobile('');
                  })
                  
                
                  
          }
  
  catch (error) {
      alert("error",error);
  }

 
    
   
  }
  
    return (
      <LinearGradient colors={['#FF9933', '#ffffff', '#4CAF50']}>
        {isLoading ?
        <View style={{backgroundColor:'transparent',height:'100%',flexDirection:'column',justifyContent:'center'}}>
          <ActivityIndicator size={70} color="#4CAF50" style={{alignSelf:'center'}} />
          <Text style={{alignSelf:'center',color:'#000000',fontSize:20}}>Please Wait...</Text>
        </View>
        :
      <View style={{flexDirection:'column',justifyContent:'space-evenly',height:'100%'}}>

      <ImageBackground source={require('../../assets/images/logo.jpg')} ></ImageBackground>
      <Animatable.Image animation="bounceIn"
      source={require('../../assets/images/logo.jpg')}
      style={{width:120,height:120,borderColor:'#000000',borderRadius:50,padding:10,alignSelf:'center',marginTop:50}}>
  

      </Animatable.Image>
      <Animatable.View animation="bounceIn" style={{backgroundColor:'#FFFFFF',height:250,margin:20,borderRadius:20,shadowOffset: { width: 0, height: 2, }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5}}>
      <Text style={{fontSize:18,color:'#000000',fontWeight:'bold',marginLeft:20,marginTop:20}}>Mobile</Text>
      <TextInput
          placeholderTextColor={'#000000'}
          maxLength={10}
          onChangeText={(e)=>{setMobile(e)}}
          keyboardType="number-pad"
           style={{width:'90%',height:50,borderRadius:10,margin:10,padding:10,fontSize:18,backgroundColor:'#ededed',color:'#000000',alignSelf:'center'}}></TextInput>
        <TouchableOpacity
          onPress={()=>{console.log("mobile",mobile); if(mobile.length!=10){Alert.alert("Invalid Mobile No!")}
                        else{
                          if(IsOffline){Alert.alert("No Internet Connection!")}
                          else{ setIsLoading(true); login()}}}}
         style={{backgroundColor:'#4CAF50',width:'80%',alignSelf:'center',height:50,borderRadius:10,flexDirection:'column',justifyContent:'center'}}>
         
          <Text style={{fontSize:18,color:'#ffffff',fontWeight:'bold',textAlign:'center'}}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {navigation.navigate("RegisterScreen")}}
          style={{marginTop:20}}>
        <Text style={{color:'#4CAF50',fontSize:18,textAlign:'center'}}>Don't have an account? Register Now</Text>
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View animation="bounceIn" style={{flexDirection:'column', justifyContent:'flex-end'}}>
        <Text style={{color:'#ffffff',fontSize:18,textAlign:'center',padding:10}}></Text>
        <Image 
      style={{width:100,height:100,borderRadius:50,alignSelf:'center',padding:20}}/>
      </Animatable.View>

      </View>}
      </LinearGradient>
     
      
    )
}