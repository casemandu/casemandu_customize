'use client'
import React, { useState, useRef } from 'react';

function PromoCountdown({ promos, currentPromo }) {
  const [countdown, setCountdown] = useState('');
  const intervalRef = useRef(null);

  const getCountdown = () => {
    const date = new Date(promos[currentPromo].expiresAt);
    const now = new Date();
    const diff = date - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
  };

  // Start the interval when the component is mounted
  const startCountdown = () => {
    if (promos.length > 0 && !intervalRef.current) {
      getCountdown(); // Run immediately to avoid a delay
      intervalRef.current = setInterval(() => {
        getCountdown();
      }, 1000);
    }
  };

  // Clear the interval when the component is unmounted
  const stopCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Start the interval manually
  React.useEffect(() => {
    startCountdown();
    return stopCountdown; // Cleanup on unmount
  }, [promos, currentPromo]);

  return (
      <p>{countdown}</p>
  );
}

export default PromoCountdown;
