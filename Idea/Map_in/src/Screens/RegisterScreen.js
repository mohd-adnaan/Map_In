import React,{ useState,useEffect } from 'react';
import { Text, TextInput, View,StyleSheet, Alert, Image, TouchableOpacity, ActivityIndicator,ScrollView } from 'react-native';
import NetInfo  from "@react-native-community/netinfo";
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
//import { ScrollView } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import DeviceInfo from 'react-native-device-info';
import './global.js';
import { Platform } from 'react-native';
export default function RegisterScreen({route,navigation}){

  const [isLoading,setIsLoading]=useState(false)
  const [isRegisterSuccess,setIsRegisterSuccess]=useState(false)
  const [name,setName]=useState('')
  const [mobile,setMobile]=useState('')
  const [address,setAddress]=useState('')
  const [cityName,setCityName]=useState('')
  const [stateName,setStateName]=useState('')
  const [pincode,setPincode]=useState('')
  const [email,setEmail]=useState('')
  let url = global.server_url+"register.php";
  const [IsOffline,setIsOffline]=useState(false)

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = !(state.isConnected && state.isInternetReachable);
      console.log("offline:",offline)
      setIsOffline(offline);
    });
  
  
    return () => removeNetInfoSubscription();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      
      setName('');
      setMobile('')
      setAddress('')
      setCityName('')
      setStateName('')
      setPincode('')
      setEmail('')
      
      // The screen is focused
      // Call any action
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  
  let brand = DeviceInfo.getBrand();
  let model = brand+" "+DeviceInfo.getModel()
  let os=Platform.OS
  let systemVersion = os+" "+DeviceInfo.getSystemVersion();
  console.log("model",systemVersion)
  


  const requestOptions = {
    method: 'POST',
    headers: { 'Accept': 'application/json',
        'Content-Type': 'application/json' },
        body:JSON.stringify({name:name,mobile:mobile,email:email,address:address,city:cityName,state:stateName,pincode:pincode,mob_model:model,os_version:systemVersion})
  
};


  const register = async () => {
    try { 
            
      fetch(
          url, requestOptions,100)
          .then((response) => 
              response.json())
                  .then(response => {
                      console.log("Message: ", 
                      response.Message);
                      if(response.Code==3){
                      setIsLoading(false)
                      registerSuccess()
                      }
                      else{alert(response.Message)
                        setIsLoading(false)
                        setName('')
                        setMobile('');setAddress('');setCityName('');setEmail('');setStateName('');setPincode('')}
                     
                  }               
                  )
                  .catch((error)=>{
                    Alert.alert("Some Error Occurred!")
                    setIsLoading(false)
                    setName('')
                        setMobile('');setAddress('');setCityName('');setEmail('');setStateName('');setPincode('')
                  })
                  
                
                  
          }
  
  catch (error) {
      Alert.alert("Some Error Occurred!");
      setIsLoading(false)
      setName('')
                        setMobile('');setAddress('');setCityName('');setEmail('');setStateName('');setPincode('')
  }

 
    
   
  }

  const registerSuccess=()=> {
    setIsRegisterSuccess(true);

      setTimeout(() => {
           setIsRegisterSuccess(false);
           navigation.navigate("LoginScreen")
           setName(''); setMobile('');setAddress('');setCityName('');setEmail('');setStateName('');setPincode('')
      }, 3000);
}

    return(

      isRegisterSuccess? <Animatable.View animation="bounceIn" style={{backgroundColor:'#4CAF50',height:'100%',flexDirection:'column',justifyContent:'center'}}>
          <Ionicons style={{alignSelf:'center'}}
              name='checkmark-circle-outline'
              type='evilicon'
              color='#ffffff'
              size={100}              
            />
            <Text style={{color:'#ffffff',alignSelf:'center',fontSize:22}}>Registration Success</Text>
      </Animatable.View>:
      isLoading ?
        <View style={{backgroundColor:'transparent',height:'100%',flexDirection:'column',justifyContent:'center'}}>
          <ActivityIndicator size={70} color="#4CAF50" style={{alignSelf:'center'}} />
        </View>:
        <Animatable.View animation="fadeInUp" style={styles.container}>
        <LinearGradient colors={['#FF9933', '#ffffff']} style={styles.linearGradient}>
        
        
         
        
        <View  style={{height:'20%',flexDirection:'column',justifyContent:'space-between'}}>
          
        
 

        <Animatable.Image
              animation="bounceIn"
              duraton="1500"
          source={require('../../assets/images/logo.jpg')}
          style={styles.logo}
          
          />
          
          </View>
          
          
          
        <View style={{width:'100%',backgroundColor:'#ffffff',borderTopStartRadius:50,borderTopEndRadius:50,flexDirection:'column',padding:20,height:'60%',}}>
        
          
        
        
      
        
        <ScrollView style={{}}>
        
        
       
        <TextInput
          placeholder='Name'
          placeholderTextColor={'#000000'}
          maxLength={50}
          onChangeText={(e)=>{setName(e)}}
           style={styles.input}/>
           <TextInput
          placeholder='Mobile'
          placeholderTextColor={'#000000'}
          maxLength={10}
          onChangeText={(e)=>{setMobile(e)}}
          keyboardType="number-pad"
           style={styles.input}/>
           <TextInput
            onChangeText={(e)=>{setEmail(e)}}
          placeholder='Email'
          placeholderTextColor={'#000000'}
          maxLength={100}
          keyboardType="email-address"
           style={styles.input}></TextInput>
            <TextInput
          placeholder='Street Adress'
          placeholderTextColor={'#000000'}
          onChangeText={(e)=>{setAddress(e)}}
          maxLength={100}
           style={styles.input}></TextInput>
            <TextInput
            onChangeText={(e)=>{setCityName(e)}}
          placeholder='City Name'
          placeholderTextColor={'#000000'}
          maxLength={100}
           style={styles.input}></TextInput>
            <TextInput
          placeholder='State Name'
          onChangeText={(e)=>{setStateName(e)}}
          placeholderTextColor={'#000000'}
          maxLength={20}
           style={styles.input}></TextInput>
            <TextInput
            onChangeText={(e)=>{setPincode(e)}}
          placeholder='Pincode'
          placeholderTextColor={'#000000'}
          maxLength={6}
          keyboardType="number-pad"
           style={styles.input}></TextInput>
           </ScrollView>
           </View>
           
           
           
          <View style={{height:'20%',backgroundColor:'#ffffff'}}>
           
            
           <TouchableOpacity style={{backgroundColor:'#4CAF50',width:'80%',alignSelf:'center',height:50,borderRadius:10,flexDirection:'column',justifyContent:'center'}}
           onPress={() => {if(name.length>0 && mobile.length>0 && email.length>0 && address.length>0 && cityName.length>0 && stateName.length>0 && pincode.length>0){
                          if(!IsOffline){
                            setIsLoading(true)
                            register()}
                            else{
                              Alert.alert("No internet connection")}
                          }
           else{Alert.alert("All fields are required")}}}>
            <Text style={{fontSize:20,color:'#ffffff',alignSelf:'center',fontWeight:'bold'}}>Register</Text>
           </TouchableOpacity>
           <TouchableOpacity 
           onPress={() => {navigation.navigate("LoginScreen")}}>
           <Text style={{color:'#4CAF50',alignSelf:'center',color:'#4CAF50',fontSize:16,marginTop:20,fontWeight:'bold'}}>Already have an account? Login Now</Text>
           </TouchableOpacity>
          
           
          </View>
          </LinearGradient>
          
         
        
          
    
        
        
      </Animatable.View>
    )
    
    
}
const styles = StyleSheet.create({

  input:{
    width:'90%',
    height:'auto',
    borderRadius:10,
    margin:10,
    fontSize:18,
    padding:10,
    backgroundColor:'#ededed',
    color:'#000000',
    alignSelf:'center'
  },
    container: {
      flex:1,
      height:'100%', 
      backgroundColor: '#ffffff',
    
    },
    header: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 20,
        //paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: 80,
        height: 80,
        alignSelf:'center',
        margin:20,
        borderRadius:50,
        elevation:20,
        borderColor:'#000000',
        borderRadius:20
        
    },
    title: {
        color: '#05375a',
        fontSize: 34,
        fontWeight: 'bold'
    },
    text: {
        color: 'grey',
        fontSize: 30,
        marginTop:5,
        //height:'100%',
        marginBottom:50,
        textAlign: 'justify'
    },
    button: {
        alignItems: 'center',
        marginTop: 10
    },
    signIn: {
        width: 200,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        flexDirection: 'row'
    },
    textSign: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
    }
  });