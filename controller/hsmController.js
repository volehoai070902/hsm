import { session, slot } from "../config/connectsoftHsm.js";
import genPublickey from "../helper/genPublickey.js";
import getPk from "../helper/getPk.js";
import web3 from "../config/web3Config.js";
import createSign from "../helper/createSign.js";
import graphene from "graphene-pk11";
import util, { BN } from "ethereumjs-util";
import { Transaction } from "@ethereumjs/tx";
import { Chain } from "web3-eth-accounts";
import { Common } from "@ethereumjs/common";
import { ethers } from "ethers";
import {} from "express"
const hsmController = {
  createkeypair: async (req, res) => {
    const label = req.body.label;
    const ID = () => {
      return Math.random().toString(36).substring(2, 9);
    };
    const check_label = session.find({ label: label });
    if (check_label.length === 0) {
      try {
        const keys = session.generateKeyPair(
          graphene.KeyGenMechanism.ECDSA,
          {
            keyType: graphene.KeyType.ECDSA,
            id: Buffer.from([ID]), // Uniquer id for keys in storage https://www.cryptsoft.com/pkcs11doc/v230/group__SEC__9__7__KEY__OBJECTS.html
            label: label,
            token: true,
            verify: true,
            paramsECDSA: graphene.NamedCurve.getByName("secp256k1").value,
          },
          {
            keyType: graphene.KeyType.ECDSA,
            id: Buffer.from([ID]), // Uniquer id for keys in storage https://www.cryptsoft.com/pkcs11doc/v230/group__SEC__9__7__KEY__OBJECTS.html
            label: label,
            token: true,
            sign: true,
          }
        );
        
        console.log()
        let public_key = genPublickey(
          keys.publicKey.getAttribute({ pointEC: null }).pointEC
        );

        const address = util.keccak256(public_key); // keccak256 hash of publicKey
        const buf2 = Buffer.from(address, "hex");
        const address_account = "0x" + buf2.subarray(-20).toString("hex");
        res.status(200).json({
          address: address_account,
        });
      } catch (err) {
        return res.status(400).json({
          message: "errrr",
        });
      }
    }else{
      return res.status(400).json({
        message: "Label is valid",
      });
    }
  },

  sendsigned: async (req, res) => {
    const address = req.body.address;
    const value = req.body.value;
    const label = req.body.label;
    const to = req.body.to;
    const pk = getPk(label);
    const gas = req.body.gas;
    const data = req.body.data
    let gasPrice = await web3.eth.getGasPrice();
    const msgHash = util.keccak256(Buffer.from(to));

    const sign = await createSign(msgHash, pk, address);
    console.log("Verified Ethereum address:", {
      r: sign.r,
      s: sign.s,
      v: sign.v,
    });
    
    const wei = web3.utils.toWei(value.toString(), "ether");
    const gas_price = web3.utils.toWei(gas.toString(), "ether");
    console.log("Wei: ", wei);
    console.log("Gas price: ", gasPrice);
    const params_tx = {
      nonce: await web3.eth.getTransactionCount(address),
      gasPrice: web3.utils.toHex(web3.utils.toWei("0.00009", "gwei")),
      to: to,
      value: web3.utils.toHex(BigInt(wei)),
      gasLimit: web3.utils.toHex(21208),
      data: util.bufferToHex(Buffer.from(data)),
      r: sign.r,
      s: sign.s,
      v: sign.v,
    };

    let transaction_tx = new Transaction(params_tx, {
      common: new Common({ chain: Chain.Goerli }),
      freeze: false,
    });
    const tx_hash = transaction_tx.getMessageToSign();
    const tx_sign = await createSign(tx_hash, pk, address);
    transaction_tx.r = new BN(tx_sign.r);
    transaction_tx.s = new BN(tx_sign.s);
    transaction_tx.v = new BN(tx_sign.v);

    console.log("GAS: ", ethers.formatEther(transaction_tx.gasPrice));
    const serializedTx = transaction_tx.serialize().toString("hex");
    console.log("Signature: ", serializedTx);

    try {
      await web3.eth
        .sendSignedTransaction("0x" + serializedTx)
        .on("confirmation", function (confirmationNumber) {
          console.log("Confirmation:", confirmationNumber);
        })
        .on("error", console.error);
      return res.status(200).json({
        message: "Send sign successfully",
      });
    } catch (err) {
      return res.status(200).json({
        message: err,
      });
    }
  },
};

export default hsmController;
