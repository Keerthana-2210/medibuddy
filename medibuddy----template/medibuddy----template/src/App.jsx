import {useState} from 'react';
import "./app.css";
function App(){
    const [search, setSearch] = useState("");
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading]= useState(flase);
    const [error, setError]= useState("");
    const searchMedicine= async()=>{
        if(!search.trim()){
            setError("please enter a medicine name");
            return;
        }
        setLoading(true);
        setError("");
        setMedicines([]);
        try{
            const url='https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${search}&"limit=20';
            const response= await fetch(url);
            if(response.status===404){
                setMedicines([]);
                return;
            }
            if(!response.ok){
                throw new Error("something went wrong");
            }
            const data=await response.json();
            setMedicines(data.returns||[]);        }
        catch(err){
            setError("something went wrong");}
        finally{
            setLoading(false);
    }

};
return (
    <div className="app">
        <h1>Medicine search</h1>
        <div className="search">
            <input
                type="text"
                placeholder="Enter medicine name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e)=>{if(e.key==="Enter"){searchMedicine()}}}

            />
            <button onClick={searchMedicine}>Search</button>
        </div>
        {error && <p className="error">{error}</p>}
        {!loading && !error && medicines.length===0 && search &&(<p className="message"> No results found</p>)}
        <div className="cards">
            {medicines.map((medicine,index) =>{
                const data= medicine.openfda||{};
                return(
                    <div className="card" key={index}>
                        <h2>{data.brand_name?.[0] || "unknown medicine"}</h2>
                        <p>
                            <b>Generic Name:</b>{" "} {data.generic_name?.[0] || "not avaliable"}
                        </p>
                        <p>
                            <b>Manufacturer Name:</b>{" "} {data.manufacturer_name?.[0] || "not avaliable"}
                        </p>
                        <p>
                            <b>product type:</b> {data.product_type?.[0] || "not avaliable"}
                        </p>
                        <p>
                            <b>Route:</b>
                        </p>
                    </div>);
            })}
        </div>
        </div>
);

}