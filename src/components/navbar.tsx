
import { useEffect, useState } from "react";
import React from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation'

export const Navbar = () => {
    const router = useRouter()
    const [value, setValue] = useState<any>("");

    const handleKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            Search(value)
        }
      };

    const Search = async (input: any) => {
        if (isNaN(input)) {
            if (value.length == 64) {
                router.push("/tx/" + value);
            }
            else if (value.length <= 35) {
                router.push("/address/" + value);
            }
        }
        else {
            router.push("/block/" + value);
        }
    }

    return (
        <div className="navbar fixed lg:static flex justify-between bg-base-300">
            <div className="flex">
                <div className="dropdown">
                    <div tabIndex={0} className="btn btn-ghost rounded-lg btn-sm lg:btn-md"><img src="/menu.png" alt="" className="h-8" /></div>
                    <ul tabIndex={0} className="mt-1 text-md shadow menu dropdown-content bg-base-200 rounded border border-gray-500 w-[10rem]">
                        <Link passHref href={`/`} className="hover:bg-gray-800 rounded p-1">OVERVIEW</Link>
                        <Link passHref href={`/blocks`} className="hover:bg-gray-800 rounded p-1">LATEST BLOCKS</Link>
                        <Link passHref href={`/txs`} className="hover:bg-gray-800 rounded p-1">LATEST TX</Link>
                        <Link passHref href={`/holders`} className="hover:bg-gray-800 rounded p-1">TOP HOLDERS</Link>
                        <Link passHref href={`/tokens`} className="hover:bg-gray-800 rounded p-1">TOKENS</Link>
                    </ul>
                </div>
                <Link passHref href={`/`} className="hidden lg:block"><img src="/logo1.png" alt="" className="h-8"/></Link>
            </div>
            <div>
                <input
                    type="text"
                    placeholder="Search tx/address/block"
                    className="font-pixel input input-sm lg:input-md rounded-lg bg-base-200"
                    value={value}
                    onChange={(e) => { setValue(e.target.value) }}
                    onKeyPress={handleKeyPress}
                />                
                <button className="btn ml-4 rounded-lg btn-sm lg:btn-md" onClick={() => Search(value)}><img src="/logo2.png" alt="" className="h-8 lg:hidden"/><div className="hidden lg:block">Search</div></button>
            </div>
        </div>

    )
}