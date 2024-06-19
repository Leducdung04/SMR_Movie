import {
  Alert,
  Image,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {Uri_LoginPhone,Uri_LoginEmail,Uri_CheckPhone}  from '../api/index'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const [hindpassword, sethindpassword] = useState(true);
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [tbEmail, settbEmail] = useState('')
  const [tbPass, settbPass] = useState('')
  const [ttEmail, setttEmail] = useState(false)
  const [ttPass, setttPass] = useState(false)
  const DangNhap=()=>{
      var phoneRegex=/^(\+\d{1,3})?\d{9,14}$/
      var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(email.length===0){
          settbEmail('Vui lòng nhập Email hoặc số điện thoại')
          setttEmail(true)
        }
        if(password.length===0){
          settbPass('Vui lòng nhập Password')
          setttPass(true)
          return false
        }

        if(phoneRegex.test(email)){
          try {
            fetch(Uri_LoginPhone,{
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                phone: email,
                password: password,
              })
            }).then(responses=>responses.json()).then(async data=>{
              if(data.status===200){
                try {
                  fetch(`${Uri_CheckPhone}/${email}`).then(response=>response.json()).then((dt)=>{
                     AsyncStorage.setItem('Account',JSON.stringify(dt.data)).then(()=>{
                      console.log('login thành công'+dt.data)
                      navigation.navigate('Bottomtabs')
                  });
                    
                  })
                } catch (error){
                  console.log(error)
                }
              }else{
                settbEmail('Phone và Password không đúng')
                setttEmail(true)
                settbPass('Phone và Password không đúng')
                setttPass(true)
              }
            })
          } catch (error) {
            console.log("Lỗi"+error)
          }
         
        }else if(emailRegex.test(email)){
          try {
            fetch(Uri_LoginEmail,{
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: email,
                password: password,
              })
            }).then(response=>response.json()).then(async data=>{
              if(data.status===200){
                await AsyncStorage.setItem('Account',JSON.stringify(data.data));
                navigation.navigate('Bottomtabs')
                console.log('login thành công')
              }else{
                settbEmail('Email và Password không đúng')
                setttEmail(true)
                settbPass('Email và Password không đúng')
                setttPass(true)
              }
            })
          } catch (error) {
            console.log(error)
          }
        }else{
          settbEmail('Vui lòng nhập Email hoặc số điện thoại đúng định dạng')
          setttEmail(true)
          return false
        }

        
  }
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View
        style={{
          marginStart: 20,
          marginTop: 40,
          flexDirection: "row",
          alignContent: "center",
        }}
      >
        <TouchableOpacity
          style={{ width: 50 }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-circle" size={45} color="#999999" />
        </TouchableOpacity>
      </View>
      <View style={{ width: "100%", alignItems: "center" }}>
        <Text style={{ fontSize: 22, color: "#999999" }}>Wellcome</Text>
        <Image
          style={{ width: 150, height: 150 }}
          source={require("../img/logo.png")}
        />
      </View>
      <View style={{ marginTop: 60 }}>
        <TextInput
          onFocus={()=>{
            setttEmail(false)
          }}
          value={email}
          onChangeText={(text)=>{setemail(text)}}
          style={styles.input}
          placeholder="Email hoặc số điện thoại"
        />
        {ttEmail&&(<Text style={{marginStart:20,marginTop:-10,marginBottom:10,color:'red'}}>{tbEmail}</Text>)}
        <View
          style={{ width: "100%", flexDirection: "row", alignItems: "center" }}
        >
          <TextInput
            value={password}
            onChangeText={(text)=>{setpassword(text)}}
            style={[styles.input, { width: "90%" }]}
            placeholder="Mật khẩu"
            secureTextEntry={hindpassword} 
            onFocus={()=>{setttPass(false)}}
          />
          <TouchableOpacity onPress={()=>sethindpassword(!hindpassword)}>
          <Ionicons
           style={{marginStart:-50,marginBottom:20}}
            name={hindpassword ? "eye-off" : "eye"}
            size={24}
            color="gray"
          />
         
          </TouchableOpacity>
          
        </View>
        {ttPass&&(<Text style={{marginStart:20,marginTop:-10,marginBottom:10,color:'red'}}>{tbPass}</Text>)}
      </View>
      <TouchableOpacity onPress={()=>{DangNhap()}}>
        <View
          style={{
            marginHorizontal: 30,
            backgroundColor: "#94d0ee",
            height: 50,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            marginTop:50
          }}
        >
          <Text style={{ fontSize: 18, color: "white", fontWeight: "bold" }}>
            Đăng nhập
          </Text>
        </View>
      </TouchableOpacity>

      <Text style={{textAlign:'center',color:'#3333FF',marginTop:40}}>Quên mật khẩu?</Text>
       <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:30,marginTop:40}}>
        <View style={{flex:1,height:1,backgroundColor:'gray'}}></View>
        <Text style={{textAlign:'center',marginHorizontal:10,color:'#555555'}}>hoặc</Text>
        <View style={{flex:1,height:1,backgroundColor:'gray'}}></View>
       </View>
       
      <TouchableOpacity onPress={()=>{navigation.navigate('Sigup')}}>
        <View
          style={{
            marginHorizontal: 70,
            borderWidth:0.5,
            height: 50,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            marginTop:40
          }}
        >
          <Text style={{ fontSize: 16, color: "gray", fontWeight: "bold" }}>
            Đăng ký tài khoản SMR
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1, // Độ dày của đường kẻ chân
    borderBottomColor: "gray", // Màu của đường kẻ chân
    marginHorizontal: 20,
    height: 40,
    marginBottom: 20,
    fontSize: 16,
    marginVertical: 5,
    paddingEnd:40
  },
});
