import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import HomePage from './pages/HomePage';
import CharacterPage from './pages/CharacterPage';

const App: React.FC = () => {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/character/:id" element={<CharacterPage />} />
      </Routes>
    </Router>
  );
};

export default App;