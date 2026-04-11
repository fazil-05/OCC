const fetch = require('node-fetch');

async function test() {
  // Step 1: Login and get the token from Set-Cookie
  const loginRes = await fetch('https://off-campus-club.vercel.app/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'spherefulltos@gmail.com', password: 'TestReset@123' })
  });
  
  const setCookie = loginRes.headers.get('set-cookie');
  console.log('Set-Cookie header:', setCookie);
  
  // Extract token
  const match = setCookie && setCookie.match(/occ-token=([^;]+)/);
  const token = match ? match[1] : null;
  console.log('Extracted token:', token ? token.substring(0, 40) + '...' : 'NONE');
  
  if (!token) {
    console.log('⚠️ No token extracted from Set-Cookie');
    return;
  }

  // Step 2: Fetch profile using the extracted token as Cookie header
  const profileRes = await fetch('https://off-campus-club.vercel.app/api/profile', {
    method: 'GET',
    headers: {
      'Cookie': `occ-token=${token}`,
    }
  });
  
  const profileData = await profileRes.json();
  console.log('Profile status:', profileRes.status);
  console.log('Profile data:', JSON.stringify(profileData, null, 2));
}

test().catch(console.error);
