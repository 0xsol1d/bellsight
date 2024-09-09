"use client";
import React, { useRef } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { networks, Psbt } from "belcoinjs-lib";
import { useNintondo, NintondoProvider } from "nintondo-sdk/react";
import { splitTxs } from "./splitTxs";
import Select from "react-select";

import toast from "react-hot-toast";
import { toastStyles } from "../../utils/styles";
import { SATS_PER_BELL, ESPLORA_API, BELLSIGHT_API } from "@/utils/consts";

export default function Wallet() {
  return (
    <NintondoProvider>
      <AppEntyPoint />
    </NintondoProvider>
  );
}

import { Navbar, CopyIcon, Decimal, Loader } from "../../components";
import { inscribe } from "./index";

const AppEntyPoint = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const modalRef2 = useRef<HTMLDialogElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

  const { isConnected, nintondo } = useNintondo();
  const [connected, setConnected] = useState<any>();
  const [balance, setBalance] = useState<any>();
  const [address, setAddress] = useState<any>();
  const [stats, setStats] = useState(null);
  const [utxos, setUtxos] = useState<any>();

  const [snsHoldings, setSnsHoldings] = useState<any>([]);
  const [namespaces, setNamespaces] = useState<any>([]);
  const [selectedNamespace, setSelectedNamespace] = useState("");

  const [domainName, setDomainName] = useState<string>("");
  const [nameAvatar, setNameAvatar] = useState<string>("");

  const [namespaceName, setNamespaceName] = useState<string>("");
  const [namespaceAbout, setNamespaceAbout] = useState<string>("");
  const [namespaceAvatar, setNamespaceAvatar] = useState<string>("");

  const [feeRate, setFeeRate] = useState<number>(5);
  const [feeRateSlow, setFeeRateSlow] = useState<number>(5);
  const [feeRateFast, setFeeRateFast] = useState<number>(5);
  const [latestFeeRate, setLatestFeeRate] = useState<any>(5);
  const [feeType, setFeeType] = useState<any>("slow");
  const [initialFetch, setInitialFetch] = useState<any>(false);

  const [imageUrl, setImageUrl] = useState<any>("");

  const [send_reciever, setSend_reciever] = useState<any>("");
  const [send_amount, setSend_amount] = useState<string>("0");
  const [receiverToPayFee, setReceiverToPayFee] = useState<any>(false);

  const [split_costs, setSplit_costs] = useState<any>(1000);
  const [split_amount, setSplit_amount] = useState<any>(5);

  const [data, setData] = useState<any>();
  const [dataCoingecko, setDataCoingecko] = useState<any>();

  const GetUtxos = async (addr: any) => {
    await fetch(`https://api.nintondo.io/api/address/${addr}/utxo?hex=true`)
      .then((res) => res.json())
      .then((result) => {
        var arr2: any = [];
        result.forEach((element: any) => {
          var json = {
            txid: element.txid,
            vout: element.vout,
            value: element.value,
            hex: element.hex,
          };
          arr2.push(json);
        });
        setUtxos(arr2);
      });
  };

  const GetSNSForAddress = async (addr: any) => {
    await fetch(BELLSIGHT_API + "holder/" + addr)
      .then((res) => res.json())
      .then((result) => {
        if (result.length > 0) setSnsHoldings(result);
      });
  };

  const GetNamespaces = async () => {
    await fetch(BELLSIGHT_API + "namespaces")
      .then((res) => res.json())
      .then((result) => {
        if (result.length > 0) {
          setNamespaces(result);
          setSelectedNamespace(result[0].namespace);
        }
      });
  };

  const GetTransaction = async (id: any) => {
    await fetch(ESPLORA_API + "tx/" + id)
      .then((res) => res.json())
      .then((result) => {
        return result;
      });
  };

  const GetEstimatedFees = async () => {
    await fetch(ESPLORA_API + "fee-estimates")
      .then((res) => res.json())
      .then((result) => {
        const values: number[] = Object.values(result);
        const sum: any = values.reduce((acc: any, curr: any) => acc + curr, 0);
        const average = Math.ceil(sum / values.length);
        setLatestFeeRate(average);

        const frequency: any = {};
        values.forEach((value) => {
          frequency[value] = (frequency[value] || 0) + 1;
        });

        const mostFrequentValue = Object.keys(frequency).reduce((a, b) =>
          frequency[a] > frequency[b] ? a : b
        );
        const highestValue: number = Math.max(...values);

        setFeeRateFast(Math.ceil(highestValue));
        setFeeRateSlow(parseInt(mostFrequentValue));

        if (feeType == "fast") {
          setFeeRate(Math.ceil(highestValue));
        } else if (feeType == "slow") {
          setFeeRate(parseInt(mostFrequentValue));
        }

        toast.success(
          `Refreshed Fee rate\n\nSlow: ${feeRateSlow}/vB\nFast: ${feeRateFast}/vB`,
          toastStyles
        );
      });
  };

  const GetStats = async (addr: any) => {
    await fetch(ESPLORA_API + "address/" + addr)
      .then((res) => res.json())
      .then((stats) => {
        setStats(stats);
      });
  };

  const GetCoingeckoData = async () => {
    await fetch("https://api.coingecko.com/api/v3/coins/bellscoin")
      .then((res) => res.json())
      .then((result) => {
        setDataCoingecko(result);
      });
  };

  const connectWallet = async () => {
    if (nintondo) {
      try {
        await nintondo.provider.connect();
        const addr = await nintondo.provider.getAccount();
        const bal = await nintondo?.provider.getBalance();
        toast.success("Wallet connected", toastStyles);
        setConnected(true);
        setAddress(addr);
        setBalance(bal);
        GetUtxos(addr);
        GetEstimatedFees();
        GetSNSForAddress(addr);
        if (addr) GetStats(addr);
      } catch (error) {
        toast.error("Failed to connect wallet", toastStyles);
        console.error("Failed to connect wallet:", error);
      }
    } else {
      toast.error("Nintondo instance is not initialized", toastStyles);
      toast.error("Nintondo instance is not initialized", toastStyles);
    }
  };

  const signMessage = async () => {
    if (nintondo) {
      try {
        console.log("Attempting to sign message");
        const result = await nintondo.provider.signMessage("test");
        console.log(result);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      toast.error("Nintondo instance is not initialized", toastStyles);
      console.error("Nintondo instance is not initialized");
    }
  };

  const createTransaction = async () => {
    if (nintondo) {
      try {
        let reciever;
        if (send_reciever.includes(".")) {
          await fetch(BELLSIGHT_API + "name/" + send_reciever)
            .then((res) => res.json())
            .then((result) => {
              reciever = result[0].holder;
            });
        } else reciever = send_reciever;
        const result = await nintondo?.provider.createTx({
          to: reciever,
          amount: parseFloat(send_amount) * SATS_PER_BELL,
          receiverToPayFee: receiverToPayFee,
          feeRate: feeRate,
        });
        const result2 = nintondo.api.pushTx(result);
        const bal = await nintondo?.provider.getBalance();
        setBalance(bal);
        toast.success("TX pushed succesfully", toastStyles);
      } catch (error) {
        toast.error("Failed to create TX:" + error, toastStyles);
        console.error("Failed to create TX:", error);
      }
    } else {
      toast.error("Nintondo instance is not initialized", toastStyles);
    }
  };

  const Inscribe = async (type: string) => {
    if (nintondo) {
      let inscribeData = "";
      let modifiedDomainName = "";
      let nameSpace = "";
      const lettersRegex = /^[a-zA-Z]+$/;

      if (type == "name") {
        console.log((domainName.match(/\./g) || []).length);
        if ((domainName.match(/\./g) || []).length > 1) {
          toast.error(
            "Name has more than to periods.\n\nExample: 'bellsight.bells'",
            toastStyles
          );
          return;
        }
        if (!domainName.includes("."))
          modifiedDomainName = domainName + "." + selectedNamespace;
        else modifiedDomainName = domainName;
        let dataObj: { [key: string]: any } = {
          p: "sns",
          op: "reg",
          name: modifiedDomainName.toLocaleLowerCase(),
        };
        if (nameAvatar !== null) {
          dataObj.about = nameAvatar;
        }
        inscribeData = JSON.stringify(dataObj);
      } else if (type == "namespace") {
        if (!lettersRegex.test(namespaceName)) {
          toast.error("Only letters are allowed in namespaces.", toastStyles);
          return;
        }
        let dataObj: { [key: string]: any } = {
          p: "sns",
          op: "ns",
          ns: namespaceName.toLocaleLowerCase(),
        };
        if (namespaceAbout !== null) {
          dataObj.about = namespaceAbout;
        }
        if (namespaceAvatar !== null) {
          dataObj.avatar = namespaceAvatar;
        }
        inscribeData = JSON.stringify(dataObj);
      }
      console.log(inscribeData);

      const publicKey = await nintondo?.provider.getPublicKey();
      const inscribeParams = {
        toAddress: address,
        fromAddress: address,
        contentType: "application/json",
        data: Buffer.from(inscribeData),
        feeRate: feeRate,
        network: networks.bellcoin,
        utxos: utxos,
        publicKey: Buffer.from(publicKey, "hex"),
        signPsbtHex: async (psbtHex: any) => {
          const unsignedPsbt = Buffer.from(psbtHex, "hex").toString("base64");

          const result = await nintondo.provider.signPsbt(unsignedPsbt, {
            autoFinalized: false,
          });

          const psbt = Psbt.fromBase64(result);
          const signatures = psbt.data.inputs.map((input) => {
            return input!.partialSig![0].signature.toString("hex");
          });

          return {
            psbtHex: Buffer.from(result, "base64").toString("hex"),
            signatures,
          };
        },
      };

      try {
        const inscription = await inscribe(inscribeParams);
        const firstTransaction = inscription[0];
        const secondTransaction = inscription[1];
        const pushResult1 = await nintondo?.api.pushTx(firstTransaction);
        const pushResult2 = await nintondo?.api.pushTx(secondTransaction);

        console.log("INSCRIPTION LOCATION", pushResult2);
        const response = await fetch(ESPLORA_API + "tx/" + pushResult2?.txid);
        const responseText = await response.text();
        const inscriptionId = JSON.parse(responseText);
        /*console.log("INSCRIPTION ID:" + inscriptionId.vin[0].txid + "i0");

        if ((type = "name"))
          toast.success(
            `Domain ${modifiedDomainName}\nsuccesfully inscribed.\n\nLocation: ${pushResult2}\nGenesis: ${inscriptionId}i0`,
            toastStyles
          );
        if ((type = "namespace"))
          toast.success(
            `Domain ${nameSpace}\nsuccesfully inscribed.\n\nLocation: ${pushResult2}\nGenesis: ${inscriptionId}i0`,
            toastStyles
          );*/
      } catch (error: any) {
        toast.error("Inscription Error:\n\n" + error.message, toastStyles);
        console.error("Inscription Error", error);
        connectWallet();
      }
    }
  };

  const SetFeeType = (type: any) => {
    if (type == "fast") {
      setFeeType("fast");
      setFeeRate(feeRateFast);
    } else if (type == "slow") {
      setFeeType("slow");
      setFeeRate(feeRateSlow);
    } else if (type == "custom") {
      setFeeType("custom");
    }
  };

  const checkUtxo = async () => {
    const test = await nintondo?.api.getUtxos(address);
    toast.success(
      `You have ${test?.length} ${test?.length == 1 ? "utxo" : "utxo"}`,
      toastStyles
    );
  };

  const openModal = () => {
    if (!namespaceName) {
      toast.error("Please type in a namespace.", toastStyles);
      return;
    }
    if (modalRef.current) {
      setImageUrl(
        `https://content.nintondo.io/api/pub/content/${namespaceAvatar}`
      );
      modalRef.current.showModal();
    }
  };

  const openModal2 = () => {
    if (!domainName) {
      toast.error("Please type in a name.", toastStyles);
      return;
    }
    if (modalRef2.current) {
      setImageUrl(`https://content.nintondo.io/api/pub/content/${nameAvatar}`);
      modalRef2.current.showModal();
    }
  };

  const handleChange = (event: any) => {
    setSelectedNamespace(event.target.value);
  };

  useEffect(() => {
    GetCoingeckoData();
    GetNamespaces();
  }, []);

  useEffect(() => {
    console.log("Refresh...");
  }, [feeRateSlow, feeRateFast, connected, balance]);

  return (
    <div className="min-h-screen">
      <Navbar />
      {dataCoingecko && (
        <div className="grid grid-flow-row auto-rows-max">
          <div className="hidden lg:block">
            <div className="bg-base-300">
              <div className="flex justify-between p-4 items-center">
                {connected && (
                  <div className="flex gap-2 items-center">
                    <div className="text-center text-sm flex">
                      <div role="tablist" className="tabs tabs-boxed">
                        <a
                          onClick={() => SetFeeType("slow")}
                          role="tab"
                          className={
                            feeType === "slow" ? "tab tab-active" : "tab"
                          }
                        >
                          <div className="flex gap-2">
                            <div>SLOW</div>
                            <div>{feeRateSlow}/vB</div>
                          </div>
                        </a>
                        <a
                          onClick={() => SetFeeType("fast")}
                          role="tab"
                          className={
                            feeType === "fast" ? "tab tab-active" : "tab"
                          }
                        >
                          <div className="flex gap-2">
                            <div>FAST</div>
                            <div>{feeRateFast}/vB</div>
                          </div>
                        </a>
                        <a
                          onClick={() => SetFeeType("custom")}
                          role="tab"
                          className={
                            feeType === "custom" ? "tab tab-active" : "tab"
                          }
                        >
                          CUSTOM
                        </a>
                      </div>
                      {feeType == "custom" && (
                        <div className="flex items-center ml-1">
                          <input
                            type="text"
                            placeholder="Fees"
                            className="font-pixel input input-sm w-20 rounded-lg bg-base-200"
                            value={feeRate}
                            onChange={(e) => {
                              setFeeRate(parseInt(e.target.value));
                            }}
                          />
                        </div>
                      )}

                      <button
                        onClick={GetEstimatedFees}
                        className="btn btn-ghost rounded text-2xl ml-1"
                      >
                        ⟳
                      </button>
                    </div>
                  </div>
                )}
                {!connected && (
                  <div>Please connect your NINTONDO wallet to proceed.</div>
                )}
                {connected && (
                  <div className="text-center text-sm">
                    <div>Address:</div>
                    <Link passHref href={`/address/${address}`}>
                      <div className="text-right text-blue-500 hover:text-blue-300 flex truncate">
                        {address}
                      </div>
                    </Link>
                  </div>
                )}
                {connected && (
                  <div className="text-center text-sm">
                    <div>Balance (without inscriptions):</div>
                    {`${balance / SATS_PER_BELL} $BEL (${(
                      (balance / SATS_PER_BELL) *
                      dataCoingecko.market_data.current_price.usd
                    ).toFixed(2)}$)`}
                  </div>
                )}
                {connected && (
                  <div className="dropdown dropdown-hover">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-secondary m-1"
                    >
                      Your SNS
                    </div>
                    <ul
                      tabIndex={0}
                      className="grid dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow overflow-y-auto h-40"
                    >
                      {snsHoldings.map((sns: any, index: any) => (
                        <li key={index}>
                          <a>{sns.domain}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {!connected && <div />}
                <div>
                  <button
                    onClick={connectWallet}
                    className="btn btn-secondary rounded"
                  >
                    {connected ? "Connected" : "Connect Wallet"}
                  </button>
                </div>
              </div>
            </div>
            {/*
            <div>sign</div>
            <button onClick={signMessage} className="btn btn-secondary rounded">
              Sign Message
            </button>
            */}
            {connected && (
              <div className="grid grid-cols-2 mt-4 text-sm">
                <div className="text-center bg-base-300 rounded-lg m-5 p-4">
                  <div className="mb-3">TX SPLITTER</div>
                  <div className="grid gap-y-2">
                    <div className="flex justify-between items-center">
                      <div className="mr-4">Single Costs</div>
                      <input
                        type="text"
                        placeholder="Address/Domain"
                        className="font-pixel input input-md rounded-lg bg-base-200 w-48"
                        value={split_costs}
                        onChange={(e) => {
                          setSplit_costs(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>Amount</div>
                      <input
                        type="text"
                        placeholder="amount"
                        className="font-pixel input input-md rounded-lg bg-base-200 w-48"
                        value={split_amount}
                        onChange={(e) => {
                          setSplit_amount(e.target.value);
                        }}
                      />
                    </div>
                    <button
                      onClick={() =>
                        splitTxs({
                          utxos: utxos,
                          feeRate: feeRate,
                          amount: split_amount,
                          signleInscriptionCost: split_costs,
                          address: address,
                          network: networks.bellcoin,
                          nintondo: nintondo,
                        })
                      }
                      className="btn btn-secondary rounded"
                    >
                      Split UTXOs
                    </button>
                    <button
                      onClick={checkUtxo}
                      className="btn btn-secondary rounded"
                    >
                      Check my UTXOs
                    </button>
                  </div>
                </div>
                <div className="text-center bg-base-300 rounded-lg m-5 p-4">
                  <div className="mb-3">SEND $BEL</div>
                  <div className="grid gap-y-2">
                    <div className="flex justify-between items-center">
                      <div className="mr-4">Address/Domain</div>
                      <input
                        type="text"
                        placeholder="Address/Domain"
                        className="font-pixel input input-md rounded-lg bg-base-200 w-48"
                        value={send_reciever}
                        onChange={(e) => {
                          setSend_reciever(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>Amount in $BEL</div>
                      <div className="flex items-center">
                        <button
                          className="btn btn-secondary mr-2"
                          onClick={() => {
                            const bal = (balance / SATS_PER_BELL).toString();
                            setSend_amount(bal);
                          }}
                        >
                          MAX
                        </button>
                        <input
                          type="text"
                          placeholder="amount"
                          className="font-pixel input input-md rounded-lg bg-base-200 w-48"
                          value={send_amount}
                          onChange={(e) => {
                            setSend_amount(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                    <div className="form-controlflex justify-between items-center">
                      <label className="label cursor-pointer">
                        <span className="label-text">
                          Reciever pays the fee
                        </span>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          onChange={() =>
                            setReceiverToPayFee(!receiverToPayFee)
                          }
                        />
                      </label>
                    </div>
                    <button
                      onClick={createTransaction}
                      className="btn btn-secondary rounded"
                    >
                      Send $BEL
                    </button>
                  </div>
                </div>
                <div className="text-center mt-4 bg-base-300 rounded-lg m-5 p-4">
                  <div>
                    <div className="mb-3">INSCRIBE NAME</div>
                    <div className="grid gap-y-2">
                      <div className="flex justify-between items-center">
                        <div>Name</div>
                        <input
                          type="text"
                          placeholder="Name"
                          className="font-pixel input input-md rounded-lg bg-base-200 w-48"
                          value={domainName}
                          maxLength={30}
                          onChange={(e) => {
                            setDomainName(e.target.value);
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <div>Avatar</div>
                        <input
                          type="text"
                          placeholder="Inscription ID"
                          className="font-pixel input input-md rounded-lg bg-base-200 w-48"
                          value={nameAvatar}
                          onChange={(e) => {
                            setNameAvatar(e.target.value);
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <div>Namespace</div>
                        <select
                          className="select select-bordered select-md w-48 max-w-xs"
                          value={selectedNamespace}
                          onChange={handleChange}
                        >
                          {namespaces.map((ns: any, index: any) => (
                            <option
                              key={index}
                              value={ns.namespace}
                              className="flex justify-between"
                            >
                              {ns.namespace}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        className="btn btn-secondary rounded"
                        onClick={openModal2}
                      >
                        Inscribe Name
                      </button>
                      <dialog
                        id="previewName"
                        className="modal"
                        ref={modalRef2}
                      >
                        <div className="modal-box">
                          Are you sure you want to inscribe this name?
                          <div className="grid items-center mt-4">
                            <div>{`p: "sns"`}</div>
                            <div>{`op: "reg"`}</div>
                            <div>
                              {`name: "${
                                !domainName.includes(".")
                                  ? domainName + "." + selectedNamespace
                                  : domainName
                              }"`}
                            </div>
                            <div className="truncate">
                              {nameAvatar != ""
                                ? `avatar: "${nameAvatar.toLocaleLowerCase()}"`
                                : ""}
                            </div>
                            <div className="flex justify-center mt-4">
                              <img src={imageUrl} alt="none" />
                            </div>
                          </div>
                          <div className="modal-action">
                            <form method="dialog">
                              <button
                                onClick={() => Inscribe("name")}
                                className="btn btn-secondary rounded"
                              >
                                INSCRIBE NAME
                              </button>
                              <button className="btn">Cancel</button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  </div>
                </div>
                <div className="text-center mt-4 bg-base-300 rounded-lg m-5 p-4">
                  <div className="mb-3">INSCRIBE NAMESPACE</div>
                  <div className="grid gap-y-2">
                    <div className="flex justify-between items-center">
                      <div>Namespace</div>
                      <input
                        type="text"
                        placeholder="Namespace"
                        className="font-pixel input input-md rounded-lg bg-base-200 w-48"
                        value={namespaceName}
                        maxLength={10}
                        onChange={(e) => {
                          setNamespaceName(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>About</div>
                      <input
                        type="text"
                        placeholder="About"
                        className="font-pixel input input-md rounded-lg bg-base-200 w-48"
                        value={namespaceAbout}
                        maxLength={140}
                        onChange={(e) => {
                          setNamespaceAbout(e.target.value);
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <div>{`Avatar (inscription ID)`}</div>
                      <input
                        type="text"
                        placeholder="Inscription ID"
                        className="font-pixel input input-md rounded-lg bg-base-200 w-48"
                        value={namespaceAvatar}
                        maxLength={100}
                        onChange={(e) => {
                          setNamespaceAvatar(e.target.value);
                        }}
                      />
                    </div>
                    <button
                      className="btn btn-secondary rounded"
                      onClick={openModal}
                    >
                      Inscribe Namespace
                    </button>
                    <dialog
                      id="previewNamespace"
                      className="modal"
                      ref={modalRef}
                    >
                      <div className="modal-box">
                        Are you sure you want to inscribe this namespace?
                        <div className="grid items-center mt-4">
                          <div>{`p: "sns"`}</div>
                          <div>{`op: "ns"`}</div>
                          <div>{`ns: "${namespaceName.toLocaleLowerCase()}"`}</div>
                          <div>
                            {namespaceAbout != ""
                              ? `about: "${namespaceAbout.toLocaleLowerCase()}`
                              : ""}
                          </div>
                          <div className="truncate">
                            {namespaceAvatar != ""
                              ? `avatar: "${namespaceAvatar.toLocaleLowerCase()}"`
                              : ""}
                          </div>
                          <div className="flex justify-center mt-4">
                            {namespaceAvatar && (
                              <img src={imageUrl} alt="none" />
                            )}
                          </div>
                        </div>
                        <div className="modal-action">
                          <form method="dialog">
                            <button
                              onClick={() => Inscribe("namespace")}
                              className="btn btn-secondary rounded"
                            >
                              INSCRIBE NAMESPACE
                            </button>
                            <button className="btn">Cancel</button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="lg:hidden block text-center">
            wallet function not yet supported on mobile
          </div>
        </div>
      )}
    </div>
  );
};
