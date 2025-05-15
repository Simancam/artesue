"use client";

import {BsWhatsapp } from "react-icons/bs";

interface WhatsappButtonProps {
  phoneNumber: string;
}

const WhatsappButton = ({ phoneNumber }: WhatsappButtonProps) => {
  return (
    <button
      onClick={() => window.open(`https://wa.me/${phoneNumber}`, "_blank")}
      className="fixed bottom-6 right-6 z-50 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg transition-transform hover:scale-105 p-4"
    >
      <BsWhatsapp className="h-5 w-5" />
    </button>
  );
};

export default WhatsappButton;
