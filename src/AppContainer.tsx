import { useReducer } from "react";
import App from "./App";
import reducer from "./context/reducer";
import { Context, initialState } from "./context/root";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";

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
    <QueryClientProvider client={queryClient}>
      <Context.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Context.Provider>
    </QueryClientProvider>
  );
};

export default Container;
