import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Encanador from "./pages/Encanador";
// import Pintor from "./pages/Pintor";
// import Eletricista from "./pages/Eletricista";
// import Pedreiro from "./pages/Pedreiro";
import Diarista from "./pages/Diarista";
import Servico from "./pages/Final";
// import Jardineiro from "./pages/Jardineiro";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/encanador" element={<Encanador />} />
      {/* <Route path="/pintor" element={<Pintor />} /> */}
      {/* <Route path="/eletricista" element={<Eletricista />} /> */}
      {/* <Route path="/pedreiro" element={<Pedreiro />} /> */}
      <Route path="/diarista" element={<Diarista />} />
      {/* <Route path="/jardineiro" element={<Jardineiro />} /> */}
      <Route path="/servico" element={<Servico />} />
    </Routes>
  );
};

export default App;
