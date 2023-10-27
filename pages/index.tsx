import {
  useActiveClaimCondition,
  useActiveClaimConditionForWallet,
  useAddress,
  useContract,
  useContractMetadata,
  useTotalCirculatingSupply,
  useTotalCount,
} from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import { CONTRACT_ADDRESS } from "../const/addresses";

const Home: NextPage = () => {
  const address = useAddress();
  const { contract } = useContract(CONTRACT_ADDRESS);
  const { data: contractMetadata, isLoading: isContractMetadataLoading } =
    useContractMetadata(contract);

  const { data: activeClaimPhase, isLoading: isActiveClaimPhaseLoading } =
    useActiveClaimConditionForWallet(contract, address);

  const { data: totalSupply, isLoading: isTotalSupplyLoading } =
    useTotalCount(contract);

  const { data: TotalClaimed, isLoading: isTotalClaimedLoading } =
    useTotalCirculatingSupply(contract);

  const maxClaimable = parseInt(activeClaimPhase?.maxClaimablePerWallet || "0");

  return (
    <main className={styles.main}>
      <div className={styles.container}></div>
    </main>
  );
};

export default Home;
