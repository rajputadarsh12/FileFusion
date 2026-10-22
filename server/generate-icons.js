import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const svg192 = `
<svg width="192" height="192" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="192" height="192" rx="40" fill="#026fc7"/>
  <rect x="46" y="38" width="100" height="116" rx="12" fill="#ffffff"/>
  <path d="M106 38v40h40" fill="#bae0fd"/>
  <text x="96" y="115" font-family="Arial, sans-serif" font-weight="900" font-size="22" fill="#026fc7" text-anchor="middle">FILE</text>
  <text x="96" y="138" font-family="Arial, sans-serif" font-weight="700" font-size="14" fill="#64748b" text-anchor="middle">FUSION</text>
</svg>
`;

const svg512 = `
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="110" fill="#026fc7"/>
  <rect x="120" y="100" width="272" height="312" rx="32" fill="#ffffff"/>
  <path d="M280 100v110h112" fill="#bae0fd"/>
  <text x="256" y="310" font-family="Arial, sans-serif" font-weight="900" font-size="60" fill="#026fc7" text-anchor="middle">FILE</text>
  <text x="256" y="370" font-family="Arial, sans-serif" font-weight="700" font-size="38" fill="#64748b" text-anchor="middle">FUSION</text>
</svg>
`;

async function generate() {
  const targetDir = path.resolve('../client/public');
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  await sharp(Buffer.from(svg192)).png().toFile(path.join(targetDir, 'icon-192.png'));
  await sharp(Buffer.from(svg512)).png().toFile(path.join(targetDir, 'icon-512.png'));
  console.log('App icons generated successfully in client/public');
}

generate();
