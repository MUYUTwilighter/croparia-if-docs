import React from "react";

export default function useDebounced<T>(value: T, delay = 300) {
  const [deb, setDeb] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setDeb(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return deb;
}