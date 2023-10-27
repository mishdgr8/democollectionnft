import React from "react";
import Link from "next/link";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import styles from "./../styles/Home.module.css"; // Import the CSS styles

const Navbar = () => {
  const address = useAddress();
  return (
    <div className={styles.navbar}>
      <div className={styles.navItem}>
        <Link href="/">
          <p className={`${(styles.navItem, styles.logo)}`}>
            DemoNft Collection
          </p>
        </Link>
      </div>
      <div className={styles.navItem}>
        {address && (
          <Link href={`/profile/${address}`}>
            <p>My Nfts</p>
          </Link>
        )}
      </div>
      <div className={styles.navItem}>
        <ConnectWallet />
      </div>
    </div>
  );
};

export default Navbar;
