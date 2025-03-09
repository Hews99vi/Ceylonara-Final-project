import "./harvestPlanPage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const HarvestPlanPage = () => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState("Nuwara Eliya");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  // Add state for showing the data input form
  const [showDataForm, setShowDataForm] = useState(false);
  // Add state for form data
  const [formData, setFormData] = useState({
    estateName: "",
    elevation: "",
    teaType: "Black",
    yield: "",
    rainfall: "",
    temperature: "",
    humidity: "",
    notes: ""
  });
  
  const regions = ["Nuwara Eliya", "Kandy", "Galle", "Ratnapura", "Matara"];
  const months = ["January", "February", "March", "April", "May", "June", 
                 "July", "August", "September", "October", "November", "December"];
  
  // Sample data for demonstration
  const harvestData = {
    "Nuwara Eliya": [
      { month: 0, status: "peak", tip: "Peak harvest season. Pluck leaves every 7 days for premium quality." },
      { month: 1, status: "peak", tip: "Peak harvest season. Pluck leaves every 7 days for premium quality." },
      { month: 2, status: "good", tip: "Good harvesting conditions. Focus on quality over quantity." },
      { month: 3, status: "good", tip: "Good harvesting conditions. Monitor rainfall patterns." },
      { month: 4, status: "average", tip: "Average yield expected. Consider supplemental irrigation." },
      { month: 5, status: "low", tip: "Low season. Focus on maintenance and pruning." },
      { month: 6, status: "low", tip: "Low season. Good time for field maintenance." },
      { month: 7, status: "average", tip: "Yields beginning to improve. Monitor closely." },
      { month: 8, status: "good", tip: "Good harvesting conditions returning. Prepare workforce." },
      { month: 9, status: "peak", tip: "Peak harvest season approaching. Maximize labor efficiency." },
      { month: 10, status: "peak", tip: "Peak harvest season. Pluck leaves every 7 days for premium quality." },
      { month: 11, status: "peak", tip: "Peak harvest season. Pluck leaves every 7 days for premium quality." }
    ],
    "Kandy": [
      { month: 0, status: "good", tip: "Good harvesting conditions. Focus on quality over quantity." },
      { month: 1, status: "good", tip: "Good harvesting conditions. Monitor rainfall patterns." },
      { month: 2, status: "average", tip: "Average yield expected. Consider supplemental irrigation." },
      { month: 3, status: "average", tip: "Average yield expected. Monitor pest activity." },
      { month: 4, status: "low", tip: "Low season. Focus on maintenance and pruning." },
      { month: 5, status: "low", tip: "Low season. Good time for field maintenance." },
      { month: 6, status: "average", tip: "Yields beginning to improve. Monitor closely." },
      { month: 7, status: "good", tip: "Good harvesting conditions returning. Prepare workforce." },
      { month: 8, status: "peak", tip: "Peak harvest season approaching. Maximize labor efficiency." },
      { month: 9, status: "peak", tip: "Peak harvest season. Pluck leaves every 7 days for premium quality." },
      { month: 10, status: "good", tip: "Good harvesting conditions. Focus on quality over quantity." },
      { month: 11, status: "good", tip: "Good harvesting conditions. Monitor rainfall patterns." }
    ],
    "Galle": [
      { month: 0, status: "average", tip: "Average yield expected. Consider supplemental irrigation." },
      { month: 1, status: "average", tip: "Average yield expected. Monitor pest activity." },
      { month: 2, status: "low", tip: "Low season. Focus on maintenance and pruning." },
      { month: 3, status: "low", tip: "Low season. Good time for field maintenance." },
      { month: 4, status: "average", tip: "Yields beginning to improve. Monitor closely." },
      { month: 5, status: "good", tip: "Good harvesting conditions returning. Prepare workforce." },
      { month: 6, status: "peak", tip: "Peak harvest season approaching. Maximize labor efficiency." },
      { month: 7, status: "peak", tip: "Peak harvest season. Pluck leaves every 7 days for premium quality." },
      { month: 8, status: "good", tip: "Good harvesting conditions. Focus on quality over quantity." },
      { month: 9, status: "good", tip: "Good harvesting conditions. Monitor rainfall patterns." },
      { month: 10, status: "average", tip: "Average yield expected. Consider supplemental irrigation." },
      { month: 11, status: "average", tip: "Average yield expected. Monitor pest activity." }
    ],
    "Ratnapura": [
      { month: 0, status: "low", tip: "Low season. Focus on maintenance and pruning." },
      { month: 1, status: "low", tip: "Low season. Good time for field maintenance." },
      { month: 2, status: "average", tip: "Yields beginning to improve. Monitor closely." },
      { month: 3, status: "good", tip: "Good harvesting conditions returning. Prepare workforce." },
      { month: 4, status: "peak", tip: "Peak harvest season approaching. Maximize labor efficiency." },
      { month: 5, status: "peak", tip: "Peak harvest season. Pluck leaves every 7 days for premium quality." },
      { month: 6, status: "good", tip: "Good harvesting conditions. Focus on quality over quantity." },
      { month: 7, status: "good", tip: "Good harvesting conditions. Monitor rainfall patterns." },
      { month: 8, status: "average", tip: "Average yield expected. Consider supplemental irrigation." },
      { month: 9, status: "average", tip: "Average yield expected. Monitor pest activity." },
      { month: 10, status: "low", tip: "Low season. Focus on maintenance and pruning." },
      { month: 11, status: "low", tip: "Low season. Good time for field maintenance." }
    ],
    "Matara": [
      { month: 0, status: "average", tip: "Average yield expected. Consider supplemental irrigation." },
      { month: 1, status: "good", tip: "Good harvesting conditions returning. Prepare workforce." },
      { month: 2, status: "peak", tip: "Peak harvest season approaching. Maximize labor efficiency." },
      { month: 3, status: "peak", tip: "Peak harvest season. Pluck leaves every 7 days for premium quality." },
      { month: 4, status: "good", tip: "Good harvesting conditions. Focus on quality over quantity." },
      { month: 5, status: "good", tip: "Good harvesting conditions. Monitor rainfall patterns." },
      { month: 6, status: "average", tip: "Average yield expected. Consider supplemental irrigation." },
      { month: 7, status: "average", tip: "Average yield expected. Monitor pest activity." },
      { month: 8, status: "low", tip: "Low season. Focus on maintenance and pruning." },
      { month: 9, status: "low", tip: "Low season. Good time for field maintenance." },
      { month: 10, status: "average", tip: "Yields beginning to improve. Monitor closely." },
      { month: 11, status: "good", tip: "Good harvesting conditions returning. Prepare workforce." }
    ]
  };
  
  // Default to Nuwara Eliya if selected region doesn't have data
  const currentRegionData = harvestData[selectedRegion] || harvestData["Nuwara Eliya"];
  const currentMonthData = currentRegionData.find(item => item.month === selectedMonth);
  
  // Weather forecast data (sample)
  const weatherForecast = [
    { date: "Mon, 15", icon: "☀️", temp: "24°C" },
    { date: "Tue, 16", icon: "🌤️", temp: "23°C" },
    { date: "Wed, 17", icon: "🌧️", temp: "21°C" },
    { date: "Thu, 18", icon: "🌧️", temp: "20°C" },
    { date: "Fri, 19", icon: "🌤️", temp: "22°C" },
    { date: "Sat, 20", icon: "☀️", temp: "25°C" },
    { date: "Sun, 21", icon: "☀️", temp: "26°C" }
  ];
  
  // Yield prediction (sample)
  const yieldPrediction = {
    current: "85%",
    trend: "increasing",
    recommendation: "Optimal harvesting time approaching. Schedule labor for next week."
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmitData = (e) => {
    e.preventDefault();
    
    // Here you would typically send this data to your backend
    console.log("Submitting harvest data:", {
      region: selectedRegion,
      month: selectedMonth,
      ...formData
    });
    
    // For now, just close the form and show a success message
    alert("Data submitted successfully! This will improve your yield predictions.");
    setShowDataForm(false);
    
    // Reset form
    setFormData({
      estateName: "",
      elevation: "",
      teaType: "Black",
      yield: "",
      rainfall: "",
      temperature: "",
      humidity: "",
      notes: ""
    });
  };

  return (
    <div className="harvestPlanPage">
      <div className="harvestPlanContainer">
        <button className="closeButton" onClick={() => navigate("/dashboard")}>×</button>
        <div className="harvestPlanHeader">
          <img src="/logo.png" alt="Ceylonara Logo" />
          <h1>Harvest Planning</h1>
        </div>
        
        {showDataForm ? (
          <div className="dataFormContainer">
            <h2>Log Harvest Data</h2>
            <p className="formDescription">
              Enter your tea estate data to get personalized yield predictions.
              The more data you provide, the more accurate your predictions will be.
            </p>
            
            <form onSubmit={handleSubmitData} className="harvestDataForm">
              <div className="formGroup">
                <label htmlFor="estateName">Estate Name</label>
                <input 
                  type="text" 
                  id="estateName" 
                  name="estateName" 
                  value={formData.estateName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="formRow">
                <div className="formGroup">
                  <label htmlFor="elevation">Elevation (meters)</label>
                  <input 
                    type="number" 
                    id="elevation" 
                    name="elevation" 
                    value={formData.elevation}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="formGroup">
                  <label htmlFor="teaType">Tea Type</label>
                  <select 
                    id="teaType" 
                    name="teaType" 
                    value={formData.teaType}
                    onChange={handleInputChange}
                  >
                    <option value="Black">Black Tea</option>
                    <option value="Green">Green Tea</option>
                    <option value="White">White Tea</option>
                    <option value="Oolong">Oolong Tea</option>
                  </select>
                </div>
              </div>
              
              <div className="formGroup">
                <label htmlFor="yield">Yield (kg per hectare)</label>
                <input 
                  type="number" 
                  id="yield" 
                  name="yield" 
                  value={formData.yield}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="formRow">
                <div className="formGroup">
                  <label htmlFor="rainfall">Rainfall (mm)</label>
                  <input 
                    type="number" 
                    id="rainfall" 
                    name="rainfall" 
                    value={formData.rainfall}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="formGroup">
                  <label htmlFor="temperature">Temperature (°C)</label>
                  <input 
                    type="number" 
                    id="temperature" 
                    name="temperature" 
                    value={formData.temperature}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="formGroup">
                  <label htmlFor="humidity">Humidity (%)</label>
                  <input 
                    type="number" 
                    id="humidity" 
                    name="humidity" 
                    value={formData.humidity}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="formGroup">
                <label htmlFor="notes">Notes</label>
                <textarea 
                  id="notes" 
                  name="notes" 
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any additional observations..."
                />
              </div>
              
              <div className="formButtons">
                <button type="button" className="cancelButton" onClick={() => setShowDataForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="submitButton">
                  Submit Data
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="harvestPlanLayout">
            <div className="controlPanel">
              <div className="regionSelector">
                <h3>Select Region</h3>
                <select 
                  value={selectedRegion} 
                  onChange={(e) => setSelectedRegion(e.target.value)}
                >
                  {regions.map((region) => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
              
              <div className="monthSelector">
                <h3>Select Month</h3>
                <div className="monthGrid">
                  {months.map((month, index) => (
                    <div 
                      key={month} 
                      className={selectedMonth === index ? 'selected' : ''}
                      onClick={() => setSelectedMonth(index)}
                    >
                      {month.substring(0, 3)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="contentSection">
              <div className="harvestInfoCard">
                <h2>Harvest Status for {months[selectedMonth]} in {selectedRegion}</h2>
                
                {currentMonthData && (
                  <>
                    <div className="statusIndicator">
                      <div className={`statusDot ${currentMonthData.status}`}></div>
                      <div className="statusText">
                        {currentMonthData.status === "peak" && "Peak Harvest Season"}
                        {currentMonthData.status === "good" && "Good Harvest Conditions"}
                        {currentMonthData.status === "average" && "Average Harvest Conditions"}
                        {currentMonthData.status === "low" && "Low Harvest Season"}
                      </div>
                    </div>
                    
                    <div className="harvestTip">
                      <strong>Tip:</strong> {currentMonthData.tip}
                    </div>
                  </>
                )}
                
                <div className="weatherForecast">
                  <h3>7-Day Weather Forecast</h3>
                  <div className="forecastGrid">
                    {[...Array(7)].map((_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() + i);
                      
                      return (
                        <div className="forecastDay" key={i}>
                          <div className="date">{date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</div>
                          <div className="icon">{i % 2 === 0 ? '☀️' : '🌧️'}</div>
                          <div className="temp">{Math.floor(20 + Math.random() * 10)}°C</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="yieldPrediction">
                  <h3>Yield Prediction</h3>
                  <div className="predictionDetails">
                    <div className="predictionPercentage">{yieldPrediction.current}</div>
                    <div className={`predictionTrend ${yieldPrediction.trend}`}>
                      {yieldPrediction.trend === "increasing" && "Increasing"}
                      {yieldPrediction.trend === "decreasing" && "Decreasing"}
                      {yieldPrediction.trend === "stable" && "Stable"}
                    </div>
                  </div>
                  <div className="predictionRecommendation">
                    <strong>Recommendation:</strong> {yieldPrediction.recommendation}
                  </div>
                </div>
                
                <div className="actionButtons">
                  <button className="actionButton">
                    <span className="actionIcon">🔔</span>
                    Set Reminders
                  </button>
                  <button className="actionButton">
                    <span className="actionIcon">📊</span>
                    View Detailed Report
                  </button>
                  <button className="actionButton" onClick={() => setShowDataForm(true)}>
                    <span className="actionIcon">📝</span>
                    Log Harvest Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HarvestPlanPage;