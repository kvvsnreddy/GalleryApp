import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { PicsumImage } from '../types/gallery';
import { useGalleryStore } from '../store/useGalleryStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;

interface ImageCardProps {
  image: PicsumImage;
  onPress: (image: PicsumImage) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, onPress }) => {
  const isFavorite = useGalleryStore((state) => state.isFavorite(image.id));
  const toggleFavorite = useGalleryStore((state) => state.toggleFavorite);

  const handleFavorite = useCallback(() => {
    toggleFavorite(image);
  }, [image, toggleFavorite]);

  const thumbUrl = `https://picsum.photos/id/${image.id}/300/200`;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(image)}
      activeOpacity={0.92}
    >
      <Image
        source={{ uri: thumbUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <TouchableOpacity style={styles.favBtn} onPress={handleFavorite} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={styles.favIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={styles.author} numberOfLines={1}>{image.author}</Text>
        <Text style={styles.id}>ID: {image.id}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  image: { width: '100%', height: 130 },
  favBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    padding: 4,
  },
  favIcon: { fontSize: 18 },
  info: { padding: 10 },
  author: { fontSize: 13, fontWeight: '600', color: '#1F2937', marginBottom: 2 },
  id: { fontSize: 11, color: '#9CA3AF' },
});
