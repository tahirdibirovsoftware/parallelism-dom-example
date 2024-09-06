import React, { useEffect, useRef, useState } from "react";
import { generateColor } from "./colorGenerator";
import './App.css';
import { calculatePrimes } from "./cpuIntensive";
import { Thread } from "parallel-memo-dom";

const App: React.FC = () => {
  const [background, setBackground] = useState<string>('#000000');
  const [primeNumbers, setPrimeNumbers] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.backgroundColor = background;
    }
  }, [background]);



  const handleColorChange = () => {
    const newColor = generateColor();
    setBackground(newColor);
  };

  return (
    <div ref={ref} className="App">
      <h1>CPU Intensive operation</h1>
      <h2>{primeNumbers}</h2>
      <button onClick={handleColorChange}>Change Background</button>
      <button onClick={()=>Thread.exec(calculatePrimes, 50000000).then(data=>setPrimeNumbers(data.length))}>Compute</button>
      <button onClick={()=>setPrimeNumbers(0)} className="reset">Reset</button>
    </div>
  );
};

export default App;