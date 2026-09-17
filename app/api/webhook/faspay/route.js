import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();

    const trxCode = body.merchant_tran_id;
    const status = body.status_desc; // 'SUCCESS' atau 'FAILED'

    if (status === 'SUCCESS') {
      console.log(`[WEBHOOK SUCCESS] Transaction ${trxCode} BERHASIL.`);
      // Update DB -> Status = SUCCESS
    } else {
      console.log(`[WEBHOOK FAILED] Transaction ${trxCode} GAGAL. Rollback Saldo!`);
      // Update DB -> Status = FAILED & Kembalikan Saldo User
    }

    // Wajib beri respon balik ke Faspay
    return NextResponse.json({ response_code: "00", response_desc: "OK" });
  } catch (err) {
    return NextResponse.json({ response_code: "99", response_desc: err.message }, { status: 500 });
  }
}