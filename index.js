import express from "express";
import cors from "cors"
import indexRoute from "./routers/index.js";
const PORT = 3005;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

indexRoute(app);
app.listen(PORT, ()=>{
  console.log(`Connect to ${PORT}`);
})


// const decodeECPointToPublicKey = (data) => {
//   if (data.length === 0 || data[0] !== 4) {
//     throw new Error("Only uncompressed point format supported");
//   }
//   // Accoring to ASN encoded value, the first 3 bytes are
//   //04 - OCTET STRING
//   //41 - Length 65 bytes
//   //For secp256k1 curve it's always 044104 at the beginning
//   return data.slice(3, 67);
// };

// function createKeypair() {
//   const ID = () => {
//     return Math.random().toString(36).substring(2, 9);
//   };
//   const keys = session.generateKeyPair(
//     graphene.KeyGenMechanism.ECDSA,
//     {
//       keyType: graphene.KeyType.ECDSA,
//       id: Buffer.from([ID]), // Uniquer id for keys in storage https://www.cryptsoft.com/pkcs11doc/v230/group__SEC__9__7__KEY__OBJECTS.html
//       label: "EthreAddrees2",
//       token: true,
//       verify: true,
//       paramsECDSA: graphene.NamedCurve.getByName("secp256k1").value,
//     },
//     {
//       keyType: graphene.KeyType.ECDSA,
//       id: Buffer.from([ID]), // Uniquer id for keys in storage https://www.cryptsoft.com/pkcs11doc/v230/group__SEC__9__7__KEY__OBJECTS.html
//       label: "EthreAddrees2",
//       token: true,
//       sign: true,
//     }
//   );
//   let public_key = decodeECPointToPublicKey(
//     keys.publicKey.getAttribute({ pointEC: null }).pointEC
//   );

//   const address = util.keccak256(public_key); // keccak256 hash of publicKey
//   const buf2 = Buffer.from(address, "hex");
//   address_account = "0x" + buf2.subarray(-20).toString("hex");
//   return address_account;
// }

// function tranfer() {
//   if (slot.flags && graphene.SlotFlag.TOKEN_PRESENT) {
//     const allKeys = session.find({ class: graphene.ObjectClass.PRIVATE_KEY });
//     let pk;
//     for (let i = 0; i < allKeys.length; i++) {
//       if (
//         allKeys.items(i).getAttribute({ label: null }).label == "EthreAddrees1"
//       ) {
//         pk = allKeys.items(i);
//         break;
//       }
//     }

//     const allPubKeys = session.find({ class: graphene.ObjectClass.PUBLIC_KEY });
//     let pubk;
//     for (let i = 0; i < allPubKeys.length; i++) {
//       if (
//         allPubKeys.items(i).getAttribute({ label: null }).label ==
//         "EthreAddrees1"
//       ) {
//         pubk = allPubKeys.items(i);
//         break;
//       }
//     }
    
//     let public_key = decodeECPointToPublicKey(
//       pubk.getAttribute({ pointEC: null }).pointEC
//     );
//     const address = util.keccak256(public_key); // keccak256 hash of publicKey
//     const buf2 = Buffer.from(address, "hex");
   
//     console.log("public_key: ","0x" + buf2.subarray(-20).toString("hex"));
//     Transactions(pk, pubk);
//   }
// }

// async function createSign(msgHash, pk, pubk) {
//   let flag = true;
//   let tempsig;
//   let S;
//   let V;

//   try {
//     while (flag) {
//       const sign = session.createSign(graphene.MechanismEnum.ECDSA, pk);
//       tempsig = sign.once(msgHash);
//       S = tempsig.subarray(32);

//       let s_value = new BigNumber(S.toString("hex"), 16);

//       let secp256k1N = new BigNumber(
//         "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
//         16
//       );
//       let secp256k1halfN = secp256k1N.dividedBy(new BigNumber(2));
//       if (s_value.isLessThan(secp256k1halfN)) flag = false;
//     }
//     const rs = {
//       r: tempsig.subarray(0, 32),
//       s: tempsig.subarray(32, 64),
//     };
//     V = 27;
//     let recoverkey = util.ecrecover(msgHash, V, rs.r, rs.s);
//     let addressBuff = util.pubToAddress(recoverkey);
//     let recoverETHADRESS = util.bufferToHex(addressBuff);
    
//     if ("0xe23161c94d7d310eac4ac68c617df4cf2f4ec40a" != recoverETHADRESS) {
//       V = 28;
//       recoverkey = util.ecrecover(msgHash, V, rs.r, rs.s);
//       addressBuff = util.pubToAddress(recoverkey);
//       recoverETHADRESS = util.bufferToHex(addressBuff);
//     }
    
//     return {
//       v: V,
//       s: rs.s,
//       r: rs.r,
//     };
//   } catch (err) {
//     console.log(err);
//   }
// }

// async function Transactions(pk, pubk) {
//   let gasPrice = await web3.eth.getGasPrice();
//   const msgHash = util.keccak256(
//     Buffer.from("0x7D5D710FDc4267619570A2f0E80bA4532415E608")
//   );
//   const sign = await createSign(msgHash, pk, pubk);
//   console.log("Verified Ethereum address:", {
//     r: sign.r,
//     s: sign.s,
//     v: sign.v,
//   });
//   const value = 0.00001;
//   const wei = web3.utils.toWei(value.toString(), "ether");
//   const hex_value = web3.utils.toHex(wei);
//   const params_tx = {
//     nonce: await web3.eth.getTransactionCount(
//       "0xe23161c94d7d310eac4ac68c617df4cf2f4ec40a"
//     ),
//     gasPrice: web3.utils.toHex(gasPrice),
//     to: "0x7D5D710FDc4267619570A2f0E80bA4532415E608",
//     value: web3.utils.toHex(2000000000000000),
//     gasLimit: web3.utils.toHex(21208),
//     data: util.bufferToHex(Buffer.from("Hello cac ban")),
//     r: sign.r,
//     s: sign.s,
//     v: sign.v,
//   };

//   let transaction_tx = new Transaction(params_tx, {
//     common: new Common({ chain: Chain.Goerli }),
//     freeze: false,
//   });
//   const tx_hash = transaction_tx.getMessageToSign();

//   const tx_sign = await createSign(tx_hash, pk);
//   transaction_tx.r = new BN(tx_sign.r);
//   transaction_tx.s = new BN(tx_sign.s);
//   transaction_tx.v = new BN(tx_sign.v);

//   console.log("GAS: ", ethers.formatEther(transaction_tx.gasPrice));
//   const serializedTx = transaction_tx.serialize().toString("hex");
//   console.log("Signature: ", serializedTx);
//   await web3.eth.sendSignedTransaction("0x" + serializedTx);
// }

