// Toggle this value to 'production' when to deploy, or 'development' locally

// change to 'production' for deployed environment

// const mode = 'development'; 
const mode = 'production';

const dev = {
  API_BASE: "http://localhost:5173",
};

const prod = {
  API_BASE: "https://summer-class-proj.onrender.com",
};

export const API_BASE = mode === 'production' ? prod.API_BASE : dev.API_BASE;
export const MODE = mode;
