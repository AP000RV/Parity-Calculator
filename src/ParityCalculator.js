import React, { useState } from "react";
import "./ParityCalculator.css"; // Optional but recommended

const commodityList = [
  { value: "gold", label: "Gold" },
  { value: "silver", label: "Silver" },
  { value: "crude", label: "Crude Oil" },
  { value: "natgas", label: "Natural Gas" },
];

const instrumentList = [
  { value: "Fut", label: "Futures" },
  { value: "Opt", label: "Options" },
];

export default function ParityCalculator() {
  // Step selectors
  const [selectedCommodity, setSelectedCommodity] = useState("");
  const [selectedInstrument, setSelectedInstrument] = useState("");
  // Input state
  const [cme, setCME] = useState("");
  const [iu, setIU] = useState("");
  const [mcxFut, setMcxFut] = useState("");
  const [strike, setStrike] = useState("");
  const [ce, setCE] = useState("");
  const [pe, setPE] = useState("");

  // Compute combo key for calculation
  const selectedType =
    selectedCommodity && selectedInstrument
      ? `${selectedCommodity}${selectedInstrument}`
      : "";

  const isOptions = selectedInstrument === "Opt";

  // Handler: Reset all fields
  const clearAll = () => {
    setCME("");
    setIU("");
    setMcxFut("");
    setStrike("");
    setCE("");
    setPE("");
  };

  // Handlers: Radio resets
  const handleCommodity = (value) => {
    setSelectedCommodity(value);
    setSelectedInstrument("");
    clearAll();
  };
  const handleInstrument = (value) => {
    setSelectedInstrument(value);
    clearAll();
  };

  // Calculation logic
  const calculateParity = () => {
    const cmeNum = parseFloat(cme);
    const iuNum = parseFloat(iu);
    if (!cmeNum || !iuNum || iuNum === 0) return "";

    let cmeRate = 0;

    if (selectedType === "goldFut" || selectedType === "goldOpt") {
      cmeRate = (cmeNum / 10) * 0.3199 * (10000 / iuNum);
    } else if (selectedType === "silverFut" || selectedType === "silverOpt") {
      cmeRate = (cmeNum / 1000) * 31.1035 * (10000 / iuNum);
    } else if (selectedType === "crudeFut" || selectedType === "crudeOpt") {
      cmeRate = (cmeNum / 100) * (10000 / iuNum);
    } else if (selectedType === "natgasFut" || selectedType === "natgasOpt") {
      cmeRate = (cmeNum / 1000) * (10000 / iuNum);
    } else {
      return "";
    }

    if (selectedInstrument === "Fut") {
      const mcxFutNum = parseFloat(mcxFut);
      if (isNaN(mcxFutNum)) return "";
      return (mcxFutNum - cmeRate).toFixed(2);
    } else if (selectedInstrument === "Opt") {
      const ceNum = parseFloat(ce);
      const peNum = parseFloat(pe);
      const strikeNum = parseFloat(strike);
      if ([ceNum, peNum, strikeNum].some((x) => isNaN(x))) return "";
      const mcxRate = ceNum - peNum + strikeNum;
      return (mcxRate - cmeRate).toFixed(2);
    }
    return "";
  };

  const parity = calculateParity();

  // UI
  return (
    <div
      className="container"
      style={{
        maxWidth: 600,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 10,
        boxShadow: "0 0 12px #ddd",
        padding: 24,
      }}
    >
      <h2>Parity Calculator</h2>
      {/* Step 1: Commodity */}
      <div className="radios">
        {commodityList.map((c) => (
          <label
            key={c.value}
            className={`radio-label${
              selectedCommodity === c.value ? " selected" : ""
            }`}
          >
            <input
              type="radio"
              name="commodity"
              value={c.value}
              checked={selectedCommodity === c.value}
              onChange={() => handleCommodity(c.value)}
            />
            {c.label}
          </label>
        ))}
      </div>
      {/* Step 2: Futures/Options */}
      {selectedCommodity && (
        <div className="radios" style={{ marginTop: 8 }}>
          {instrumentList.map((i) => (
            <label
              key={i.value}
              className={`radio-label${
                selectedInstrument === i.value ? " selected" : ""
              }`}
            >
              <input
                type="radio"
                name="instrument"
                value={i.value}
                checked={selectedInstrument === i.value}
                onChange={() => handleInstrument(i.value)}
              />
              {i.label}
            </label>
          ))}
        </div>
      )}
      {/* STEP 3: Input Fields */}
      {selectedType && (
        <div style={{ marginTop: 16 }}>
          {/* Render relevant inputs in a row */}
          <div
            className={
              isOptions ? "row-options input-row" : "row-cme-iu-fut input-row"
            }
          >
            <label>
              CME Price
              <input
                type="text"
                value={cme}
                onChange={(e) => setCME(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="CME"
              />
            </label>
            <label>
              IU Price
              <input
                type="text"
                value={iu}
                onChange={(e) => setIU(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="IU"
              />
            </label>
            {!isOptions && (
              <label>
                MCX FUT
                <input
                  type="text"
                  value={mcxFut}
                  onChange={(e) =>
                    setMcxFut(e.target.value.replace(/[^0-9.]/g, ""))
                  }
                  placeholder="MCX Future"
                />
              </label>
            )}
            {isOptions && (
              <>
                <label>
                  Strike
                  <input
                    type="text"
                    value={strike}
                    onChange={(e) =>
                      setStrike(e.target.value.replace(/[^0-9.]/g, ""))
                    }
                    placeholder="Strike"
                  />
                </label>
                <label>
                  CE
                  <input
                    type="text"
                    value={ce}
                    onChange={(e) =>
                      setCE(e.target.value.replace(/[^0-9.]/g, ""))
                    }
                    placeholder="CE"
                  />
                </label>
                <label>
                  PE
                  <input
                    type="text"
                    value={pe}
                    onChange={(e) =>
                      setPE(e.target.value.replace(/[^0-9.]/g, ""))
                    }
                    placeholder="PE"
                  />
                </label>
              </>
            )}
          </div>
        </div>
      )}
      {/* Parity Result */}
      {selectedType && (
        <div className="parity-result">
          Parity:{" "}
          {parity !== "" ? (
            <span>{parity}</span>
          ) : (
            <span>Please enter valid inputs</span>
          )}
        </div>
      )}
      {/* Reset Button */}
      <div style={{ marginTop: 20, textAlign: "center" }}>
        <button
          onClick={clearAll}
          style={{
            padding: "8px 16px",
            fontSize: "1rem",
            cursor: "pointer",
            borderRadius: "5px",
            border: "1px solid #ccc",
            backgroundColor: "#f4f4f4",
          }}
          disabled={!selectedType}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
