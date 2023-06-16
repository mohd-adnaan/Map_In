import * as Animatable from 'react-native-animatable';
import React,{ useState,useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Text, TextInput, View,StyleSheet, Alert, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
export default function UserScreen ({navigation,route}){
    const [name,setName]=useState('');
    const [email,setEmail]=useState('')
    const [mobile,setMobile]=useState('')
    const [address,setAddress]=useState('')
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            display();
        });
    
        
        return unsubscribe;
      }, [navigation]);
      const display =async ()=>{  
        try{  
          let name =  await AsyncStorage.getItem('name');
          let mobile= await AsyncStorage.getItem('mobile');
          let email =await AsyncStorage.getItem('email')
          let address=await AsyncStorage.getItem('address')
          let city=await AsyncStorage.getItem('city')
          let state=await AsyncStorage.getItem('state')
          let pincode=await AsyncStorage.getItem('pincode')
          console.log("name:",name)
          address=address+", "+city+", "+state+", "+pincode
          setAddress(address);
          setMobile(mobile);
          setEmail(email);
          setName(name);              
            
           
        }  
        catch(error){  
          console.log(error) 
        }  
      }

    return(
        <Animatable.View animation="zoomInUp" style={{flex:1,flexDirection:'column',backgroundColor:'#ffffff'}}>
        <View style={{width:'100%',height:'40%',backgroundColor:'#ffffff'}}>
          <View style={{height:'70%',backgroundColor:'#4CAF50'}}>          </View>
          <View style={{backgroundColor:'#ffffff',justifyContent:'center',width:'90%',height:'70%',alignSelf:'center',marginTop:-100,borderRadius:20,elevation:20}}>
          <MaterialIcons
            name="account-circle"
            size={100}
            color="#4CAF50"
            style={{alignSelf:'center',}}
          />
          <Text style={{color:'#000000',fontSize:20,alignSelf:'center',}}>{name}</Text>
          <Text style={{color:'#b6b6b8',fontSize:16,alignSelf:'center',marginBottom:'2%'}}>{email}</Text>
          </View>
        </View>
        <View style={{marginTop:'10%',}}>
        <View style={{flexDirection:'row',width:'90%'}}>
        <MaterialIcons
            name="smartphone"
            size={40}
            color="#4CAF50"/>
            <Text style={{color:'#000000',alignSelf:'center',fontSize:22,marginLeft:20}}>+91 {mobile}</Text>
            
        </View>
        
        <View style={{flexDirection:'row',marginTop:'5%',width:'90%'}}>
        <MaterialIcons
            name="email"
            size={40}
            color="#4CAF50"/>
            <Text style={{color:'#000000',alignSelf:'center',fontSize:22,marginLeft:20}}>{email}</Text>
        </View>
        
        <View style={{flexDirection:'row',marginTop:'5%',width:'90%'}}>
        <MaterialIcons
            name="location-city"
            size={40}
            color="#4CAF50"/>
            <Text style={{color:'#000000',alignSelf:'center',fontSize:22,marginLeft:20}}>{address}</Text>
        </View>
        
        
            <TouchableOpacity 
                onPress={()=>{  Alert.alert("Hold on!", "Are you sure you want to logout?", [
              {
                text: "No",
                onPress: () => null,
                style: "cancel"
              },
              { text: "YES", onPress: () => {AsyncStorage.clear();
                                RNRestart.Restart()
                

               } }
            ]);}}
                style={{backgroundColor:'#4CAF50',width:'80%',alignSelf:'center',height:50,borderRadius:10,flexDirection:'column',justifyContent:'center',marginTop:'5%'}}>
                <Text style={{color:'#ffffff',alignSelf:'center',fontSize:22}}>Logout</Text>
            </TouchableOpacity>
            
            </View>
        </Animatable.View>
    )

}