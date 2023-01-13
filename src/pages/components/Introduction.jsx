import { Box, Button, Heading, HStack, VStack, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

function Introduction() {
  return (
    <HStack
      width={"100vw"}
      height={"100vh"}
      backgroundImage={`url("./intro_bg.png")`}
      backgroundSize={"cover"}
      color={"white"}
      padding={"10vw"}
    >
      <VStack
        width={["80vw", "70vw", "60vw", "30vw"]}
        align={["left"]}
        spacing={5}
        height={"100%"}
      >
        <Heading
          fontFamily={"sans-serif"}
          fontWeight={"900"}
          fontSize={["2.5em", "3.5em", "4.5em"]}
        >
          Earn while you sleep
        </Heading>
        <Text fontSize={"18px"}>
          Staker is a platform where you can stack your Ethereum Currency and
          Earn 0.01 Eth on each minute after you stake the money. Make sure to
          stake the money during staking period and claim the reward during the
          Claim period. So what are you waiting for ?
        </Text>
        <Link href={"/Stake"}>
          <Button colorScheme={"green"} width={"fit-content"}>
            Start Staking
          </Button>
        </Link>
      </VStack>
    </HStack>
  );
}

export default Introduction;
