// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Button, Alert, TextInput, ScrollView } from 'react-native';
// import { useNavigation } from '@react-navigation/native';

// interface Event {
//   title: string;
//   date: string;
//   price?: number;
// }

// interface CheckoutPageProps {
//   route?: {
//     params?: {
//       event?: Event;
//     };
//   };
// }

// const CheckoutPage: React.FC<CheckoutPageProps> = ({ route }) => {
//   const navigation = useNavigation();
//   const event = route?.params?.event;

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');

//   if (!event) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.title}>Invalid Event</Text>
//         <Text>No event details provided.</Text>
//         <View style={styles.buttonContainer}>
//           <Button title="Go Back" onPress={() => navigation.navigate('Home')} color="#4285F4" />
//         </View>
//       </View>
//     );
//   }

//   const handlePurchase = () => {
//     if (!name || !email) {
//       Alert.alert('Missing Information', 'Please enter your name and email to continue.');
//       return;
//     }
//     Alert.alert('Purchase Complete', `Thank you, ${name}! You have booked a ticket for ${event.title}`);
//     navigation.navigate('BookedEvents');
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Checkout</Text>

//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>Event</Text>
//         <Text style={styles.eventTitle}>{event.title}</Text>
//         <Text style={styles.eventDate}>{event.date}</Text>
//         {event.price !== undefined && <Text style={styles.eventPrice}>Price: ${event.price.toFixed(2)}</Text>}
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.cardTitle}>Your Information</Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Full Name"
//           value={name}
//           onChangeText={setName}
//           autoCapitalize="words"
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Email Address"
//           value={email}
//           onChangeText={setEmail}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//       </View>

//       <View style={styles.buttonContainer}>
//         <Button title="Confirm Purchase" onPress={handlePurchase} color="#4285F4" />
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flexGrow: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f5f5f5' },
//   title: { fontSize: 26, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
//   card: { backgroundColor: 'white', borderRadius: 8, padding: 16, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 3 },
//   cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
//   eventTitle: { fontSize: 20, fontWeight: '600', marginBottom: 6 },
//   eventDate: { fontSize: 16, color: '#666', marginBottom: 4 },
//   eventPrice: { fontSize: 16, color: '#222', fontWeight: 'bold' },
//   input: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 6, paddingHorizontal: 10, marginBottom: 16, backgroundColor: '#fafafa' },
//   buttonContainer: { marginTop: 10 },
// });

// export default CheckoutPage;
// // 