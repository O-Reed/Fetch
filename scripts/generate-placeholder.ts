import sharp from "sharp";
import path from "path";

const OUTPUT_PATH = path.join(
  __dirname,
  "../src/assets/images/placeholder-dog.png"
);

sharp({
  create: {
    width: 400,
    height: 400,
    channels: 4,
    background: { r: 244, g: 63, b: 94, alpha: 0.1 }
  }
})
  .composite([
    {
      input: Buffer.from(`
    <svg>
      <rect x="160" y="160" width="80" height="80" fill="#f43f5e"/>
      <text x="200" y="210" font-family="Arial" font-size="40" fill="#f43f5e" text-anchor="middle">🐕</text>
    </svg>`),
      top: 0,
      left: 0
    }
  ])
  .png()
  .toFile(OUTPUT_PATH)
  .then(() => console.log("✓ Placeholder image generated"))
  .catch(console.error);
