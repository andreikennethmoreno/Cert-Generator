import { useState, type FormEvent } from 'react';
import { generatePDF, capitalize } from './utils/pdfGenerator';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedName = name.trim();

    if (trimmedName === '' || trimmedName.length < 3) {
      setError('Please enter a valid name (minimum 3 characters)');
      return;
    }

    if (trimmedName.length > 30) {
      setError('Name is too long (maximum 30 characters)');
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      const capitalizedName = capitalize(trimmedName);
      await generatePDF(capitalizedName);
    } catch (err) {
      setError('Failed to generate certificate. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <img src="/padhega-india.png" alt="Padhega India Logo" className="logo" />
        <h4>Get your certificate of subscription to</h4>
        <h1>
          <a
            href="https://www.youtube.com/channel/UCUwURiBONxHJw1vdxU_RGkw"
            target="_blank"
            rel="noopener noreferrer"
          >
            Padhega India
          </a>
        </h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Type Your Name</label>
          <input
            required
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Accha Baccha"
            id="name"
            minLength={3}
            maxLength={30}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isGenerating}
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Get Certificate'}
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;
