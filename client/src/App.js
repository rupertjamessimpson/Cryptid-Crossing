import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import CreateShow from "./components/pages/shows/create";
import Header from "./components/header";
import Development from "./components/pages/development";
import Footer from "./components/footer";
import Login from "./components/pages/login";
import Shows from "./components/pages/shows";

function App() {
  return (
    <div>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/shows" />} />
          <Route path="/shows" element={<Shows />} />
          <Route path="/shows/create" element={<CreateShow />} />
          <Route path="/login" element={<Login />} />
          <Route path="/development" element={<Development />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;