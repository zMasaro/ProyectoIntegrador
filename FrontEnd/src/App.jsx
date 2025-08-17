
import { Routes, Route } from "react-router-dom";
import Main from "./pages/Main.jsx";
import Product from "./pages/Product.jsx";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import { Navigate } from "react-router-dom"; 
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx";

function App() {
  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route  path="/app" element={<ProtectedRoute> <Main /> </ProtectedRoute>}/>       
        <Route path="/signup" element={ <ProtectedAdminRoute> <SignUp /> </ProtectedAdminRoute>} />
        <Route path="/producto" element={<Product />} />
        <Route path="" element={<Navigate to="/" />} />
      </Routes>
  );
}

export default App;
