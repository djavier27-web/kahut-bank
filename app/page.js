'use client';
import { useState } from 'react';

export default function UserApp() {
  const [nfcUid, setNfcUid] = useState('');
  const [bankCode, setBankCode] = useState('GOPAY');
  const [accountNo, setAccountNo] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Scan NFC lewat Web NFC API
  const scanNFC = async () => {
    if (!('NDEFReader' in window)) {
      alert('Akses NFC membutuhkan browser Chrome Android / Webview APK dengan HTTPS.');
      return;
    }
    try {
      const ndef = new NDEFReader();
      await ndef.scan();
      setStatus('Tempelkan kartu NFC ke HP...');
      ndef.addEventListener('reading', ({ serialNumber }) => {
        setNfcUid(serialNumber);
        setStatus(`Kartu NFC Terbaca: ${serialNumber}`);
      });
    } catch (err) {
      setStatus(`Error NFC: ${err.message}`);
    }
  };

  // Submit Transfer ke API
  const handleTransfer = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('Memproses transaksi...');

    try {
      const res = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nfcUid,
          bankCode,
          accountNo,
          amount: parseFloat(amount)
        })
      });

      const result = await res.json();
      if (res.ok) {
        setStatus(`BERHASIL! Ref ID: ${result.trxCode}`);
        setAmount('');
        setAccountNo('');
      } else {
        setStatus(`GAGAL: ${result.message}`);
      }
    } catch (err) {
      setStatus(`Error System: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
      <h2>Kahut Bank Mobile</h2>
      
      <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px' }}>
        <button onClick={scanNFC} style={{ width: '100%', padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Scan Kartu NFC
        </button>
        <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#555' }}>
          UID: <strong>{nfcUid || 'Belum di-scan'}</strong>
        </p>
      </div>

      <form onSubmit={handleTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label>Tujuan Transfer:</label>
        <select value={bankCode} onChange={(e) => setBankCode(e.target.value)} style={{ padding: '10px' }}>
          <option value="GOPAY">GoPay</option>
          <option value="OVO">OVO</option>
          <option value="DANA">DANA</option>
          <option value="BCA">BCA</option>
          <option value="BRI">BRI</option>
        </select>

        <input 
          type="text" 
          placeholder="Nomor HP / Rekening Target" 
          value={accountNo} 
          onChange={(e) => setAccountNo(e.target.value)} 
          style={{ padding: '10px' }}
          required 
        />

        <input 
          type="number" 
          placeholder="Nominal Transfer (Rp)" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          style={{ padding: '10px' }}
          required 
        />

        <button type="submit" disabled={loading} style={{ padding: '12px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
          {loading ? 'Memproses...' : 'Kirim Uang'}
        </button>
      </form>

      {status && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#f8f9fa', borderLeft: '4px solid #007bff' }}>
          {status}
        </div>
      )}
    </div>
  );
}