import React, { useState } from "react";
import "./Calculator.css";

const multipliers = {
  goldOpt: { CE: -3, PE: 3, IU: -15, Mini: -2 },
  goldFut: { Fut: -3, IU: -15, Mini: -2 },
  silverOpt: { CE: -5, PE: 5, IU: -8, Mini: -2 },
  silverFut: { Fut: -5, IU: -8, Mini: -2 },
};

const tableDefs = {
  goldOpt: { label: "Gold Options", cols: ["CME", "CE", "PE", "IU", "Mini"] },
  goldFut: { label: "Gold Future", cols: ["CME", "Fut", "IU", "Mini"] },
  silverOpt: {
    label: "Silver Options",
    cols: ["CME", "CE", "PE", "IU", "Mini"],
  },
  silverFut: { label: "Silver Future", cols: ["CME", "Fut", "IU", "Mini"] },
};

function fix(val) {
  if (val == null || val === "") return "";
  return parseFloat(val).toFixed(2).replace(/\.00$/, "");
}

export default function Calculator() {
  const [current, setCurrent] = useState("goldOpt");
  const [autoValues, setAutoValues] = useState({});
  const [userValues, setUserValues] = useState({});

  const def = tableDefs[current];
  const cols = def.cols;

  // Handler for CME input
  const handleAutoCME = (e) => {
    const value = e.target.value;
    let newAuto = { ...autoValues, CME: value };
    for (const c of cols) {
      if (c !== "CME") {
        newAuto[c] = value !== "" ? fix(value * multipliers[current][c]) : "";
      }
    }
    setAutoValues(newAuto);
  };

  // Handler for user input
  const handleUserInput = (c, e) => {
    setUserValues({ ...userValues, [c]: e.target.value });
  };

  // Render Table Rows
  const renderTable = () => (
    <table>
      <thead>
        <tr>
          {cols.map((c) => (
            <th key={c}>{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {cols.map((c) =>
            c === "CME" ? (
              <td key={c}>
                <input
                  type="number"
                  step="any"
                  value={autoValues["CME"] || ""}
                  onChange={handleAutoCME}
                />
              </td>
            ) : (
              <td key={c}>
                <input
                  type="number"
                  disabled
                  value={autoValues[c] !== undefined ? autoValues[c] : ""}
                />
              </td>
            )
          )}
        </tr>
        <tr>
          {cols.map((c) => (
            <td key={c}>
              <input
                type="number"
                step="any"
                value={userValues[c] !== undefined ? userValues[c] : ""}
                onChange={(e) => handleUserInput(c, e)}
              />
            </td>
          ))}
        </tr>
        <tr className="result-row">
          {cols.map((c) => (
            <td key={c}>
              {autoValues[c] !== undefined &&
              userValues[c] !== undefined &&
              userValues[c] !== ""
                ? fix(autoValues[c] - userValues[c])
                : ""}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );

  // Handle radio change
  const handleRadioChange = (e) => {
    setCurrent(e.target.value);
    setAutoValues({});
    setUserValues({});
  };

  const handleRefresh = () => {
    setAutoValues({});
    setUserValues({});
  };

  return (
    <div className="container">
      <h2>Gold/Silver Quantity</h2>
      <div className="radios">
        <label>
          <input
            type="radio"
            name="type"
            value="goldOpt"
            checked={current === "goldOpt"}
            onChange={handleRadioChange}
          />{" "}
          Gold Options
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="goldFut"
            checked={current === "goldFut"}
            onChange={handleRadioChange}
          />{" "}
          Gold Future
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="silverOpt"
            checked={current === "silverOpt"}
            onChange={handleRadioChange}
          />{" "}
          Silver Options
        </label>
        <label>
          <input
            type="radio"
            name="type"
            value="silverFut"
            checked={current === "silverFut"}
            onChange={handleRadioChange}
          />{" "}
          Silver Future
        </label>
      </div>
      {renderTable()}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button
          onClick={handleRefresh}
          style={{
            padding: "8px 16px",
            fontSize: "1rem",
            cursor: "pointer",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "#f4f4f4",
            marginBottom: "25px",
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
