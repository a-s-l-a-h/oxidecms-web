import { openDB } from 'idb';

const DB_NAME = 'ibtwil-blog-db';
const DB_VERSION = 1;

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    // Posts cache store
    if (!db.objectStoreNames.contains('posts')) {
      db.createObjectStore('posts', { keyPath: 'id' });
    }
    
    // Offline posts store
    if (!db.objectStoreNames.contains('offline-posts')) {
      db.createObjectStore('offline-posts', { keyPath: 'id' });
    }
    
    // Visited posts (with full content) store
    if (!db.objectStoreNames.contains('visited-posts')) {
      db.createObjectStore('visited-posts', { keyPath: 'id' });
    }
    
    // Settings store
    if (!db.objectStoreNames.contains('settings')) {
      db.createObjectStore('settings');
    }
  },
});

// Cache operations
export const cacheOperations = {
  async getAllPosts() {
    const db = await dbPromise;
    return db.getAll('posts');
  },
  
  async cachePost(post) {
    const db = await dbPromise;
    await db.put('posts', post);
  },
  
  async cachePosts(posts) {
    const db = await dbPromise;
    const tx = db.transaction('posts', 'readwrite');
    await Promise.all(posts.map(post => tx.store.put(post)));
  },
  
  async clearPostsCache() {
    const db = await dbPromise;
    await db.clear('posts');
  },
  
  async getVisitedPost(id) {
    const db = await dbPromise;
    return db.get('visited-posts', id);
  },
  
  async cacheVisitedPost(post) {
    const db = await dbPromise;
    await db.put('visited-posts', post);
  },
  
  async clearVisitedPosts() {
    const db = await dbPromise;
    await db.clear('visited-posts');
  },
};

// Offline operations
export const offlineOperations = {
  async getAll() {
    const db = await dbPromise;
    return db.getAll('offline-posts');
  },
  
  async add(post) {
    const db = await dbPromise;
    await db.put('offline-posts', post);
  },
  
  async remove(id) {
    const db = await dbPromise;
    await db.delete('offline-posts', id);
  },
  
  async clear() {
    const db = await dbPromise;
    await db.clear('offline-posts');
  },
};

// Settings operations
export const settingsOperations = {
  async get(key) {
    const db = await dbPromise;
    return db.get('settings', key);
  },
  
  async set(key, value) {
    const db = await dbPromise;
    await db.put('settings', value, key);
  },
  
  async delete(key) {
    const db = await dbPromise;
    await db.delete('settings', key);
  },
};