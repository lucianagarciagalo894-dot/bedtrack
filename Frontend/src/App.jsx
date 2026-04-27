import { useState } from "react";
import Beds from "./pages/Beds";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";

function App() {
  const [role, setRole] = useState(null);

  if (!role) {
    return <Login onLogin={setRole} />;
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ marginLeft: "200px", width: "100%" }}>
        <Beds role={role} />
      </div>
    </div>
  );
}

export default App;