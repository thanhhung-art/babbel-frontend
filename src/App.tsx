import Home from "./pages/Home";
import Login from "./pages/Login";
import { Route, Routes } from "react-router-dom";
import CheckAuth from "./components/CheckAuth";
import Register from "./pages/Register";

function App() {

  return (
    <Routes>
      <Route
        path="/"
        element={
          <CheckAuth>
            <Home />
          </CheckAuth>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={ <Register /> }/>
    </Routes>
  );
}

export default App;
