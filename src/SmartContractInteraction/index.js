import { ethers } from "ethers";

let abi = [
  {
    inputs: [],
    stateMutability: "payable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "Stake",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "claim",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimDeadline",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "claimPeriodLeft",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "completeStake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "depositTimestamps",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "estimateStakingReward",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "fund",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "rewardRatePerSecond",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stakingCompleted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stakingDeadline",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stakingStarted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stakingTimeLeft",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "startStaking",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawContractFunds",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];
let deployedAddress = "0xb652078697F18a58C87AD35360d5F44515e040F0";

export async function getSigner() {
  if (window.ethereum) {
    // console.log("ethereum provider exists");
  } else {
    alert("Please install or Unlock metamask First !");
    return 0;
  }
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  // MetaMask requires requesting permission to connect users accounts
  await provider.send("eth_requestAccounts", []);

  // The MetaMask plugin also allows signing transactions to
  // send ether and pay to change state within the blockchain.
  // For this, you need the account signer...
  const signer = provider.getSigner();

  return signer;
}

export async function getContract(signer, setter) {
  let contract = new ethers.Contract(deployedAddress, abi, signer);
  if (setter) {
    setter(contract);
  }
  return contract;
}

export async function getEstimatedReward(contract) {
  try {
    let reward = await contract?.estimateStakingReward();
    return reward;
  } catch (e) {
    return 0;
  }
}

export async function getStakeDeadline(contract) {
  try {
    let time = await contract?.stakingTimeLeft();
    time = parseInt(time);
    console.log("staking left is ", time);
    return time;
  } catch (e) {
    console.log(e);
    return 0;
  }
}
export async function getClaimDeadline(contract) {
  try {
    let time = await contract?.claimPeriodLeft();
    time = parseInt(time);
    console.log("claiming left is ", time);

    return time;
  } catch (e) {
    console.log(e);
    return 0;
  }
}

export async function stakingRewardRatePerSecond(contract) {
  try {
    let reward_per_second = await contract?.rewardRatePerSecond();
    return parseFloat(reward_per_second);
  } catch (e) {
    console.log(e);
    return 0;
  }
}

export async function startStaking(contract, updator) {
  try {
    let res = await contract?.startStaking({
      value: ethers.utils.parseEther("0.1"),
    });
    await res.wait();

    updator();
  } catch (e) {
    console.log(e);
    updator();
  }
}
export async function claimReward(contract, updator) {
  try {
    let res = await contract?.claim();
    await res.wait();
    updator();
  } catch (e) {
    console.log(e);
    updator();
  }
}

export async function stakeAmount(contract, amount, updator) {
  try {
    console.log("staking ", amount, " matic");
    let res = await contract?.Stake({
      value: ethers.utils.parseEther(amount.toString()),
    });
    await res.wait();

    updator();
  } catch (e) {
    console.log(e);
    updator();
  }
}
