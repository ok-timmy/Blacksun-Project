// const fetch = require('node-fetch');
import fetch from "node-fetch";

fetch(["https://api.blacksun.net/ethereum/sepolia/efb75fc91ae07767979cbb06524e2b6a"], {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_blockNumber',
    params: [],
    id: 3,
  }),
})
  .then((res) => res.json())
  .then(console.log);

  