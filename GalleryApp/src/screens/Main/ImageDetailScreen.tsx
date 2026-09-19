import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { RootStackParamList } from '../../types/navigation';
import { useGalleryStore } from '../../store/useGalleryStore';
import { Button } from '../../components/Button';

const { width } = Dimensions.get('window');

type Props = {
  navigation: StackNavigationProp<RootStackParamList, 'ImageDetail'>;
  route: RouteProp<RootStackParamList, 'ImageDetail'>;
};

export const ImageDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { image } = route.params;
  const isFavorite = useGalleryStore((state) => state.isFavorite(image.id));
  const toggleFavorite = useGalleryStore((state) => state.toggleFavorite);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to your photo library.');
        return;
      }

      const fileUri = FileSystem.documentDirectory + `picsum_${image.id}.jpg`;
      const downloadUrl = `https://picsum.photos/id/${image.id}/1200/800`;

      const { uri } = await FileSystem.downloadAsync(downloadUrl, fileUri);
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Saved!', 'Image saved to your gallery successfully. 🎉');
    } catch {
      Alert.alert('Download failed', 'Could not download the image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert('Sharing not available', 'Sharing is not supported on this device.');
        return;
      }

      const fileUri = FileSystem.cacheDirectory + `share_${image.id}.jpg`;
      const downloadUrl = `https://picsum.photos/id/${image.id}/800/600`;
      await FileSystem.downloadAsync(downloadUrl, fileUri);
      await Sharing.shareAsync(fileUri, { mimeType: 'image/jpeg' });
    } catch {
      Alert.alert('Share failed', 'Could not share the image.');
    } finally {
      setSharing(false);
    }
  };

  const imageUrl = `https://picsum.photos/id/${image.id}/${width}/600`;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {image.author}
        </Text>
        <TouchableOpacity style={styles.favBtnHeader} onPress={() => toggleFavorite(image)}>
          <Text style={styles.favIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.fullImage}
          resizeMode="cover"
        />

        <View style={styles.details}>
          <View style={styles.metaRow}>
            <View style={styles.metaBadge}>
              <Text style={styles.metaLabel}>ID</Text>
              <Text style={styles.metaValue}>#{image.id}</Text>
            </View>
            <View style={styles.metaBadge}>
              <Text style={styles.metaLabel}>Size</Text>
              <Text style={styles.metaValue}>{image.width} × {image.height}</Text>
            </View>
          </View>

          <Text style={styles.authorName}>{image.author}</Text>
          <Text style={styles.authorSub}>Photographer</Text>

          <View style={styles.actionRow}>
            <Button
              title={downloading ? 'Saving...' : '⬇ Download'}
              onPress={handleDownload}
              loading={downloading}
              style={styles.actionBtn}
            />
            <Button
              title={sharing ? 'Sharing...' : '↗ Share'}
              onPress={handleShare}
              loading={sharing}
              variant="outline"
              style={styles.actionBtn}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0F0F1A' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0F0F1A',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerTitle: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '600', marginHorizontal: 12 },
  favBtnHeader: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  favIcon: { fontSize: 20 },
  fullImage: { width: '100%', height: width * 0.75 },
  details: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    padding: 24,
    minHeight: 280,
  },
  metaRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  metaBadge: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  metaLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '600', marginBottom: 4 },
  metaValue: { fontSize: 15, color: '#1F2937', fontWeight: '700' },
  authorName: { fontSize: 22, fontWeight: '800', color: '#1F2937', marginBottom: 4 },
  authorSub: { fontSize: 14, color: '#9CA3AF', marginBottom: 24 },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1 },
});
