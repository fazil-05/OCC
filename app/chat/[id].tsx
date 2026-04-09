import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { dash } from '@/constants/occ-dashboard-theme';

const MOCK_MESSAGES = [
  { id: '1', text: 'Hey! You coming to the photo jam tomorrow?', sender: 'them', time: '10:00 AM' },
  { id: '2', text: 'Yeah for sure! What time are we meeting?', sender: 'me', time: '10:05 AM' },
  { id: '3', text: 'Around 5 PM at the main gate.', sender: 'them', time: '10:06 AM' },
];

export default function DirectChatScreen() {
  const { name, avatar } = useLocalSearchParams<{ name: string, avatar: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<any[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = (content: string, type: 'text' | 'image' = 'text') => {
    if (type === 'text' && !content.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      text: type === 'text' ? content : '',
      image: type === 'image' ? content : null,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      sendMessage(result.assets[0].uri, 'image');
    }
  };

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={[styles.container, { paddingTop: insets.top }]}>
          <Stack.Screen options={{ headerShown: false }} />
          
          {/* Authoritative Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color={dash.text} />
            </TouchableOpacity>
            <Image source={{ uri: avatar }} style={styles.headerAvatar} />
            <View style={styles.headerInfo}>
              <Text style={styles.headerName}>{name || 'Friend'}</Text>
              <Text style={styles.headerStatus}>Online</Text>
            </View>
            <TouchableOpacity style={styles.headerAction}>
              <Ionicons name="call-outline" size={22} color={dash.text} />
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View style={[
                styles.messageBubble, 
                item.sender === 'me' ? styles.bubbleMe : styles.bubbleThem,
                item.image && styles.bubbleImage
              ]}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.sentImage} />
                ) : (
                  <Text style={[
                    styles.messageText,
                    item.sender === 'me' ? styles.textMe : styles.textThem
                  ]}>{item.text}</Text>
                )}
                <Text style={[styles.messageTime, item.image && styles.timeImage]}>{item.time}</Text>
              </View>
            )}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          />

          <View style={[styles.inputRow, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <TouchableOpacity onPress={pickImage} style={styles.addBtn}>
              <Ionicons name="add" size={24} color={dash.textSoft} />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={dash.textSoft}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity 
              style={[styles.sendBtn, !inputText.trim() && { opacity: 0.5 }]} 
              onPress={() => sendMessage(inputText)}
              disabled={!inputText.trim()}
            >
              <Ionicons name="send" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: { padding: 4, marginRight: 8 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20 },
  headerInfo: { flex: 1, marginLeft: 12 },
  headerName: { fontFamily: 'MontBold', fontSize: 16, color: '#0F172A' },
  headerStatus: { fontFamily: 'InterSemi', fontSize: 12, color: '#22C55E' },
  headerAction: { padding: 8 },
  listContent: { padding: 16, paddingBottom: 32, gap: 12 },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 4,
  },
  bubbleMe: {
    alignSelf: 'flex-end',
    backgroundColor: dash.purple,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    borderBottomLeftRadius: 4,
  },
  bubbleImage: {
    padding: 4,
    borderRadius: 16,
  },
  sentImage: {
    width: 240,
    height: 180,
    borderRadius: 12,
  },
  messageText: { fontFamily: 'InterRegular', fontSize: 15 },
  textMe: { color: '#FFF' },
  textThem: { color: '#1E293B' },
  messageTime: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.3)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timeImage: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    color: '#FFF',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
    backgroundColor: '#FFF',
  },
  addBtn: { padding: 4 },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: 'InterRegular',
    fontSize: 15,
    maxHeight: 100,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: dash.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
