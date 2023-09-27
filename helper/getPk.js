import { LangEn } from "ethers";
import { session, slot } from "../config/connectsoftHsm.js";
import graphene from "graphene-pk11";
function getPk(label){

    if (slot.flags && graphene.SlotFlag.TOKEN_PRESENT) {
        const allKeys = session.find({ class: graphene.ObjectClass.PRIVATE_KEY });
        let pk;
        for (let i = 0; i < allKeys.length; i++) {
          if (
            allKeys.items(i).getAttribute({ id: null }).id == label
          ) {
            pk = allKeys.items(i);
            break;
          }
        }
    
        const allPubKeys = session.find({ class: graphene.ObjectClass.PUBLIC_KEY });
        let pubk;
        for (let i = 0; i < allPubKeys.length; i++) {
          if (
            allPubKeys.items(i).getAttribute({ id: null }).id ==
            label
          ) {
            pubk = allPubKeys.items(i);
            break;
          }
        }
        
        return pk;
        // let public_key = decodeECPointToPublicKey(
        //   pubk.getAttribute({ pointEC: null }).pointEC
        // );
        // const address = util.keccak256(public_key); // keccak256 hash of publicKey
        // const buf2 = Buffer.from(address, "hex");
       
        // console.log("public_key: ","0x" + buf2.subarray(-20).toString("hex"));
        // Transactions(pk, pubk);
      }
}

export default getPk;