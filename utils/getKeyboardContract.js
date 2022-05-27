import { ethers } from 'ethers';

import abi from "../utils/Keyboards.json";

const contractAddress = "0x7539Fcbf011C66C139090695B5f58Ea5FB8a97fe";
const contractABI = abi.abi;

export default function getKeyboardsContract(ethereum) {
    if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        return new ethers.Contract(contractAddress, contractABI, signer);
    } else {
        return undefined;
    }
}