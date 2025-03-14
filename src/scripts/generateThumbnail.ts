import { createCanvas } from 'canvas';
import fs from 'fs/promises';
import path from 'path';

async function generatePodcastThumbnail(title: string) {
  // Create a 1400x1400 canvas (standard podcast artwork size)
  const canvas = createCanvas(1400, 1400);
  const ctx = canvas.getContext('2d');

  // Set background
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, 1400, 1400);

  // Add gradient overlay
  const gradient = ctx.createLinearGradient(0, 0, 1400, 1400);
  gradient.addColorStop(0, 'rgba(100, 100, 255, 0.2)');
  gradient.addColorStop(1, 'rgba(255, 100, 100, 0.2)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1400, 1400);

  // Configure text
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Split title into lines
  const words = title.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach(word => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    if (testLine.length > 20) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  if (currentLine) {
    lines.push(currentLine);
  }

  // Draw title
  const lineHeight = 100;
  const totalHeight = lines.length * lineHeight;
  const startY = (1400 - totalHeight) / 2;

  lines.forEach((line, index) => {
    ctx.font = '700 80px "Arial"';
    ctx.fillText(line, 700, startY + (index * lineHeight));
  });

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  await fs.writeFile(
    path.join('output', 'mathematical-logic-frontiers-thumbnail.png'),
    buffer
  );
}

// Generate thumbnail for our podcast
generatePodcastThumbnail('Frontiers of Mathematical Logic: Recent Breakthroughs in 2024')
  .then(() => console.log('Thumbnail generated successfully!'))
  .catch(console.error); 