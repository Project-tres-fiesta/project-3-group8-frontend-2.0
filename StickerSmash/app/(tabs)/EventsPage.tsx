// import React, { use, useEffect, useState } from 'react';
// import { View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { ThemedView } from '@/components/themed-view';
// import { ThemedText } from '@/components/themed-text';
// import { Ionicons } from '@expo/vector-icons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { router } from 'expo-router';
// import { Button } from '@react-navigation/elements';

// // interface Event {
// //   id: string;
// //   name: string;
// //   dates: {
// //     start: {
// //       localDate: string;
// //       localTime?: string;
// //     };
// //   };
// //   images?: Array<{
// //     url: string;
// //     ratio?: string;
// //   }>;
// //   _embedded?: {
// //     venues?: Array<{
// //       name: string;
// //       city?: { name: string };
// //       state?: { name: string };
// //       country?: { name: string };
// //     }>;
// //   };
// // }

// export interface Event {
//   id: string;
//   name: string;

//   // Date & Time
//   localDate: string;      // "2025-12-10"
//   localTime: string;      // "18:30:00"
//   dateTime: string;       // "2025-12-11T00:30:00Z"

//   // Venue Info
//   venueName: string;      // "Paycom Center"
//   venueCity: string;      // "Oklahoma City"
//   venueState: string;     // "OK"
//   venueCountry: string;   // "US"

//   // Pricing
//   minPrice: number | null;
//   maxPrice: number | null;
//   currency: string | null;

//   // Classification
//   category: string;       // "Sports"
//   genre: string;          // "Basketball"
//   source: string;         // "ticketmaster"

//   // Media
//   imageUrl: string;

//   // URLs
//   url: string;
// }


// interface EventsPageProps {}

// const API_KEY = 'BZWNLgbulJGpWGUNixb7Vh991xWPOzgs';

// const EventsPage: React.FC<EventsPageProps> = () => {
//   const insets = useSafeAreaInsets();
//   const [events, setEvents] = useState<Event[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const token = localStorage.getItem("jwt");

// const getUserId = async (token: string): Promise<number | null> => {
//   try {
//     const res = await fetch("http://localhost:8080/api/users/profile", {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (!res.ok) throw new Error(`Backend error: ${res.status}`);

//     const data = await res.json();
//     console.log("User profile:", data);
//     console.log("Fetched user ID:", data.userId);
//     return data.userId; // assuming backend returns { id: number, ... }
//   } catch (err) {
//     console.error("Error fetching profile for user ID:", err);
//     return null;
//   }
// };


//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         const res = await fetch("http://localhost:8080/api/events/popular")/*, {
//           headers: { Authorization: `Bearer ${token}` },
//         });*/
//         const data = await res.json();
//         console.log("Stored events data:", data);
//         setEvents(data.events || []);
//         console.log("Events set to state:", data.events || []);
//       } catch (err) {
//         console.error("Error fetching stored events:", err);
//       }finally {
//         setLoading(false);
//       }
//     //   try {
//     //     const todayISO = new Date().toISOString().split('.')[0] + 'Z';
//     //     const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${API_KEY}&size=20&sort=date,asc&startDateTime=${todayISO}&countryCode=US`;

//     //     const response = await fetch(url);
//     //     const data = await response.json();
//     //     console.log('Ticketmaster API data:', data);

//     //     if (response.ok && data._embedded && data._embedded.events && data._embedded.events.length > 0) {
//     //       setEvents(data._embedded.events);
//     //     } else if (data.errors) {
//     //       setError(data.errors.map((e: any) => e.detail).join('\n'));
//     //     } else {
//     //       setError('No upcoming events found.');
//     //     }
//     //   } catch (err: any) {
//     //     setError(err.message || 'Failed to load events');
//     //   } finally {
//     //     setLoading(false);
//     //   }
//     // 
//     };

    

//     fetchEvents();
//   }, []);

//   // const addEvent = async (event: Event) => {
//   //   try {
//   //     const res = await fetch("http://localhost:8080/api/events/stored", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify(event),
//   //     });

//   //     if (!res.ok) throw new Error(`Backend error: ${res.status}`);
//   //     const data = await res.json();
//   //     console.log("Event added response:", data);
//   //     return data;
//   //   } catch (err) {
//   //     console.error("Error adding event to backend:", err);
//   //   }
//   // };

// const addEvent = async (event: Event, token: string, userId: number) => {
//   try {
//     // 1️⃣ Store the event first
//     const eventRes = await fetch("http://localhost:8080/api/events/stored", {
//       method: "POST",
//       headers: { 
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       },
//       body: JSON.stringify(event),
//     });

//     if (!eventRes.ok) throw new Error(`Backend error adding event: ${eventRes.status}`);

//     const storedEvent = await eventRes.json();
//     console.log("Stored event ID:", storedEvent);

//     // 2️⃣ Now create the user-event relationship
//     const userEventRes = await fetch("http://localhost:8080/api/user-events", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         userId: userId,
//         eventId: storedEvent.event.id, // ✅ use the nested event ID
//         isAttending: true,
//         wantsToGo: true,
//       }),
//     });

//     if (!userEventRes.ok) throw new Error(`Failed to add user event: ${userEventRes.status}`);

//     const userEventData = await userEventRes.json();
//     console.log("Created user event ID:", userEventData.id);

//     return { storedEvent, userEventId: userEventData.id };

//   } catch (err) {
//     console.error("Error adding event:", err);
//   }
// };

//   const [event, setEvent] = useState([]);

// const addGroupEvent = async (event: Event, token: string, groupId: number) => {
//   try {
//     // 1️⃣ Store the event first
//     const eventRes = await fetch("http://localhost:8080/api/events/stored", {
//       method: "POST",
//       headers: { 
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`
//       },
//       body: JSON.stringify(event),
//     });

//     if (!eventRes.ok) throw new Error(`Backend error adding event: ${eventRes.status}`);

//     const storedEvent = await eventRes.json();
//     console.log("Stored event ID:", storedEvent);
//     setEvent(storedEvent);
//     console.log("Event state updated:", event);
//     console.log("Stored Event id:", storedEvent.event.id);

//     // 2️⃣ Now create the user-event relationship
//     const userEventRes = await fetch("http://localhost:8080/api/groupEvents/add", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`,
//       },
//       body: JSON.stringify({ id: {
//             groupId: groupId,   // the group the user wants to join
//             eventId: storedEvent.event.id  // the logged-in user's ID
//         } })
//     });

//     if (!userEventRes.ok) throw new Error(`Failed to add user event: ${userEventRes.status}`);

//     const userEventData = await userEventRes.json();
//     console.log("Created user event ID:", userEventData.id);

//     return { storedEvent, userEventId: userEventData.id };

//   } catch (err) {
//     console.error("Error adding event:", err);
//   }
// };



//   // const addUserEvent = async (eventId: string, token: string) => {
//   //   try {
//   //     const res = await fetch("http://localhost:8080/api/user-events", {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //         "Authorization": `Bearer ${token}`, // ✅ correct syntax
//   //       },
//   //       body: JSON.stringify({
//   //         userId: 1,         // replace with your logged-in user's ID
//   //         eventId: Number(eventId),
//   //         isAttending: true, // or false depending on your app
//   //         wantsToGo: true,   // or false depending on your app
//   //       }),
//   //     });

//   //     if (!res.ok) {
//   //       throw new Error(`HTTP error! status: ${res.status}`);
//   //     }

//   //     const data = await res.json();
//   //     console.log("User event added:", data);
//   //     return data;
//   //   } catch (err) {
//   //     console.error("Error adding user event:", err);
//   //   }
//   // };

      

  

//   const handleEventPress = (event: Event) => {
//     router.push({
//       pathname: '/event-details',
//       params: { event: JSON.stringify(event) },
//     });
//   };

// const renderItem = ({ item }: { item: Event }) => (
//   <TouchableOpacity
//     style={styles.eventCard}
//     activeOpacity={0.8}
//     onPress={() => handleEventPress(item)}
//   >
//     <ThemedView isCard style={styles.cardImageContainer}>
//       <ThemedView style={styles.imageOverlay} />
//       {item.images && item.images[0] ? (
//         <ThemedView style={[styles.eventImage]} />
//       ) : (
//         <ThemedView style={styles.placeholderImage} />
//       )}
//       <ThemedText type="headline" style={styles.cardTitle} numberOfLines={2}>
//         {item.name}
//       </ThemedText>
//       <ThemedText type="caption" style={styles.cardSubtitle} numberOfLines={1}>
//         {item.venueName || 'Venue TBD'}
//       </ThemedText>
//       <ThemedText type="caption" style={styles.cardDate}>
//         {item.localDate} {item.localTime}
//       </ThemedText>
//     </ThemedView>

//     <View style={styles.cardContent}>
//       <ThemedText type="bodyLarge" style={styles.viewSeats}>
//         VIEW SEATS
//       </ThemedText>

//       <View style={{ flexDirection: "row" }}>
//         {/* Add Event Button */}
//         <TouchableOpacity
//           style={styles.addButton}
//           onPress={async () => {
//             if (!token) return console.error("No JWT token found");

//             const userId = await getUserId(token);
//             if (!userId) return console.error("Could not fetch user ID");

//             await addEvent(
//               {
//                 title: item.name,
//                 description: item.name + " event",
//                 eventDate: item.localDate,
//                 eventTime: item.localTime ?? "00:00:00",
//                 eventUrl: item.url,
//                 externalEventId: item.id,
//                 externalSource: "ticketmaster",
//                 category: item.category,
//                 genre: item.genre,
//                 imageUrl: item.imageUrl,
//                 minPrice: item.minPrice ?? null,
//                 maxPrice: item.maxPrice ?? null,
//                 currency: item.currency ?? "USD",
//                 venueName: item.venueName,
//                 venueCity: item.venueCity,
//                 venueState: item.venueState,
//                 venueCountry: item.venueCountry,
//               },
//               token,
//               userId
//             );
//           }}
//         >
//           <ThemedText type="body" style={styles.addButtonText}>
//             Add Event
//           </ThemedText>
//         </TouchableOpacity>

//         {/* Add to Group Button */}
//         <TouchableOpacity
//           style={[styles.addButton, { marginLeft: 10, backgroundColor: "#32CD32" }]} // green for group
//           onPress={async () => {
//             if (!token) return console.error("No JWT token found");

//             const groupId = 4; // replace with actual group ID
//             await addGroupEvent(
//               {
//                 title: item.name,
//                 description: item.name + " event",
//                 eventDate: item.localDate,
//                 eventTime: item.localTime ?? "00:00:00",
//                 eventUrl: item.url,
//                 externalEventId: item.id,
//                 externalSource: "ticketmaster",
//                 category: item.category,
//                 genre: item.genre,
//                 imageUrl: item.imageUrl,
//                 minPrice: item.minPrice ?? null,
//                 maxPrice: item.maxPrice ?? null,
//                 currency: item.currency ?? "USD",
//                 venueName: item.venueName,
//                 venueCity: item.venueCity,
//                 venueState: item.venueState,
//                 venueCountry: item.venueCountry,
//               },
//               token,
//               groupId
//             );
//           }}
//         >
//           <ThemedText type="body" style={styles.addButtonText}>
//             Add to Group
//           </ThemedText>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </TouchableOpacity>
// );


//   return (
//     <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
//       <View style={styles.header}>
//         <ThemedText type="title" style={styles.headerTitle}>
//           Upcoming Events
//         </ThemedText>
//         <TouchableOpacity style={styles.filterButton}>
//           <Ionicons name="options-outline" size={24} color="#1E90FF" />
//         </TouchableOpacity>
//       </View>

//       {loading && (
//         <ThemedView style={styles.loadingContainer}>
//           <ActivityIndicator size="large" color="#1E90FF" />
//           <ThemedText type="body" style={styles.loadingText}>
//             Loading events...
//           </ThemedText>
//         </ThemedView>
//       )}

//       {error && (
//         <ThemedView style={styles.errorContainer}>
//           <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
//           <ThemedText type="headline" style={styles.errorTitle}>
//             Oops!
//           </ThemedText>
//           <ThemedText type="body" style={styles.errorText}>
//             {error}
//           </ThemedText>
//         </ThemedView>
//       )}

//       <FlatList
//         data={events}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={
//           <ThemedView style={styles.emptyState}>
//             <Ionicons name="ticket-outline" size={64} color="#1E90FF" />
//             <ThemedText type="headline" style={styles.emptyTitle}>
//               No events found
//             </ThemedText>
//             <ThemedText type="body" style={styles.emptySubtitle}>
//               Check back soon for upcoming events
//             </ThemedText>
//           </ThemedView>
//         }
//       />
//     </ThemedView>
//   );
// };

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
//     flexGrow: 1,
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
//   eventImage: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: '#1E90FF',
//   },
//   placeholderImage: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: '#1E90FF',
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
//   padding: 20,
//   flexDirection: "row",
//   justifyContent: "space-between", // <—— space items apart
//   alignItems: "center",
// },
//   viewSeats: {
//     color: '#1E90FF',
//     fontWeight: '700',
//     textTransform: 'uppercase',
//     letterSpacing: 1,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 16,
//   },
//   loadingText: {
//     opacity: 0.8,
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 16,
//     padding: 32,
//   },
//   errorTitle: {
//     textAlign: 'center',
//   },
//   errorText: {
//     textAlign: 'center',
//     opacity: 0.8,
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 16,
//     padding: 48,
//   },
//   emptyTitle: {
//     textAlign: 'center',
//   },
//   emptySubtitle: {
//     textAlign: 'center',
//     opacity: 0.7,
//   },
//   addButton: {
//   backgroundColor: "#1E90FF",
//   paddingVertical: 10,
//   paddingHorizontal: 18,
//   borderRadius: 12,
//   shadowColor: "#1E90FF",
//   shadowOffset: { width: 0, height: 4 },
//   shadowOpacity: 0.25,
//   shadowRadius: 6,
//   elevation: 4,
// },
// addButtonText: {
//   color: "white",
//   fontWeight: "700",
//   letterSpacing: 0.5,
// },

// });

// export default EventsPage;

import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export interface Event {
  id: string;
  name: string;
  localDate: string;
  localTime: string;
  dateTime: string;
  venueName: string;
  venueCity: string;
  venueState: string;
  venueCountry: string;
  minPrice: number | null;
  maxPrice: number | null;
  currency: string | null;
  category: string;
  genre: string;
  source: string;
  imageUrl: string;
  url: string;
}

/**
 * NOTE: backend returns groups in shape:
 * [
 *   { groupId: 1, groupName: "Test Group", userId: 10 },
 *   ...
 * ]
 *
 * So Group type matches that shape.
 */
interface Group {
  groupId: number;
  groupName: string;
  userId: number;
}

const API_KEY = 'BZWNLgbulJGpWGUNixb7Vh991xWPOzgs';

const EventsPage: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // groups and modal state
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGroupModalVisible, setGroupModalVisible] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const token = localStorage.getItem('jwt');

  const getUserId = async (token: string): Promise<number | null> => {
    try {
      const res = await fetch('http://localhost:8080/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Backend error: ${res.status}`);
      const data = await res.json();
      console.log('User profile:', data);
      return data.userId ?? null;
    } catch (err) {
      console.error('Error fetching profile for user ID:', err);
      return null;
    }
  };

  const fetchUserGroups = async (token: string) => {
    try {
      const res = await fetch('http://localhost:8080/api/groups', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch user groups: ${res.status}`);
      const data = await res.json();
      console.log('Fetched groups:', data);
      setGroups(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setGroups([]);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/events/popular');
        if (!res.ok) {
          console.warn('events/popular returned', res.status);
        }
        const data = await res.json();
        console.log('Stored events data:', data);
        setEvents(data.events || []);
      } catch (err) {
        console.error('Error fetching stored events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();

    // load groups if token exists
    if (token) {
      fetchUserGroups(token);
    }
  }, [token]);

  const addEvent = async (eventData: any, token: string, userId: number) => {
    try {
      const eventRes = await fetch('http://localhost:8080/api/events/stored', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!eventRes.ok) throw new Error(`Backend error adding event: ${eventRes.status}`);

      const storedEvent = await eventRes.json();
      console.log('Stored event:', storedEvent);

      const userEventRes = await fetch('http://localhost:8080/api/user-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          eventId: storedEvent.event.id,
          isAttending: true,
          wantsToGo: true,
        }),
      });

      if (!userEventRes.ok) throw new Error(`Failed to add user event: ${userEventRes.status}`);
      const userEventData = await userEventRes.json();
      console.log('Created user event ID:', userEventData.id);
      return { storedEvent, userEventId: userEventData.id };
    } catch (err) {
      console.error('Error adding event:', err);
      throw err;
    }
  };

  /**
   * addGroupEvent:
   *  - stores event
   *  - posts to /api/groupEvents/add with body { id: { groupId, eventId } }
   */
  const addGroupEvent = async (eventData: any, token: string, groupId: number) => {
    try {
      // 1) store event
      const eventRes = await fetch('http://localhost:8080/api/events/stored', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!eventRes.ok) {
        const text = await eventRes.text().catch(() => null);
        console.error('event store failed body:', eventData);
        throw new Error(`Backend error adding event: ${eventRes.status} ${text ?? ''}`);
      }

      const storedEvent = await eventRes.json();
      console.log('Stored event (group flow):', storedEvent);

      // 2) add group-event relationship using the exact body shape your backend expects
      const body = {
        id: {
          groupId: groupId,
          eventId: storedEvent.event.id,
        },
      };

      console.log('Sending groupEvents/add body:', body);

      const groupEventRes = await fetch('http://localhost:8080/api/groupEvents/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!groupEventRes.ok) {
        const text = await groupEventRes.text().catch(() => null);
        console.error('groupEvents/add response text:', text);
        throw new Error(`Failed to add group event: ${groupEventRes.status} ${text ?? ''}`);
      }

      const groupEventData = await groupEventRes.json();
      console.log('Created group event:', groupEventData);
      return groupEventData;
    } catch (err) {
      console.error('Error addGroupEvent:', err);
      throw err;
    }
  };

  // handle opening modal — set selectedEvent and show modal
  const openGroupModalForEvent = (ev: Event) => {
    setSelectedEvent(ev);
    setSelectedGroup(null);
    setGroupModalVisible(true);
  };

  // When a group is chosen in the modal: call addGroupEvent and close modal
  const handleSelectGroupAndAdd = async (group: Group) => {
    console.log('Selected group:', group);
    setSelectedGroup(group);

    if (!selectedEvent) {
      console.error('No selected event when selecting group');
      return;
    }
    if (!token) {
      console.error('No JWT token found');
      return;
    }

    try {
      const userId = await getUserId(token);
      // userId may not be necessary for groupEvents/add but fetching to satisfy other flows
      console.log('UserId (for logs):', userId);

      // prepare body the same way you used previously
      const eventPayload = {
        title: selectedEvent.name,
        description: selectedEvent.name + ' event',
        eventDate: selectedEvent.localDate,
        eventTime: selectedEvent.localTime ?? '00:00:00',
        eventUrl: selectedEvent.url,
        externalEventId: selectedEvent.id,
        externalSource: 'ticketmaster',
        category: selectedEvent.category,
        genre: selectedEvent.genre,
        imageUrl: selectedEvent.imageUrl,
        minPrice: selectedEvent.minPrice ?? null,
        maxPrice: selectedEvent.maxPrice ?? null,
        currency: selectedEvent.currency ?? 'USD',
        venueName: selectedEvent.venueName,
        venueCity: selectedEvent.venueCity,
        venueState: selectedEvent.venueState,
        venueCountry: selectedEvent.venueCountry,
      };

      // call API
      const result = await addGroupEvent(eventPayload, token, group.groupId);
      console.log('addGroupEvent result:', result);

      // optionally show success log / UI feedback
    } catch (err) {
      console.error('Failed to add event to group:', err);
    } finally {
      setGroupModalVisible(false);
      setSelectedEvent(null);
    }
  };

  const renderItem = ({ item }: { item: Event }) => (
    <TouchableOpacity style={styles.eventCard} activeOpacity={0.8} onPress={() => handleEventPress(item)}>
      <ThemedView isCard style={styles.cardImageContainer}>
        <ThemedView style={styles.imageOverlay} />
        <ThemedText type="headline" style={styles.cardTitle} numberOfLines={2}>
          {item.name}
        </ThemedText>
        <ThemedText
          type="caption"
          style={styles.cardSubtitle}
          numberOfLines={1}
        >
          {item.venueName || "Venue TBD"}
        </ThemedText>
        <ThemedText type="caption" style={styles.cardDate}>
          {item.localDate} {item.localTime}
        </ThemedText>
      </ThemedView>

      <View style={styles.cardContent}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={async () => {
            if (!token) return console.error('No JWT token found');
            const userId = await getUserId(token);
            if (!userId) return console.error('Could not fetch user ID');

            await addEvent(
              {
                title: item.name,
                description: item.name + ' event',
                eventDate: item.localDate,
                eventTime: item.localTime ?? '00:00:00',
                eventUrl: item.url,
                externalEventId: item.id,
                externalSource: 'ticketmaster',
                category: item.category,
                genre: item.genre,
                imageUrl: item.imageUrl,
                minPrice: item.minPrice ?? null,
                maxPrice: item.maxPrice ?? null,
                currency: item.currency ?? 'USD',
                venueName: item.venueName,
                venueCity: item.venueCity,
                venueState: item.venueState,
                venueCountry: item.venueCountry,
              },
              token,
              userId
            );
          }}
        >
          <ThemedText type="body" style={styles.addButtonText}>
            Add Event
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.addButton, { marginLeft: 10, backgroundColor: '#32CD32' }]}
          onPress={() => openGroupModalForEvent(item)}
        >
          <ThemedText type="body" style={styles.addButtonText}>
            Add to Group
          </ThemedText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  function handleEventPress(event: Event) {
    router.push({
      pathname: '/event-details',
      params: { event: JSON.stringify(event) },
    });
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          Upcoming Events
        </ThemedText>

        {/* show selected group info (if any) for debugging / visibility */}
        {selectedGroup ? (
          <View style={styles.selectedGroupInfo}>
            <ThemedText type="caption" style={{ fontWeight: '700' }}>
              Selected: {selectedGroup.groupName}
            </ThemedText>
          </View>
        ) : null}

        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={24} color="#1E90FF" />
        </TouchableOpacity>
      </View>

      {loading && (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <ThemedText type="body" style={styles.loadingText}>
            Loading events...
          </ThemedText>
        </ThemedView>
      )}

      {error && !loading && (
        <ThemedView style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
          <ThemedText type="headline" style={styles.errorTitle}>
            Oops!
          </ThemedText>
          <ThemedText type="body" style={styles.errorText}>
            {error}
          </ThemedText>
        </ThemedView>
      )}

      <FlatList data={events} renderItem={renderItem} keyExtractor={(item) => item.id} showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent} />

      {/* Group Selection Modal (simple list modal — tap group to add) */}
      <Modal transparent visible={isGroupModalVisible} animationType="fade" onRequestClose={() => setGroupModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
             <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12, color: "black" }}>
        Select a Group
      </Text>

            <ScrollView style={{ maxHeight: 300 }}>
              {groups.length === 0 ? (
                <ThemedText type="body">No groups found.</ThemedText>
              ) : (
                groups.map((g) => {
                  const isSelected = selectedGroup && selectedGroup.groupId === g.groupId;
                  return (
                    <TouchableOpacity
                      key={g.groupId}
                      style={[
                        styles.groupOption,
                        isSelected ? { backgroundColor: '#eef9ee' } : undefined,
                      ]}
                      onPress={() => {
                        console.log('Selected group (pressed):', g);
                        // immediate action: add and close modal
                        handleSelectGroupAndAdd(g);
                      }}
                      
                    >

                      <ThemedText style={{ color: "black" }}>{g.groupName}</ThemedText>
                      <ThemedText style={{ color: "black" }} type="caption">ID: {g.groupId}</ThemedText>
                    </TouchableOpacity>
                  );
                })
              )}
            </ScrollView>

            <TouchableOpacity onPress={() => setGroupModalVisible(false)} style={{ marginTop: 12 }}>
              <ThemedText style={{ color: 'red' }}>Cancel</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20 },
  headerTitle: { fontWeight: '900' },
  selectedGroupInfo: { position: 'absolute', left: '35%', top: 22 },
  filterButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F8F9FA', justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 24, paddingBottom: 100, flexGrow: 1 },
  eventCard: { marginBottom: 20 },
  cardImageContainer: { height: 200, borderRadius: 16, overflow: 'hidden', position: 'relative' },
  imageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)' },
  cardTitle: { position: 'absolute', bottom: 60, left: 20, right: 20, color: 'white', fontWeight: '900' },
  cardSubtitle: { position: 'absolute', bottom: 36, left: 20, right: 20, color: 'white' },
  cardDate: { position: 'absolute', bottom: 16, left: 20, right: 20, color: 'white' },
  cardContent: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addButton: { backgroundColor: '#1E90FF', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12, shadowColor: '#1E90FF', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 4 },
  addButtonText: { color: 'white', fontWeight: '700', letterSpacing: 0.5 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  loadingText: { opacity: 0.8 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16, padding: 32 },
  errorTitle: { textAlign: 'center' },
  errorText: { textAlign: 'center', opacity: 0.8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', padding: 18, borderRadius: 12, width: '85%', maxHeight: '80%' },
  groupOption: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#ddd', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalText: {
  color: "black",
},
});

export default EventsPage;
