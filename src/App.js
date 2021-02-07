import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import alertSound from "./happy-bell-alert.wav";
import useSound from "use-sound";

function padTime(time) {
  return time.toString().padStart(2, "0");
}

// function playAudio() {
//   const audioEl = "./happy-bell-alert.wav";
//   audioEl.play();
// }

export default function App() {
  const [title, setTitle] = useState("Time to focus!");
  const [timeLeft, setTimeLeft] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [breakTime, setBreakTime] = useState(false);
  const [cycleIndex, setCycleIndex] = useState(1);
  // const [backgroundColor, setBackgroundColor] = useState("red");
  let intervalRef = useRef(null);

  useEffect(() => {
    console.log("cycleIndex:", cycleIndex);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    // setTitle("Ready to go another round?");
    if (cycleIndex % 8 === 0) {
      setTimeLeft(20 * 60);
      setTitle("Take a break!");
    } else if (cycleIndex % 2 !== 0) {
      setTimeLeft(25 * 60);
      setTitle("Time to focus!");
    } else {
      setTimeLeft(5 * 60);
      setTitle("Take a break!");
    }
    // setTimeLeft(25 * 60);
    if (cycleIndex > 1) {
      startTimer();
    }
  }, [cycleIndex]);

  // useEffect(() => {
  //   console.log("break time?", breakTime);
  //   if (breakTime) {
  //     setBackgroundColor("blue");
  //   } else {
  //     setBackgroundColor("red");
  //   }
  // }, [breakTime]);

  function startTimer() {
    if (intervalRef.current != null) return;

    if (cycleIndex % 8 === 0) {
      setTitle("Take a break!");
      document.title = "Break time";
    } else if (cycleIndex % 2 !== 0) {
      setTitle("Time to focus!");
      document.title = "Focus time";
    } else {
      setTitle("Take a break!");
      document.title = "Break time";
    }
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTimeLeft((timeLeft) => {
        if (timeLeft >= 1) return timeLeft - 1;
        alert();
        setCycleIndex(cycleIndex + 1);
        setBreakTime(!breakTime);
        // resetTimer();
        // return 0;
      });
    }, 1000);
  }

  function stopTimer() {
    if (intervalRef.current == null) return;
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setTitle("Keep it up!");
    setIsRunning(false);
  }

  function resetTimer() {
    console.log("Timer is resetting");

    console.log("cycleIndex:", cycleIndex);
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    // setTitle("Ready to go another round?");
    setCycleIndex(1);
    setBreakTime(false);
    setTimeLeft(25 * 60);
    setIsRunning(false);
  }

  const [alert] = useSound(alertSound, { volume: 0.25 });

  const minutes = padTime(Math.floor(timeLeft / 60));
  const seconds = padTime(timeLeft - minutes * 60);

  return (
    <div className="app" id={breakTime ? "background-blue" : "background-red"}>
      <h2>{title}</h2>

      <div className="timer">
        <span>{minutes}</span>
        <span>:</span>
        <span>{seconds}</span>
      </div>

      <div className="buttons">
        {!isRunning && <button onClick={startTimer}>Start</button>}
        {isRunning && <button onClick={stopTimer}>Pause</button>}
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
}
