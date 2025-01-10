import {ethers} from "ethers";
export const connectWallet =async () =>{
    if(!windows.ethereum){
        alert("Metamask is Required!");
        return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    return signer;
};