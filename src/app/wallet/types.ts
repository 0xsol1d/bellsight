//this is a modified version of 
//https://github.com/Nintondo/inscriber/blob/main/src/types.ts
import { Network } from "belcoinjs-lib";

export interface ApiUTXO {
  txid: string;
  vout: number;
  value: number;
  scriptPubKeyHex?: string;
  redeemScriptHex?: string;
  hex: string;
}

export interface PrepareForMultipleInscriptionsInscribe {
  utxos: ApiUTXO[];
  feeRate: number;
  amount: number;
  signleInscriptionCost: number;
  address: string;
  network: Network;
  nintondo: any;
}

export interface Status {
  confirmed: boolean;
  block_height: number;
  block_hash: string;
  block_time: number;
}

export interface Chunk {
  buf?: Buffer;
  len?: number;
  opcodenum: number;
}

export interface InscribeParams {
  toAddress: string;
  fromAddress: string;
  contentType: string;
  data: Buffer;
  feeRate: number;
  network: Network;
  utxos: ApiUTXO[];
  publicKey: Buffer;
  signPsbtHex: (
    psbtHex: string
  ) => Promise<{ psbtHex: string; signatures: (string | undefined)[] }>;
}
