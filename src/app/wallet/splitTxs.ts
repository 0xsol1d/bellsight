//this is a modified version of 
//https://github.com/Nintondo/inscriber/blob/main/src/index.ts
import { Psbt } from "belcoinjs-lib";
import { PrepareForMultipleInscriptionsInscribe } from "./types";
import { gptFeeCalculate } from "./utils";

export async function splitTxs({
  utxos,
  feeRate,
  amount,
  signleInscriptionCost,
  address,
  network,
  nintondo,
}: PrepareForMultipleInscriptionsInscribe): Promise<string[]> {
  const psbt = new Psbt({ network });
  const txidArray: string[] = [];

  utxos.forEach((f: any) => {
    psbt.addInput({
      hash: f.txid,
      index: f.vout,
      nonWitnessUtxo: Buffer.from(f.hex, "hex"),
    });
  });

  for (let i = 0; i < amount; i++) {
    psbt.addOutput({
      address: address,
      value: signleInscriptionCost,
    });
  }

  const totalInputValue = utxos.reduce(
    (acc: any, val: { value: any }) => acc + val.value,
    0
  );
  const totalInscriptionsCost = signleInscriptionCost * amount;
  const totalFee = gptFeeCalculate(utxos.length, amount + 1, feeRate);
  const change = totalInputValue - totalInscriptionsCost - totalFee;

  if (change < 1000) {
    throw new Error(
      `Not enough balance for preparation. Change calculated: ${change}`
    );
  }

  psbt.addOutput({
    address,
    value: change,
  });

  const psbtBase64 = psbt.toBase64();
  const signedPsbtBase64 = await nintondo?.provider.signPsbt(psbtBase64, {
    autoFinalized: false,
  });

  if (!signedPsbtBase64) {
    throw new Error("Failed to sign PSBT");
  }

  const signedPsbt = Psbt.fromBase64(signedPsbtBase64);
  console.log(`Signed PSBT Base64: ${signedPsbtBase64}`);

  signedPsbt.finalizeAllInputs();
  const finalizedTxHex = signedPsbt.extractTransaction(true).toHex();
  console.log(`Finalized Transaction Hex: ${finalizedTxHex}`);

  const pushTxResponse = await nintondo?.api.pushTx(finalizedTxHex);

  if (pushTxResponse && pushTxResponse.txid) {
    txidArray.push(pushTxResponse.txid);
    // Stelle sicher, dass du diese Funktion weiterreichst oder in der neuen Datei definierst
    // GetUtxos(address); 
  } else {
    throw new Error("Failed to push transaction to network");
  }

  return txidArray;
}
