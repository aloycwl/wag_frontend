//Casino Essential
$('head').append(
  '<meta name="viewport"content="width=device-width,initial-scale=1.0"><link rel="stylesheet"href="https://aloycwl.github.io/wag_frontend/css/wag.css">'
);
const WB =
    'https://eth-rinkeby.alchemyapi.io/v2/xneL9EV87zUlVocEVcyDT5tqp4LZE0Fy',
  CA2 = '0xFf53E86755fddadFB671a338d4D5b3CacD9c07c1',
  CHAIN = 4;
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
        b = await LB();
        if (b != balance) {
          balance = b;
          refreshInfo();
        }
      } else $('#connect').show();
    } else $('#connect').html('No Metamask');
  }, 1000);
});
