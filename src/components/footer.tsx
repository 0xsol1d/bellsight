import React, { useRef } from "react";
import { useRouter } from "next/navigation";

import { AlertComponent } from "../components";

export const Footer = () => {
  const alertRef = useRef<{ showAlert: (msg: string) => void }>(null);
  const handleAlert = (message: string) => {
    alertRef.current?.showAlert(message);
  };

  const copyAddress = async (val: any) => {
    await navigator.clipboard.writeText(val);
    handleAlert("Copied donate address");
  };

  const router = useRouter();
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-base-300 p-2">
      <div className="flex justify-between">
        <a
          href="https://github.com/0xsol1id/bellsight"
          target="_blank"
          className="mr-4"
        >
          <img src="/github.png" className="h-8" />
        </a>
        <a href="https://nintondo.io" target="_blank">
          <div className="lg:text-lg text-xs text-center flex items-center hover:text-blue-500">
            V0.1.9 - powered by <img src="/nintondo.png" className="lg:h-8 h-6" />
            INTONDO.IO
          </div>
        </a>
        <div className="flex space-x-3">
          <a href="https://bellscoin.com" target="_blank">
            <img src="/home.png" className="h-8" />
          </a>
          <a
            href="https://discord.com/invite/wXUXhkRQts"
            target="_blank"
            className="hidden lg:block"
          >
            <img src="/discord.png" className="h-8" />
          </a>

          <a
            href="https://bitcointalk.org/index.php?topic=349695.0"
            target="_blank"
            className="hidden lg:block"
          >
            <img src="/btc_logo.png" className="h-8" />
          </a>
        </div>
      </div>
      <AlertComponent ref={alertRef} />
    </div>
  );
};
