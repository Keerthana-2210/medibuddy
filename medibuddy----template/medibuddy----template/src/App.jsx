
import { useState } from "react";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchMedicine = async () => {
    if (!search.trim()) {
      setError("Please enter a medicine name");
      return;
    }

    setLoading(true);
    setError("");
    setMedicines([]);

    try {
      const url =
        `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${search}"&limit=20`;

      const response = await fetch(url);

      if (response.status === 404) {
        setMedicines([]);
        return;
      }

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      setMedicines(data.results || []);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Medicine Search</h1>

      <div className="search">
        <input
          type="text"
          placeholder="Search medicine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchMedicine();
            }
          }}
        />

        <button onClick={searchMedicine}>Search</button>
      </div>

      {loading && <p className="message">Loading...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && medicines.length === 0 && search && (
        <p className="message">No results found</p>
      )}

      <div className="cards">
        {medicines.map((medicine, index) => {
          const data = medicine.openfda || {};

          return (
            <div className="card" key={index}>
              <h2>{data.brand_name?.[0] || "Unknown medicine"}</h2>

              <p>
                <b>Generic Name:</b>{" "}
                {data.generic_name?.[0] || "Not available"}
              </p>

              <p>
                <b>Manufacturer:</b>{" "}
                {data.manufacturer_name?.[0] || "Not available"}
              </p>

              <p>
                <b>Product Type:</b>{" "}
                {data.product_type?.[0] || "Not available"}
              </p>

              <p>
                <b>Route:</b>{" "}
                {data.route?.[0] || "Not available"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
