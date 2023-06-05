import React from "react";
import { Route, Routes } from "react-router-dom";

import Layout from "hoc/layout/layout";
import Weather from "features/weather/weather";

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Weather />} />
      </Routes>
    </Layout>
  );
};

export default App;
