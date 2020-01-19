import { useState, useRef } from 'react';

const calculate = (times: [number, number, number], diff: number) => {
  const timesUpdated = [...times] as [number, number, number];

  timesUpdated[2] += diff / 10;

  if (timesUpdated[2] >= 100) {
    timesUpdated[1] += 1;
    timesUpdated[2] -= 100;
  }

  if (timesUpdated[1] >= 60) {
    timesUpdated[0] += 1;
    timesUpdated[1] -= 60;
  }

  return timesUpdated;
}

export default function useStopWatch() {

  const [times, setTimes] = useState<[number, number, number]>([0, 0, 0]);
  const [isRunning, setIsRunning] = useState(false);
  const previousTimeRef = useRef<number>();
  const requestRef = useRef<number>();

  function start() {
    setIsRunning(true);
    previousTimeRef.current = Date.now();
    setTimes([0, 0, 0]);
    requestAnimationFrame(step);
  }

  function step(timestamp: number) {
    if (!previousTimeRef.current) {
      return;
    }

    setTimes((times) => calculate(times, timestamp - previousTimeRef.current));
    previousTimeRef.current = timestamp;
    requestRef.current = requestAnimationFrame(step);
  }

  function stop() {
    previousTimeRef.current = null;
    setTimes([0, 0, 0]);
    cancelAnimationFrame(requestRef.current);
    setIsRunning(false);
  }

  return { times, start, stop, isRunning };
}