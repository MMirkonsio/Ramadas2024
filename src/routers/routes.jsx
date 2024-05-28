import Login from "../components/login";
import HomeApp from "../screens/Home";
import { Routes, Route } from "react-router-dom";
export function MyRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeApp />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
