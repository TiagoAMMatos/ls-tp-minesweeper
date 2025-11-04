import { useState, useEffect } from "react";

function Timer({ onTimer }) {
  const [seconds, setSeconds] = useState(0);
  const [idInterval, setIdInterval] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);
    setIdInterval(interval);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    onTimer(seconds, idInterval);
  }, [seconds, onTimer, idInterval]);

  return <>{seconds}</>;
}

export default Timer;
