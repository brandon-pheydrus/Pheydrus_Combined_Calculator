import { useCalculatorController } from '../controllers';

export function CalculatorPage() {
  const { inputs, results, isLoading, error, updateInput, calculate, reset } =
    useCalculatorController();

  return (
    <div className="page calculator-page">
      <h1>Calculator</h1>

      <div className="calculator-container">
        <div className="input-section">
          <h2>Inputs</h2>
          <div className="input-group">
            <label htmlFor="value1">Value 1</label>
            <input
              id="value1"
              type="number"
              value={inputs.value1 ?? ''}
              onChange={(e) => updateInput('value1', e.target.value)}
              placeholder="Enter value"
            />
          </div>
          <div className="input-group">
            <label htmlFor="value2">Value 2</label>
            <input
              id="value2"
              type="number"
              value={inputs.value2 ?? ''}
              onChange={(e) => updateInput('value2', e.target.value)}
              placeholder="Enter value"
            />
          </div>

          <div className="button-group">
            <button onClick={calculate} disabled={isLoading} className="primary-button">
              {isLoading ? 'Calculating...' : 'Calculate'}
            </button>
            <button onClick={reset} className="secondary-button">
              Reset
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}
        </div>

        <div className="results-section">
          <h2>Results</h2>
          {results.length > 0 ? (
            <ul className="results-list">
              {results.map((result) => (
                <li key={result.id} className="result-item">
                  <span className="result-label">{result.label}:</span>
                  <span className="result-value">
                    {result.value} {result.unit}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-results">Enter values and click Calculate</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CalculatorPage;
