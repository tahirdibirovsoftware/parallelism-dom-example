export const generateColor = (): string => {
  const generateDarkComponent = (): string => {  
    const value = Math.floor(Math.random() * 128);
    return value.toString(16).padStart(2, '0');
  };

  const red = generateDarkComponent();
  const green = generateDarkComponent();
  const blue = generateDarkComponent();

  return `#${red}${green}${blue}`;
};