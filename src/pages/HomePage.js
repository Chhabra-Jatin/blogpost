import { useEffect, useState, useRef, useMemo } from "react";
import { useTitle } from "../hooks/useTitle";
import { onSnapshot, query, orderBy, collection } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { PostCard, SkeletonCard } from "../components";
import { onAuthStateChanged } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";

export const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showMyPosts, setShowMyPosts] = useState(true);
  const [showAllPosts, setShowAllPosts] = useState(true);

  const [sortBy, setSortBy] = useState("Select"); // newest | oldest | liked

  useTitle("Home");

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setCurrentUser);
    return () => unsub();
  }, []);

  // Fetch posts
  useEffect(() => {
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // My Posts (never sorted by UI)
  const userPosts = useMemo(() => {
    if (!currentUser) return [];
    return posts.filter((p) => p.author.id === currentUser.uid);
  }, [posts, currentUser]);

  // All Other Posts
  const otherPosts = useMemo(() => {
    if (!currentUser) return posts;
    return posts.filter((p) => p.author.id !== currentUser.uid);
  }, [posts, currentUser]);

  // Sorted All Posts (IMPORTANT)
  const sortedOtherPosts = [...otherPosts].sort((a, b) => {
    if (sortBy === "liked") {
      const likeDiff = (b.likes?.length || 0) - (a.likes?.length || 0);

      if (likeDiff !== 0) return likeDiff;

      // tie-breaker → newest first
      return b.createdAt?.seconds - a.createdAt?.seconds;
    }

    if (sortBy === "oldest") {
      return a.createdAt?.seconds - b.createdAt?.seconds;
    }

    // newest (default)
    return b.createdAt?.seconds - a.createdAt?.seconds;
  });

  return (
    <section>
      {/* Loading */}
      {loading && (
        <>
          <SkeletonCard />
          <SkeletonCard />
        </>
      )}

      {/* My Posts */}
      {!loading && currentUser && (
        <>
          <div
            className="posts-header clickable"
            onClick={() => setShowMyPosts((prev) => !prev)}
          >
            <h2 className="section-title">
              <i
                className={`bi bi-chevron-right collapse-icon ${
                  showMyPosts ? "open" : ""
                }`}
              ></i>
              My Posts
            </h2>
          </div>

          <AnimatePresence>
            {showMyPosts && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ overflow: "hidden" }}
              >
                {userPosts.length > 0 ? (
                  userPosts.map((post) => (
                    <PostCard key={post.id} post={post} setPosts={setPosts}/>
                  ))
                ) : (
                  <div className="empty-state">
                    <i className="bi bi-emoji-frown empty-icon" />
                    <p>You haven't written any posts yet.</p>
                    <p>✍️ Click on 'Create' to write your first post</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="section-divider" />
        </>
      )}

      {/* All Posts Header + Sort */}
      {!loading && (
        <div className="posts-header">
          <div
            className="posts-header clickable"
            onClick={() => setShowAllPosts((prev) => !prev)}
          >
            <h2 className="section-title">
              <i
                className={`bi bi-chevron-right collapse-icon ${
                  showAllPosts ? "open" : ""
                }`}
              ></i>
              All Posts
            </h2>
          </div>

          <div className="sort-box">
            <span className="sort-label">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="select">Select</option>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="liked">Most liked</option>
            </select>
          </div>
        </div>
      )}

      {/* All Posts List */}
      <AnimatePresence>
        {showAllPosts && !loading && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: "hidden" }}
          >
            {/* Case 1: Other users' posts exist */}
            {sortedOtherPosts.length > 0 &&
              sortedOtherPosts.map((post) => (
                <PostCard key={post.id} post={post} setPosts={setPosts} />
              ))}

            {/* Case 2: Logged-in user has posts, but others don't */}
            {sortedOtherPosts.length === 0 &&
              currentUser &&
              userPosts.length > 0 && (
                <div className="empty-state">
                  <i className="bi bi-emoji-frown empty-icon" />
                  <h2>No posts from others yet</h2>
                </div>
              )}

            {/* Case 3: No posts at all */}
            {posts.length === 0 && (
              <div className="empty-state">
                <i className="bi bi-emoji-frown empty-icon" />
                <h2>No posts yet</h2>
                <p>Be the first one to create a post ✨</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
