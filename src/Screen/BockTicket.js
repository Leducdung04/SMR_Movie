import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import { Uri_listTicketById_showtime ,Uri_Add_Bills,Uri_addTicker,Uri_get_movies_by_id} from '../api/index'
import { useRoute } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import NetInfo from "@react-native-community/netinfo"; 
import axios from "axios";
// import ImagePicker from '@react-native-image-picker';
// import { launchImageLibrary } from 'react-native-image-picker';

const { width: widthScreen,height:heightScreen } = Dimensions.get("window");
const soundObject = new Audio.Sound();
const BockTicket = ({ navigation }) => {

  const route = useRoute();
  const { data } = route.params;
  console.log("dữ liệu truyền vào màn hình ",data)
  const [DataMovie, setDataMovie] = useState(null)
  const ListGhe = [...Array(60).keys()].map((num) => num + 1);
  const [Chair_select, setChair_select] = useState([]);
  const [ListTichetByid_showtime, setListTichetByid_showtime] = useState([]);
  const PriceTicket=data.fare
  const [TotalPrice, setTotalPrice] = useState(0)
  const [payMethod, setpayMethod] = useState(1)
  const [comfirmBooking, setcomfirmBooking] = useState(false)
  const [comfirmBookingByPay, setcomfirmBookingByPay] = useState(false)
  const [anhThanhToan, setanhThanhToan] = useState(null)
  const [ImgQR, setImgQR] = useState(null)
  const [newBills, setnewBills] = useState({})
  const [CheckSuccess, setCheckSuccess] = useState(false)

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

//   const chooseImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: false,
//         quality: 1,
//     });

//     if (!result.canceled) {
//         const { uri, type, fileName } = result.assets[0];
//         setanhThanhToan(uri);
//         setImgQR({
//             uri,
//             type,
//             fileName: fileName || uri.split('/').pop() // Lấy tên tệp từ URI nếu không có fileName
//         });
//     }
// };

const chooseImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    quality: 1,
  });

  if (!result.canceled) {
    const { uri, type, fileName } = result.assets[0];
    const name = fileName || uri.split('/').pop();
    const fileType = type || 'image/jpeg';
    setanhThanhToan(uri);
    setImgQR({
      uri: result.assets[0].uri,
      type: result.assets[0].mimeType || 'image/jpeg',
      name: result.assets[0].fileName || result.assets[0].uri.split('/').pop(),
    });
  }
};



// phát âm thanh thành công 
const AmThanhThanhCong = async () => {
  try {
    await soundObject.loadAsync(require('../mp3/livechat-129007.mp3')); // Load file âm thanh
    await soundObject.playAsync(); // Phát âm thanh
    // Có thể thêm xử lý khác sau khi phát âm thanh
  } catch (error) {
    console.log('Error playing sound:', error);
  }
};

  const Check_chair_status = async () => {
    try {
      const response = await fetch(`${Uri_listTicketById_showtime}/${data._id}`)
      console.log("uri" + `${Uri_listTicketById_showtime}/${data._id}`)
      const dulieu = await response.json()
      setListTichetByid_showtime(dulieu.data)
      console.log("lấy dữ liệu thành công list vé" + JSON.stringify(dulieu.data))
    } catch (error) {
      console.log("Lỗi khi lấy dữ liệu list vé theo id suất chiếu trong màn BockTixket", error)
    }
  }

  
  const orderTicket=async()=>{
            addBills();
            addTicket();
            setcomfirmBooking(false)
            setCheckSuccess(true)
            AmThanhThanhCong()
            await setTimeout(() => {
            setCheckSuccess(false)
            }, 1500);
            await Check_chair_status()
            await setChair_select([])
            setTimeout(() => {
            Alert.alert("Cảm ơn bạn đã lựa chọn SMR ! Thông tin vé của bạn đã được gửi đến hòm thư. Vui lòng kiểm tra lại các thông tin chi tiết. Nếu có bất kỳ thắc mắc hoặc cần hỗ trợ vui lòng liên hệ với chúng tôi qua email. Chúc bạn có một buổi xem phim vui vẻ và thú vị !")
            }, 2000);
  }

  useEffect(() => {
    NetInfo.fetch().then(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    });
  }, []);

  const orderTicketByPay = async () => {
    const date=new Date();
      const day = date.getDate(); // Ngày tính từ 1-31
      const month = date.getMonth() + 1; // Tháng tính từ 0-11, cần +1 để thành 1-12
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2,'0');
      const minutes = date.getMinutes().toString().padStart(2,'0');
    const newOder={
      img:null,
      payment_amount:TotalPrice,
      Number_of_tickets:Chair_select.length,
      Payment_methods:payMethod,
      date:`${day}/${month}/${year}`,
      time:`${hours}:${minutes}`,
      id_uer:'663b1b0095121af8cf26fe17',
      status:0,
    }

    const dulieuthem = new FormData();
    dulieuthem.append('payment_amount',TotalPrice);
    dulieuthem.append('Number_of_tickets', Chair_select.length);
    dulieuthem.append('Payment_methods',payMethod);
    dulieuthem.append('date', `${day}/${month}/${year}`);
    dulieuthem.append('time', `${hours}:${minutes}`);
    dulieuthem.append('id_user', '663b1b0095121af8cf26fe17');
    dulieuthem.append('status', 0);

    if (ImgQR) {
      dulieuthem.append('img', {
        uri: ImgQR.uri,
        type: ImgQR.type,
        name: ImgQR.name,
      });
    }
    try {
      const response = await fetch('http://192.168.1.6:3000/api/add-bills', {
        method: 'POST',
        body: dulieuthem,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.ok) {
        console.log('Thêm bills thành công');
        console.log("dữ liệu đây ",dulieuthem)
        addTicket();
        setcomfirmBookingByPay(false);
        setCheckSuccess(true);
        AmThanhThanhCong();
        await setTimeout(() => {
            setCheckSuccess(false);
        }, 1500);
        await Check_chair_status();
        await setChair_select([]);
        setTimeout(() => {
            Alert.alert("Cảm ơn bạn đã lựa chọn SMR! Thông tin vé của bạn đã được gửi đến hòm thư. Vui lòng kiểm tra lại các thông tin chi tiết. Nếu có bất kỳ thắc mắc hoặc cần hỗ trợ vui lòng liên hệ với chúng tôi qua email. Chúc bạn có một buổi xem phim vui vẻ và thú vị!");
        }, 2000);
      } else {
        console.log('Failed to add bills', response.status);
      }
    } catch (error) {
      console.log("Lỗi khi orderTicketByPay", error);
          if (error.message === "Network Error") {
              Alert.alert("Lỗi mạng", "Không thể kết nối đến server. Vui lòng kiểm tra lại kết nối mạng và thử lại.");
          } else {
              Alert.alert("Lỗi", error.message);
          }
    }
  };
  





  const addBills=async()=>{
    try {
      const date=new Date();
      const day = date.getDate(); // Ngày tính từ 1-31
      const month = date.getMonth() + 1; // Tháng tính từ 0-11, cần +1 để thành 1-12
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2,'0');
      const minutes = date.getMinutes().toString().padStart(2,'0');
  
      let newBills={
        payment_amount:TotalPrice,
        Number_of_tickets:Chair_select.length,
        Payment_methods:payMethod,
        date:`${day}/${month}/${year}`,
        time:`${hours}:${minutes}`,
        id_uer:'663b1b0095121af8cf26fe17',
        status:0,
        img:anhThanhToan===null? null:ImgQR
      }
         const response= await fetch(Uri_Add_Bills,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(newBills)
         })
         const data= await response.json();
         setnewBills(data.data)
         console.log("Thêm bills thành công")
    } catch (error) {
      console.log("lỗi khi thêm bills",error)
    }
    
  }

  const addTicket=()=>{
      Chair_select.forEach(async item=>{
           try {
               const response= await fetch(Uri_addTicker,{
                  method:"POST",
                  headers:{
                      "Content-Type":"application/json"
                  },
                  body:JSON.stringify({
                      id_showtimes:data._id,
                      chair:item,
                      pay:payMethod,
                      status:0,
                      id_bills:newBills.id_bills,
                      id_users:'663b1b0095121af8cf26fe17',
                      id_showtimes:data._id,
                  })
               })
               const data1=await response.json()
               data1.status===200?()=>{Check_chair_status();Alert.alert("Đặt vé thành công")}:Alert.alert("Lỗi khi Đặt vé vui lòng thử lại")
           } catch (error) {
              console.log("Lỗi khi thêm vé",error)
           }
      })
  }
  const getDataMovie=async()=>{
    try {
      let response=await fetch(`${Uri_get_movies_by_id}/${data.id_movie}`)
      let dataMovie=await response.json()
      setDataMovie(dataMovie)
    } catch (error) {
      console.log("Lỗi khi thực hiện truy xuất Movie"+error)
    }
  }
  useEffect(() => {
    Check_chair_status()
      getDataMovie()
   
  }, []);

  useEffect(() => {
    setTotalPrice(Chair_select.length * PriceTicket);
  }, [Chair_select]);

  const ItemGhe = ({ item }) => {
    const isBooked = ListTichetByid_showtime.some(ticket => Number(ticket.chair) === item);
    const isSelect = Chair_select.includes(item);

    const SelectChair = (item) => {
      if (isBooked) {
        Alert.alert("Ghế đã được đặt, vui lòng chọn ghế khác");
      } else {
        if (isSelect) {
          // Nếu ghế đã được chọn, bỏ chọn nó
          setChair_select(prevState => prevState.filter(chair => chair !== item));
        } else {
          // Nếu ghế chưa được chọn, thêm vào danh sách ghế chọn
          setChair_select(prevState => [...prevState,item]);
        }
      }
    }

    return (
      <TouchableOpacity onPress={() => SelectChair(item)}>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <AntDesign name="QQ" size={widthScreen /10} color={isBooked ? 'red' : (isSelect ? "#94d0ee" : "#DDDDDD")} />
          <Text
            style={{
              position: "absolute",
              color: "white",
              fontWeight: "bold",
              fontSize: 16,
              width: 30,
              textAlign: "center",
            }}
          >
            {item}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex:1,backgroundColor:'white'}}>

         {/* headers  */}
         <View style={{flex:1}}>
         <ImageBackground
            style={{ height: '100%', width: "100%" }}
            source={require("../img/image.png")}
          >
            <View
              style={{
                marginStart: 20,
                marginTop: 35,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{ width: 50 }}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back-circle" size={45} color="white" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
         </View>

         {/* body */}
         <View style={{flex:4}}>
               {/* Danh sách ghế ngồi */}
               <View style={{flex:1.25,backgroundColor:'white'}}>
                       <Text style={{fontSize: 18, textAlign: "center",marginTop:10}}>Vui lòng chọn ghế</Text>
                       <FlatList
                        data={ListGhe}
                        renderItem={({ item }) => <ItemGhe item={item} />}
                        numColumns={10}
                        keyExtractor={(item, index) => index.toString()}
                      />
               </View>

               <View style={{flex:1}}>
                       
               </View>

               
         </View>

          {/* footer */}
         <View style={{flex:1,backgroundColor:'black'}}>

         </View>
         
        {/* <View style={{flex:1}}>
          <ImageBackground
            style={{ height: 120, width: "100%" }}
            source={require("../img/image.png")}
          >
            <View
              style={{
                marginStart: 20,
                marginTop: 45,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{ width: 50 }}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back-circle" size={45} color="white" />
              </TouchableOpacity>
            </View>
          </ImageBackground>
          <Text style={{ fontSize: 18, textAlign: "center", marginVertical: 10 }}>
            Vui lòng chọn ghế{" "}
          </Text>
          <FlatList
            data={ListGhe}
            renderItem={({ item }) => <ItemGhe item={item} />}
            numColumns={10}
            keyExtractor={(item, index) => index.toString()}
          />
          <Text style={{ margin: 10, fontSize: 17, color: 'gray' }}>Trạng thái ghế</Text>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width:widthScreen/10*3, marginStart: 10 }}>
              <View style={{ flexDirection: "row", alignItems: 'center', margin: 5 }}>
                <AntDesign name="QQ" size={40} color='#DDDDDD' />
                <Text>Ghế trống</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: 'center', margin: 5 }}>
                <AntDesign name="QQ" size={40} color="#94d0ee" />
                <Text>Đang chọn</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: 'center', margin: 5 }}>
                <AntDesign name="QQ" size={40} color="red" />
                <Text>Đã đặt</Text>
              </View>
            </View>
            <View style={{flex:1,width:widthScreen/10*7}}>
            <FlatList
              style={{flex:1,backgroundColor:'#EEEEEE',borderRadius:5}}
              data={Chair_select}
              numColumns={3}
              renderItem={({item})=>(<ImageBackground style={{width:widthScreen/10*2,height:40,margin:6,flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}
                                    source={require('../img/Ticket.png')}
              >
                <Text style={{color:'black',fontSize:16,textAlign:'center',fontWeight:'bold'}}>{item}</Text>
                <Image source={require('../img/Ma.png')}
                      style={{width:10,height:40}}
                />
              </ImageBackground>)}
              />
            </View>
            
          </View>
          <Text style={{ margin: 10, fontSize: 17, color: 'gray' }}>Phương thức thanh toán</Text>
          <View style={{flex:2}}>
              
              <TouchableOpacity 
              onPress={()=>{setpayMethod(1)}}
              style={{height:57,marginHorizontal:20,marginBottom:15,borderWidth:payMethod===1?1:0,borderRadius:10,borderColor:'green'}}>
                <View  style={styles.pay}>
                    <Text style={styles.textPay}>Thanh toán tại quầy</Text>
                    <FontAwesome5 name="money-bill" size={24} color="green" />
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
              onPress={()=>{

                setpayMethod(2)
              }}
              style={{height:57,marginHorizontal:20,marginBottom:15,borderWidth:payMethod===2?1:0,borderRadius:10,borderColor:'green'}}>
                <View style={styles.pay}>
                    <Text style={styles.textPay}>Chuyển khoản</Text>
                    <FontAwesome name="bank" size={24} color="blue" />
                </View>
              </TouchableOpacity>
          </View>
        </View>

        <View style={{position:"absolute",bottom:30,width:widthScreen-15,height:75,flexDirection:'row',justifyContent:'space-between'}}>
              <View style={{flex:1.5,justifyContent:'center',alignItems:'center'}}> 
                  <Text style={{color:'#ff4500',fontSize:20,textAlign:'center',fontWeight:'bold'}}>{TotalPrice.toLocaleString()} vnd</Text>
              </View>
              <TouchableOpacity onPress={()=>{
                if(Chair_select.length===0){
                  Alert.alert('Vui lòng chọn ghế')
                }else{
                  payMethod===1?setcomfirmBooking(true):setcomfirmBookingByPay(true)
                }
                }} style={{flex:1}}>
              <View style={{flex:1,backgroundColor:'#94d0ee',borderRadius:40,justifyContent:'center'}}>
                    <Text style={{color:'white',fontSize:20,textAlign:'center',fontWeight:'bold'}}>Đặt Vé</Text>
              </View>
              </TouchableOpacity>

            
        </View>
           */}
          {CheckSuccess&&<AntDesign style={{position:"absolute",top:(heightScreen-70)/2,start:(widthScreen-70)/2}} name="checkcircleo" size={70} color="green" />}
    
         {/* comfirm oder Ticket by pay at the counter */}
          <Modal  
                visible={comfirmBooking}
                animationType="slide"
                transparent={true}> 
               <View style={{flex:1,justifyContent:'center',alignItems:"center"}}>
                     <View style={{width:'85%',height:640,backgroundColor:'white',borderRadius:20,
                     shadowColor: '#000',shadowOffset: { width: 1, height: 2 },shadowOpacity: 0.3,shadowRadius: 3.84,
                     }}>
                      
                               <View style={{flex:4}}>
                                  <Text style={{textAlign:'center',marginTop:20,fontSize:20}}>Xác nhận thông tin</Text>
                                  <View style={{flexDirection:'row',marginStart:20,marginTop:10}}>
                                   <Image  source={{uri:DataMovie==null?undefined:DataMovie.img}} style={{width:100,height:150,borderRadius:10}}/>
                                      <View style={{flex:1,padding:10}}>
                                          <Text style={{fontWeight:'bold',marginVertical:5}}>{DataMovie==null?'':DataMovie.name}</Text>
                                          <Text >Diễn viên: {DataMovie==null?'':DataMovie.performer}</Text>
                                          <Text style={{marginTop:5}}>Thời lượng: {DataMovie==null?'':DataMovie.time} phút</Text>
                                      </View>
                                  </View>
                                  <View style={{paddingHorizontal:10,marginTop:10}}>
                                    <Text>Thời gian : {data.time}  {data.date}</Text>
                                    <Text style={{marginTop:5}}>Ngày : {data.date}</Text>
                                    <Text style={{marginTop:5}}>Vé đặt :</Text>
                                    <FlatList
                                        style={{borderRadius:5,height:140}}
                                        data={Chair_select}
                                        numColumns={3}
                                        renderItem={({item})=>(<View style={{paddingVertical:3,paddingStart:2,borderRadius:5,backgroundColor:'#eeeeee',marginHorizontal:5,marginVertical:5}}><ImageBackground style={{width:85,height:35,flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}
                                                              source={require('../img/Ticket.png')}>
                                          <Text style={{color:'black',fontSize:16,textAlign:'center',fontWeight:'bold'}}>{item}</Text>
                                          <Image source={require('../img/Ma.png')}
                                                style={{width:10,height:40}}
                                          />
                                        </ImageBackground></View>)}
                                        />
                                        <Text style={{color:'#ff4500',fontSize:20,fontWeight:'bold',margin:15}}>{TotalPrice.toLocaleString()} vnd</Text>
                                         <View style={{marginStart:20}}>
                                              <Text>Lưu ý :</Text>
                                              <Text>            Mang theo mã đặt vé </Text>
                                              <Text>            Đến sớm lấy vé và hoàn thành thanh toán</Text>
                                              <Text>            Kiểm tra thông tin vé khi nhận</Text>
                                         </View>
                                        
                                  </View>
                                  
                               </View>

                               <View style={{flex:1,flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                                    <TouchableOpacity onPress={()=>{setcomfirmBooking(false)}}>
                                      <View style={styles.Button}>
                                        <Text style={styles.textButton}>Hủy</Text>
                                      </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>orderTicket()}>
                                    <View style={styles.Button}>
                                       <Text style={styles.textButton}>Xác nhận</Text>
                                    </View>
                                    </TouchableOpacity>
                               </View>
                        </View>
               </View>
          </Modal>

          {/* comfirm oder Ticket By Pay */}
          <Modal  
                visible={comfirmBookingByPay}
                animationType="slide"
                transparent={true}> 
               <View style={{flex:1,justifyContent:'center',alignItems:"center"}}>
                     <View style={{width:'90%',height:'85%',backgroundColor:'white',borderRadius:20,
                      shadowColor: '#000',shadowOffset: { width: 1, height: 2 },shadowOpacity: 0.3,shadowRadius: 3.84,
                     }}>
                               <View style={{flex:4}}>
                                  <Text style={{textAlign:'center',marginTop:20,fontSize:20}}>Xác nhận thông tin</Text>
                                  <View style={{flexDirection:'row',marginStart:20,marginTop:10}}>
                                   <Image  source={{uri:DataMovie==null?undefined:DataMovie.img}} style={{width:100,height:150,borderRadius:10}}/>
                                      <View style={{flex:1,padding:10}}>
                                          <Text style={{fontWeight:'bold',marginVertical:5}}>{DataMovie==null?'':DataMovie.name}</Text>
                                          <Text >Diễn viên: {DataMovie==null?'':DataMovie.performer}</Text>
                                          <Text style={{marginTop:5}}>Thời lượng: {DataMovie==null?'':DataMovie.time} phút</Text>
                                      </View>
                                  </View>
                                  <View style={{paddingHorizontal:10,marginTop:10}}>
                                    <Text>Thời gian : {data.time}  {data.date}</Text>
                                    <Text style={{marginTop:5}}>Ngày : {data.date}</Text>
                                    <Text style={{marginTop:5}}>Vé đặt :</Text>
                                    <FlatList
                                        style={{borderRadius:5,maxHeight:140}}
                                        data={Chair_select}
                                        numColumns={3}
                                        renderItem={({item})=>(<View style={{paddingVertical:3,paddingStart:2,borderRadius:5,backgroundColor:'#eeeeee',marginHorizontal:5,marginVertical:5}}><ImageBackground style={{width:85,height:35,flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}
                                                              source={require('../img/Ticket.png')}>
                                          <Text style={{color:'black',fontSize:16,textAlign:'center',fontWeight:'bold'}}>{item}</Text>
                                          <Image source={require('../img/Ma.png')}
                                                style={{width:10,height:40}}
                                          />
                                        </ImageBackground></View>)}
                                        />
                                        <Text style={{color:'#ff4500',fontSize:20,fontWeight:'bold',margin:15}}>{TotalPrice.toLocaleString()} vnd</Text>
                                        <Text>Thông tin tài khoản</Text>
                                        <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center'}}>
                                        <Image source={require('../img/imgQr.png')} style={{width:120,height:130,margin:10}}/>
                                        <TouchableOpacity onPress={()=>{chooseImage()}}>
                                        <Image source={{uri:anhThanhToan==null?'https://cdn-icons-png.flaticon.com/128/401/401061.png':anhThanhToan}} style={{width:100,height:140,margin:10,borderRadius:10}}/>
                                        </TouchableOpacity>
                                        </View>
                                        <Text>Lưu ý:</Text>
                                        <Text>           +Kiểm tra thông tin tài khoản trước khi giao dịch</Text>
                                        <Text>           +Nôi dung chuyển khoản số điện thoại của bạn</Text>
                                        <Text>           +Gửi ảnh rõ nét nội dung giao dịch</Text>
                                        
                                  </View>
                                  
                               </View>

                               <View style={{flex:1,flexDirection:'row',justifyContent:'space-around',alignItems:'center'}}>
                                    <TouchableOpacity onPress={()=>{setcomfirmBookingByPay(false)}}>
                                      <View style={styles.Button}>
                                        <Text style={styles.textButton}>Hủy</Text>
                                      </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{orderTicketByPay()}}>
                                    <View style={styles.Button}>
                                       <Text style={styles.textButton}>Xác nhận</Text>
                                    </View>
                                    </TouchableOpacity>
                               </View>
                        </View>
               </View>
          </Modal>


    </View>
  );
};

export default BockTicket;

const styles = StyleSheet.create({
  textPay:{
    fontSize:18
  },
  pay:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingHorizontal:15,
    height:55,
    backgroundColor:'#EEEEEE',
    borderRadius:10,
    marginBottom:15
  },
  textButton:{
    fontSize:16,textAlign:'center',fontWeight:'bold',color:'white'
  },
  Button:{
    width:120,height:53,backgroundColor:'blue',borderRadius:25,justifyContent:'center'
  }
});
