//Casino Essential
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
