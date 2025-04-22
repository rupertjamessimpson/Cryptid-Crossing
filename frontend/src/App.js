import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Create from "./components/pages/shows/create";
import Details from "./components/pages/shows/details";
import Edit from "./components/pages/shows/edit";
import Header from "./components/header";
import Development from "./components/pages/development";
import Footer from "./components/footer";
import Login from "./components/pages/login";
import Shows from "./components/pages/shows";

function App() {
  return (
    <BrowserRouter> {/* ✅ Move this to wrap everything */}
      <div className="layout">
        <Header />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Navigate to="/shows" />} />
            <Route path="/shows" element={<Shows />} />
            <Route path="/shows/create" element={<Create />} />
            <Route path="/shows/:id" element={<Details />} />
            <Route path="/shows/edit/:id" element={<Edit />} />
            <Route path="/login" element={<Login />} />
            <Route path="/development" element={<Development />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
