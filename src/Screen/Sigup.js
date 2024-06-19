import {
  Alert,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
  } from "react-native";
  import {Uri_CheckPhone,Uri_CheckEmail,Uri_SiginAccount} from '../api/index.js'
 import AsyncStorage from '@react-native-async-storage/async-storage';
  import React, { useState } from "react";
  import { Ionicons } from "@expo/vector-icons";
const Sigup = ({navigation}) => {
    const [hindpassword, sethindpassword] = useState(true);
    const [name, setname] = useState('')
    const [ttname, setttname] = useState(false)
    const [email, setemail] = useState('')
    const [ttemail, setttemail] = useState(false)
    const [phone, setphone] = useState('')
    const [ttphone, setttphone] = useState(false)
    const [password, setpassword] = useState('')
    const [ttPass, setttPass] = useState(false)
    const [date, setdate] = useState('')
    const [ttdate, setttdate] = useState(false)
    const [sex, setsex] = useState('')
    const [ttsex, setttsex] = useState(false)

    const DangKy= async()=>{
      const phoneRegex=/^(\+\d{1,3})?\d{9,14}$/
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          name.length===0? setttname(true):setttname(false)
          email.length===0? setttemail(true):setttemail(false)
          phone.length===0? setttphone(true):setttphone(false)
          password.length===0? setttPass(true):setttPass(false)
          date.length===0? setttdate(true):setttdate(false)
          sex.length===0? setttsex(true):setttsex(false)

          if(name.length===0||email.length===0||phone.length===0||password.length===0||date.length===0||sex.length===0){
            return false
          }
          
          !phoneRegex.test(phone)? ()=>{setttphone(true);return false}:setttphone(false)
          !emailRegex.test(email)?()=>{setttemail(true);return false}:setttemail(false)
          if(sex.toLocaleLowerCase().trim()!='nam' && sex.toLocaleLowerCase().trim()!='nữ' ){
                setttsex(true)
                return false
          }
          checkEmail()&&checkPhone()? SigupAccount():function(){return false}
          
    }

    const checkPhone=async()=>{
          const response=await fetch(`${Uri_CheckPhone}/${phone}`)
          const data=await response.json()
          if(data.status===200){
            Alert.alert("số điện thoại đã được đăng ký")
            return false}
    }
    const checkEmail=async()=>{
      const response=await fetch(`${Uri_CheckEmail}/${email}`)
      const data=await response.json()
      if(data.status===200){
        Alert.alert("Email đã được đăng ký")
        return false}
}
    const SigupAccount=async()=>{
      const newAccout={
        name:name,
        email:email,
        phone:phone,
        password:password,
        date:date,
        sex:sex
      }
      try {
          const response=await fetch(`${Uri_SiginAccount}`,{
            method:"POST",
            headers: {
              "Content-Type": "application/json" // Sửa đổi phần này
            },
            body:JSON.stringify(newAccout)
          })
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Đã xảy ra lỗi không xác định");
          }
          const data = await response.json();
          await AsyncStorage.setItem('Account',JSON.stringify(data.data));
          navigation.navigate('Bottomtabs')
          Alert.alert("Đăng ký thành công");    
      } catch (error) {
        console.log(error)
      }
    }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
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
      <View>
      <TextInput
        onFocus={()=>{setttname(false)}}
          style={styles.input}
          placeholder="Họ tên"
          value={name}
          onChangeText={(text)=>setname(text)}
        />
        {ttname&&(<Text style={{color:'red',marginStart:20,marginTop:-10}}>Vui lòng nhập họ tên</Text>)}
        <TextInput
          onFocus={()=>{setttemail(false)}}
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={(text)=>setemail(text)}
        />
        {ttemail&&(<Text style={{color:'red',marginStart:20,marginTop:-10}}>Email không hợp lệ</Text>)}
        <TextInput
          onFocus={()=>{setttphone(false)}}
          style={styles.input}
          placeholder="Số điện thoại"
          value={phone}
          onChangeText={(text)=>setphone(text)}
        />
        {ttphone&&(<Text style={{color:'red',marginStart:20,marginTop:-10}}>Số điện thoại không hợp lệ</Text>)}
        <View
          style={{ width: "100%", flexDirection: "row", alignItems: "center" }}
        >
          <TextInput
            onFocus={()=>{setttPass(false)}}
            style={[styles.input, { width: "90%" }]}
            placeholder="Mật khẩu"
            secureTextEntry={hindpassword} 
            value={password}
            onChangeText={(text)=>setpassword(text)}
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
        {ttPass&&(<Text style={{color:'red',marginStart:20,marginTop:-10}}>Mật khẩu chứa ít nhất 6 ký tự</Text>)}
            <View style={{flexDirection:'row'}}>
                    <TextInput
                      onFocus={()=>{setttdate(false)}}
                    keyboardType="numeric"
                        style={[styles.input,{flex:1}]}
                        placeholder="Ngày sinh"
                        value={date}
                        onChangeText={(text)=>setdate(text)}
                />
                <View>
                    <TextInput
                    onFocus={()=>{setttsex(false)}}
                        style={[styles.input,{flex:1}]}
                            placeholder="Giới tính"
                            value={sex}
                            onChangeText={(text)=>setsex(text)}
                    />
                   
                </View>
               
        
            </View>
            <View style={{flexDirection:'row',justifyContent:'space-between',paddingEnd:25}}>
            {ttdate?(<Text style={{color:'red',marginStart:20,marginTop:-10}}>Vui lòng nhập ngày sinh</Text>):(<Text></Text>)}
            {ttsex&&(<Text style={{color:'red',marginStart:20,marginTop:-10}}>nhập giới tính </Text>)}
            </View>
           
           
      </View>
      <TouchableOpacity onPress={()=>{DangKy()}}>
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
            Đăng ký
          </Text>
        </View>
      </TouchableOpacity>

  
       
     
    </View></KeyboardAvoidingView>
  )
}

export default Sigup

const styles = StyleSheet.create({
    input: {
        borderBottomWidth: 1, // Độ dày của đường kẻ chân
        borderBottomColor: "gray", // Màu của đường kẻ chân
        marginHorizontal: 20,
        height: 40,
        marginBottom: 20,
        fontSize: 16,
     
        paddingEnd:40
      },
})