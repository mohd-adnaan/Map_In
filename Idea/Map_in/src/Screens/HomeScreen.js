import React,{ useState,useEffect } from 'react';
import { Text,View,Image, TouchableOpacity,} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import './global.js';

export default function HomeScreen({navigation,route}){
    return (
        
        <View style={{height:'100%',width:'100%',backgroundColor:'#ffffff',}}>
        <LinearGradient colors={['#FF9933', '#ffffff', '#4CAF50']} style={{height:'100%',flexDirection:'column'}}>
        <Animatable.Image animation="bounceIn" resizeMode='center'
      source={require('../../assets/images/emblem.png')}
      style={{width:'50%',height:'10%',borderColor:'#000000',alignSelf:'center',marginTop:'2%'}}>
      </Animatable.Image>
      <View style={{marginTop:'2%'}}>
        <Text style={{color:'#000000',fontFamily:'Cochin',textAlign:'center',fontSize:20,fontWeight:'700'}}>Welcome</Text>
        <Animatable.Image animation="bounceIn" resizeMode='center'
      source={require('../../assets/images/name_logo.png')}
      style={{height:50,width:'100%',alignSelf:'center',marginTop:'2%',}}>
      </Animatable.Image>
      <Animatable.View>
              <Text style={{textAlign:'center',marginTop:'5%',fontSize:20,color:'#000000',fontStyle:'italic',width:'80%',alignSelf:'center',fontFamily:'Cochin'}}>An Interactive App for</Text>
              <Text style={{textAlign:'center',fontSize:20,color:'#000000',width:'80%',alignSelf:'center',fontFamily:'Cochin'}}>Geo Spatial Data Collection for Field Surveys.</Text>
              <Text style={{textAlign:'center',fontSize:20,marginTop:'5%',color:'#000000',width:'80%',alignSelf:'center',fontFamily:'Cochin',fontStyle:'italic'}}>Designed & Developed by:</Text>
              <Image source={require('../../assets/images/nrsc-logo.png')} style={{height:90,width:90,alignSelf:'center',borderWidth:1,borderColor:'orange',borderRadius:50,marginTop:'4%'}}/>
            </Animatable.View>

      </View>
            <Animatable.View animation="slideInUp"
            style={{height:'30%',borderTopRightRadius:40,borderTopLeftRadius:40,backgroundColor:'rgba(76, 175, 80, 0.5)',marginTop:'auto',}}>
            
            
                <TouchableOpacity
          onPress={()=>{navigation.navigate("LoginScreen")}}
         style={{backgroundColor:'#ffffff',width:'80%',alignSelf:'center',height:50,borderRadius:10,flexDirection:'column',justifyContent:'center',marginTop:'10%'}}>
         
          <Text style={{fontSize:18,color:'#4CAF50',fontWeight:'bold',textAlign:'center'}}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity      onPress={()=>{navigation.navigate("RegisterScreen")}}    style={{backgroundColor:'#ffffff',width:'80%',alignSelf:'center',height:50,borderRadius:10,flexDirection:'column',justifyContent:'center',marginTop:'5%'}}>
          <Text style={{fontSize:18,color:'#4CAF50',fontWeight:'bold',textAlign:'center',}}>Register</Text>
        </TouchableOpacity>
            </Animatable.View>
            
            </LinearGradient>
        </View>
       
    )
}