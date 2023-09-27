import { session, slot } from "../config/connectsoftHsm.js";
import graphene from "graphene-pk11";
import BigNumber from "bignumber.js";
import util from "ethereumjs-util";

async function createSign(msgHash, pk, address) {
  let flag = true;
  let tempsig;
  let S;
  let V;
  console.log("Address: ",address);
  try {
    while (flag) {
      const sign = session.createSign(graphene.MechanismEnum.ECDSA, pk);
      tempsig = sign.once(msgHash);
      S = tempsig.subarray(32);

      let s_value = new BigNumber(S.toString("hex"), 16);

      let secp256k1N = new BigNumber(
        "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
        16
      );
      let secp256k1halfN = secp256k1N.dividedBy(new BigNumber(2));
      if (s_value.isLessThan(secp256k1halfN)) flag = false;
    }
    const rs = {
      r: tempsig.subarray(0, 32),
      s: tempsig.subarray(32, 64),
    };
    V = 27;
    
    let recoverkey = util.ecrecover(msgHash, V, rs.r, rs.s);
    let addressBuff = util.pubToAddress(recoverkey);
    let recoverETHADRESS = util.bufferToHex(addressBuff);

    if (address != recoverETHADRESS) {
      V = 28;
      recoverkey = util.ecrecover(msgHash, V, rs.r, rs.s);
      addressBuff = util.pubToAddress(recoverkey);
      recoverETHADRESS = util.bufferToHex(addressBuff);
    }

    return {
      v: V,
      s: rs.s,
      r: rs.r,
    };
  } catch (err) {
    console.log(err);
  }
}

export default createSign;