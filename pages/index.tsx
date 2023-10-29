import {
  MediaRenderer,
  Web3Button,
  useActiveClaimCondition,
  useActiveClaimConditionForWallet,
  useAddress,
  useClaimIneligibilityReasons,
  useContract,
  useContractMetadata,
  useTotalCirculatingSupply,
  useTotalCount,
} from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";
import { NextPage } from "next";
import { CONTRACT_ADDRESS } from "../const/addresses";
import { ethers } from "ethers";
import { useState } from "react";

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

  const [claimQuantity, setClaimQuantity] = useState(1);
  const increment = () => {
    if (claimQuantity < maxClaimable) {
      // Change to maxClaimable
      setClaimQuantity(claimQuantity + 1);
    }
  };

  const decrement = () => {
    if (claimQuantity > 1) {
      setClaimQuantity(claimQuantity - 1);
    }
  };

  const { data: claimIneligibility, isLoading: isClaimIneleiigibilityLoading } =
    useClaimIneligibilityReasons(contract, {
      walletAddress: address || "",
      quantity: claimQuantity,
    });

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        {!isContractMetadataLoading && (
          <div className={styles.heroSection}>
            <div>
              <MediaRenderer
                className={styles.imgCard}
                src={contractMetadata?.image}
              />
            </div>
            <div className={styles.writeUp}>
              <h1 className={styles.headerCard}>{contractMetadata?.name}</h1>
              <p>{contractMetadata?.description}</p>
              {!isActiveClaimPhaseLoading ? (
                <div>
                  <p>Claim Phase: {activeClaimPhase?.metadata?.name}</p>
                  <p>
                    Price: {ethers.utils.formatUnits(activeClaimPhase?.price!)}
                  </p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
              {!isTotalSupplyLoading && !isTotalClaimedLoading ? (
                <p>
                  Claimed: {TotalClaimed?.toNumber()} /{" "}
                  {totalSupply?.toNumber()}
                </p>
              ) : (
                <p>Loading...</p>
              )}

              {address ? (
                !isClaimIneleiigibilityLoading ? (
                  claimIneligibility?.length! > 0 ? (
                    claimIneligibility?.map((reason, index) => (
                      <p key={index}>{reason}</p>
                    ))
                  ) : (
                    <div>
                      <p>
                        You are eligible to claim
                        {` {max claimable: ${maxClaimable})`}
                      </p>
                      <div className={styles.claimContainer}>
                        <div className={styles.claimValue}>
                          <button
                            className={styles.claimBtn}
                            onClick={decrement}
                          >
                            -
                          </button>
                          <input
                            className={styles.claimInput}
                            type="number"
                            value={claimQuantity}
                          />
                          <button
                            onClick={increment}
                            className={styles.claimBtn}
                          >
                            +
                          </button>
                        </div>
                        <Web3Button
                          contractAddress={CONTRACT_ADDRESS}
                          action={(contract) =>
                            contract.erc721.claim(claimQuantity)
                          }
                        >
                          Claim Nft
                        </Web3Button>
                      </div>
                    </div>
                  )
                ) : (
                  <p>Loading...</p>
                )
              ) : (
                <p> Connect wallet to claim nft</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
