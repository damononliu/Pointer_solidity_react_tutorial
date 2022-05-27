import { useState, useEffect } from "react"
import PrimaryButton from "../components/primary-button";
// import abi from "../utils/Keyboards.json";
import { ethers } from "ethers";
import Keyboard from "../components/keyboard";
import addressesEqual from "../utils/addressesEqual";
import { UserCircleIcon } from "@heroicons/react/solid"
import TipButton from "../components/tipButton"
import getKeyboardsContract from "../utils/getKeyboardContract";
import { toast } from "react-hot-toast";


export default function Home() {

  const [ethereum, setEthereum] = useState(undefined);
  const [connectedAccount, setConnectedAccount] = useState(undefined);
  const [keyboards, setKeyboards] = useState([]);
  const [newKeyboard, setNewKeyboard] = useState("");
  const [keyboardLoading, setKeyboardLoading] = useState(false);

  const keyboardsContract = getKeyboardsContract(ethereum);

  // const contractAddress = "0x611b72c4df5e24ee90342c3a46f0153738f93b33"
  // const contractAddress = "0x7539Fcbf011C66C139090695B5f58Ea5FB8a97fe"

  // const contractABI = abi.abi;

  const handleAccounts = (accounts) => {
    if (accounts.length > 0) {
      const account = accounts[0];
      console.log('We have an authorized account: ', account);
      setConnectedAccount(account);
    } else {
      console.log("No authorized accounts yet")
    }
  };
  
  const getConnectedAccount = async () => {
    if (window.ethereum) {
      setEthereum(window.ethereum);
    }
  
    if (ethereum) {
      // matamask请求一个之前授权的账户
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      handleAccounts(accounts);
    }
  };

  const getKeyboards = async () => {
    if(ethereum && connectedAccount) {

        setKeyboardLoading(true);
        try {
          const keyboards = await keyboardsContract.getKeyboards();
          console.log("Retrieved keyboards...", keyboards);
          setKeyboards(keyboards);

        } finally {
          setKeyboardLoading(false);
        }

    }
  }

  const addContractEventHandlers = () => {
    if(connectedAccount && keyboardsContract) {
      keyboardsContract.on("KeyboardCreated", async (keyboard) => {
        if(!addressesEqual(keyboard.owner, connectedAccount)) {
          toast("somebody create a new keyboard!", {id: JSON.stringify(keyboard)})
        }
        await getKeyboards();
      })

      keyboardsContract.on("tipSent", (recipient, amount) => {
        if(addressesEqual(recipient, connectedAccount)) {
          toast(`You received a tip of ${ethers.utils.formatEther(amount)} ether`)
        }
      })
    }
  }

  useEffect(() => getConnectedAccount(), []);
  useEffect(() => getKeyboards(), [!!keyboardsContract, connectedAccount]);
  useEffect(() => addContractEventHandlers(), [!!keyboardsContract, connectedAccount]);

  const connectAccount = async() => {
    if(!ethereum) {
      alert("Metamask is required to connect to an account");
      return;
    }

    // 请求用户点击一个账户
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    handleAccounts(accounts);
  };


  // const submitCreate = async (e) => {
  //   e.preventDefault();

  //   if(!ethereum) {
  //     console.error('ethereum object is not available');
  //     return;
  //   }

  //   const provider = new ethers.providers.Web3Provider(ethereum);
  //   const signer = provider.getSigner();
  //   const keyboardsContract = new ethers.Contract(contractAddress, contractABI, signer);

  //   const createTxn = await keyboardsContract.create(newKeyboard);
  //   console.log('Create transaction started...', createTxn.hash);

  //   await createTxn.wait();
  //   console.log('Created keyboard!', createTxn.hash);

  //   await getKeyboards();

  // }

  if(!ethereum) {
    return <p>Please install Metamask to connect to this site!</p>
  }

  if(!connectedAccount) {
    return <PrimaryButton onClick={connectAccount}>Connect Metamask Wallet!</PrimaryButton>
  }

  if(keyboards.length > 0) {
    return (
      <div className="flex flex-col gap-4">
        <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
        {keyboards.map(
          ([kind, isPBT, filter, owner], i) => (
            <div key={i} className="relative">
              <Keyboard kind={kind} isPBT={isPBT} filter={filter} />
              <span className="absolute top-1 right-6">
                {addressesEqual(owner, connectedAccount) ?
                  <UserCircleIcon className="h-5 w-5 text-indigo-100" /> :
                  <TipButton keyboardsContract={keyboardsContract} index={i} />
                }
              </span>
            </div>
          )
        )}
        </div>
      </div>
    )
  }

  if(keyboardLoading) {
    return (
      <div>
        <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
        <p>Loading keyboards...</p>
      </div>
    )
  }

  return (
    
    // <div className="flex flex-col gap-y-8">
    //   <p>Connected Account: {connectedAccount}</p>
    //   <form className="flex flex-col gap-y-2">
    //     <label htmlFor="keyboard-description" className="block text-sm font-medium text-gray-700">
    //       Keyboard Description
    //     </label>
    //     <input
    //       name="keyboard-type"
    //       className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
    //       value={newKeyboard}
    //       onChange={(e) => { setNewKeyboard(e.target.value) }}
    //     />
    //     <PrimaryButton type="submit" onClick={submitCreate}>
    //       create keyboard!
    //     </PrimaryButton>
    //   </form>
    //   <div>{
    //     keyboards.map(
    //       (keyboard, i) => <p key={i}>{keyboard}</p>
    //     )
    //     }
    //   </div>
    // </div>
    
    <div>
      <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
      <p>No keyboards yet!</p>
    </div>
  )
  

}