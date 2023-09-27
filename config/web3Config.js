import { Web3, utils } from "web3";
const web3 = new Web3(
    new Web3.providers.HttpProvider(
      "https://goerli.infura.io/v3/c4196969f9b84232a4c688decfecf5eb"
    )
  );

export default web3;