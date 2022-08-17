import { useState, useEffect } from "react";

function getSessionStorageOrDefault(key: string, defaultValue: any) {
  const stored = sessionStorage.getItem(key);
  if (!stored) {
    return defaultValue;
  }
  return JSON.parse(stored);
}

export function useSessionStorage(key: string, defaultValue: any) {
  const [value, setValue] = useState(
    getSessionStorageOrDefault(key, defaultValue)
  );

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
