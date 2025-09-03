import "./App.css";
import Calculator from "./Calculator"; // adjust the path as needed
import ParityCalculator from "./ParityCalculator";

function App() {
  return (
    <div className="App">
      <header>
        <div>
          <ParityCalculator />
          <Calculator />
        </div>
      </header>
    </div>
  );
}

export default App;
