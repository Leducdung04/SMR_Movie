import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,Animated,
  Modal
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import {uri_get_videos_by_movie,Ipv4} from '../api/index'

const widthScreem = Dimensions.get("window").width;
const heightScreem = Dimensions.get("window").height;
const Movide = ({ navigation }) => {
  const Animatedvalue=useRef(new Animated.Value(0)).current;
  const disAnimations={
    transform: [{
      rotate: Animatedvalue.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['0deg', '180deg', '360deg'] // Adjusted outputRange
      })
    }]
  };
  useEffect(()=>{
    setTimeout(() => {
      Animated.loop(
        Animated.timing(Animatedvalue,{
          toValue:1,
          duration:3000,
          useNativeDriver:false
        })
      ).start();
    }, 2500);
    
  },[Animatedvalue]);

  const route = useRoute();
  const { data } = route.params;
  const [numberOfLines, setnumberOfLines] = useState(3);
  const [Videoslist, setVideoslist] = useState([]);
  const [Listds, setListds] = useState([]);
  const [ttBooktickets, setttBooktickets] = useState(false)
  const getVideos = async () => {
    try {
      let response = await fetch(`${uri_get_videos_by_movie}/${data._id}`);
      let dt = await response.json();
      setListds(dt);
      console.log(dt);
      console.log("Lấy thành công");
      console.log("Danh sách đây " + Videoslist + " kkkkk");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getVideos();
  }, []);

  return (
    <View style={{flex:1}}>
    <ScrollView>
      <ImageBackground
        source={{ uri: data.img }}
        style={{ width: widthScreem, height: heightScreem / 2 }}
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
          <Text
            style={{
              marginTop: 10,
              width: widthScreem - 140,
              textAlign: "center",
              color: "white",
              fontSize: 26,
              fontWeight: "bold",
              textDecorationLine: "underline",
            }}
          >
            {data.name}
          </Text>
        </View>
        <Text
          style={{
            position: "absolute",
            color: "white",
            bottom: 20,
            end: 15,
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          Công chiếu {data.Release_date}
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 16,
            marginStart: 10,
            position: "absolute",
            color: "white",
            bottom: 20,
            fontSize: 18,
          }}
        >
          {data.time} phút
        </Text>
      </ImageBackground>
      <Text style={{ margin: 10, fontSize: 20, fontWeight: "bold" }}>
        Phim {data.name}
      </Text>

      <TouchableOpacity
        onPress={() => {
          numberOfLines === 3
            ? setnumberOfLines(undefined)
            : setnumberOfLines(3);
        }}
      >
        <Text
          numberOfLines={numberOfLines}
          style={{ marginStart: 10, fontSize: 16, lineHeight: 25 }}
        >
          {" "}
          {data.content}{" "}
        </Text>
      </TouchableOpacity>
      <Text style={{ margin: 10, fontSize: 16, fontWeight: "bold" }}>
        Trailer
      </Text>
      {/* <FlatList
         horizontal={true}
         data={Videoslist}
         keyExtractor={({item}) =>item._id}
         renderItem={({item})=>{
          return(
            <View>

            </View>
            // <Video
            //   resizeMode="cover"
            //   source={item.name}
            //   key={item._id}
            //   style={{ width: 120, height: 200, backgroundColor: "red" }}
            // />
          )
         }}
      /> */}
      <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={{ marginHorizontal: 10 ,marginStart:10}}>
        {Listds.map((item) => {
          const uri_video=item.video[0]
          const  abc = uri_video.replace("localhost", Ipv4)
          console.log(Listds.length);
          console.log(abc);
          return (
            // <View
            // key={Math.round(100)}
            //   style={{ width: 120, height: 200, backgroundColor: "red"}}>
            //  <Text>{item.video}</Text>
            // </View>
            <Video
              resizeMode="cover"
              source={{uri:abc}}
              key={item._id}
              style={{ width: 120, height: 220,marginHorizontal:5,borderRadius:10 ,marginBottom:100}}
              useNativeControls
              onLoadStart={() => {
                console.log("Bắt đầu tải video");
              }}
              // onLoad={() => console.log("Video đã tải xong")}
              onBuffer={() => {
                console.log("Video đang được tải vào bộ nhớ đệm");
              }}
              onError={(error) => console.log("Lỗi khi tải video:", error)}
              onEnd={() => console.log("Video đã kết thúc")}
            />
          );
        })}
      </ScrollView>
      
      
    </ScrollView>
    <TouchableOpacity onPress={()=>navigation.navigate('Showtime',{data:data._id})}>
      <Animated.Image source={require('../img/sale.png')} style={[{position:'absolute',bottom:35,end:30,width:100,height:100},disAnimations]}/>
      <View style={{width:75,height:75,backgroundColor:'#94d0ee',position:'absolute',bottom:48,end:42,borderRadius:70,alignItems:'center',justifyContent:'center'}}>
        <Text style={{color:'white',fontSize:20,fontWeight:'bold'}}>Đặt Vé</Text>
      </View>
      </TouchableOpacity>
     
    </View>
  );
};

export default Movide;

const styles = StyleSheet.create({});
