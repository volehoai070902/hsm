import hsmroute from "./hsmRoute.js";
const index = (app)=>{
    app.use("/hsm", hsmroute);
}

export default index;