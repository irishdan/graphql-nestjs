import Dashboard from '../../pages/dashboard.tsx';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';

const AppContainer = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppContainer;
