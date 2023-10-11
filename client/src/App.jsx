import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Note from "./pages/Note";
import Signup from "./pages/Signup";
import { AuthState } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

function App() {
  const { token } = AuthState();

  return (
    <div className={"app"}>
      <Toaster
        toastOptions={{
          style: {
            color: "#fff",
            background: "#474747",
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={token ? <Navigate to="/home" /> : <Login />}
          />
          <Route
            path="/signup"
            element={token ? <Navigate to="/home" /> : <Signup />}
          />
          <Route
            path="/home"
            element={token ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/note/create"
            element={token ? <Note create /> : <Navigate to="/login" />}
          />
          <Route
            path="/note/edit/:id"
            element={token ? <Note edit /> : <Navigate to="/login" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
