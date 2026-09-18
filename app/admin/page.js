'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('kahut_admin_session', JSON.stringify(data.admin));
        router.push('/dashboard');
      } else {
        setError(data.message || 'Login Admin gagal.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#212529', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '380px', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
        <h2 style={{ margin: '0 0 5px 0', textAlign: 'center', color: '#dc3545' }}>Admin Portal</h2>
        <p style={{ margin: '0 0 20px 0', textAlign: 'center', color: '#666', fontSize: '13px' }}>Monitoring & Management Kahut Bank</p>

        {error && (
          <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '6px', marginBottom: '15px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold' }}>Username Admin:</label>
            <input 
              type="text" 
              placeholder="admin" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              required 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold' }}>Password:</label>
            <input 
              type="password" 
              placeholder="admin123" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              required 
            />
          </div>

          <div style={{ padding: '8px', background: '#fff3cd', borderRadius: '4px', fontSize: '11px', color: '#856404' }}>
            🔑 Akun Default Admin: Username <strong>admin</strong> | Password <strong>admin123</strong>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}
          >
            {loading ? 'Verifikasi...' : 'Masuk Dashboard Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}