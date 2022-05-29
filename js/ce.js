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
  return (await contract2.methods.balanceOf(acct).call()) / 1e18;
}
async function load(a, b) {
  if (typeof ethereum != 'undefined') {
    web3a = new Web3(
      'https://eth-rinkeby.alchemyapi.io/v2/xneL9EV87zUlVocEVcyDT5tqp4LZE0Fy'
    );
    web3a = web3a.eth;
    web3 = new Web3(ethereum);
    web3 = web3.eth;

    acct = await ethereum.request({ method: 'eth_requestAccounts' });
    acct = acct[0];
    frm = { from: acct };
    if ((await web3.net.getId()) != 4) {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x4' }],
      });
      location.reload();
    }

    contract = new web3.Contract(a, b);
    contract = contract.methods;
    contracta = new web3a.Contract(a, b);
    contracta = contracta.methods;

    await load2();
  }
}
async function load2() {
  contract2 = new web3a.Contract(
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
