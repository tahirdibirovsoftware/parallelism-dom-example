import React, { useState, useCallback, useEffect } from 'react';
import { calculatePrimes } from './cpuIntensive';
import { Thread } from 'parallel-memo-dom';
import { generateColor } from './colorGenerator';
import './App.css';

const TOTAL_RANGE = 35000000;

const App: React.FC = () => {
  const [mainThreadPrimes, setMainThreadPrimes] = useState<number>(0);
  const [isolatedThreadPrimes, setIsolatedThreadPrimes] = useState<number>(0);
  const [isComputingMain, setIsComputingMain] = useState<boolean>(false);
  const [isComputingIsolated, setIsComputingIsolated] = useState<boolean>(false);
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBackgroundColor(generateColor());
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  //Compute on Main Thread
  const computeOnMainThread = useCallback(() => {
    setIsComputingMain(true);
    setMainThreadPrimes(0);

    setTimeout(() => {
      const primes = calculatePrimes(TOTAL_RANGE);
      setMainThreadPrimes(primes.length);
      setIsComputingMain(false);
    }, 0);
  }, []);
  
  //Compute on Isolate Thread
  const computeOnIsolatedThread = useCallback(() => {
    setIsComputingIsolated(true);
    setIsolatedThreadPrimes(0);

    Thread.exec(calculatePrimes, TOTAL_RANGE)
      .then(primes => {
        setIsolatedThreadPrimes(primes.length);
        setIsComputingIsolated(false);
      })
      .catch(error => {
        console.error("Computation failed:", error);
        setIsComputingIsolated(false);
      });
  }, []);

  const handleReset = useCallback(() => {
    setMainThreadPrimes(0);
    setIsolatedThreadPrimes(0);
    setIsComputingMain(false);
    setIsComputingIsolated(false);
  }, []);

  const isComputing = isComputingMain || isComputingIsolated;

  return (
    <div className="App" style={{ backgroundColor }}>
      <h1>CPU-bound App</h1>
      
      <div className="computation-section">
        <h2>Main Thread: {mainThreadPrimes}</h2>
        <button onClick={computeOnMainThread} disabled={isComputing}>
          Compute on Main Thread
        </button>
        {isComputingMain && <p className="computing-indicator">Computing...</p>}
      </div>

      <div className="computation-section">
        <h2>Isolated Thread: {isolatedThreadPrimes}</h2>
        <button onClick={computeOnIsolatedThread} disabled={isComputing}>
          Compute on Isolated Thread
        </button>
        {isComputingIsolated && <p className="computing-indicator">Computing...</p>}
      </div>

      <div className="reset-section">
        <button onClick={handleReset} disabled={isComputing}>
          Reset
        </button>
      </div>

      <p>Background color changes every 500ms. Watch how it freezes during main thread computation.</p>
    </div>
  );
};

export default App;