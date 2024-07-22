"use client";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";
import Link from "next/link";
import * as dateFns from "date-fns";

import { Navbar, Footer, CopyIcon, Decimal, Loader } from "../../components";

export default function Stats() {
  const [averageBlockTimes, setAverageBlockTimes] = useState<number[]>([]);
  const [txCount, setTxCount] = useState<number[]>([]);
  const [txBlockHeight, setTxBlockHeight] = useState<number[]>([]);
  const [accumulatedTxCount, setAccumulatedTxCount] = useState<number[]>([]);
  const [averageBlockHeight, setAverageBlockHeight] = useState<number[]>([]);

  const [averageBlockTimesFast, setAverageBlockTimesFast] = useState<number[]>(
    []
  );
  const [averageBlockHeightFast, setAverageBlockHeightFast] = useState<
    number[]
  >([]);

  const fetchBlocks = async (height?: number) => {
    const url = height
      ? `https://api.nintondo.io/api/blocks/${height}`
      : "https://api.nintondo.io/api/blocks";
    const response = await fetch(url);
    const result = await response.json();
    return result;
  };

  const GetBlocksForAverageTime = async () => {
    let averageTimes: number[] = [];
    let txCounts: number[] = [];
    let txHeights: number[] = [];
    let accumulatedTxCounts: number[] = [];
    let count = 0;
    let averageHeight: number[] = [];
    let averageTimesFast: number[] = [];
    let averageHeightFast: number[] = [];
    let result = await fetchBlocks();
    let currentHeight = result[0].height;
    let blocksForAverageTime: any[] = [];

    for (let step = 0; step < 20; step++) {
      for (let i = 0; i < 10; i++) {
        result = await fetchBlocks(currentHeight);
        blocksForAverageTime.push(...result);

        result.forEach((c: any) => {
          if (step < 1) {
            txCounts.push(c.tx_count);
            txHeights.push(c.height);
          }
          count += c.tx_count;
        });

        if (step < 2) {
          const averageTimeFast = GetAverageBlockTime(blocksForAverageTime);
          averageTimesFast.push(averageTimeFast);
          averageHeightFast.push(currentHeight);
        }

        if (i == 0) averageHeight.push(currentHeight);
        currentHeight -= 10;
      }
      if (step == 1) {
        setTxCount(txCounts.reverse());

        setTxBlockHeight(txHeights.reverse());

        setAverageBlockHeightFast(averageHeightFast.reverse());
        setAverageBlockTimesFast(averageTimesFast.reverse());
      }
      const averageTime = GetAverageBlockTime(blocksForAverageTime);
      averageTimes.push(averageTime);
      accumulatedTxCounts.push(count);
      count = 0;
    }
    setAverageBlockHeight(averageHeight.reverse());
    setAverageBlockTimes(averageTimes.reverse());
    setAccumulatedTxCount(accumulatedTxCounts.reverse());
  };

  const compareTimestamps = (
    timestamp1: number,
    timestamp2: number
  ): number => {
    const differenceInSeconds = Math.abs(timestamp2 - timestamp1);
    const differenceInMinutes = Math.floor(differenceInSeconds / 60);
    return differenceInMinutes;
  };

  const GetAverageBlockTime = (dat: any): number => {
    let totalDifference = 0;
    let count = 1;

    dat.forEach((block: any, index: number) => {
      if (index > 0) {
        totalDifference += compareTimestamps(
          dat[index - 1].timestamp,
          block.timestamp
        );
        count++;
      }
    });

    return parseFloat((totalDifference / count).toFixed(2));
  };

  useEffect(() => {
    GetBlocksForAverageTime();
  }, []);

  const data = {
    labels: averageBlockTimes.map((time, index) => `${time} minutes`),
    datasets: [
      {
        label: "Average block time 100/2000 blocks",
        data: averageBlockTimes,
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const dataFast = {
    labels: averageBlockTimesFast.map((time, index) => `${time} minutes`),
    datasets: [
      {
        label: "Average block time 10/200 blocks",
        data: averageBlockTimesFast,
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const dataTxCount = {
    labels: txCount.map((tx, index) => `${tx} transactions`),
    datasets: [
      {
        label: "TX of the last 100 blocks",
        data: txCount,
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const dataAccumulatedTxCount = {
    labels: accumulatedTxCount.map((tx, index) => `${tx} transactions`),
    datasets: [
      {
        label: "Accumulated TX 100/2000 blocks",
        data: accumulatedTxCount,
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        ticks: {
          display: false,
          autoSkip: false,
          maxRotation: 90,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const optionsABTF = {
    ...options,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = "";
            const index = context.dataIndex; // Index des aktuellen Datenpunkts
            label += ` (Block Height: ${averageBlockHeightFast[index]} - ${
              averageBlockHeightFast[index] - 9
            })`;
            return label;
          },
        },
      },
    },
  };

  const optionsABT = {
    ...options,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = "";
            const index = context.dataIndex; // Index des aktuellen Datenpunkts
            label += ` (Block Height: ${averageBlockHeight[index]} - ${
              averageBlockHeight[index] - 99
            })`;
            return label;
          },
        },
      },
    },
  };

  const optionsTx = {
    ...options,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = "";
            const index = context.dataIndex; // Index des aktuellen Datenpunkts
            label += ` (Block Height: ${txBlockHeight[index]})`;
            return label;
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="grid">
        <h1 className="text-center lg:mt-0 mt-16 underline">STATS</h1>
        <div className="lg:grid grid-cols-2 p-6 lg:h-[53rem] overflow-auto">
          <div className="mb-12 lg:mt-0 flex justify-center items-center max-h-[20rem]">
            {averageBlockTimesFast.length > 0 ? (
              <>
                <Bar data={dataFast} options={optionsABTF} />
              </>
            ) : (
              <Loader />
            )}
          </div>
          <div className="mb-12 lg:mt-0 flex justify-center items-center max-h-[20rem]">
            {averageBlockTimes.length > 0 ? (
              <Bar data={data} options={optionsABT} />
            ) : (
              <Loader />
            )}
          </div>
          <div className="mb-12 lg:mt-0 flex justify-center items-center max-h-[20rem]">
            {txCount.length > 0 ? (
              <Bar data={dataTxCount} options={optionsTx} />
            ) : (
              <Loader />
            )}
          </div>
          <div className="mb-12 lg:mt-0 flex justify-center items-center max-h-[20rem]">
            {accumulatedTxCount.length > 0 ? (
              <Bar data={dataAccumulatedTxCount} options={optionsABT} />
            ) : (
              <Loader />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
