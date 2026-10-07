import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  useEffect(() => {
    let live = true;
    setState((s) => ({ ...s, loading: true, error: "" }));
    api.get(url)
      .then((data) => live && setState({ data, loading: false, error: "" }))
      .catch((e) => live && setState({ data: null, loading: false, error: e.message }));
    return () => { live = false; };
  }, [url]);
  return state;
}
