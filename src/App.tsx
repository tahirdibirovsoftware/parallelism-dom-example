import React, { useState, useCallback, useEffect } from 'react';
import { calculatePrimes } from './cpuIntensive';
import './App.css';
import { Thread } from 'parallel-memo-dom';

const TOTAL_RANGE = 34000000;

const App: React.FC = () => {
  const [mainThreadPrimes, setMainThreadPrimes] = useState<number>(0);
  const [isolatedThreadPrimes, setIsolatedThreadPrimes] = useState<number>(0);
  const [isComputing, setIsComputing] = useState<boolean>(false);
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setBackgroundColor(getRandomColor());
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  const getRandomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  };

  const computeOnMainThread = useCallback(() => {
    setIsComputing(true);
    setMainThreadPrimes(0);

    setTimeout(() => {
      const primes = calculatePrimes(TOTAL_RANGE);
      setMainThreadPrimes(primes.length);
      setIsComputing(false);
    }, 0);
  }, []);

  const computeOnIsolatedThread = useCallback(() => {
    setIsComputing(true);
    setIsolatedThreadPrimes(0);

    Thread.exec(calculatePrimes, TOTAL_RANGE)
      .then(primes => {
        setIsolatedThreadPrimes(primes.length);
        setIsComputing(false);
      })
      .catch(error => {
        console.error("Computation failed:", error);
        setIsComputing(false);
      });
  }, []);

  const handleReset = useCallback(() => {
    setMainThreadPrimes(0);
    setIsolatedThreadPrimes(0);
    setIsComputing(false);
  }, []);

  return (
    <div className="App" style={{ backgroundColor }}>
      <h1>CPU Intensive App</h1>
      
      <div className="computation-section">
        <h2>Main Thread: {mainThreadPrimes}</h2>
        <button onClick={computeOnMainThread} disabled={isComputing}>
          Compute on Main Thread
        </button>
      </div>

      <div className="computation-section">
        <h2>Isolated Thread: {isolatedThreadPrimes}</h2>
        <button onClick={computeOnIsolatedThread} disabled={isComputing}>
          Compute on Isolated Thread
        </button>
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