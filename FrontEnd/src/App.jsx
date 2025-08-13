
import { Routes, Route } from "react-router-dom";
import Main from "./pages/Main.jsx";
import Product from "./pages/Product.jsx";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/producto" element={<Product />} />
    </Routes>
  );
}

export default App;
