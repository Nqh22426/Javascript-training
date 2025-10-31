import { useState, useEffect } from 'react';

/**
 * Custom Hook: useLocalStorage
 * @param {string} key - Key để lưu trong localStorage
 * @param {any} initialValue - Giá trị khởi tạo
 * @returns {[any, function]} - [value, setValue]
 */
function useLocalStorage(key, initialValue) {
  // Khởi tạo state từ localStorage
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });
  
  // Tự động lưu vào localStorage mỗi khi value thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [key, value]);
  
  return [value, setValue];
}

export default useLocalStorage;