import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityBase,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from '@expo/vector-icons';

import { Uri_listTicketByUser,Uri_get_movies_by_id } from "../api/index";

const widthScreen = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;
const SettingScreen = ({ navigation }) => {
  
  const [status, setS] = useState(0);
  const [t1, sett1] = useState(0);
  const [ListTicket, setListTicket] = useState([]);
  const [ListFavourti, setListFavourti] = useState([])
  const [ListMovie, setListMovie] = useState([])
  const [ListBill, setListBill] = useState([])

  const [ListHienThi, setListHienThi] = useState([])
  const [TaiKhoan, setTaiKhoan] = useState(null);
   const [StatusGetData, setStatusGetData] = useState(0)

  const [TicketNumber, setTicketNumber] = useState(0)

  const clearAccount = async () => {
    try {
      await AsyncStorage.removeItem("Account");
      console.log("Đã xóa tất cả dữ liệu thành công");
      setTaiKhoan(null);
      navigation.navigate("Trang chủ");
    } catch (error) {
      console.error("Lỗi khi xóa dữ liệu:", error);
    }
  };
  const LoginOut = () => {
    TaiKhoan === null
      ? navigation.navigate("Login")
      : Alert.alert("Bạn có muốn đăng xuất không ?", "", [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => clearAccount(),
          },
        ]);
  };

  const getListTicketByAccount = async () => {
    try {
      const response = await fetch(`${Uri_listTicketByUser}/${TaiKhoan._id}`);
      if (!response.ok) {
        throw new Error('Lỗi khi gọi API');
      }
      const data = await response.json();
      setListTicket(data.data);
      console.log("Lấy dữ liệu listTicket thành công" + JSON.stringify(data.data));
      setTicketNumber(ListTicket.length)
    } catch (error) {
      console.log('Lỗi khi gọi API:', error);
      // Xử lý lỗi ở đây, có thể đặt trạng thái hoặc hiển thị thông báo lỗi
    }
  };

 const ItemTicket=({item})=>{
  const [movideTicket, setmovideTicket] = useState(null)
  const getmovieTicket =async()=>{
    try {
    const response = await fetch(`${Uri_get_movies_by_id}/${item.id_showtimes.id_movie}`)
    const data = await response.json()
    setmovideTicket(data)
    console.log('JJJ '+movideTicket)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
      getmovieTicket()
  }, [])
  
  return  (<View style={{flex:1,marginTop:10,width:(widthScreen/2),height:(widthScreen/2)*1.8,alignItems:'center'}}>
    <ImageBackground style={{flex:1,width:(widthScreen/2)-5,height:(widthScreen/2)*1.8,alignItems:'center'}} source={require('../img/Subtract.png')}>
      <View style={{flex:2.8}}>
        <View style={{flex:1,marginHorizontal:5}}>
              <Text style={{textAlign:'center',marginTop:10,color:'#999999',fontWeight:'bold'}}>Vé Phim</Text>
              <Image style={{width:45,height:45,position:'absolute',end:0,top:0}} source={require('../img/logo.png')}/>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:20}}>
                   <Text style={{marginTop:10,color:'#999999',fontWeight:'bold'}}>{movideTicket&&movideTicket.name? movideTicket.name:'Tên phim'}</Text>
                   
                      <View style={{width:40,height:25,borderRadius:10,backgroundColor:'#94d0ee',marginTop:10,alignItems:'center',justifyContent:'center'}}>
                       <Text style={{color:'white',fontWeight:'bold'}}>{item.id_showtimes.room}</Text>
                      </View>
                     
              </View>
              {item.status==1?(<Text style={{color:'red',fontWeight:'bold',marginVertical:5}}>Chưa thanh toán</Text>):(<Text style={{marginVertical:5,color:'#999999',fontWeight:'bold'}}>Đã thanh toán</Text>)}
              
              <Text style={{color:'#999999',fontWeight:'bold',marginVertical:5}}>{item.pay}</Text>
              
        </View>
        <View style={{flex:1,}}>
               <View style={{flex:1}}>
                
               </View>
               <View style={{flex:1,flexDirection:'row',alignContent:'space-between',justifyContent:"space-around",width:(widthScreen/2)-20}}>
                    <View>
                         <Text style={{color:'#999999',marginBottom:5}}>Date</Text>
                         <Text>{item.id_showtimes.date.substring(0,5)}</Text>
                    </View>
                    <View style={{width:1,height:'90%',backgroundColor:'#999999',}}></View>
                    <View>
                         <Text style={{color:'#999999',marginBottom:5}}>Hour</Text>
                         <Text>{item.id_showtimes.time}</Text>
                    </View>
                    <View style={{width:1,height:'90%',backgroundColor:'#999999',}}></View>
                    <View>
                         <Text style={{color:'#999999',marginBottom:5}}>Seats</Text>
                         <Text>{item.chair}</Text>
                    </View>
               </View>
        </View>
      </View>
      <Image style={{width:(widthScreen/2)-30,height:10}} source={require('../img/Vector 8.png')} />
      <View style={{flex:1}}>
      <View style={{flex:1,paddingHorizontal:10,justifyContent:'center'}}>
           <Text style={{color:'#999999',marginBottom:5}}>Booking Code</Text>
           <Text>{item._id}</Text>
      </View>
      </View>
      <Image style={{width:(widthScreen/2)-40,height:50,marginBottom:20}} source={require('../img/Group 8.png')} />
     </ImageBackground>  

   </View>)
 }

 const ItemMovie=({item})=>{
  const [Phim, setPhim] = useState(null)
  const getmovie =async()=>{
    try {
    const response = await fetch(`${Uri_get_movies_by_id}/${item.id_showtimes.id_movie}`)
    const data = await response.json()
    setPhim(data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
      getmovie()
  }, [])
  
     return(<View style={{flex:1,height:150,borderRadius:10,backgroundColor:'white',margin:10,justifyContent:'center',paddingHorizontal:20}}>
              <Image source={{uri:Phim&&Phim.img? Phim.img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlLkt9BmpUMbRD0A6P4Cjdbshfb4FTDMQoew&s'}} style={{width:100,height:120,borderRadius:5}}/>
     </View>)
 }
 const ItemList=({item})=>{
        switch(t1){
           case 0: return (<View style={{width:100,height:100,backgroundColor:'gray'}}></View>);
           case 1: return  <ItemTicket item={item}/>
           case 2: return  <ItemMovie item={item}/>;
           case 3: return (<View style={{width:100,height:100,backgroundColor:'blue'}}></View>);
           default : return false
        }
 }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      try {
        const accountDataString = await AsyncStorage.getItem("Account");
        setTaiKhoan(await JSON.parse(accountDataString));
        setStatusGetData(1)
        console.log("data Acount  " + TaiKhoan);
      } catch (error) {
        console.log(error);
      }
    });
   
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
     if(StatusGetData===1){
      getListTicketByAccount();
      setStatusGetData(2)
     }
  }, [StatusGetData])
  
  useEffect(() => {
     getListTicketByAccount();
  }, [ListHienThi])
  
  const BodyList=()=>{
    switch(t1){
      case 0: return (<View style={{width:100,height:100,backgroundColor:'gray'}}></View>);
      case 1: return (<FlatList
        style={{ flex: 1,backgroundColor:'#eeeeee'}}
        data={ListHienThi}
        renderItem={({item})=><ItemList item={item}/>}
        numColumns={2}
      />);
      case 2: return (<FlatList
        style={{ flex: 1,backgroundColor:'#eeeeee'}}
        data={ListHienThi}
        renderItem={({item})=><ItemList item={item}/>}
      />);
      case 3: return (<View style={{width:100,height:100,backgroundColor:'blue'}}></View>);
      default : return false
   }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar barStyle={"default"} />
      <View style={{ flex: 1.2 }}>
        <Text style={{ textAlign: "center", fontSize: 18, marginTop: 10 }}>
          {TaiKhoan && TaiKhoan.name ? TaiKhoan.name : "Name Account"}
        </Text>
        <MaterialIcons
          style={{ textAlign: "center", marginTop: 20 }}
          name="account-circle"
          size={90}
          color="#999999"
        />
        <TouchableOpacity style={{ position: "absolute", end: 10, top: -5 }}>
          <Image
            source={require("../img/logo.png")}
            style={{ width: 55, height: 55 }}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ width: 120, height: 50, justifyContent: "center" }}>
            <Text
              style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}
            >
              {TicketNumber}
            </Text>
            <Text style={{ textAlign: "center", fontSize: 14 }}>Vé đặt</Text>
          </View>
          <View
            style={{
              width: 1,
              height: 30,
              justifyContent: "center",
              backgroundColor: "gray",
            }}
          ></View>
          <View style={{ width: 120, height: 50, justifyContent: "center" }}>
            <Text
              style={{ textAlign: "center", fontSize: 16, fontWeight: "bold" }}
            >
              12
            </Text>
            <Text style={{ textAlign: "center", fontSize: 14 }}>Thích</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <TouchableOpacity>
            <View
              style={{
                width: 120,
                height: 50,
                backgroundColor: "#eeeeee",
                margin: 5,
                borderRadius: 10,
                justifyContent: "center",
              }}
            >
              <Text style={{ textAlign: "center", fontSize: 16 }}>
                Sửa hồ sơ
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => LoginOut()}>
            <View
              style={{
                width: 120,
                height: 50,
                backgroundColor: "#eeeeee",
                margin: 5,
                borderRadius: 10,
                justifyContent: "center",
              }}
            >
              {TaiKhoan === null ? (
                <Text style={{ textAlign: "center", fontSize: 16 }}>
                  Đăng nhập
                </Text>
              ) : (
                <Text style={{ textAlign: "center", fontSize: 16 }}>
                  Đăng xuất
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 2 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          {t1 === 0 ? (
            <TouchableOpacity>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    marginHorizontal: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AntDesign name="qrcode" size={24} color="black" />
                </View>
                <View
                  style={{ height: 2, width: 50, backgroundColor: "black" }}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() =>{ sett1(0); setListHienThi(ListBill)}} >
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    marginHorizontal: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AntDesign name="qrcode" size={24} color="#999999" />
                </View>
              </View>
            </TouchableOpacity>
          )}

          {t1 === 1 ? (
            <TouchableOpacity onPress={()=>{
              sett1(1)
              getListTicketByAccount();
              setListHienThi(ListTicket)
            }}>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    marginHorizontal: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="ticket-outline" size={28} color="black" />
                </View>
                <View
                  style={{ height: 2, width: 50, backgroundColor: "black" }}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() =>{ sett1(1);setListHienThi(ListTicket)}}>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    marginHorizontal: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="ticket-outline" size={28} color="#999999" />
                </View>
              </View>
            </TouchableOpacity>
          )}
          {t1 === 2 ? (
            <TouchableOpacity

            >
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    marginHorizontal: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="movie-open-play-outline"
                    size={28}
                    color="black"
                  />
                </View>
                <View
                  style={{ height: 2, width: 50, backgroundColor: "black" }}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                sett1(2);
                let newList=[]
                let id_movie_kt=new Set()
                ListTicket.forEach(item=>{
                     if(!id_movie_kt.has(item.id_showtimes._id)){
                      id_movie_kt.add(item.id_showtimes._id)
                      newList.push(item)
                     }
                })
                setListHienThi(newList)
              }}
            >
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    marginHorizontal: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="movie-open-play-outline"
                    size={28}
                    color="#999999"
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
          {t1 === 3 ? (
            <TouchableOpacity>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    marginHorizontal: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AntDesign name="hearto" size={24} color="black" />
                </View>
                <View
                  style={{ height: 2, width: 50, backgroundColor: "black" }}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => {sett1(3);setListHienThi(ListFavourti)}}>
              <View style={{ alignItems: "center" }}>
                <View
                  style={{
                    width: 50,
                    height: 50,
                    marginHorizontal: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AntDesign name="hearto" size={24} color="#888888" />
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
        {TaiKhoan === null ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator style={{ marginBottom: 20 }}></ActivityIndicator>
            <Text>Vui lòng đăng nhập</Text>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
              <BodyList/>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({});
