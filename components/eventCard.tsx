import Link from "next/link";
import styles from "../styles/Home.module.css";
import { truncateAddress } from "../utils/truncateAddress";
import { BigNumber } from "ethers";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment } from "@fortawesome/free-regular-svg-icons";

type EventCardProps = {
  walletAddress: string;
  newStatus: string;
  timeStamp: BigNumber;
};

export default function EventCard(props: EventCardProps) {
  const date = new Date(props.timeStamp.toNumber() * 1000);
  const [likes, setLikes] = useState(0);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comments, setComments] = useState(0);
  const [commentText, setCommentText] = useState("");

  const handleLike = () => {
    if (likes === 0) {
      setLikes(1);
    } else {
      setLikes(0);
    }
  };

  const toggleCommentInput = () => {
    setShowCommentInput(!showCommentInput);
  };

  const handleComment = () => {
    // Implement the functionality to add a comment
    if (commentText.trim() !== "") {
      setCommentText(""); // Clear the comment text input
      setComments(comments + 1);
    }
  };

  return (
    <div className={styles.eventCard}>
      <div className={styles.eventHeader}>
        <Link href={`account/${props.walletAddress}`} passHref>
          <p className={styles.connectedAddress}>{truncateAddress(props.walletAddress)}</p>
        </Link>
        <p className={styles.date}>{date.toLocaleString()}</p>
      </div>
      <p className={styles.newStatus}>{props.newStatus}</p>

      <div className={styles.actions}>
        <button onClick={handleLike}>
          <FontAwesomeIcon icon={faHeart} color={likes === 0 ? "gray" : "red"} size="lg" />
        </button>
        <span className={styles.likes}>{likes} Likes</span>

        <button onClick={toggleCommentInput}>
          <FontAwesomeIcon icon={faComment} size="lg" />
        </button>
        <span className={styles.comments}>{comments} Comments</span>
      </div>

      {showCommentInput && (
        <div className={styles.commentSection}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button onClick={handleComment}>Add</button>
        </div>
      )}
    </div>
  );
}
