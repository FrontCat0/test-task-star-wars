import axios from 'axios';
import { Character } from '../types/character';

const API_BASE_URL = 'https://swapi.dev/api';

const cache: { [key: string]: { data: any, timestamp: number } } = {};
const CACHE_EXPIRATION = 5 * 60 * 1000;

const getCachedData = (key: string) => {
  const cachedItem = cache[key];
  if (cachedItem && Date.now() - cachedItem.timestamp < CACHE_EXPIRATION) {
    return cachedItem.data;
  }
  return null;
};

const setCachedData = (key: string, data: any) => {
  cache[key] = { data, timestamp: Date.now() };
};

const clearCacheByPrefix = (prefix: string) => {
  Object.keys(cache).forEach(key => {
    if (key.startsWith(prefix)) {
      delete cache[key];
    }
  });
};

export const getCharacters = async (page: number, search: string = '') => {
  const cacheKey = `characters_${page}_${search}`;
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  const response = await axios.get(`${API_BASE_URL}/people/`, {
    params: { page, search },
  });

  const updatedResults = response.data.results.map((character: Character) => {
    const id = character.url.split('/').slice(-2)[0];
    const localData = localStorage.getItem(`character_${id}`);
    return localData ? JSON.parse(localData) : character;
  });

  const result = { ...response.data, results: updatedResults };
  setCachedData(cacheKey, result);
  return result;
};

export const getCharacter = async (id: string): Promise<Character> => {
  const cacheKey = `character_${id}`;
  const cachedData = getCachedData(cacheKey);
  if (cachedData) return cachedData;

  const localData = localStorage.getItem(`character_${id}`);
  if (localData) {
    const parsedData = JSON.parse(localData);
    setCachedData(cacheKey, parsedData);
    return parsedData;
  }

  const response = await axios.get(`${API_BASE_URL}/people/${id}/`);
  setCachedData(cacheKey, response.data);
  return response.data;
};

export const updateCharacter = (character: Character) => {
  const id = character.url.split('/').slice(-2)[0];
  localStorage.setItem(`character_${id}`, JSON.stringify(character));
  setCachedData(`character_${id}`, character);

  clearCacheByPrefix('characters_');
};

export const searchLocalCharacters = (query: string): Character[] => {
  const characters: Character[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('character_')) {
      const character: Character = JSON.parse(localStorage.getItem(key) || '');
      if (character.name.toLowerCase().includes(query.toLowerCase())) {
        characters.push(character);
      }
    }
  }
  return characters;
};