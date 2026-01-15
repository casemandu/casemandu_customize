"use client";
import React from "react";

function Payment({ payment, activePayment, setActivePayment }) {
  return (
    <div
      onClick={() => {
        setActivePayment(payment.id);
      }}
      key={payment.id}
      className={`flex flex-col items-center gap-2 p-4 border rounded-md 
                    ${
                      activePayment === payment.id
                        ? "border-purple"
                        : "border-transparent"
                    }
                    `}
    >
      <img
        src={payment.image}
        alt={payment.name}
        className="w-20 h-20 object-cover rounded-md"
      />
      <p>
        <strong>{payment.name}</strong>
      </p>
    </div>
  );
}

export default Payment;
