import { useEffect, useState } from "react";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { toastStyles } from "../utils/styles";
import { SATS_PER_BELL, ESPLORA_API, BELLSIGHT_API } from "@/utils/consts";

export const Navbar = () => {
  const router = useRouter();
  const [value, setValue] = useState<any>("");

  const [theme, setTheme] = useState<"nord" | "night">("night");

  const toggleTheme = () => {
    setTheme(theme === "night" ? "nord" : "night");
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      Search(value);
    }
  };

  const Search = async (input: any) => {
    if (isNaN(input)) {
      if (value.length == 64) {
        await fetch(ESPLORA_API + "tx/" + input).then((res) => {
          if (res.status == 404) router.push("/block/" + value);
          else router.push("/tx/" + value);
        });
      } else if (value.length <= 35 || value.includes("bel1")) {
        if (value.includes(".")) {
          await fetch(BELLSIGHT_API + "name/" + input)
            .then((res) => res.json())
            .then((result) => {
              if (result && result.length > 0 && result[0].holder !== undefined)
                router.push("/address/" + result[0].holder);
              else
                toast.error("Name not found", toastStyles)
            });
        } else router.push("/address/" + value);
      }
    } else {
      router.push("/block/" + value);
    }
  };

  // initially set the theme and "listen" for changes to apply them to the HTML tag
  useEffect(() => {
    document.querySelector("html")?.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="bg-base-300 w-full">
      <div className="navbar static justify-between">
        <div className="flex">
          <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex justify-between items-center">
              <label
                htmlFor="my-drawer"
                className="btn btn-ghost drawer-button"
              >
                <img src="/menu.png" alt="" className="h-8" />
              </label>

              <Link passHref href={`/`} className="">
                <img src="/logo1.png" alt="" className="h-8" />
              </Link>
            </div>
            <div className="drawer-side">
              <label
                htmlFor="my-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <ul className="menu bg-base-200 min-h-full overflow-y-hidden w-60 lg:w-80 text-xl flex flex-col justify-between text-center">
                <div>
                  <li className="flex items-center">
                    <Link
                      passHref
                      href={`/`}
                      className="hover:bg-gray-800 rounded p-1 lg:p-4 w-full justify-center"
                    >
                      HOME
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <Link
                      passHref
                      href={`/stats`}
                      className="hover:bg-gray-800 rounded p-1 lg:p-4 w-full justify-center"
                    >
                      STATS
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <Link
                      passHref
                      href={`/blocks`}
                      className="hover:bg-gray-800 rounded p-1 lg:p-4 w-full justify-center"
                    >
                      LATEST BLOCKS
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <Link
                      passHref
                      href={`/holders`}
                      className="hover:bg-gray-800 rounded p-1 lg:p-4 w-full justify-center"
                    >
                      TOP HOLDERS
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <Link
                      passHref
                      href={`/tokens`}
                      className="hover:bg-gray-800 rounded p-1 lg:p-4 w-full justify-center"
                    >
                      TOKENS
                    </Link>
                  </li>
                </div>
                <div className="text-xs lg:text-xl">
                  <a
                    href="https://github.com/0xsol1d/bellsight"
                    target="_blank"
                  >
                    <div className="grid grid-cols-4 items-center justify-center w-full hover:bg-slate-800 rounded p-1 lg:p-4">
                      <img src="/github.png" className="h-8" />
                      <div className="ml-2 col-span-3">BELLSIGHT GITHUB</div>
                    </div>
                  </a>
                  <a
                    href="https://docs.bellsight.xyz"
                    target="_blank"
                    className=""
                  >
                    <div className="grid grid-cols-4 items-center justify-center w-full hover:bg-slate-800 rounded p-1 lg:p-4">
                      <img src="/gitbook.png" className="h-8" />
                      <div className="ml-2 col-span-3">BELLSIGHT MANUAL</div>
                    </div>
                  </a>
                </div>
                <div className="text-xs lg:text-xl">
                  <a href="https://bellscoin.com" target="_blank">
                    <div className="grid grid-cols-4 w-full items-center hover:bg-slate-800 rounded p-1 lg:p-4">
                      <img src="/bellslogo.png" className="h-8" />
                      <div className="ml-2 col-span-3">BELLSCOIN WEBSITE</div>
                    </div>
                  </a>
                  <a
                    href="https://discord.com/invite/wXUXhkRQts"
                    target="_blank"
                  >
                    <div className="grid grid-cols-4 items-center w-full hover:bg-slate-800 rounded p-1 lg:p-4">
                      <img src="/discord.png" className="h-8" />
                      <div className="ml-2 col-span-3">BELLSCOIN DISCORD</div>
                    </div>
                  </a>

                  <a
                    href="https://bitcointalk.org/index.php?topic=349695.0"
                    target="_blank"
                  >
                    <div className="grid grid-cols-4 w-full items-center hover:bg-slate-800 rounded p-1 lg:p-4">
                      <img src="/btc_logo.png" className="h-8" />
                      <div className="ml-2 col-span-3">BICOINTALK</div>
                    </div>
                  </a>
                </div>
                <div className="">
                  <label className="swap swap-rotate ml-4 relative mb-10">
                    <input onClick={toggleTheme} type="checkbox" />
                    <div className="swap-off">
                      <svg
                        viewBox="0 0 64 64"
                        width="32px"
                        height="32px"
                        preserveAspectRatio="xMidYMid meet"
                      >
                        <g
                          transform="translate(0.000000,64.000000) scale(0.100000,-0.100000)"
                          fill="#FFFFFF"
                          stroke="none"
                        >
                          <path d="M203 559 c-50 -25 -109 -87 -131 -138 -24 -55 -21 -157 7 -213 25 -54 87 -113 140 -136 48 -20 155 -20 204 2 83 36 146 120 161 211 10 62 -3 73 -61 52 -62 -22 -95 -22 -142 3 -71 36 -92 92 -79 210 3 21 -2 25 -27 28 -16 1 -49 -7 -72 -19z" />
                        </g>
                      </svg>
                    </div>
                    <div className="swap-on">
                      <svg
                        viewBox="0 0 50 50"
                        width="32px"
                        height="32px"
                        fill="#000000"
                      >
                        <path d="M 24.90625 3.96875 C 24.863281 3.976563 24.820313 3.988281 24.78125 4 C 24.316406 4.105469 23.988281 4.523438 24 5 L 24 11 C 23.996094 11.359375 24.183594 11.695313 24.496094 11.878906 C 24.808594 12.058594 25.191406 12.058594 25.503906 11.878906 C 25.816406 11.695313 26.003906 11.359375 26 11 L 26 5 C 26.011719 4.710938 25.894531 4.433594 25.6875 4.238281 C 25.476563 4.039063 25.191406 3.941406 24.90625 3.96875 Z M 10.65625 9.84375 C 10.28125 9.910156 9.980469 10.183594 9.875 10.546875 C 9.769531 10.914063 9.878906 11.304688 10.15625 11.5625 L 14.40625 15.8125 C 14.648438 16.109375 15.035156 16.246094 15.410156 16.160156 C 15.78125 16.074219 16.074219 15.78125 16.160156 15.410156 C 16.246094 15.035156 16.109375 14.648438 15.8125 14.40625 L 11.5625 10.15625 C 11.355469 9.933594 11.054688 9.820313 10.75 9.84375 C 10.71875 9.84375 10.6875 9.84375 10.65625 9.84375 Z M 39.03125 9.84375 C 38.804688 9.875 38.59375 9.988281 38.4375 10.15625 L 34.1875 14.40625 C 33.890625 14.648438 33.753906 15.035156 33.839844 15.410156 C 33.925781 15.78125 34.21875 16.074219 34.589844 16.160156 C 34.964844 16.246094 35.351563 16.109375 35.59375 15.8125 L 39.84375 11.5625 C 40.15625 11.265625 40.246094 10.800781 40.0625 10.410156 C 39.875 10.015625 39.460938 9.789063 39.03125 9.84375 Z M 25 15 C 19.484375 15 15 19.484375 15 25 C 15 30.515625 19.484375 35 25 35 C 30.515625 35 35 30.515625 35 25 C 35 19.484375 30.515625 15 25 15 Z M 4.71875 24 C 4.167969 24.078125 3.78125 24.589844 3.859375 25.140625 C 3.9375 25.691406 4.449219 26.078125 5 26 L 11 26 C 11.359375 26.003906 11.695313 25.816406 11.878906 25.503906 C 12.058594 25.191406 12.058594 24.808594 11.878906 24.496094 C 11.695313 24.183594 11.359375 23.996094 11 24 L 5 24 C 4.96875 24 4.9375 24 4.90625 24 C 4.875 24 4.84375 24 4.8125 24 C 4.78125 24 4.75 24 4.71875 24 Z M 38.71875 24 C 38.167969 24.078125 37.78125 24.589844 37.859375 25.140625 C 37.9375 25.691406 38.449219 26.078125 39 26 L 45 26 C 45.359375 26.003906 45.695313 25.816406 45.878906 25.503906 C 46.058594 25.191406 46.058594 24.808594 45.878906 24.496094 C 45.695313 24.183594 45.359375 23.996094 45 24 L 39 24 C 38.96875 24 38.9375 24 38.90625 24 C 38.875 24 38.84375 24 38.8125 24 C 38.78125 24 38.75 24 38.71875 24 Z M 15 33.875 C 14.773438 33.90625 14.5625 34.019531 14.40625 34.1875 L 10.15625 38.4375 C 9.859375 38.679688 9.722656 39.066406 9.808594 39.441406 C 9.894531 39.8125 10.1875 40.105469 10.558594 40.191406 C 10.933594 40.277344 11.320313 40.140625 11.5625 39.84375 L 15.8125 35.59375 C 16.109375 35.308594 16.199219 34.867188 16.039063 34.488281 C 15.882813 34.109375 15.503906 33.867188 15.09375 33.875 C 15.0625 33.875 15.03125 33.875 15 33.875 Z M 34.6875 33.875 C 34.3125 33.941406 34.011719 34.214844 33.90625 34.578125 C 33.800781 34.945313 33.910156 35.335938 34.1875 35.59375 L 38.4375 39.84375 C 38.679688 40.140625 39.066406 40.277344 39.441406 40.191406 C 39.8125 40.105469 40.105469 39.8125 40.191406 39.441406 C 40.277344 39.066406 40.140625 38.679688 39.84375 38.4375 L 35.59375 34.1875 C 35.40625 33.988281 35.148438 33.878906 34.875 33.875 C 34.84375 33.875 34.8125 33.875 34.78125 33.875 C 34.75 33.875 34.71875 33.875 34.6875 33.875 Z M 24.90625 37.96875 C 24.863281 37.976563 24.820313 37.988281 24.78125 38 C 24.316406 38.105469 23.988281 38.523438 24 39 L 24 45 C 23.996094 45.359375 24.183594 45.695313 24.496094 45.878906 C 24.808594 46.058594 25.191406 46.058594 25.503906 45.878906 C 25.816406 45.695313 26.003906 45.359375 26 45 L 26 39 C 26.011719 38.710938 25.894531 38.433594 25.6875 38.238281 C 25.476563 38.039063 25.191406 37.941406 24.90625 37.96875 Z" />
                      </svg>
                    </div>
                  </label>
                  <a
                    href="https://nintondo.io"
                    target="_blank"
                    className="flex flex-col items-center"
                  >
                    <div className="text-xs flex items-center hover:text-blue-500">
                      V0.2.0 - powered by
                      <img src="/nintondo.png" className="lg:h-8 h-6" />
                      INTONDO.IO
                    </div>
                  </a>
                </div>
              </ul>
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
          <input
            type="text"
            placeholder="Search tx/address/name/block"
            className="font-pixel input w-[30rem] lg:input-md rounded-lg bg-base-200"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            onKeyPress={handleKeyPress}
          />
          <button
            className="btn ml-4 rounded-lg btn-sm lg:btn-md btn-secondary"
            onClick={() => Search(value)}
          >
            <img src="/logo2.png" alt="" className="h-8 lg:hidden" />
            <div className="hidden lg:block">Search</div>
          </button>
        </div>
        <Link passHref href={`/wallet`} className="">
          <svg viewBox="0 0 512 512" width="32px" height="32px" fill="#FFFFFF">
            <path d="M435.2,384a64.19,64.19,0,0,1-64,64H64A64.19,64.19,0,0,1,0,384V128A64.19,64.19,0,0,1,64,64H371.2a64.19,64.19,0,0,1,64,64v38.4H396.8c-49.28,0-89.6,40.32-89.6,89.6s40.32,89.6,89.6,89.6h38.4ZM448,64H433.79a89.29,89.29,0,0,1,27,64v38.4H512V128A64.19,64.19,0,0,0,448,64Zm12.8,320a89.29,89.29,0,0,1-27,64H448a64.19,64.19,0,0,0,64-64V345.6H460.8Zm-64-192H512V320H396.8a64,64,0,1,1,0-128Zm0,38.4A25.6,25.6,0,1,0,422.4,256,25.6,25.6,0,0,0,396.8,230.4Z" />
          </svg>
        </Link>
      </div>
      <div className="lg:hidden flex justify-between p-1">
        <input
          type="text"
          placeholder="tx/address/name/block"
          className="font-pixel input input-md rounded-lg bg-base-200"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onKeyPress={handleKeyPress}
        />
        <button
          className="btn ml-4 rounded-lg btn-md btn-secondary"
          onClick={() => Search(value)}
        >
          <img src="/logo2.png" alt="" className="h-8" />
          <div className="">Search</div>
        </button>
      </div>
    </div>
  );
};
