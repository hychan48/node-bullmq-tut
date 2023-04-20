import {execCmdOnController} from "./SpawnExecOnController.mjs";

/* cmd commands */
export const killFirefoxCmd = "taskkill /IM firefox.exe /F"
export const launchFirefoxCmd = `"C:\\Program Files\\Mozilla Firefox\\firefox.exe"`
export async function launchFirefoxNT(taskKill=false){
  let out
  if(taskKill){
    //if i taskkill firefox... it causes an error when launching firefox...
    out = await execCmdOnController(killFirefoxCmd);
    // console.log(out);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  out = await execCmdOnController(launchFirefoxCmd);//stuck for some reason
  // console.log(out)
  return out;

}

export default {launchFirefoxNT}