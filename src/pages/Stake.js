import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  VStack,
  Text,
  Input,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Stack,
  Img,
} from "@chakra-ui/react";
import Timer from "./components/Timer";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  claimReward,
  getClaimDeadline,
  getContract,
  getEstimatedReward,
  getSigner,
  getStakeDeadline,
  stakeAmount,
  stakingRewardRatePerSecond,
  startStaking,
} from "@/SmartContractInteraction";
import { useRouter } from "next/router";
function Stake() {
  const [stakingTimeRemaining, setStakingTimeRemaining] = useState(0);
  const [stakingAmount, setStakingAmount] = useState(0);
  const [claimTimeRemaining, setClaimTimeRemaining] = useState(0);
  const [claimDeadline, setClaimDeadline] = useState(null);
  const [stakeDeadline, setStakeDeadline] = useState(null);
  const [stakeReward, setStakeReward] = useState(0);
  const [perSecondStakingReward, setPerSecondStakingReward] = useState(0);
  const { address, isConnected } = useAccount();
  const [contract, setContract] = useState(null);
  const [Loader, setLoader] = useState(false);
  const Navigate = useRouter();

  async function ensureContractIsFetched() {
    if (!contract) {
      let _signer = await getSigner();
      let _contract = await getContract(_signer, setContract);
      return _contract;
    }
    return contract;
  }

  async function getStakingTime() {
    let _contract = await ensureContractIsFetched();
    let deadline_ = await getStakeDeadline(_contract);
    console.log("stake is ", deadline_);

    setStakingTimeRemaining(deadline_);

    if (deadline_ > 0) {
      setStakeDeadline(deadline_ + parseInt(Date.now() / 1000));
    } else setStakeDeadline(null);
  }
  async function getClaimTime() {
    let _contract = await ensureContractIsFetched();

    let deadline_ = await getClaimDeadline(_contract);
    console.log("claim is ", deadline_);

    setClaimTimeRemaining(deadline_);
    if (deadline_ > 0)
      setClaimDeadline(deadline_ + parseInt(Date.now() / 1000));
    else setClaimDeadline(null);
  }

  async function getPerSecondStakingReward() {
    let _contract = await ensureContractIsFetched();
    let stakingReward = await stakingRewardRatePerSecond(_contract);
    let rewardInETH = parseFloat(stakingReward / 10 ** 18);
    console.log("persecond is", rewardInETH);

    setPerSecondStakingReward(rewardInETH);
  }
  async function getStakingReward() {
    let _contract = await ensureContractIsFetched();
    let stakingReward = await getEstimatedReward(_contract);
    let rewardInETH = stakingReward / 10 ** 18;
    console.log("stake rewrd is ", rewardInETH);
    setStakeReward(rewardInETH);
  }
  async function startStakingOperation() {
    let _contract = await ensureContractIsFetched();
    setLoader(true);
    await startStaking(_contract, () => {
      Navigate.push("/");
    });
  }

  async function updateApp() {
    console.log("updating");
    await getStakingTime();

    await getPerSecondStakingReward();
    await getClaimTime();
    await getStakingReward();
  }
  useEffect(() => {
    if (address && claimDeadline == null) {
      updateApp();
    }
  }, [address]);

  async function stake() {
    if (stakingTimeRemaining) {
      alert("Staking " + stakingAmount + " MATIC !");
      let _contract = await ensureContractIsFetched();
      setLoader(true);
      await stakeAmount(_contract, stakingAmount, () => {
        setTimeout(() => {
          alert("Amount staked successfylly !");
          setLoader(false);
          updateApp();
        }, 2000);
      });
    } else {
      alert("Staking has not started yet.");
    }
  }
  async function claim() {
    if (claimTimeRemaining) {
      alert("Claiming your Staking reward");

      let _contract = await ensureContractIsFetched();
      setLoader(true);
      await claimReward(_contract, () => {
        setTimeout(() => {
          alert("Amount Claimed successfylly !");

          setLoader(false);
          updateApp();
        }, 2000);
      });
    } else if (stakingTimeRemaining) {
      alert("Claiming has not started.\n");
    } else {
      alert("Claiming has ended !");
    }
  }
  console.log({
    claimDeadline,
    claimTimeRemaining,
    stakeDeadline,
    stakingTimeRemaining,
  });

  return (
    <Box
      width={"100vw"}
      height={"100vh"}
      backgroundImage={`url("./staking_bg.png")`}
      backgroundSize={"cover"}
      color={"white"}
      align={"center"}
      justify={"center"}
      paddingTop={"20vh"}
    >
      <VStack
        width={"70vw"}
        height={"70vh"}
        color={"white"}
        padding={"10vw"}
        border={"1px solid grey"}
        bg={"rgba(0,0,0,0.5)"}
        borderRadius={"20px"}
        justify={"center"}
      >
        {!address ? (
          <ConnectButton />
        ) : (
          <VStack paddingTop={["20vh", "10vh"]} justify={"flex-start"}>
            <Tabs colorScheme={"cyan"}>
              <TabList
                width={"fit-content"}
                display={"flex"}
                justifyContent={"space-between"}
              >
                <Tab>Stake</Tab>
                <Tab>Claim</Tab>
              </TabList>

              <TabPanels>
                <TabPanel justifyItems={"space-between"}>
                  <Stack
                    align={"center"}
                    direction={["column", "column", "row"]}
                    spacing={5}
                  >
                    <Heading>
                      {stakingTimeRemaining > 0 &&
                        stakeDeadline !== null &&
                        "Staking ends in"}
                      {stakeDeadline == null &&
                        claimDeadline == null &&
                        "Staking is Ended"}
                      {!stakeDeadline &&
                        claimTimeRemaining > 0 &&
                        claimDeadline !== null &&
                        "Claiming is Active"}
                    </Heading>
                    {stakingTimeRemaining > 0 && stakeDeadline != null && (
                      <Timer
                        timeUpdator={setStakingTimeRemaining}
                        deadline={stakeDeadline}
                        deadlineSetter={setStakeDeadline}
                        title={"stake"}
                      />
                    )}
                  </Stack>

                  <VStack height={"60vh"} paddingTop={"10vh"} spacing={10}>
                    {!stakeDeadline && !claimDeadline ? (
                      <Button
                        onClick={startStakingOperation}
                        colorScheme={"cyan"}
                      >
                        {Loader ? "Staking..." : "Start Staking"}
                      </Button>
                    ) : (
                      <>
                        <Input
                          variant="outline"
                          placeholder="Amount to stake (ETH)"
                          onChange={(e) => {
                            setStakingAmount(parseFloat(e.target.value));
                          }}
                        />
                        <Input
                          variant="outline"
                          value={
                            stakingAmount
                              ? `Estimated Profit ${parseFloat(
                                  stakingAmount *
                                    perSecondStakingReward *
                                    stakingTimeRemaining
                                ).toFixed(2)} ETH`
                              : "Enter Staking Amount. Hurry up !"
                          }
                        />

                        <Button
                          disabled={
                            !stakeDeadline &&
                            claimTimeRemaining > 0 &&
                            claimDeadline !== null &&
                            true
                          }
                          onClick={stake}
                          colorScheme={"green"}
                        >
                          {Loader ? "Staking..." : "Stake"}
                        </Button>
                      </>
                    )}
                  </VStack>
                </TabPanel>
                <TabPanel
                  height={"fit-content"}
                  minH={"70vh"}
                  justifyItems={"space-between"}
                >
                  <Stack
                    wrap={"wrap"}
                    direction={["column", "column", "row"]}
                    spacing={6}
                    align={"center"}
                    height={
                      !stakeDeadline && claimDeadline ? "fit-content" : "60vh"
                    }
                  >
                    <Heading>
                      {stakingTimeRemaining > 0 &&
                        stakeDeadline &&
                        "Staking is Active"}
                      {stakeDeadline == null &&
                        claimDeadline == null &&
                        "Claiming is Ended."}
                      {!stakeDeadline &&
                        claimTimeRemaining > 0 &&
                        claimDeadline !== null &&
                        "Claiming ends in"}
                    </Heading>

                    {!stakeDeadline && claimDeadline && (
                      <Timer
                        timeUpdator={setClaimTimeRemaining}
                        deadline={claimDeadline}
                        deadlineSetter={setClaimDeadline}
                        title={"claim"}
                      />
                    )}
                  </Stack>
                  {!stakeDeadline && claimDeadline && (
                    <VStack height={"60vh"} paddingTop={"10vh"} spacing={5}>
                      <HStack spacing={5}>
                        <Text>Your Staking Earnings are </Text>
                        <HStack spacing={2}>
                          <Text>{parseFloat(stakeReward).toFixed(2)} </Text>
                          <Img
                            height={6}
                            src="https://raw.githubusercontent.com/umaresso/cryptocurrency-icons/master/128/color/matic.png"
                          />{" "}
                        </HStack>
                      </HStack>

                      <Button
                        disabled={
                          parseFloat(stakeReward).toFixed(2) == 0.0 ||
                          Loader == true
                        }
                        onClick={claim}
                        colorScheme={"green"}
                      >
                        {Loader ? "Claiming" : "Claim"}
                      </Button>
                    </VStack>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        )}
      </VStack>
    </Box>
  );
}

export default Stake;
