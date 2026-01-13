const connectBtn = document.querySelector('#connectBtn');
const statusEl = document.querySelector('#status');
const addressEl = document.querySelector('#address');
const informationEl = document.querySelector('#information');
const networkEl = document.querySelector('#network');
const balanceEl = document.querySelector('#balance');

// Avalanche Fuji Testnet chainId
const AVALANCHE_FUJI_CHAIN_ID = '0xa869';

function formatAvaxBalance(balanceWei) {
  const balance = parseInt(balanceWei, 16);
  return (balance / 1e18).toFixed(4);
}

async function connectWallet() {
  if (typeof window.ethereum === 'undefined') {
    alert('Core Wallet tidak terdeteksi. Silahkan install Core Wallet.');
    return;
  }

  try {
    statusEl.textContent = 'Connecting...';

    // Request wallet accounts
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    const address = accounts[0];
    addressEl.textContent = address;

    informationEl.textContent = 'Adrian Ahmad Al Zidan, 231011403759';

    // Get chainId
    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    });

    if (chainId === AVALANCHE_FUJI_CHAIN_ID) {
      networkEl.textContent = 'Avalanche Fuji';
      statusEl.textContent = 'Connected ✅';
      statusEl.style.color = '#4cd137';

      // Get AVAX balance
      const balanceWei = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest'],
      });

      balanceEl.textContent = formatAvaxBalance(balanceWei);
    } else {
      networkEl.textContent = 'Wrong Network ❌';
      statusEl.textContent = 'Please switch to Avalanche Fuji';
      statusEl.style.color = '#fbc531';
      balanceEl.textContent = '-';
    }
  } catch (error) {
    console.error(error);
    statusEl.textContent = 'Connection Failed ❌';
  }
}

connectBtn.addEventListener('click', connectWallet);
