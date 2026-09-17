import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { walletId, amount } = await req.json();
    
    // Logika menambah saldo DB via ORM / Prisma
    console.log(`[DB TopUp] Wallet: ${walletId}, Added: Rp ${amount}`);

    return NextResponse.json({ success: true, message: 'Top up sukses' });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}