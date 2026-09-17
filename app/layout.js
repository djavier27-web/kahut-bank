export const metadata = {
  title: 'Kahut Bank',
  description: 'Aplikasi Perbankan & Transfer NFC',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ margin: 0, padding: 0, fontFamily: 'sans-serif' }}>
        {children}
      </body>
    </html>
  );
}