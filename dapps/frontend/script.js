const connectBtn = document.getElementById("connectBtn");
const statusEl = document.getElementById("status");
const addressEl = document.getElementById("address");
const networkEl = document.getElementById("network");
const balanceEl = document.getElementById("balance");
const errorEl = document.getElementById("error-message");

// Avalanche Fuji Testnet chainId (hex)
const AVALANCHE_FUJI_CHAIN_ID = "0xa869";

function formatAvaxBalance(balanceWei) {
  const balance = parseInt(balanceWei, 16);
  console.log({ balance });
  return (balance / 1e18).toFixed(4);
}
const shortenAddress = (address) => {
      if (!address) return "";
      return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    };


let isConnected = false;

function disconnectWallet() {
  isConnected = false;
  // Restore initial UI state
  statusEl.textContent = "Not Connected";
  statusEl.style.color = "";
  addressEl.textContent = "-";
  networkEl.textContent = "-";
  balanceEl.textContent = "-";
  connectBtn.textContent = "Connect Wallet";
  if (errorEl) errorEl.textContent = "";
}

async function updateUI(address) {
      try {
        addressEl.textContent = shortenAddress(address);
        addressEl.title = address;
        if (errorEl) errorEl.textContent = "";
      } catch (error) {
        console.error("Failed to update UI:", error);
        if (errorEl) errorEl.textContent = "Failed to update UI: " + (error && error.message ? error.message : error);
      }
    }

async function connectWallet() {
  // connect menjadi disconnect
  if (isConnected) {
    disconnectWallet();
    return;
  }
  if (typeof window.ethereum === "undefined") {
    alert("Core Wallet tidak terdeteksi. Silakan install Core Wallet.");
    return;
  }

  console.log("window.ethereum", window.ethereum);



  try {
    if (errorEl) errorEl.textContent = "";
    statusEl.textContent = "Connecting...";

    // Request wallet accounts
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const address = accounts[0];
    addressEl.textContent = shortenAddress(address);
    addressEl.title = address
    

    // Get chainId
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    console.log({ chainId });

    if (chainId === AVALANCHE_FUJI_CHAIN_ID) {
      networkEl.textContent = "Avalanche Fuji Testnet";
      statusEl.textContent = "Connected ✅";
      statusEl.style.color = "#4cd137";
      // perubahan teks tombol
      connectBtn.textContent = "Disconnect";
      isConnected = true;

      // Get AVAX balance
      const balanceWei = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });

      console.log({ balanceWei });

      balanceEl.textContent = formatAvaxBalance(balanceWei);
    } else {
      networkEl.textContent = "Wrong Network ❌";
      statusEl.textContent = "Please switch to Avalanche Fuji";
      statusEl.style.color = "#fbc531";
      balanceEl.textContent = "-";
      if (errorEl) errorEl.textContent = "Wrong network. Please switch your wallet to Avalanche Fuji Testnet (chainId 0xa869).";
    }
  } catch (error) {
    console.error(error);
    if (errorEl) {
      if (error && error.code === 4001) {
        errorEl.textContent = "User rejected the connection request.";
        statusEl.textContent = "User Rejected ❌";
      } else if (error && error.code === -32002) {
        errorEl.textContent = "Connection request already pending. Please check your wallet.";
        statusEl.textContent = "Request Pending ❗";
      } else {
        errorEl.textContent = (error && error.message) ? error.message : "Connection failed.";
        statusEl.textContent = "Connection Failed ❌";
      }
    } else {
      statusEl.textContent = "Connection Failed ❌";
    }
  }
}

connectBtn.addEventListener("click", connectWallet);

// listen events
if (window.ethereum) {
  window.ethereum.on('accountsChanged', (accounts) => {
    if (accounts && accounts.length > 0) {
      console.log('accountsChanged', accounts[0]);
      if (isConnected) {
        updateUI(accounts[0]);
      } else {
        console.log('accountsChanged ignored because not connected');
      }
    } else {
      console.log('accountsChanged: no accounts');
      disconnectWallet();
    }
  });

  window.ethereum.on('chainChanged', (chainId) => {
    console.log('chainChanged', chainId);
    // balik halaman awal
    window.location.reload();
  });
}
