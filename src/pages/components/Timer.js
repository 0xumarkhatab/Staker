import React, { useEffect, useState } from "react";
import { Box, HStack } from "@chakra-ui/react";
const Timer = ({ deadline, stakeTimeUpdator }) => {
  const [days, setDays] = React.useState(0);
  const [hours, setHours] = React.useState(0);
  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(50);

  const getTime = () => {
    const time = deadline - new Date();
    let totalSeconds = new Date(time).getSeconds();
    stakeTimeUpdator(totalSeconds);
    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  React.useEffect(() => {
    const interval = setInterval(() => getTime(deadline), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <HStack
      direction={["column", "column", "row"]}
      fontSize={"20px"}
      className="timer"
      role="timer"
    >
      {days && (
        <>
          {" "}
          <p id="day">{days}</p>
          <span className="text">Days</span>
        </>
      )}
      {hours && (
        <>
          <p id="hour">{hours}</p>
          <span className="text">Hours</span>
        </>
      )}
      {minutes && (
        <>
          <p id="minute">{minutes}</p>
          <span className="text">Minutes</span>
        </>
      )}
      {seconds && (
        <>
          <p id="second">{seconds}</p>
          <span className="text">Seconds</span>
        </>
      )}
    </HStack>
  );
};

export default Timer;
