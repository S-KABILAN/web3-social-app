import Link from "next/link";
import styles from "../styles/Home.module.css";
import { truncateAddress } from "../utils/truncateAddress";
import { useState, useRef } from "react";
import Lottie from "lottie-react";
import loadingLottie from "../public/loadingLottie.json";
import { STATUS_CONTRACT_ADDRESS } from "../constants/addresses";
import {
    ConnectWallet,
    Web3Button,
    useAddress,
    useContract,
    useContractRead,
    useDisconnect,
} from "@thirdweb-dev/react";

export default function UserStatus() {
    const address = useAddress();
    const disconnect = useDisconnect();
    const [newStatus, setNewStatus] = useState("");
    const [mediaFile, setMediaFile] = useState(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [characterCount, setCharacterCount] = useState(0);
    const characterDecoration = characterCount >= 140 ? styles.characterCountOver : styles.characterCountUnder;

    const mediaInputRef = useRef(null);

    const { contract } = useContract(STATUS_CONTRACT_ADDRESS);

    const { data: myStatus, isLoading: isMyStatusLoading } = useContractRead(contract, "getStatus", [address]);

    const handleMediaUpload = (e) => {
        const file = e.target.files[0];
        setMediaFile(file);
    };

    const updateStatus = async () => {
        if (contract) {
            // Combine text status with media upload logic here
            // For simplicity, we'll just set the text status in this example
            const tx = await contract.call("setStatus", [newStatus]);

            // You can handle the transaction response here (e.g., show a success message)
            console.log("Status update transaction hash:", tx.hash);
        }
        setIsStatusModalOpen(false);
        setNewStatus("");
    };

    if (!address) {
        return (
            <div>
                <ConnectWallet
                    modalSize="compact"
                    dropdownPosition={{
                        side: "bottom",
                        align: "start",
                    }}
                />
                <p>Please connect your wallet.</p>
            </div>
        );
    }

    if (isMyStatusLoading) {
        return (
            <div className={styles.sectionLoading}>
                <Lottie animationData={loadingLottie} loop={true} />
            </div>
        );
    }

    return (
        <div className={styles.userContainer}>
            <div className={styles.statusHeader}>
                <Link href={`/account/${address}`} style={{ color: "white" }}>
                    <p className={styles.connectedAddress}>{truncateAddress(address)}</p>
                </Link>
                <button className={styles.logoutButton} onClick={() => disconnect()}>
                    Logout
                </button>
            </div>

            {!isMyStatusLoading && myStatus && (
                <div>
                    <p className={styles.statusText}>{myStatus}</p>
                </div>
            )}
            <button className={styles.updateButton} onClick={() => setIsStatusModalOpen(true)}>
                Update
            </button>

            {isStatusModalOpen && (
                <div className={styles.statusModalContainer}>
                    <div className={styles.statusModal}>
                        <div className={styles.statusModalHeader}>
                            <p>New Status:</p>
                            <button onClick={() => setIsStatusModalOpen(false)}>Close</button>
                        </div>
                        <textarea
                            value={newStatus}
                            onChange={(e) => {
                                setNewStatus(e.target.value);
                                setCharacterCount(e.target.value.length);
                            }}
                            placeholder="Enter your status"
                        />
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleMediaUpload}
                            ref={mediaInputRef}
                        />
                        <div className={styles.characterCountContainer}>
                            <p className={characterDecoration}>{characterCount}/140</p>
                        </div>
                        <Web3Button
                            className={styles.statusModalButton}
                            contractAddress={STATUS_CONTRACT_ADDRESS}
                            action={updateStatus}
                            isDisabled={characterCount === 0 || characterCount > 140}
                        >
                            Update Status
                        </Web3Button>
                    </div>
                </div>
            )}
        </div>
    );
}
