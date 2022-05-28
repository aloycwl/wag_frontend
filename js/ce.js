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
$(document).ready(function () {
  setInterval(async function () {
    if (typeof ethereum != 'undefined') {
      d = await web3.getAccounts();
      if (d.length > 0) {
        $('#connect').hide();
        $('#root').show();
        b = (await contract2.methods.balanceOf(acct[0]).call()) / 1e18;
        if (b != balance) {
          balance = b;
          refreshInfo();
        }
      } else $('#connect').show();
    } else $('#connect').html('No Metamask');
  }, 1000);
});
