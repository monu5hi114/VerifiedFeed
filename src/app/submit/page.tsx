'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SubmitPage() {
  const [title, setTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Generate summary first
      const aiRes = await fetch('/api/ai/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `${title} ${mediaUrl}` }),
      });

      const { summary } = await aiRes.json();

      if (!summary) {
        throw new Error('No summary generated');
      }

      // Step 2: Save the post with the summary
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, mediaUrl, summary }),
      });

      if (res.ok) {
        toast.success('✅ Post submitted successfully!');
        toast('🧠 AI Summary: ' + summary, { icon: '🤖' });
        setTitle('');
        setMediaUrl('');
      } else {
        toast.error('❌ Failed to submit post.');
      }
    } catch (error) {
      console.error(error);
      toast.error('⚠️ Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Submit a Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          required
          className="w-full p-2 border rounded"
        />
        <input
          value={mediaUrl}
          onChange={(e) => setMediaUrl(e.target.value)}
          placeholder="Media URL (optional)"
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </main>
  );
}
