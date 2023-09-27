import graphene from "graphene-pk11";
import config from "./configENV.js";
const Module = graphene.Module;

const mod = Module.load(
    // "/home/caubexudua/softhsm-2.3.0/src/lib/.libs/libsofthsm2.so",
    //   "8ca59180f35e:/usr/local/lib/softhsm/libsofthsm2.so",
    // "/home/local/lib/softhsm/libsofthsm2.so",
    config.LIB,
    "SoftHSM"
);

mod.initialize();

const slot = mod.getSlots(0);
const session = slot.open(
  graphene.SessionFlag.RW_SESSION | graphene.SessionFlag.SERIAL_SESSION
);

session.login(config.PIN);

export {slot};
export {session};
