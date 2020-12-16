export default function colorizeLetters(text) {
  const letters = text.split('');
  // Converts integer to hex
  const colToHex = (c) => {
  // Hack so colors are bright enough
    const color = (c < 75) ? c + 75 : c;
    const hex = color.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  const rgbToHex = (r, g, b) => `#${colToHex(r)}${colToHex(g)}${colToHex(b)}`;
  const getRandomColor = () => rgbToHex(
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
    Math.floor(Math.random() * 255),
  );
  const randomColor = function (array) {
    let html = '';
    // eslint-disable-next-line array-callback-return
    array.map((letter) => {
      const color = getRandomColor();
      // eslint-disable-next-line no-param-reassign
      if (letter === ' ') letter = '&nbsp';
      html
      += `<span style="color:${color}">${
          letter
        }</span>`;
    });
    return html;
  };

  // Set the text
  return randomColor(letters);
}