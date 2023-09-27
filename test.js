import { Web3, utils } from "web3";
const web3 = new Web3(
    new Web3.providers.HttpProvider(
      "https://base-goerli.blockpi.network/v1/rpc/public"
      // "https://eth-goerli.api.onfinality.io/public"
    )
  );


web3.eth.sendSignedTransaction("0xf86c028405f5e13283030d4094f34b233b40352dfbda8dc10fc1cae3bfebbf895685174876e8000083029489a0a3b4a0975d573719e57c9b242d1d05931115a2330b2e4bd92727b651052bde59a01e764575cdf36b63efef3bf3716446138d46ea1bcfc516ccd5cf42fa9378ab97")