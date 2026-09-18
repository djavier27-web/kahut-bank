'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', fullName, email, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('kahut_user_session', JSON.stringify(data.user));
        alert(`Buka Rekening Berhasil!\nNo Rekening: ${data.user.accountNumber}\nUID NFC Otomatis: ${data.user.nfcCardUid}`);
        router.push('/');
      } else {
        setError(data.message || 'Pendaftaran gagal.');
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6f9', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '420px', background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: '0 0 8px 0', textAlign: 'center', color: '#007bff' }}>Kahut Bank</h2>
        <p style={{ margin: '0 0 20px 0', textAlign: 'center', color: '#666', fontSize: '14px' }}>Buka Rekening Bank Sementara</p>

        {error && (
          <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '6px', marginBottom: '15px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold' }}>Nama Lengkap Nasabah:</label>
            <input 
              type="text" 
              placeholder="Contoh: Budi Santoso" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              required 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 'bold' }}>Alamat Email:</label>
            <input 
              type="email" 
              placeholder="budi@email.com" 
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
              placeholder="Minimal 6 karakter" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              required 
            />
          </div>

          <div style={{ padding: '10px', background: '#e9ecef', borderRadius: '6px', fontSize: '12px', color: '#495057' }}>
            ✨ Bonus Buka Rekening: Saldo Awal <strong>Rp 100.000</strong> & UID Card NFC Otomatis langsung di-generate!
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '5px' }}
          >
            {loading ? 'Membuat Rekening...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#666' }}>
          Sudah punya rekening? <Link href="/login" style={{ color: '#007bff', textDecoration: 'none', fontWeight: 'bold' }}>Masuk</Link>
        </p>
      </div>
    </div>
  );
}