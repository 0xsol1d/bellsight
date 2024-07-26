import { useEffect, useState } from "react";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
        await fetch("https://api.nintondo.io/api/tx/" + input).then((res) => {
          if (res.status == 404) router.push("/block/" + value);
          else router.push("/tx/" + value);
        });
      } else if (value.length <= 35) {
        router.push("/address/" + value);
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
    <div className="navbar fixed lg:static flex justify-between bg-base-300">
      <div className="flex">
        <div className="dropdown">
          <div
            tabIndex={0}
            className="btn btn-ghost rounded-lg btn-sm lg:btn-md"
          >
            <img src="/menu.png" alt="" className="h-8" />
          </div>
          <ul
            tabIndex={0}
            className="mt-1 text-lg shadow menu dropdown-content bg-base-200 rounded border border-gray-500 w-[10rem]"
          >
            <Link passHref href={`/`} className="hover:bg-gray-800 rounded p-1">
              OVERVIEW
            </Link>
            <Link
              passHref
              href={`/stats`}
              className="hover:bg-gray-800 rounded p-1"
            >
              STATS
            </Link>
            <Link
              passHref
              href={`/blocks`}
              className="hover:bg-gray-800 rounded p-1"
            >
              LATEST BLOCKS
            </Link>
            <Link
              passHref
              href={`/holders`}
              className="hover:bg-gray-800 rounded p-1"
            >
              TOP HOLDERS
            </Link>
            <Link
              passHref
              href={`/tokens`}
              className="hover:bg-gray-800 rounded p-1"
            >
              TOKENS
            </Link>
          </ul>
        </div>
        <Link passHref href={`/`} className="hidden lg:block">
          <img src="/logo1.png" alt="" className="h-8" />
        </Link>
        <label className="swap swap-rotate ml-4">
          <input onClick={toggleTheme} type="checkbox"/>
          <div className="swap-off">
            <svg
              xmlns="http://www.w3.org/2000/svg"
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
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              width="32px"
              height="32px"
              fill="#000000"
            >
              <path d="M 24.90625 3.96875 C 24.863281 3.976563 24.820313 3.988281 24.78125 4 C 24.316406 4.105469 23.988281 4.523438 24 5 L 24 11 C 23.996094 11.359375 24.183594 11.695313 24.496094 11.878906 C 24.808594 12.058594 25.191406 12.058594 25.503906 11.878906 C 25.816406 11.695313 26.003906 11.359375 26 11 L 26 5 C 26.011719 4.710938 25.894531 4.433594 25.6875 4.238281 C 25.476563 4.039063 25.191406 3.941406 24.90625 3.96875 Z M 10.65625 9.84375 C 10.28125 9.910156 9.980469 10.183594 9.875 10.546875 C 9.769531 10.914063 9.878906 11.304688 10.15625 11.5625 L 14.40625 15.8125 C 14.648438 16.109375 15.035156 16.246094 15.410156 16.160156 C 15.78125 16.074219 16.074219 15.78125 16.160156 15.410156 C 16.246094 15.035156 16.109375 14.648438 15.8125 14.40625 L 11.5625 10.15625 C 11.355469 9.933594 11.054688 9.820313 10.75 9.84375 C 10.71875 9.84375 10.6875 9.84375 10.65625 9.84375 Z M 39.03125 9.84375 C 38.804688 9.875 38.59375 9.988281 38.4375 10.15625 L 34.1875 14.40625 C 33.890625 14.648438 33.753906 15.035156 33.839844 15.410156 C 33.925781 15.78125 34.21875 16.074219 34.589844 16.160156 C 34.964844 16.246094 35.351563 16.109375 35.59375 15.8125 L 39.84375 11.5625 C 40.15625 11.265625 40.246094 10.800781 40.0625 10.410156 C 39.875 10.015625 39.460938 9.789063 39.03125 9.84375 Z M 25 15 C 19.484375 15 15 19.484375 15 25 C 15 30.515625 19.484375 35 25 35 C 30.515625 35 35 30.515625 35 25 C 35 19.484375 30.515625 15 25 15 Z M 4.71875 24 C 4.167969 24.078125 3.78125 24.589844 3.859375 25.140625 C 3.9375 25.691406 4.449219 26.078125 5 26 L 11 26 C 11.359375 26.003906 11.695313 25.816406 11.878906 25.503906 C 12.058594 25.191406 12.058594 24.808594 11.878906 24.496094 C 11.695313 24.183594 11.359375 23.996094 11 24 L 5 24 C 4.96875 24 4.9375 24 4.90625 24 C 4.875 24 4.84375 24 4.8125 24 C 4.78125 24 4.75 24 4.71875 24 Z M 38.71875 24 C 38.167969 24.078125 37.78125 24.589844 37.859375 25.140625 C 37.9375 25.691406 38.449219 26.078125 39 26 L 45 26 C 45.359375 26.003906 45.695313 25.816406 45.878906 25.503906 C 46.058594 25.191406 46.058594 24.808594 45.878906 24.496094 C 45.695313 24.183594 45.359375 23.996094 45 24 L 39 24 C 38.96875 24 38.9375 24 38.90625 24 C 38.875 24 38.84375 24 38.8125 24 C 38.78125 24 38.75 24 38.71875 24 Z M 15 33.875 C 14.773438 33.90625 14.5625 34.019531 14.40625 34.1875 L 10.15625 38.4375 C 9.859375 38.679688 9.722656 39.066406 9.808594 39.441406 C 9.894531 39.8125 10.1875 40.105469 10.558594 40.191406 C 10.933594 40.277344 11.320313 40.140625 11.5625 39.84375 L 15.8125 35.59375 C 16.109375 35.308594 16.199219 34.867188 16.039063 34.488281 C 15.882813 34.109375 15.503906 33.867188 15.09375 33.875 C 15.0625 33.875 15.03125 33.875 15 33.875 Z M 34.6875 33.875 C 34.3125 33.941406 34.011719 34.214844 33.90625 34.578125 C 33.800781 34.945313 33.910156 35.335938 34.1875 35.59375 L 38.4375 39.84375 C 38.679688 40.140625 39.066406 40.277344 39.441406 40.191406 C 39.8125 40.105469 40.105469 39.8125 40.191406 39.441406 C 40.277344 39.066406 40.140625 38.679688 39.84375 38.4375 L 35.59375 34.1875 C 35.40625 33.988281 35.148438 33.878906 34.875 33.875 C 34.84375 33.875 34.8125 33.875 34.78125 33.875 C 34.75 33.875 34.71875 33.875 34.6875 33.875 Z M 24.90625 37.96875 C 24.863281 37.976563 24.820313 37.988281 24.78125 38 C 24.316406 38.105469 23.988281 38.523438 24 39 L 24 45 C 23.996094 45.359375 24.183594 45.695313 24.496094 45.878906 C 24.808594 46.058594 25.191406 46.058594 25.503906 45.878906 C 25.816406 45.695313 26.003906 45.359375 26 45 L 26 39 C 26.011719 38.710938 25.894531 38.433594 25.6875 38.238281 C 25.476563 38.039063 25.191406 37.941406 24.90625 37.96875 Z" />
            </svg>
          </div>
        </label>
      </div>
      <div>
        <input
          type="text"
          placeholder="Search tx/address/block"
          className="font-pixel input input-sm lg:input-md rounded-lg bg-base-200"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onKeyPress={handleKeyPress}
        />
        <button
          className="btn ml-4 rounded-lg btn-sm lg:btn-md"
          onClick={() => Search(value)}
        >
          <img src="/logo2.png" alt="" className="h-8 lg:hidden" />
          <div className="hidden lg:block">Search</div>
        </button>
      </div>
    </div>
  );
};
