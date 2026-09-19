import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFetchImages } from '../../hooks/useFetchImages';
import { useDebounce } from '../../hooks/useDebounce';
import { ImageCard } from '../../components/ImageCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { PicsumImage, FilterMode } from '../../types/gallery';
import { RootStackParamList } from '../../types/navigation';

type NavProp = StackNavigationProp<RootStackParamList>;

const FILTERS: FilterMode[] = ['ALL', 'A-M', 'N-Z'];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { images, loading, refreshing, error, loadMore, handleRefresh } = useFetchImages();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('ALL');
  const debouncedSearch = useDebounce(searchQuery, 350);

  const filteredImages = useMemo(() => {
    return images.filter((img) => {
      const matchesSearch = img.author
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());

      const firstChar = img.author.trim().toUpperCase()[0];
      let matchesFilter = true;
      if (filterMode === 'A-M') {
        matchesFilter = firstChar >= 'A' && firstChar <= 'M';
      } else if (filterMode === 'N-Z') {
        matchesFilter = firstChar >= 'N' && firstChar <= 'Z';
      }

      return matchesSearch && matchesFilter;
    });
  }, [images, debouncedSearch, filterMode]);

  const handleImagePress = (image: PicsumImage) => {
    navigation.navigate('ImageDetail', { image });
  };

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#6C63FF" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>{error ? '⚠️' : '🔍'}</Text>
        <Text style={styles.emptyTitle}>{error ? 'Failed to load' : 'No images found'}</Text>
        <Text style={styles.emptyText}>
          {error || 'Try a different search or filter.'}
        </Text>
        {error && (
          <TouchableOpacity style={styles.retryBtn} onPress={handleRefresh}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading && images.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <Text style={styles.screenTitle}>Gallery</Text>
        </View>
        <LoadingSpinner message="Fetching images..." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Text style={styles.screenTitle}>Gallery</Text>
        <Text style={styles.countBadge}>{filteredImages.length} photos</Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by author..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filterMode === f && styles.filterChipActive]}
            onPress={() => setFilterMode(f)}
          >
            <Text style={[styles.filterText, filterMode === f && styles.filterTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredImages}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ImageCard image={item} onPress={handleImagePress} />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7FF' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 8,
  },
  screenTitle: { fontSize: 26, fontWeight: '800', color: '#1F2937' },
  countBadge: {
    fontSize: 12,
    color: '#6C63FF',
    fontWeight: '600',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  searchRow: { paddingHorizontal: 16, marginBottom: 10 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    height: 46,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, color: '#111827' },
  clearIcon: { fontSize: 14, color: '#9CA3AF', paddingLeft: 8 },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  filterChipActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  filterText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  filterTextActive: { color: '#fff' },
  row: { justifyContent: 'space-between', paddingHorizontal: 16 },
  listContent: { paddingBottom: 24 },
  footer: { padding: 20, alignItems: 'center' },
  emptyState: { flex: 1, alignItems: 'center', paddingTop: 80, paddingHorizontal: 32 },
  emptyIcon: { fontSize: 52, marginBottom: 14 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
  retryBtn: {
    marginTop: 20,
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
