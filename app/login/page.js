'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('kahut_user_session', JSON.stringify(data.user));
        router.push('/');
      } else {
        setError(data.message || 'Login gagal.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6f9', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: '0 0 10px 0', textAlign: 'center', color: '#007bff' }}>Kahut Bank</h2>
        <p style={{ margin: '0 0 20px 0', textAlign: 'center', color: '#666', fontSize: '14px' }}>Masuk ke Akun Nasabah</p>

        {error && (
          <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '6px', marginBottom: '15px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold' }}>Email Nasabah:</label>
            <input 
              type="email" 
              placeholder="nama@email.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              required 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold' }}>Password:</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#666' }}>
          Belum punya rekening? <Link href="/register" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Buka Rekening Baru</Link>
        </p>

        <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee', textAlign: 'center' }}>
          <Link href="/admin/login" style={{ fontSize: '12px', color: '#6c757d', textDecoration: 'none' }}>→ Portal Admin Kahut Bank</Link>
        </div>
      </div>
    </div>
  );
}