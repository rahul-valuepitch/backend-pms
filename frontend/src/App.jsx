import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Website, Dashboard, Resume } from "./layouts/index";
import { Home } from "./pages/website/index";
import { Register, Login } from "./pages/authentication/index";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Website />}>
            <Route index element={<Home />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
          </Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/resume" element={<Resume />}></Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
