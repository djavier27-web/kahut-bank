'use client';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [walletId, setWalletId] = useState('');
  const [topUpAmount, setTopUpAmount] = useState('');
  const [msg, setMsg] = useState('');

  // Fetch Transaksi untuk Monitoring
  const fetchTransactions = async () => {
    const res = await fetch('/api/transfer');
    if (res.ok) {
      const data = await res.json();
      setTransactions(data);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(fetchTransactions, 5000); // Polling tiap 5 detik
    return () => clearInterval(interval);
  }, []);

  // Submit Top Up Saldo
  const handleTopUp = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/topup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletId, amount: parseFloat(topUpAmount) })
    });

    if (res.ok) {
      setMsg('Top-Up Berhasil!');
      setTopUpAmount('');
      fetchTransactions();
    } else {
      setMsg('Top-Up Gagal.');
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1>Dashboard Admin Kahut Bank</h1>
      
      {/* Form Top Up */}
      <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Tambah Saldo User (Top-Up Manual)</h3>
        <form onSubmit={handleTopUp} style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Wallet ID / No Rekening User" 
            value={walletId} 
            onChange={(e) => setWalletId(e.target.value)} 
            style={{ padding: '8px', flex: '1' }}
            required 
          />
          <input 
            type="number" 
            placeholder="Nominal Rp" 
            value={topUpAmount} 
            onChange={(e) => setTopUpAmount(e.target.value)} 
            style={{ padding: '8px', width: '200px' }}
            required 
          />
          <button type="submit" style={{ padding: '8px 20px', background: '#28a745', color: '#fff', border: 'none' }}>
            Tambah Saldo
          </button>
        </form>
        {msg && <p style={{ color: 'green', marginTop: '10px' }}>{msg}</p>}
      </div>

      {/* Tabel Monitoring Transaksi */}
      <h3>Monitoring Transaksi Real-time</h3>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th>Waktu</th>
            <th>Kode Trx</th>
            <th>Tujuan</th>
            <th>No Rekening</th>
            <th>Nominal</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{new Date(t.createdAt).toLocaleString('id-ID')}</td>
              <td>{t.trxCode}</td>
              <td>{t.bankCode}</td>
              <td>{t.destinationAcc}</td>
              <td>Rp {Number(t.amount).toLocaleString('id-ID')}</td>
              <td style={{ color: t.status === 'SUCCESS' ? 'green' : t.status === 'FAILED' ? 'red' : 'orange', fontWeight: 'bold' }}>
                {t.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}