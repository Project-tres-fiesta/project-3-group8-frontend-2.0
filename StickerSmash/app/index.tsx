// app/index.tsx
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/(tabs)/LoginPage" />;
}
// import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
// import React from 'react';
// import { ThemedView } from '@/components/themed-view';
// import { ThemedText } from '@/components/themed-text';
// import { Ionicons } from '@expo/vector-icons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// export default function HomeScreen() {
//   const insets = useSafeAreaInsets();

//   const events = [
//     {
//       id: '1',
//       title: 'Coldplay World Tour',
//       subtitle: 'Madison Square Garden',
//       date: 'Dec 15, 2025',
//       image: 'https://via.placeholder.com/400x200/E31C5D/FFFFFF?text=Coldplay',
//       price: '$125',
//     },
//     {
//       id: '2',
//       title: 'Taylor Swift Eras Tour',
//       subtitle: 'MetLife Stadium',
//       date: 'Jan 10, 2026',
//       image: 'https://via.placeholder.com/400x200/E31C5D/FFFFFF?text=Taylor+Swift',
//       price: '$299',
//     },
//     {
//       id: '3',
//       title: 'NBA: Knicks vs Lakers',
//       subtitle: 'Madison Square Garden',
//       date: 'Tomorrow • 7:30 PM',
//       image: 'https://via.placeholder.com/400x200/E31C5D/FFFFFF?text=NBA',
//       price: '$89',
//     },
//   ];

//   const renderEventCard = ({ item }: { item: any }) => (
//     <TouchableOpacity style={styles.eventCard} activeOpacity={0.8}>
//       <ThemedView isCard style={styles.cardImageContainer}>
//         <ThemedView style={styles.imageOverlay} />
//         <ThemedText type="headline" style={styles.cardTitle}>
//           {item.title}
//         </ThemedText>
//         <ThemedText type="caption" style={styles.cardSubtitle}>
//           {item.subtitle}
//         </ThemedText>
//         <ThemedText type="caption" style={styles.cardDate}>
//           {item.date}
//         </ThemedText>
//       </ThemedView>
//       <View style={styles.cardContent}>
//         <ThemedText type="bodyLarge" style={styles.price}>
//           {item.price}
//         </ThemedText>
//         <ThemedText type="label" style={styles.viewSeats}>
//           VIEW SEATS
//         </ThemedText>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
//       <View style={styles.header}>
//         <ThemedText type="title" style={styles.headerTitle}>
//           Events Near You
//         </ThemedText>
//         <TouchableOpacity style={styles.filterButton}>
//           <Ionicons name="options-outline" size={24} color="#E31C5D" />
//         </TouchableOpacity>
//       </View>
      
//       <FlatList
//         data={events}
//         renderItem={renderEventCard}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.listContent}
//       />
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingVertical: 20,
//   },
//   headerTitle: {
//     fontWeight: '900',
//   },
//   filterButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#F8F9FA',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContent: {
//     padding: 24,
//     paddingBottom: 100,
//   },
//   eventCard: {
//     marginBottom: 20,
//   },
//   cardImageContainer: {
//     height: 200,
//     borderRadius: 16,
//     overflow: 'hidden',
//     position: 'relative',
//   },
//   imageOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//   },
//   cardTitle: {
//     position: 'absolute',
//     bottom: 60,
//     left: 20,
//     right: 20,
//     color: 'white',
//     fontWeight: '900',
//   },
//   cardSubtitle: {
//     position: 'absolute',
//     bottom: 36,
//     left: 20,
//     right: 20,
//     color: 'white',
//   },
//   cardDate: {
//     position: 'absolute',
//     bottom: 16,
//     left: 20,
//     right: 20,
//     color: 'white',
//   },
//   cardContent: {
//     padding: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   price: {
//     fontSize: 24,
//     fontWeight: '900',
//     color: '#E31C5D',
//   },
//   viewSeats: {
//     color: '#E31C5D',
//     fontWeight: '700',
//     textTransform: 'uppercase',
//     letterSpacing: 1,
//   },
// });


// import { Redirect } from 'expo-router';

// export default function RootIndex() {
//   return <Redirect href="/login" />;
// }


import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import GitHubTestLogin from '@/components/GitHubLogin';
import GoogleLoginWeb from '@/components/GoogleLoginWeb';
import { ThemedText } from '@/components/themed-text';

export default function LoginScreen() {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        {/* EventLink hero branding */}
        <View style={styles.logoContainer}>
          <ThemedText type="titleLarge" style={styles.logoText}>
            EventLink
          </ThemedText>
          <ThemedText
            type="caption"
            lightColor="#1E90FF"
            darkColor="#4DA3FF"
          >
            Discover amazing events near you
          </ThemedText>
        </View>

        <ThemedText type="headline" style={styles.subtitle}>
          Sign in to discover events
        </ThemedText>

        <View style={styles.buttonContainer}>
          <GoogleLoginWeb />
          <GitHubTestLogin />
        </View>

        <ThemedView style={styles.footer}>
          <ThemedText type="caption">
            By signing in, you agree to our Terms of Service
          </ThemedText>
        </ThemedView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: 80,
    gap: 32,
  },
  logoContainer: {
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: '900',
    backgroundColor: 'transparent',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  buttonContainer: {
    gap: 16,
    width: '100%',
    maxWidth: 320,
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
});
