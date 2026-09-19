import axios from 'axios';
import { PicsumImage } from '../types/gallery';

const BASE_URL = 'https://picsum.photos/v2';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const fetchImages = async (page: number, limit: number = 20): Promise<PicsumImage[]> => {
  const response = await apiClient.get<PicsumImage[]>(`/list`, {
    params: { page, limit },
  });
  return response.data;
};
