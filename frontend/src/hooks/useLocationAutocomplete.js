import { useState, useEffect, useRef } from "react";
import { searchCities } from "../api/locationsApi";

export function useLocationAutocomplete(debounceMs = 300) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await searchCities(query);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);
    return () => clearTimeout(timerRef.current);
  }, [query, debounceMs]);

  const clear = () => {
    setQuery("");
    setResults([]);
  };

  return { query, setQuery, results, isLoading, clear };
}
