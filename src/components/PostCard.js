import {
  doc,
  deleteDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { useState } from "react";

export const PostCard = ({ post, setPosts }) => {
  const { id, title, description, author, likes = [], dislikes = [] } = post;

  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedDescription, setUpdatedDescription] = useState(description);

  const userId = auth.currentUser?.uid; // “Only access uid if currentUser exists” OR const userId = auth.currentUser ? auth.currentUser.uid : undefined;
  const hasLiked = likes.includes(userId);
  const hasDisliked = dislikes.includes(userId);

  const postDate = post.createdAt
  ? new Date(post.createdAt.seconds * 1000).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  : "";


  async function handleUpdate() {
    await updateDoc(doc(db, "posts", id), {
      title: updatedTitle,
      description: updatedDescription,
    });

    setIsEditing(false);
  }

  async function handleDelete() {
    await deleteDoc(doc(db, "posts", id));
  }

  async function handleLike() {
    if (!userId) return;

    // 🔥 Optimistic UI update
    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === post.id
          ? {
              ...p,
              likes: hasLiked
                ? p.likes.filter((id) => id !== userId)
                : [...(p.likes || []), userId],
              dislikes: (p.dislikes || []).filter((id) => id !== userId),
            }
          : p
      )
    );

    // Firestore update
    const postRef = doc(db, "posts", post.id);
    await updateDoc(postRef, {
      likes: hasLiked ? arrayRemove(userId) : arrayUnion(userId),
      dislikes: arrayRemove(userId),
    });
  }

  async function handleDislike() {
    if (!userId) return;

    setPosts((prevPosts) =>
      prevPosts.map((p) =>
        p.id === post.id
          ? {
              ...p,
              dislikes: hasDisliked
                ? p.dislikes.filter((id) => id !== userId)
                : [...(p.dislikes || []), userId],
              likes: (p.likes || []).filter((id) => id !== userId),
            }
          : p
      )
    );

    const postRef = doc(db, "posts", post.id);
    await updateDoc(postRef, {
      dislikes: hasDisliked ? arrayRemove(userId) : arrayUnion(userId),
      likes: arrayRemove(userId),
    });
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <p className="title">{title}</p>
          {/* Author + Actions */}
          <div className="control">
            <span className="author-pill">
              {author.photoURL ? (
                <img
                  src={author.photoURL}
                  alt={author.name}
                  className="author-pic"
                />
              ) : (
                <i className="bi bi-person-circle author-icon"></i>
              )}
              <span className="author-name">{author.name}</span>
              <span className="post-date glow-green">{postDate}</span>
            </span>
          </div>
        </div>
        <p className="description">{description}</p>

        {/* 👍 👎 Reactions */}
        <div className="reaction-bar">
          <div className="like-dislike">
            <button
              className={`reaction-btn like ${hasLiked ? "active" : ""}`}
              onClick={handleLike}
            >
              <i className="bi bi-hand-thumbs-up-fill"></i>
              <span>{likes.length}</span>
            </button>

            <button
              className={`reaction-btn dislike ${hasDisliked ? "active" : ""}`}
              onClick={handleDislike}
            >
              <i className="bi bi-hand-thumbs-down-fill"></i>
              <span>{dislikes.length}</span>
            </button>
          </div>

          {userId === author.id && (
            <div className="actions">
              <i
                className="bi bi-pencil-fill edit-icon"
                onClick={() => setIsEditing(true)}
              ></i>
              <i
                className="bi bi-trash-fill delete-icon"
                onClick={handleDelete}
              ></i>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="edit-backdrop" onClick={() => setIsEditing(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Post</h2>
            <input
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              maxLength="50"
            />
            <textarea
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
              maxLength="600"
            />
            <div className="edit-buttons">
              <button className="save-btn" onClick={handleUpdate}>
                Save
              </button>
              <button
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
