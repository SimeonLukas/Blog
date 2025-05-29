function convertTextToJson(plainText) {
  plainText = plainText + "Schau auf meinen Blog, um mehr zu erfahren. Link in der Bio.";
  const text = plainText.trim();
  const sentences = text.split(/(?<=[.!?])/).filter(s => s.trim().length > 0);
  const fs = require('fs');
  const files = fs.readdirSync('images');
  const images = files.filter(file => file.endsWith('.jpg') || file.endsWith('.png')).map(file => {
    return `src/images/${file}` 
  });

  const audio = fs.readdirSync('../public/src/music');
  // get random audio files from the music directory
  if (audio.length === 0) {
    throw new Error('No audio files found in the music directory.');
  }
  let randomaudio = audio[Math.floor(Math.random() * audio.length)];
  let music = [];
  if (randomaudio.endsWith('.mp3')) {
    music.push(`src/music/${randomaudio}`);
  } else {
    throw new Error('No valid audio files found in the music directory.');
  }

  const output = {
    audioUrl: music, 
    images: images,
    words: []
  };
  
  let currentTime = 0;
  
  sentences.forEach(sentence => {
    const words = sentence.trim().split(/\s+/).filter(w => w.length > 0);
    
    words.forEach((word, index) => {
    const wordDuration = (word.length * 0.08) + 0.2;
    const start = parseFloat(currentTime.toFixed(2));
    currentTime += wordDuration;
    const end = parseFloat(currentTime.toFixed(2));
    
    currentTime += 0.02;
    
    output.words.push({
      word: word,
      start: start,
      end: end,
      confidence: (Math.random() * 0.1 + 0.9).toFixed(7),
      punctuated_word: word,
    });
    });
    
    currentTime += 0.3;
  });
  
  return JSON.stringify(output, null, 2);
  }
  
  // Example usage:
  function processTextFile(fileContent) {
    const jsonOutput = convertTextToJson(fileContent);
    return jsonOutput;
  }
  
  // If this script runs in Node.js environment
  if (typeof require !== 'undefined') {
    const fs = require('fs');
    
    // Command line usage: node script.js input.txt output.json
    if (process.argv.length >= 4) {
      const inputFile = process.argv[2];
      const outputFile = process.argv[3];
      
      try {
        const text = fs.readFileSync(inputFile, 'utf8');
        const json = convertTextToJson(text);
        fs.writeFileSync(outputFile, json);
        console.log(`Successfully converted ${inputFile} to ${outputFile}`);
      } catch (error) {
        console.error('Error:', error.message);
      }
    } else {
      console.log('Usage: node script.js input.txt output.json');
    }
  }