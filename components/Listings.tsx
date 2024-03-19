
// import { View, Text, StyleSheet, ListRenderItem, TouchableOpacity } from 'react-native';
// import { defaultStyles } from '@/constants/Styles';
// import { Ionicons } from '@expo/vector-icons';
// import { Link } from 'expo-router';
// import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
// import { useEffect, useRef, useState } from 'react';
// import { BottomSheetFlatList, BottomSheetFlatListMethods } from '@gorhom/bottom-sheet';

// interface Props {
//   listings: any[];
//   refresh: number;
//   category: string;
// }

// const Listings = ({ listings: items, refresh, category }: Props) => {
//   const listRef = useRef<BottomSheetFlatListMethods>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   // Update the view to scroll the list back top
//   useEffect(() => {
//     if (refresh) {
//       scrollListTop();
//     }
//   }, [refresh]);

//   const scrollListTop = () => {
//     listRef.current?.scrollToOffset({ offset: 0, animated: true });
//   };

//   // Use for "updating" the views data after category changed
//   useEffect(() => {
//     setLoading(true);

//     setTimeout(() => {
//       setLoading(false);
//     }, 200);
//   }, [category]);

//   // Render one listing row for the FlatList
//   const renderRow: ListRenderItem<any> = ({ item }) => (
//     <Link href={`/listing/${item.id}`} asChild>
//       <TouchableOpacity>
//         <Animated.View style={styles.listing} entering={FadeInRight} exiting={FadeOutLeft}>
//           <Animated.Image source={{ uri: item.medium_url }} style={styles.image} />
//           <TouchableOpacity style={{ position: 'absolute', right: 30, top: 30 }}>
//             <Ionicons name="heart-outline" size={24} color="#000" />
//           </TouchableOpacity>
//           <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//             <Text style={{ fontSize: 16, fontFamily: 'mon-sb' }}>{item.name}</Text>
//             <View style={{ flexDirection: 'row', gap: 4 }}>
//               <Ionicons name="star" size={16} />
//               <Text style={{ fontFamily: 'mon-sb' }}>{item.review_scores_rating / 20}</Text>
//             </View>
//           </View>
//           <Text style={{ fontFamily: 'mon' }}>{item.room_type}</Text>
//           <View style={{ flexDirection: 'row', gap: 4 }}>
//             <Text style={{ fontFamily: 'mon-sb' }}>€ {item.price}</Text>
//             <Text style={{ fontFamily: 'mon' }}>night</Text>
//           </View>
//         </Animated.View>
//       </TouchableOpacity>
//     </Link>
//   );

//   return (
//     <View style={defaultStyles.container}>
//       <BottomSheetFlatList
//         renderItem={renderRow}
//         data={loading ? [] : items}
//         ref={listRef}
//         ListHeaderComponent={<Text style={styles.info}>{items.length} homes</Text>}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   listing: {
//     padding: 16,
//     gap: 10,
//     marginVertical: 16,
//   },
//   image: {
//     width: '100%',
//     height: 300,
//     borderRadius: 10,
//   },
//   info: {
//     textAlign: 'center',
//     fontFamily: 'mon-sb',
//     fontSize: 16,
//     marginTop: 4,
//   },
// });

// export default Listings;

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { defaultStyles } from '@/constants/Styles';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import Animated from 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { BottomSheetFlatList, BottomSheetFlatListMethods } from '@gorhom/bottom-sheet';
import axios from 'axios';
import { ListRenderItem } from 'react-native';


interface ParkingLot {
  lot_id: number;
  name: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  total_spots: number;
  spot_numbering: boolean;
  owner_id: number;
}

const Listings = ({ refresh, category }: { refresh: number; category: string }) => {
  const [parkingLots, setParkingLots] = useState<ParkingLot []>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Example time frame
  const startTime = new Date(); // adjust these based on your application's needs
  const endTime = new Date();
  endTime.setHours(endTime.getHours() + 12);

  const address = "511 W Dayton, Madison, WI";

  // useEffect(() => {
  //   fetchAvailableParkingSpots(startTime, endTime);
  // }, [refresh, category, startTime, endTime]);

  const fetchAvailableParkingLots = async (startTime: Date, endTime: Date) => {
    setLoading(true);
    try {
      const response = await axios.post('http://192.168.1.80:3000/availability/available-spots/', {
        address: address,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        // Include any other criteria as needed
      });
      setParkingLots(response.data); // Assuming the response data is the array of available parking spots
    } catch (error) {
      console.error("Failed to fetch available parking spots:", error);
      // Handle error appropriately
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllParkingLots();
  }, []);

  const fetchAllParkingLots = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://192.168.1.80:3000/parkingLots/');
      const { parkingLots } = response.data;
      
      setParkingLots(parkingLots); // Assuming the response data is the array of available parking Lots

    } catch (error) {
      console.error("Failed to fetch available parking spots:", error);
      // Handle error appropriately
    }
    setLoading(false);
  };

  //http://localhost:3000/parkingSpots/

  const renderRow: ListRenderItem<ParkingLot> = ({ item }) => (
    <Link href={`/listing/${item.lot_id}`} asChild>
      <TouchableOpacity>
        <Animated.View style={styles.listing}>
   
          {/* Adjust this part as necessary to display parking spot details */}
          <Text style={{ fontSize: 16, fontFamily: 'mon-sb' }}>{item.name}</Text>
          <Text style={{ fontFamily: 'mon' }}>{item.address}</Text>
          <Text style={{ fontFamily: 'mon-sb' }}>{item.description}</Text>
          {/* Include more details as necessary */}
        </Animated.View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={defaultStyles.container}>
      <BottomSheetFlatList
        renderItem={renderRow}
        data={loading ? [] : parkingLots}
        ListHeaderComponent={<Text style={styles.info}>{parkingLots.length} available parking spots</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    listing: {
      padding: 16,
      gap: 10,
      marginVertical: 1,
    },
    image: {
      width: '100%',
      height: 300,
      borderRadius: 10,
    },
    info: {
      textAlign: 'center',
      fontFamily: 'mon-sb',
      fontSize: 16,
      marginTop: 4,
    },
  });

export default Listings;

// Styles remain unchanged
