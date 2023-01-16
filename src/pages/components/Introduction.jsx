import {
  Box,
  Button,
  Heading,
  HStack,
  VStack,
  Text,
  Stack,
  Img,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

function Introduction() {
  return (
    <Stack
      width={"100vw"}
      minH={"100vh"}
      bg={"black"}
      height={"fit-content"}
      color={"white"}
      justify={"center"}
      align={"center"}
      paddingTop={["15vh", "10vh", "5vh"]}
      direction={["column", "column", "column", "row"]}
    >
      <VStack paddingLeft={"5vw"} width={["70vw"]} spacing={5} align={"left"}>
        <Heading
          fontFamily={"sans-serif"}
          fontWeight={"900"}
          fontSize={["2.5em", "2.5em", "3.5em", "5.5em"]}
        >
          Earn while you sleep
        </Heading>
        <Text fontSize={"18px"}>
          Staker is a platform where you can stack your Ethereum Currency and
          Earn 0.001 Eth on each second after you stake the money. Make sure to
          stake the money during staking period and claim the reward during the
          Claim period. So what are you waiting for ?
        </Text>
        <Link href={"/Stake"}>
          <Button colorScheme={"green"} width={"fit-content"}>
            Start Staking
          </Button>
        </Link>
      </VStack>
      <Img
        justify={"center"}
        width={["100%", "80%", "60%"]}
        height={["80%", "70%", "60%"]}
        objectFit={"contain"}
        src="./intro_bg.png"
      />
    </Stack>
  );
}

export default Introduction;
