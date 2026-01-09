// src/components/data.js

export const columns = [
  { key: 'ticker', label: 'Ticker' },
  { key: 'price', label: 'Price' },
  { key: 'change24h', label: '24h Change' },
  { key: 'volume24h', label: '24h Volume' },
];

export const coins = [
  { ticker: "BTC", price: "$30,000", change24h: "+2.5%", volume24h: "$1.2B" },
  { ticker: "ETH", price: "$2,000", change24h: "-1.3%", volume24h: "$850M" },
  { ticker: "BNB", price: "$320", change24h: "+0.8%", volume24h: "$200M" },
  { ticker: "SOL", price: "$35", change24h: "-0.5%", volume24h: "$120M" },
  { ticker: "ADA", price: "$0.50", change24h: "+1.2%", volume24h: "$75M" },
];
