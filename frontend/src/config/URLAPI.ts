const dev = {
  API_BASE: "http://localhost:3000",
};

const prod = {
  API_BASE: "https://summer-class-yyit.onrender.com",
};

// Toggle this value to 'production' when deploying, or 'development' locally
// change to 'production' for deployed environment
let mode: string = 'production'; 
// let mode: string = 'development';

export const MODE = mode;
export const API_BASE = mode === 'production' ? prod.API_BASE : dev.API_BASE;
