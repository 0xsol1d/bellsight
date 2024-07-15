
import { useEffect, useState } from "react";
import React from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation'

export const Footer = () => {

    const router = useRouter()
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-base-300 p-2 flex justify-between">
            <div className="lg:text-lg text-xs">V0.1 - powered by NINTONDO.IO</div>            
            <div className="flex space-x-3">
                <a href="https://bellscoin.com" target="_blank"><img src="/home.png" className="h-8" /></a>
                <a href="https://discord.com/invite/wXUXhkRQts" target="_blank"><img src="/discord.png" className="h-8" /></a>
                <a href="https://nintondo.io" target="_blank"><img src="/nintondo.png" className="h-8" /></a>
                <a href="https://bitcointalk.org/index.php?topic=349695.0" target="_blank"><img src="/btc_logo.png" className="h-8" /></a>
            </div>
        </div>
    )
}