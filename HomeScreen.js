import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Fashion', icon: 'shirt-outline', color: '#FF6B6B' },
  { id: '2', name: 'Electronics', icon: 'laptop-outline', color: '#4D96FF' },
  { id: '3', name: 'Grocery', icon: 'cart-outline', color: '#6BCB77' },
  { id: '4', name: 'Services', icon: 'construct-outline', color: '#FFD93D' },
];

const FEATURED_ITEMS = [
  {
    id: '1',
    title: 'Modern Watch',
    description: 'Minimalist design for everyday wear.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '2',
    title: 'Wireless Buds',
    description: 'Crystal clear sound & noise cancellation.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
  },
];

const RECOMMENDED_ITEMS = [
  {
    id: '1',
    title: 'Leather Wallet',
    price: '$45.00',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '2',
    title: 'Smart Speaker',
    price: '$120.00',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '3',
    title: 'Coffee Maker',
    price: '$89.00',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1544195156-f00196860000?auto=format&fit=crop&q=80&w=400',
  },
];

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState('Home');

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={[styles.categoryIconContainer, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderFeaturedCard = ({ item }) => (
    <TouchableOpacity style={styles.featuredCard}>
      <Image source={{ uri: item.image }} style={styles.featuredImage} />
      <View style={styles.featuredOverlay}>
        <Text style={styles.featuredTitle}>{item.title}</Text>
        <Text style={styles.featuredSubtitle} numberOfLines={1}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>BrandStore</Text>
          <Text style={styles.greeting}>Hello, User 👋</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100' }}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Hero Banner */}
        <View style={styles.bannerContainer}>
          <TouchableOpacity style={styles.banner}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800' }}
              style={styles.bannerImage}
            />
            <View style={styles.bannerOverlay}>
              <Text style={styles.bannerTitle}>Season Sale</Text>
              <Text style={styles.bannerSubtitle}>Up to 50% Off Everything</Text>
              <View style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Shop Now</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={CATEGORIES}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />

        {/* Featured Items */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Items</Text>
        </View>
        <FlatList
          data={FEATURED_ITEMS}
          renderItem={renderFeaturedCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
          snapToInterval={width * 0.75 + 16}
          decelerationRate="fast"
        />

        {/* Recommended Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.recommendedContainer}>
          {RECOMMENDED_ITEMS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.recommendedCard}>
              <Image source={{ uri: item.image }} style={styles.recommendedImage} />
              <View style={styles.recommendedInfo}>
                <View style={styles.recommendedRow}>
                  <Text style={styles.recommendedTitle}>{item.title}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FFD93D" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                </View>
                <Text style={styles.recommendedPrice}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Extra spacing for bottom nav */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { name: 'Home', icon: 'home' },
          { name: 'Search', icon: 'search' },
          { name: 'Add', icon: 'add-circle', isCenter: true },
          { name: 'Alerts', icon: 'notifications' },
          { name: 'Profile', icon: 'person' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.name}
            style={styles.navItem}
            onPress={() => setActiveTab(tab.name)}
          >
            <Ionicons
              name={activeTab === tab.name ? (tab.icon as any) : (`${tab.icon}-outline` as any)}
              size={tab.isCenter ? 40 : 24}
              color={tab.isCenter ? '#1D3D47' : activeTab === tab.name ? '#1D3D47' : '#999'}
            />
            {!tab.isCenter && (
              <Text style={[styles.navText, activeTab === tab.name && styles.navTextActive]}>
                {tab.name}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D3D47',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  profileButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileIcon: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  bannerContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  banner: {
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#FFF',
    marginTop: 5,
    opacity: 0.9,
  },
  bannerButton: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 15,
  },
  bannerButtonText: {
    color: '#1D3D47',
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D3D47',
  },
  seeAll: {
    color: '#4D96FF',
    fontSize: 14,
  },
  categoriesList: {
    paddingLeft: 20,
    paddingBottom: 10,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 25,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  featuredList: {
    paddingLeft: 20,
    paddingBottom: 10,
  },
  featuredCard: {
    width: width * 0.75,
    height: 150,
    marginRight: 16,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  featuredTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  featuredSubtitle: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
  recommendedContainer: {
    paddingHorizontal: 20,
  },
  recommendedCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  recommendedImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  recommendedInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  recommendedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D3D47',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  recommendedPrice: {
    fontSize: 15,
    color: '#4D96FF',
    fontWeight: 'bold',
    marginTop: 8,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  navTextActive: {
    color: '#1D3D47',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
