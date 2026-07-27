import fs from 'fs';

const src = 'C:/Users/Lenovo/.gemini/antigravity/brain/68b90d36-de1e-4e23-b427-c5dba7b015c3/media__1782220631286.png';
const dest = './src/assets/spareLogo.png';

try {
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('Successfully copied logo to src/assets/spareLogo.png!');
  } else {
    console.error('Source logo file not found at: ' + src);
  }
} catch (err) {
  console.error('Error copying file: ', err);
}
