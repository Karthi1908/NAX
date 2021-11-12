import { NetworkType } from '@airgap/beacon-sdk';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
const CONTRACT_ADDRESS = 'KT1MpgKoT5L32ngsPJgjE9fptVgBE9XAUc6X';

const Tezos = new TezosToolkit('https://api.tez.ie/rpc/granadanet');

const ContractProvider = Tezos.contract;

const beaconWallet = new BeaconWallet({
  name: 'Neo Asset Exchange',
  preferredNetwork: NetworkType.GRANADANET,
});

Tezos.setWalletProvider(beaconWallet);

const wallet = Tezos.wallet;

export { CONTRACT_ADDRESS, Tezos, ContractProvider, wallet, beaconWallet };
