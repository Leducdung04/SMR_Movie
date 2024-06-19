import {
  Alert,
  Dimensions,
  FlatList,
  ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { Uri_get_movies_by_id, Uri_Showtime,Uri_listTicketById_showtime } from "../api/index";
import { AntDesign } from '@expo/vector-icons';

const heightScreen = Dimensions.get("window").height;

const widthScreen = Dimensions.get("window").width;


const Showtime = ({ navigation }) => {
  const route = useRoute();
  const { data } = route.params;
  const day = new Date();
  const [selectedDate, setSelectedDate] = useState(day);
  const widthScreem = Dimensions.get("window").width;
  const [Movide, setMovide] = useState({});
  const [Showtimes, setShowtimes] = useState([]);
  const [tb, settb] = useState(true);
  const [StatusBokingSticket, setStatusBokingSticket] = useState(false);
  const ListGhe = [...Array(54).keys()].map((num) => num + 1);
  const [ListGheDaChon, setListGheDaChon] = useState([])
  const [ListGheChon, setListGheChon] = useState([])
  //:id_movie/:date
  const getMovide = async () => {
    try {
      const response = await fetch(`${Uri_get_movies_by_id}/${data}`);
      const dat = await response.json();
      setMovide(dat);
      console.log("Dữ liệu đây" + Movide);
      console.log("Lấy dữ liệu thành công");
    } catch (error) {
      console.log(error);
    }
  };

  const getShowtime = async (day) => {
    try {
      const response = await fetch(`${Uri_Showtime}/${data}/${day}`);
      console.log(`${Uri_Showtime}/${data}/${day}`);
      const dat = await response.json();
      console.log("Status" + dat.status);
      setShowtimes(dat.data);
      dat.status === 404 ? settb(false) : settb(true);
      console.log("Dữ liệu Suất chiếu " + Showtimes);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const unsubscribe=navigation.addListener("blur", () => {
      getMovide();
    })
    return unsubscribe
  }, [navigation]);

  // Hàm được gọi khi một ngày được chọn
  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    getShowtime(day.dateString);
  };

  const ngay = () => {
    const date = new Date(selectedDate);
    const dayOfWeek = date
      .toLocaleDateString("en-US", { weekday: "long" })
      .replace("day", ""); // Lấy ngày trong tuần
    const dayOfMonth = date.getDate(); // Lấy số ngày trong tháng
    const month = date.toLocaleDateString("en-US", { month: "long" }); // Lấy tên tháng
    const year = date.getFullYear(); // Lấy năm
    return `${dayOfWeek} ${month} ${dayOfMonth} ${year}`;
  };

  
  // const renderItem = ({ item }) =>{ 
  //     const [statusChair, setstatusChair] = useState(0)
  //  return(
  //   <View style={{justifyContent:'center',alignItems:'center'}}>
  //   <AntDesign name="QQ" size={widthScreen/9} color="#999999"/>
  //   <Text style={{position:'absolute',color:'white',fontWeight:'bold',fontSize:18,width:40,height:30,textAlign:'center'}}>{item}</Text>
  //   </View>
  // )};

  return (
    <View style={{ flex: 1 }}>
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
          <Text
            style={{
              marginTop: 10,
              width: widthScreem - 140,
              textAlign: "center",
              color: "white",
              fontSize: 24,
              textDecorationLine: "underline",
            }}
          >
            {Movide.name}
          </Text>
        </View>
      </ImageBackground>

      <Calendar
        onDayPress={onDayPress} // Gọi hàm onDayPress khi một ngày được chọn
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#94d0ee" },
        }} // Đánh dấu ngày được chọn
      />
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 18,
          color: "#888888",
          margin: 10,
        }}
      >
        {ngay()}
      </Text>
      {tb ? (
        <ScrollView horizontal={true}>
          {Showtimes.map((item) => {
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate('BockTicket',{data:item})}
                key={item._id}
              >
                <View
                  style={{
                    width: 100,
                    height: 50,
                    backgroundColor: "white",
                    margin: 10,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      color: "#444444",
                    }}
                  >
                    {item.time}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <View>
          <Text>Không có xuất chiếu trong ngày {ngay()}</Text>
        </View>
      )}
      <Modal
        visible={StatusBokingSticket}
        animationType="slide"
        transparent={true}
      >
        <TouchableOpacity onPress={() => setStatusBokingSticket(false)}>
          <View
            style={{
              width: widthScreem,
              height: 120,
              backgroundColor: "rgba(0,0,0,0)",
            }}
          ></View>
        </TouchableOpacity>

        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: widthScreem,
            height: heightScreen - 120,
            backgroundColor: "white",
          }}
        >
          <Text style={{fontSize:18,textAlign:'center',marginVertical:10}}>Vui lòng chọn ghế </Text>
          <FlatList
            data={ListGhe}
            renderItem={({item})=>{
                                  
              return(
                <View style={{justifyContent:'center',alignItems:'center'}}>
                <AntDesign name="QQ" size={widthScreen/9} color="#999999"/>
                <Text style={{position:'absolute',color:'white',fontWeight:'bold',fontSize:18,width:40,height:30,textAlign:'center'}}>{item}</Text>
                </View>
              )
            }}
            numColumns={9}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </Modal>
    </View>
  );
};

export default Showtime;

const styles = StyleSheet.create({});
