import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import './App.css';
import Home from "./pages/Home";
import CreateEmp from "./pages/CreateEmployee";
import AllEmployee from "./pages/GetAllEmp";
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <AuthProvider>
        <Routes>
        <Route
            path="/home"
            element={
                <Home />
            }
          />
          <Route path="/" element={<Login />} />
          <Route path="/create" element={<CreateEmp />} />
          <Route path="/employees" element={<AllEmployee />} />
        </Routes>
      </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
