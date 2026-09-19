import { useState, useCallback, useRef, useEffect } from 'react';
import { PicsumImage } from '../types/gallery';
import { fetchImages } from '../api/picsumApi';

const PAGE_LIMIT = 20;

export const useFetchImages = () => {
  const [images, setImages] = useState<PicsumImage[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  const loadImages = useCallback(async (pageNum: number, isRefresh = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setError(null);
    if (!isRefresh) setLoading(true);

    try {
      const data = await fetchImages(pageNum, PAGE_LIMIT);
      if (data.length < PAGE_LIMIT) setHasMore(false);
      setImages((prev) => (isRefresh ? data : [...prev, ...data]));
    } catch {
      setError('Failed to load images. Please try again.');
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadImages(1, true);
  }, []);

  const loadMore = useCallback(() => {
    if (!hasMore || isFetchingRef.current || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadImages(nextPage);
  }, [hasMore, loading, page, loadImages]);

  const handleRefresh = useCallback(() => {
    if (isFetchingRef.current) return;
    setRefreshing(true);
    setHasMore(true);
    setPage(1);
    loadImages(1, true);
  }, [loadImages]);

  return { images, loading, refreshing, hasMore, error, loadMore, handleRefresh };
};
