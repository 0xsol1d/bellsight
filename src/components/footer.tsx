
import { useEffect, useState } from "react";
import React from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation'

export const Footer = () => {

    const copyAddress = async (val: any) => {
        await navigator.clipboard.writeText(val);
    }

    const router = useRouter()
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-base-300 p-2">
            <div className="flex justify-between lg:justify-normal mb-1"><div className="text-xs lg:mr-2">Donate to </div>
                <button className="text-xs text-blue-500 hover:text-blue-300" onClick={() => copyAddress("BJTuNnftKyYZpFnwwQkSbWyskSo3mHr78L")}>
                    BJTuNnftKyYZpFnwwQkSbWyskSo3mHr78L
                </button>
            </div>
            <div className="flex justify-between">
                <div className="lg:text-lg text-xs">V0.1.4 - powered by NINTONDO.IO</div>
                <div className="flex space-x-3">
                    <a href="https://github.com/0xsol1id/bellsight" target="_blank" className="mr-4"><img src="/github.png" className="h-8" /></a>
                    <a href="https://bellscoin.com" target="_blank"><img src="/home.png" className="h-8" /></a>
                    <a href="https://discord.com/invite/wXUXhkRQts" target="_blank"><img src="/discord.png" className="h-8" /></a>
                    <a href="https://nintondo.io" target="_blank"><img src="/nintondo.png" className="h-8" /></a>
                    <a href="https://bitcointalk.org/index.php?topic=349695.0" target="_blank"><img src="/btc_logo.png" className="h-8" /></a>
                </div>
            </div>
        </div>
    )
}