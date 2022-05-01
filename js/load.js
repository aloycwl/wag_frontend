var loaded;
async function load() {
  if (ethereum) {
    web3 = new Web3(ethereum);
    web3 = web3.eth;
    acct = await ethereum.request({ method: 'eth_requestAccounts' });
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
          ],
          name: 'CHECK',
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
          name: 'DEAL',
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
            {
              internalType: 'uint256',
              name: 'b',
              type: 'uint256',
            },
          ],
          name: 'JOIN',
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
            {
              internalType: 'address',
              name: 'b',
              type: 'address',
            },
          ],
          name: 'LEAVE',
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
              internalType: 'uint256',
              name: 'a',
              type: 'uint256',
            },
          ],
          name: 'getRoomInfo',
          outputs: [
            {
              internalType: 'address[]',
              name: 'b',
              type: 'address[]',
            },
            {
              internalType: 'uint256[5]',
              name: 'c',
              type: 'uint256[5]',
            },
            {
              internalType: 'uint256[5]',
              name: 'd',
              type: 'uint256[5]',
            },
            {
              internalType: 'uint256[5]',
              name: 'e',
              type: 'uint256[5]',
            },
            {
              internalType: 'uint256[5]',
              name: 'f',
              type: 'uint256[5]',
            },
            {
              internalType: 'uint256[5]',
              name: 'g',
              type: 'uint256[5]',
            },
          ],
          stateMutability: 'view',
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
          name: 'player',
          outputs: [
            {
              internalType: 'uint256',
              name: 'points',
              type: 'uint256',
            },
            {
              internalType: 'bool',
              name: 'playing',
              type: 'bool',
            },
            {
              internalType: 'uint256',
              name: 'room',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'balance',
              type: 'uint256',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '',
              type: 'uint256',
            },
          ],
          name: 'room',
          outputs: [
            {
              internalType: 'uint256',
              name: 'betSize',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'balance',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'playerCount',
              type: 'uint256',
            },
            {
              internalType: 'bool',
              name: 'hidden',
              type: 'bool',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      '0xC1Df3e705b44bFf0A45a0200619092c9c91450Dc'
    );
    contract = contract.methods;
    contract2 = new web3.Contract(
      [
        {
          inputs: [
            {
              internalType: 'address',
              name: 'account',
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
      '0x039f8E3fC2A81108784c7347d68082a7b694202F'
    );
    refreshInfo();
  } else $('#connect').html('No Metamask');
}
async function search() {
  rmNum = $('#txtRoom').val();
  d = await contract.room(rmNum).call();
  if (d.playerCount == 0)
    str = `<input id="amt"type="number"min="10"placeholder="Room Min Bet Size"> <a onclick="join(0)">Create a new room</a>`;
  else if (d.playerCount < 5) str = 'Join';
  else str = 'This room is full';
  $('#room').html(str);
}
async function refreshInfo() {
  player = await contract.player(acct[0]).call();
  $('#info').html(`You are in room ${player.room},
  Balance: ${player.balance}, WAC tokens:
  ${(await contract2.methods.balanceOf(acct[0]).call()) / 1e18}`);
  if (player.room > 0) {
    room = await contract.room(player.room).call();
    str = `Room: ${player.room}, Balance: ${room.balance}, Players count: ${room.playerCount} | `;
    players = await contract.getRoomInfo(player.room).call();
    if (players.b[0].toLowerCase() == acct[0])
      str += room.balance < 1 ? '<a onclick="deal()">Deal</a>' : 'Check';
    // DEAL
    // LEAVE
    // CHECK
    // display players
    $('#room').html(str + ' | <a onclick="leave()">Leave room</a>');
  } else
    $('#room').html(
      '<input id="txtRoom"type="text"><button onclick="search()">Search Room #</button>'
    );
}
async function transact(a) {
  waitTxt();
  c = a == 1 ? contract.DEPOSIT : contract.WITHDRAW;
  await c($('#txtAmt').val()).send({
    from: acct[0],
  });
  refreshInfo();
  $('#txtAmt').val('');
}
async function deal(a) {
  waitTxt();
  await contract.DEAL(player.room).send({
    from: acct[0],
  });
  refreshInfo();
}
async function join(a) {
  b = a == 0 ? parseInt($('#amt').val()) : room.betSize;
  str = '';
  if (a == 0 && b < 10) {
    str = 'Minimum bet size is 10';
    return;
  }
  if (player.balance < b) {
    str = 'Insufficent balance';
    return;
  }
  $('#room').html(str);
  waitTxt();
  await contract.JOIN(rmNum, b).send({
    from: acct[0],
  });
  refreshInfo();
}
async function leave() {
  waitTxt();
  await contract.LEAVE(player.room, acct[0]).send({
    from: acct[0],
  });
  refreshInfo();
}
async function isWeb3() {
  await web3.getAccounts().then((d) => {
    if (d.length > 0) {
      $('#connect').hide();
      $('#root').show();
      if (!loaded) {
        loaded = true;
      }
    } else {
      $('#connect').show();
    }
  });
}
function waitTxt() {
  $('#info').append(' <i>Waiting for transaction...</i>');
}
setInterval(isWeb3, 1000);
load();
