'use client';

import React, { useEffect, useState } from 'react';

// ----------------------------
// Type Definitions
// ----------------------------

type Comment = {
  id: string;
  content: string;
  proofUrl?: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
};

type Post = {
  id: string;
  title: string;
  mediaUrl?: string;
  summary?: string;
  mediaLinks?: string;
  realVotes: number;
  fakeVotes: number;
  createdAt: string;
  comments?: Comment[];
};

// ----------------------------
// Component
// ----------------------------

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts with comments
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Vote on post
  const votePost = async (id: string, type: 'real' | 'fake') => {
    try {
      const res = await fetch(`/api/posts/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType: type }),
      });

      if (res.ok) {
        const updated = await res.json();
        setPosts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
      } else {
        console.error('Post vote failed');
      }
    } catch (err) {
      console.error('Error voting on post:', err);
    }
  };

  // Submit comment
  const submitComment = async (
    e: React.FormEvent<HTMLFormElement>,
    postId: string
  ) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const content = formData.get('content')?.toString().trim();
    const proofUrl = formData.get('proofUrl')?.toString().trim();

    if (!content) return;

    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId, content, proofUrl }),
    });

    if (res.ok) {
      const newComment = await res.json();
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? { ...p, comments: [...(p.comments || []), newComment] }
            : p
        )
      );
      form.reset();
    }
  };

  // Vote on comment
  const voteComment = async (
    commentId: string,
    type: 'upvote' | 'downvote',
    postId: string
  ) => {
    try {
      const res = await fetch(`/api/comments/${commentId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType: type }),
      });

      if (res.ok) {
        const updatedComment = await res.json();
        setPosts((prev) =>
          prev.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: post.comments?.map((c) =>
                    c.id === updatedComment.id ? updatedComment : c
                  ),
                }
              : post
          )
        );
      }
    } catch (err) {
      console.error('Error voting on comment:', err);
    }
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">🔍 Community Feed</h1>
      <p className="text-gray-600 mb-4">
        This is where you'll see all submitted and verified posts.
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts yet. Be the first to submit one!</p>
      ) : (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.id} className="border p-4 rounded shadow bg-white">
              <h2 className="text-lg font-semibold">{post.title}</h2>

              {post.mediaUrl && (
                <a
                  href={post.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm mt-1 block"
                >
                  View Media
                </a>
              )}

              {post.summary && (
                <p className="mt-3 text-gray-700 italic">🧠 {post.summary}</p>
              )}

              <div className="mt-4 flex gap-4 text-sm">
                <button
                  onClick={() => votePost(post.id, 'real')}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200"
                >
                  ✅ Real ({post.realVotes})
                </button>
                <button
                  onClick={() => votePost(post.id, 'fake')}
                  className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                >
                  ❌ Fake ({post.fakeVotes})
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Posted on {new Date(post.createdAt).toLocaleString()}
              </p>

              {/* Submit comment */}
              <form
                onSubmit={(e) => submitComment(e, post.id)}
                className="mt-4 space-y-2"
              >
                <input
                  name="content"
                  placeholder="Write a comment..."
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  name="proofUrl"
                  placeholder="Proof link (optional)"
                  className="w-full p-2 border rounded"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  Submit Comment
                </button>
              </form>

              {/* Comment list */}
              {post.comments && post.comments.length > 0 && (
                <div className="mt-4 text-sm">
                  <p className="font-semibold text-gray-600 mb-2">💬 Comments:</p>
                  <ul className="space-y-2">
                    {post.comments.map((c) => (
                      <li key={c.id} className="bg-gray-100 p-2 rounded">
                        <p>{c.content}</p>
                        {c.proofUrl && (
                          <a
                            href={c.proofUrl}
                            target="_blank"
                            className="text-blue-600 text-xs underline"
                          >
                            View Proof
                          </a>
                        )}

                        <div className="flex gap-4 text-sm mt-2">
                          <button
                            onClick={() => voteComment(c.id, 'upvote', post.id)}
                            className="bg-green-50 text-green-700 px-2 py-1 rounded hover:bg-green-100"
                          >
                            👍 {c.upvotes}
                          </button>
                          <button
                            onClick={() => voteComment(c.id, 'downvote', post.id)}
                            className="bg-red-50 text-red-700 px-2 py-1 rounded hover:bg-red-100"
                          >
                            👎 {c.downvotes}
                          </button>
                        </div>

                        <p className="text-xs text-gray-500 mt-1">
                          Posted on {new Date(c.createdAt).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
