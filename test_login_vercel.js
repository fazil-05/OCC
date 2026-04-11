const fetch = require('node-fetch');

async function test() {
  const res = await fetch('https://off-campus-club.vercel.app/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'spherefulltos@gmail.com', password: 'TestReset@123' })
  });
  const data = await res.json();
  console.log(data);
}
test();
