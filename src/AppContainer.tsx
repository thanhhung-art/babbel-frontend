import { useEffect, useReducer } from "react";
import App from "./App";
import reducer from "./context/reducer";
import { Context, initialState } from "./context/root";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_CLIENT_ID;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const Container = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    console.log('app container running');
  }, [])

  return (
    <GoogleOAuthProvider clientId={clientId}>
    <QueryClientProvider client={queryClient}>
      <Context.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Context.Provider>
    </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default Container;
