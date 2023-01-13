import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  HStack,
  VStack,
  Text,
  Input,
  InputGroup,
  InputLeftAddon,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Stack,
} from "@chakra-ui/react";
import Link from "next/link";
import { ethers } from "ethers";
import Timer from "./components/Timer";

function Stake() {
  const [address, setAddress] = useState(null);
  const [stakingTimeRemaining, setStakingTimeRemaining] = useState(0);
  const [stakingAmount, setStakingAmount] = useState(0);

  async function connectWallet() {
    if (window.ethereum) {
      console.log("ethereum provider exists");
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
    const address_ = await signer.getAddress();
    setAddress(address_);
  }

  async function getStakingTime() {
    let stakingTime = 10;
    setStakingTimeRemaining(stakingTime);
  }

  useEffect(() => {
    if (address) getStakingTime();
  }, [address]);

  async function stake() {
    if (stakingTimeRemaining) alert("staking your amount");
    else {
      alert("Staking has not started yet.");
    }
  }

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
          <Button onClick={connectWallet} colorScheme={"blue"}>
            Connect Wallet
          </Button>
        ) : (
          <VStack paddingTop={"10vh"} justify={"flex-start"}>
            <Tabs>
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
                  <Heading>
                    <Stack direction={["column", "column", "row"]} spacing={5}>
                      <Text>
                        {stakingTimeRemaining
                          ? "Staking Ends in"
                          : "Staking has not started yet!"}{" "}
                      </Text>
                      {stakingTimeRemaining && (
                        <Timer
                          stakeTimeUpdator={setStakingTimeRemaining}
                          deadline={new Date().setSeconds(
                            new Date().getSeconds() + 20
                          )}
                        />
                      )}
                    </Stack>
                  </Heading>
                  <VStack height={"60vh"} paddingTop={"10vh"} spacing={10}>
                    <Input
                      variant="outline"
                      placeholder="Amount to stake (ETH)"
                      onChange={(e) => {
                        setStakingAmount(e.target.value);
                      }}
                    />
                    <Input
                      variant="outline"
                      value={
                        stakingAmount
                          ? `Estimated Profit ${
                              stakingAmount * 0.01 * stakingTimeRemaining
                            } ETH`
                          : "Enter Staking Amount. Hurry up !"
                      }
                    />

                    <Button onClick={stake} colorScheme={"green"}>
                      Stake
                    </Button>
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <Input
                    variant="outline"
                    placeholder="Amount to stake (ETH)"
                  />
                  <Button colorScheme={"green"}>Claim</Button>
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
