const size = {
  mobileS: "320px",
  mobileM: "375px",
  mobileL: "425px",
  tablet: "768px",
  laptop1: "1024px",
  laptop2: "1366px",
  laptop3: "1920px",
  laptop4: "1536px",
  laptop5: "1440px",
  desktop: "2560px",
};

const device = {
  mobileS: `(min-width: ${size.mobileS})`,
  mobileM: `(min-width: ${size.mobileM})`,
  mobileL: `(min-width: ${size.mobileL})`,
  tablet: `(min-width: ${size.tablet})`,
  laptop1: `(min-width: ${size.laptop1})`,
  laptop2: `(min-width: ${size.laptop2})`,
  laptop3: `(min-width: ${size.laptop3})`,
  laptop4: `(min-width: ${size.laptop4})`,
  laptop5: `(min-width: ${size.laptop45})`,
  laptopL: `(min-width: ${size.laptopL})`,
  desktop: `(min-width: ${size.desktop})`,
};

export { device };
