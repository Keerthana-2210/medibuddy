import { useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const searchMedicine = async (e) => {
    e.preventDefault();

    const value = query.trim();

    if (!value) {
      setError("Please enter a medicine name");
      setMedicines([]);
      return;
    }

    setLoading(true);
    setError("");
    setMedicines([]);
    setSearched(true);

    try {
      const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(
        value
      )}"&limit=20`;

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          setMedicines([]);
          return;
        }

        throw new Error("Failed to fetch medicines");
      }

      const data = await response.json();
      setMedicines(data.results || []);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getValue = (value) => {
    if (!value || !value.length) return "Not available";
    return value[0];
  };

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>Medicine Search</h1>
          <p>Search medicines using the FDA Drug Label API</p>
        </header>

        <form className="search-box" onSubmit={searchMedicine}>
          <input
            type="text"
            placeholder="Enter medicine brand name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button type="submit">
            Search
          </button>
        </form>

        {loading && <div className="status">Loading medicines...</div>}

        {error && <div className="error">{error}</div>}

        {!loading &&
          !error &&
          searched &&
          medicines.length === 0 && (
            <div className="status">
              No results found
            </div>
          )}

        <div className="results">
          {medicines.map((medicine, index) => {
            const openfda = medicine.openfda || {};

            return (
              <div className="card" key={index}>
                <h2>{getValue(openfda.brand_name)}</h2>

                <div className="details">
                  <div>
                    <span>Generic Name</span>
                    <p>{getValue(openfda.generic_name)}</p>
                  </div>

                  <div>
                    <span>Manufacturer</span>
                    <p>{getValue(openfda.manufacturer_name)}</p>
                  </div>

                  <div>
                    <span>Product Type</span>
                    <p>{getValue(openfda.product_type)}</p>
                  </div>

                  <div>
                    <span>Route</span>
                    <p>{getValue(openfda.route)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;