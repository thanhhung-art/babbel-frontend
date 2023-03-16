import { useReducer } from "react";
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

  return (
    <BrowserRouter>
      <Context.Provider value={{ state, dispatch }}>
        <QueryClientProvider client={queryClient}>
          <GoogleOAuthProvider clientId={clientId}>
            <App />
          </GoogleOAuthProvider>
        </QueryClientProvider>
      </Context.Provider>
    </BrowserRouter>
  );
};

export default Container;
