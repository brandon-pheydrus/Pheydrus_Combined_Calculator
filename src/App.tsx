import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components';
import { HomePage, CalculatorPage, ResultsPage, ClientAssessmentPage, ClientResultsPage } from './views';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Internal admin tool */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="calculator" element={<CalculatorPage />} />
          <Route path="results" element={<ResultsPage />} />
        </Route>
        {/* Client-facing assessment (no layout shell) */}
        <Route path="client" element={<ClientAssessmentPage />} />
        <Route path="client/results" element={<ClientResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
