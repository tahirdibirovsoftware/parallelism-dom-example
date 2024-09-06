import React, { useEffect, useRef, useState, useCallback } from "react";
import { calculatePrimes } from "./cpuIntensive";
import { Thread } from "parallel-memo-dom";
import './App.css';
import { generateColor } from "./colorGenerator";

const App: React.FC = () => {
  const [background, setBackground] = useState<string>('#000000');
  const [primeNumbers, setPrimeNumbers] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (ref.current) {
        setBackground(generateColor());
        ref.current.style.backgroundColor = background;
      }
    }, 500);

    return () => clearTimeout(timeOut);
  }, [background]);



  const handleCompute = useCallback(() => {
    Thread.exec(calculatePrimes, 50000000)
      .then(data => setPrimeNumbers(data.length))
      .catch(error => console.error("Computation failed:", error));
  }, []);



    // const handleCompute = ()=> setPrimeNumbers(calculatePrimes(50000000).length)



  const handleReset = useCallback(() => {
    setPrimeNumbers(0);
  }, []);

  return (
    <div ref={ref} className="App">
      <h1>CPU Intensive Operation</h1>
      <h2>{primeNumbers}</h2>
      <button onClick={handleCompute}>Compute</button>
      <button onClick={handleReset} className="reset">Reset</button>
    </div>
  );
};

export default App;