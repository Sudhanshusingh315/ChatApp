import { useEffect, useState } from "react";

export const useDebounce = (value, delay = 500) => {
    const [debouncedSearch, setDebouncedSearch] = useState();

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);
    return debouncedSearch;
};
