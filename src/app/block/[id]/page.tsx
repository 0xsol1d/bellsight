"use client";
import React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as dateFns from "date-fns";
import toast from "react-hot-toast";
import { toastStyles } from "../../../utils/styles";

import { Navbar, CopyIcon, Decimal, Loader } from "../../../components";
import { ESPLORA_API, BELLSIGHT_API } from "@/utils/consts";

export default function Block({ params }: { params: { id: any } }) {
  const router = useRouter();
  const [data, setData] = useState<any>();
  const [dataCoingecko, setDataCoingecko] = useState<any>();
  const [txs, setTxs] = useState<any>();
  const [height, setHeight] = useState<any>();
  const [method, setMethod] = useState<any>("");

  const [isAtBottom, setIsAtBottom] = useState(false);

  const [error, setError] = useState<boolean>(false);

  const [snsHoldings, setSnsHoldings] = useState<any>([]);

  const GetHeight = async () => {
    await fetch(ESPLORA_API + "blocks/tip/height")
      .then((res) => res.json())
      .then(async (result) => {
        setHeight(result);
      });
  };

  const GetBlockById = async (id: any) => {
    await fetch(ESPLORA_API + "blocks/" + id)
      .then(async (res) => {
        const status = res.status;
        const result = await res.json();
        return { status, result };
      })
      .then(async ({ status, result }) => {
        if (status == 200) {
          setData(result[0]);
          GetSNSForBlock(result[0].height);
          await fetch(ESPLORA_API + "block/" + result[0].id + "/txs/0")
            .then((res) => res.json())
            .then(async (result) => {
              setTxs(result);
            });
        } else {
          toast.error("Block not found", toastStyles);
          setError(true);
        }
      });
  };

  const GetBlockByHash = async (id: any) => {
    await fetch(ESPLORA_API + "block/" + id)
      .then(async (res) => {
        const status = res.status;
        const result = await res.json();
        return { status, result };
      })
      .then(async ({ status, result }) => {
        if (status == 200) {
          setData(result);
          GetSNSForBlock(result.height);
          await fetch(ESPLORA_API + "block/" + result.id + "/txs/0")
            .then((res) => res.json())
            .then(async (result) => {
              setTxs(result);
            });
        } else {
          toast.error("Block not found", toastStyles);
          setError(true);
        }
      });
  };

  const GetNextTxs = async (id: any) => {
    await fetch(ESPLORA_API + "block/" + id + "/txs/" + txs.length)
      .then((res) => res.json())
      .then((result) => {
        result.forEach((element: any) => {
          setTxs((state: any) => [...state, element]);
        });
      });
  };

  const GetSNSForBlock = async (height: any) => {
    await fetch(BELLSIGHT_API + "block/" + height)
      .then((res) => res.json())
      .then((result) => {
        if (result.length > 0) setSnsHoldings(result);
      });
  };

  const copyAddress = async (val: any) => {
    await navigator.clipboard.writeText(val);
    toast.success("Copied block id", toastStyles);
  };

  function dec2Hex(dec: any) {
    return Math.abs(dec).toString(16);
  }

  const GetCoingeckoData = async () => {
    await fetch("https://api.coingecko.com/api/v3/coins/bellscoin")
      .then((res) => res.json())
      .then((result) => {
        setDataCoingecko(result);
      });
  };

  useEffect(() => {
    GetHeight();
    GetCoingeckoData();
    if (isNaN(params.id)) {
      setMethod("hash");
      GetBlockByHash(params.id);
    } else {
      setMethod("id");
      GetBlockById(params.id);
    }

    const handleScroll = () => {
      const position = window.scrollY;
      const isBottom =
        window.innerHeight + position >=
        document.documentElement.scrollHeight - 200;
      setIsAtBottom(isBottom);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const ShowHolder = async (input: any) => {
    await fetch(BELLSIGHT_API + "name/" + input)
      .then((res) => res.json())
      .then((result) => {
        if (result && result.length > 0 && result[0].holder !== undefined)
          router.push("/address/" + result[0].holder);
        else toast.error("Name not found", toastStyles);
      });
  };

  useEffect(() => {
    if (isAtBottom) GetNextTxs(params.id);
  }, [isAtBottom]);

  return (
    <div className="min-h-screen">
      <Navbar />
      {data && dataCoingecko && height && txs ? (
        <div className="lg:grid grid-flow-row auto-rows-max place-content-center p-4">
          <h1 className="text-center lg:mt-0 mt-2 underline">BLOCK</h1>
          <div>
            <div className="flex justify-between mb-4 items-center">
              <div></div>
              {method == "id" && (
                <button
                  className="text-blue-500 hover:text-blue-300 flex"
                  onClick={() => copyAddress(data.id)}
                >
                  <div className="break-all">{data.id}</div>
                  <CopyIcon />
                </button>
              )}
              {method == "hash" && (
                <button
                  className="text-blue-500 hover:text-blue-300 flex"
                  onClick={() => copyAddress(params.id)}
                >
                  <div className="break-all">{params.id}</div>
                  <CopyIcon />
                </button>
              )}
              <div className="dropdown dropdown-hover dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-secondary m-1"
                >
                  SNS in this Block
                </div>
                <ul
                  tabIndex={0}
                  className="grid dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow overflow-y-auto h-40 gap-y-1"
                >
                  {snsHoldings.map((sns: any, index: any) => (
                    <li
                      key={index}
                      onClick={() => ShowHolder(sns.domain)}
                      className=""
                    >
                      <a>{sns.domain}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid grid-cols-2 border-b-2 mb-4"></div>

            <div className="rounded-lg bg-base-300 p-2 mb-4">
              <div className="grid grid-cols-2">
                <div>Height:</div>
                <div className="text-right">{data.height}</div>
              </div>
              <div className="grid grid-cols-2">
                <div>Confirmations:</div>
                <div className="text-right">{height - data.height + 1}</div>
              </div>
              <div className="grid grid-cols-2">
                <div>Timestamp:</div>
                <div className="text-right">
                  {dateFns.format(
                    dateFns.fromUnixTime(data.timestamp),
                    "yyyy/MM/dd - HH:mm:ss"
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 mb-4">
                <div>Median Time:</div>
                <div className="text-right">
                  {dateFns.format(
                    dateFns.fromUnixTime(data.mediantime),
                    "yyyy/MM/dd - HH:mm:ss"
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 mb-4">
                <div>Previous blockhash:</div>
                <Link passHref href={`/block/${data.previousblockhash}`}>
                  <div className="flex text-right text-blue-500 hover:text-blue-300">
                    <div className=" truncate">{data.previousblockhash}</div>
                    <img src="/logo2.png" alt="tmp" className="h-6 ml-1" />
                  </div>
                </Link>
              </div>
              <div className="grid grid-cols-2 border-b-2 mb-4"></div>

              <div className="grid grid-cols-2">
                <div>TX count:</div>
                <div className="text-right">{data.tx_count}</div>
              </div>
              <div className="grid grid-cols-2 mb-4">
                <div>Difficulty:</div>
                <div className="text-right">{data.difficulty.toFixed(0)}</div>
              </div>
              <div className="grid grid-cols-2 border-b-2 mb-4"></div>

              <div className="grid grid-cols-2">
                <div>Weight:</div>
                <div className="text-right">{data.weight}</div>
              </div>
              <div className="grid grid-cols-2">
                <div>Size:</div>
                <div className="text-right">{data.size} byte</div>
              </div>
              <div className="grid grid-cols-2">
                <div>Bits:</div>
                <div className="text-right">
                  0x{dec2Hex(data.bits)} / {data.bits}
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div>Nonce:</div>
                <div className="text-right">
                  0x{dec2Hex(data.nonce)} / {data.nonce}
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div>Version:</div>
                <div className="text-right">
                  0x{dec2Hex(data.version)} / {data.version}
                </div>
              </div>
              <div className="grid grid-cols-2 mb-4">
                <div>Merkel Root:</div>
                <div className="text-right truncate">{data.merkle_root}</div>
              </div>
            </div>
          </div>

          {txs?.map((tx: any, index: any) => (
            <div
              key={index}
              className="text-xs p-4 mb-6 rounded-lg bg-base-300 break-all"
            >
              <Link
                key={index}
                passHref
                href={`/tx/${tx.txid}`}
                className="truncate flex"
              >
                <div className="text-blue-500 mb-4 break-words truncate rounded hover:text-blue-300">
                  {tx.txid}
                </div>
                <img src="/logo2.png" alt="tmp" className="h-4 ml-1" />
              </Link>

              <div className="lg:flex justify-between">
                <div className="grid place-content-center">
                  {tx?.vin.map((data: any, index: any) => (
                    <div key={index}>
                      {data.prevout != null && (
                        <Link
                          key={index}
                          passHref
                          href={`/tx/${tx.txid}`}
                          className=""
                        >
                          <div className="lg:grid grid-cols-3 bg-base-200 rounded-lg hover:bg-base-100 p-4 w-full mb-1">
                            <div className="col-span-2 place-content-center gap-4 flex justify-between">
                              <div className="">{index}#</div>
                              <div className="text-left text-blue-500">
                                {data.txid}
                              </div>
                            </div>
                            <div className="col-span-1 text-right place-content-center flex justify-end">
                              <Decimal
                                number={data.prevout.value / 100000000}
                                dec={8}
                              />
                              &nbsp;$BEL
                              {` (${(
                                (data.prevout.value / 100000000) *
                                dataCoingecko.market_data.current_price.usd
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 0,
                              })}$)`}
                            </div>
                          </div>
                        </Link>
                      )}
                      {data.prevout == null && (
                        <div className="lg:grid grid-cols-3 bg-base-200 rounded-lg p-4 w-full">
                          <div className="col-span-2 place-content-center gap-4 flex justify-between">
                            <div className="">{index}#</div>
                            <div className="text-right">COINBASE</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <br className="block lg:hidden" />
                <div className="lg:grid place-content-center text-3xl hidden">
                  🠺
                </div>
                <div className="grid place-content-center text-3xl lg:hidden">
                  🠻
                </div>
                <br className="block lg:hidden" />
                <div className="grid place-content-center">
                  {tx?.vout.map((tx: any, index: any) => (
                    <Link
                      key={index}
                      passHref
                      href={`/address/${tx.scriptpubkey_address}`}
                    >
                      <div className="lg:grid grid-cols-3 bg-base-200 rounded-lg hover:bg-base-100 p-4 mb-1">
                        {tx.scriptpubkey_type == "op_return" && (
                          <>
                            <div className="col-span-3 truncate gap-4 flex">
                              <div className="">{index}#</div>
                              <div className="text-left">OP_RETURN</div>
                            </div>
                          </>
                        )}
                        {tx.scriptpubkey_type != "op_return" && (
                          <>
                            <div className="col-span-2 truncate gap-4 flex">
                              <div className="">{index}#</div>
                              <div className="text-left text-blue-500">
                                {tx.scriptpubkey_address}
                              </div>
                            </div>
                            <div className="col-span-1 text-right place-content-center flex justify-end">
                              <Decimal number={tx.value / 100000000} dec={8} />
                              &nbsp;$BEL
                              {` (${(
                                (tx.value / 100000000) *
                                dataCoingecko.market_data.current_price.usd
                              ).toLocaleString(undefined, {
                                minimumFractionDigits: 0,
                              })}$)`}
                            </div>
                          </>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="lg:mt-96 mt-40 flex flex-col justify-center items-center text-center">
          Block not found
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
