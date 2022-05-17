async function refreshInfo() {
  player = await contract.GetPlayer(acct[0]).call();
  $('#info').html(`Balance: ${player[0]}, WAC tokens:
  ${(await contract2.methods.balanceOf(acct[0]).call()) / 1e18}`);
}
async function transact(a) {
  if ($('#txtAmt').val() > 0) {
    waitTxt();
    await (a == 1 ? contract.DEPOSIT : contract.WITHDRAW)(
      $('#txtAmt').val()
    ).send(frm);
    refreshInfo();
    $('#txtAmt').val('');
  }
}
function waitTxt() {
  $('#info').html(' <i>Waiting for transaction...</i>');
}
async function load() {
  if (typeof ethereum != 'undefined') {
    web3 = new Web3(ethereum);
    web3 = web3.eth;
    acct = await ethereum.request({ method: 'eth_requestAccounts' });
    frm = { from: acct[0], gas: 21e5 };
    if ((await web3.net.getId()) != 4) {
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x4' }],
      });
      location.reload();
    }
    contract = new web3.Contract(
      [
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'a',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'b',
              type: 'uint256',
            },
          ],
          name: 'BET',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'a',
              type: 'uint256',
            },
          ],
          name: 'DEPOSIT',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'a',
              type: 'uint256',
            },
          ],
          name: 'WITHDRAW',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          name: 'GetPlayer',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
            {
              internalType: 'uint256[]',
              name: '',
              type: 'uint256[]',
            },
            {
              internalType: 'uint256[]',
              name: '',
              type: 'uint256[]',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'a',
              type: 'uint256',
            },
          ],
          name: 'GetRoomHistory',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
            {
              internalType: 'uint256[]',
              name: '',
              type: 'uint256[]',
            },
            {
              internalType: 'address[]',
              name: '',
              type: 'address[]',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      '0xb2A3B7f0ce57E05Cd6EA34Fc6aa4FD8757D8ac00'
    );
    contract = contract.methods;
    contract2 = new web3.Contract(
      [
        {
          inputs: [
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          name: 'balanceOf',
          outputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      '0x613Fe13FEE32E4aA8f6C2FB290816A24D6371164'
    );
    refreshInfo();
  }
}
load();
$(document).ready(function () {
  setInterval(async function () {
    if (typeof ethereum != 'undefined') {
      d = await web3.getAccounts();
      if (d.length > 0) {
        $('#connect').hide();
        $('#root').show();
      } else $('#connect').show();
    } else $('#connect').html('No Metamask');
  }, 1000);
});
