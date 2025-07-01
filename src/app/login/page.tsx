'use client';

import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password);
    alert('✅ Logged in!');
  };

  const handleRegister = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
    alert('✅ Registered!');
  };

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4">Login or Register</h1>
      <input
        className="border w-full mb-2 p-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="border w-full mb-2 p-2"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex gap-4">
        <button onClick={handleLogin} className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
        <button onClick={handleRegister} className="bg-green-600 text-white px-4 py-2 rounded">Register</button>
      </div>
    </div>
  );
}
