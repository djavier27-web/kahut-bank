import { NextResponse } from 'next/server';

let usersDb = [
  {
    id: 'usr-1',
    fullName: 'Budi Santoso',
    email: 'budi@gmail.com',
    password: 'password123',
    accountNumber: '1002938471',
    balance: 150000,
    nfcCardUid: 'KAHUT-NFC-99881234'
  }
];

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, email, password, fullName } = body;

    if (action === 'register') {
      const existing = usersDb.find(u => u.email === email);
      if (existing) {
        return NextResponse.json({ success: false, message: 'Email sudah terdaftar!' }, { status: 400 });
      }

      const newUser = {
        id: `usr-${Date.now()}`,
        fullName,
        email,
        password,
        accountNumber: `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        balance: 100000,
        nfcCardUid: `KAHUT-NFC-${Math.floor(10000000 + Math.random() * 90000000)}`
      };

      usersDb.push(newUser);

      return NextResponse.json({
        success: true,
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
          accountNumber: newUser.accountNumber,
          balance: newUser.balance,
          nfcCardUid: newUser.nfcCardUid
        }
      });
    }

    if (action === 'login') {
      const user = usersDb.find(u => u.email === email && u.password === password);
      if (!user) {
        return NextResponse.json({ success: false, message: 'Email atau password salah!' }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          accountNumber: user.accountNumber,
          balance: user.balance,
          nfcCardUid: user.nfcCardUid
        }
      });
    }

    return NextResponse.json({ success: false, message: 'Action tidak valid' }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}