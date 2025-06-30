import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";

export const useSearch = ({ searchKeys }: { searchKeys: string[] }) => {
  const [searchValue, setSearchValue] = useState("");

  const searchFormatted = useMemo(() => generateSearchFormatted({ searchKeys, searchValue }), [searchKeys, searchValue]);

  const onSearch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const debouncedSearch = debounce(() => {
      const value = event.target.value;
      setSearchValue(value);
    }, 500);
    debouncedSearch();
  }, []);

  return { searchValue, searchFormatted, onSearch };
};

export const useDebouncedSearchFormatted = ({ searchValue, searchKeys, delay = 500 }: UseSearchFormattedArgs) => {
  const [searchFormatted, setSearchFormatted] = useState<SearchObject[]>([]);

  useEffect(() => {
    const onSearchFormatted = () => {
      const formatted = generateSearchFormatted({ searchKeys, searchValue });
      setSearchFormatted(formatted);
    };

    const timer = setTimeout(onSearchFormatted, delay);
    return () => clearTimeout(timer);
  }, [searchValue, searchKeys, delay]);

  return { searchFormatted };
};

// helper functions
const generateSearchFormatted = ({ searchKeys, searchValue }: GenerateSearchFormattedArgs) => {
  if (!searchValue) return [];

  return searchKeys.map((key) => {
    const keys = key.split(".");
    let obj: SearchObject = { [keys[keys.length - 1]]: { $regex: searchValue, $options: 'i' } };
    for (let i = keys.length - 2; i >= 0; i--) {
      obj = { [keys[i]]: obj };
    }
    return obj;
  });
};

// types
export type SearchObject = { [key: string]: SearchObject | { $regex: string; $options: string } };
type GenerateSearchFormattedArgs = { searchKeys: string[]; searchValue: string };
type UseSearchFormattedArgs = GenerateSearchFormattedArgs & { delay?: number };
