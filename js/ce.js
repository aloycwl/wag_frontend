//Casino Essential
$('head').append(
  '<meta name="viewport"content="width=device-width,initial-scale=1.0"><link rel="stylesheet"href="https://aloycwl.github.io/wag_frontend/css/wag.css">'
);
u1 = {
  internalType: 'uint256',
  name: '',
  type: 'uint256',
};
u2 = {
  internalType: 'uint256[]',
  name: '',
  type: 'uint256[]',
};
u3 = {
  internalType: 'address',
  name: '',
  type: 'address',
};
u4 = {
  internalType: 'address[]',
  name: '',
  type: 'address[]',
};
function waitTxt(a) {
  $('#load').html(a > 0 ? 'Loading...' : '');
}
async function LB() {
  //Load Balance
  return (await contract2.methods.balanceOf(acct[0]).call()) / 1e18;
}
async function LP() {
  //Load Player
  waitTxt(1);
  player = await contract.GetPlayer(acct[0]).call();
  balance = await LB();
}
function FB() {
  //Format Balance
  return balance.toFixed(2).toLocaleString();
}
async function load(a, b) {
  if (typeof ethereum != 'undefined') {
    web3 = new Web3(ethereum);
    web3 = web3.eth;
    acct = await ethereum.request({ method: 'eth_requestAccounts' });
    frm = { from: acct[0] };
    if ((await web3.net.getId()) != 4) {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x4' }],
      });
      location.reload();
    }
    contract = new web3.Contract(a, b);
    contract = contract.methods;
    contract2 = new web3.Contract(
      [
        {
          inputs: [u3],
          name: 'balanceOf',
          outputs: [u1],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      '0xFf53E86755fddadFB671a338d4D5b3CacD9c07c1'
    );
  }
}
$(document).ready(function () {
  setInterval(async function () {
    if (typeof ethereum != 'undefined') {
      d = await web3.getAccounts();
      if (d.length > 0) {
        $('#connect').hide();
        $('#root').show();
        b = await LB();
        if (b != balance) {
          balance = b;
          refreshInfo();
        }
      } else $('#connect').show();
    } else $('#connect').html('No Metamask');
  }, 1000);
});
