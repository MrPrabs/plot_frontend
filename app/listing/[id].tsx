import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import MapView from 'react-native-maps'; // You'll need to install 'react-native-maps'
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import axios from 'axios';

type photo = string;
type UserType = string;
type ReservationStatus = string;
type SpotAvailability = string;
type SubleaseAgreement = string;
type Message = string;


interface User {
  user_id: number;
  username: string;
  email: string;
  password_hash: string;
  profile_picture?: string | null;
  user_type: UserType; // Assuming UserType is an enum or defined elsewhere
  ownedLots: ParkingLot[]; // Array of ParkingLot objects
  reservations: Reservation[]; // Array of Reservation objects
  sentMessages: Message[]; // Array of Message objects where the user is the sender
  receivedMessages: Message[]; // Array of Message objects where the user is the receiver
  originalLeases: SubleaseAgreement[]; // Array of SubleaseAgreement objects where the user is the original leaser
  subLeases: SubleaseAgreement[]; // Array of SubleaseAgreement objects where the user is the sub leaser
  reviews: Review[]; // Array of Review objects associated with the user
}

interface Reservation {
  reservation_id: number;
  spot_id: number;
  user_id: number;
  start_time: Date;
  end_time: Date;
  status: ReservationStatus; // Assuming ReservationStatus is an enum or defined elsewhere
  parkingSpot: ParkingSpot; // Referencing ParkingSpot object
  user: User; // Referencing User object
  availability_id?: number | null;
  spotAvailability?: SpotAvailability | null; // Referencing SpotAvailability object
}


interface ParkingSpot {
  lot_id: number;
  name: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  total_spots: number;
  spot_numbering: boolean;
  owner_id: number;
  price: GLfloat;
}

interface Review {
  review_id: number;
  lot_id: number;
  user_id: number;
  rating: number;
  comment?: string | null;
  created_at: Date;
  parkingLot: ParkingLot;
  user: User;
}

interface ParkingLot {
  lot_id: number;
  name: string;
  address: string;
  description?: string; // The question mark denotes that this field is optional
  latitude: number;
  longitude: number;
  total_spots: number;
  spot_numbering: boolean;
  owner_id: number;
  owner: string; // Assuming you want to include the related user data
  parkingSpots: ParkingSpot[]; // Assuming you want to include the related parking spots data
  reviews?: Review[]; // Assuming you want to include the related reviews data
  photos?: photo[]; // Assuming you want to include the related photos data
}




const DetailsPage = () => {
  
  const navigation = useNavigation();
  const { width } = Dimensions.get('window');

  const { id } = useLocalSearchParams();
  const [Lot, setLot] = useState<ParkingLot>();

  const [lowestPriceSpot, setLowestPriceSpot] = useState<ParkingSpot | null>(null);
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  useEffect(() => {
    // Replace this with the correct API call to fetch details based on the ID
    axios.get(`http://192.168.1.80:3000/parkingLots/${id}`)
      .then((response) => setLot(response.data))
      .catch((error) => console.error('Failed to fetch Lot', error));
      setSpots(Lot?.parkingLot?.parkingSpots ?? []);
  }, [id]);
  
  
  useEffect(() => {
    console.log('LOTTTttttttt', Lot);
  });





    

  useEffect(() => {
    console.log('spots', spots);
    setLowestPriceSpot(findLowestPriceSpot());
  } , [spots]);

  // Find the spot with the lowest price
  const findLowestPriceSpot = () => {
    if (spots.length === 0) {
      return null;
    }

    let lowestPrice = spots[0].price;
    let lowestPriceSpot = spots[0];

    for (let i = 1; i < spots.length; i++) {
      if (spots[i].price < lowestPrice) {
        lowestPrice = spots[i].price;
        lowestPriceSpot = spots[i];
      }
    }

    return lowestPriceSpot;
  };

  const handleReserve = () => {
    // Implement reservation logic or navigation to reservation screen
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageGallery}>
        {/* Implement image gallery swiping logic */}
        {Lot?.photos?.map((photo: string, index: number) => (
          <Image key={index} source={{ uri: photo }} style={styles.image} />
        ))}
      </View>

      <Text style={styles.address}>{Lot?.address}</Text>
      <Text style={styles.rating}>{Lot?.reviews?.[0]?.rating} ★</Text>
      <Text style={styles.management}>{Lot?.owner}</Text>

      {/* Map Preview */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: Lot?.latitude ?? 0,
          longitude: Lot?.longitude ?? 0,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
      >
        {/* Marker */}
        {/* <MapView.Marker
          coordinate={{
            latitude: Lot?.latitude,
            longitude: Lot?.longitude,
          }}
        /> */}
      </MapView>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>${findLowestPriceSpot()?.price}/day</Text>
        <Text style={styles.dateRange}>{"March 18"} - {"March 31"}</Text>
      </View>

      <TouchableOpacity style={styles.reserveButton} onPress={handleReserve}>
        <Text style={styles.reserveButtonText}>Reserve</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};
export default DetailsPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageGallery: {
    height: 1, // Set the height of the image gallery
  },
  image: {
    width: 400,
    height: 1,
    resizeMode: 'cover',
  },
  address: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
  },
  rating: {
    fontSize: 20,
    margin: 10,
  },
  management: {
    fontSize: 16,
    margin: 10,
  },
  map: {
    width: 400,
    height: 200,
    marginVertical: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dateRange: {
    fontSize: 18,
  },
  reserveButton: {
    backgroundColor: '#007A22',
    margin: 10,
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
