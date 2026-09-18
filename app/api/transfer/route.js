import { NextResponse } from 'next/server';

// Mock Database Transaksi Sementara (Disimpan di Memory Server)
let transactionsDb = [
  {
    id: 'trx-001',
    trxCode: 'KAHUT-MOCK-1001',
    bankCode: 'GOPAY',
    destinationAcc: '081234567890',
    amount: 50000,
    status: 'SUCCESS',
    nfcUid: '04:A2:8B:1A:3C',
    createdAt: new Date().toISOString()
  }
];

// 1. Endpoint untuk Dashboard Admin Monitoring (GET)
export async function GET() {
  return NextResponse.json(transactionsDb);
}

// 2. Endpoint Eksekusi Transfer Tiruan / Local Processing (POST)
export async function POST(req) {
  try {
    const { nfcUid, bankCode, accountNo, amount } = await req.json();

    // Validasi Sederhana
    if (!accountNo || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Nomor rekening dan nominal harus diisi dengan benar!' },
        { status: 400 }
      );
    }

    // Buat Kode Transaksi Unik
    const trxCode = `KAHUT-LOCAL-${Date.now()}`;

    // Buat Data Transaksi Baru
    const newTransaction = {
      id: `trx-${Date.now()}`,
      trxCode: trxCode,
      bankCode: bankCode,
      destinationAcc: accountNo,
      amount: amount,
      status: 'SUCCESS', // Menganggap transfer langsung berhasil secara lokal
      nfcUid: nfcUid || 'TIDAK_ADA_NFC',
      createdAt: new Date().toISOString()
    };

    // Simpan ke array database simulasi
    transactionsDb.unshift(newTransaction);

    console.log('--- [SIMULASI TRANSFER LOCAL BERHASIL] ---');
    console.log(`Kode Trx: ${trxCode}`);
    console.log(`Tujuan: ${bankCode} - ${accountNo}`);
    console.log(`Nominal: Rp ${amount}`);
    console.log(`NFC UID: ${nfcUid || 'Manual Input'}`);

    // Return Respon Sukses ke Frontend User
    return NextResponse.json({
      success: true,
      trxCode: trxCode,
      message: `[MODUL LOKAL] Transfer Rp ${amount.toLocaleString('id-ID')} ke ${bankCode} (${accountNo}) BERHASIL!`
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}