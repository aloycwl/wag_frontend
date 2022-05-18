var balance = 0,
  playerCount = 0;
async function refreshInfo() {
  player = await contract.player(acct[0]).call();
  rm = await contract.room(player.room).call();
  balance = rm.balance;
  playerCount = rm.playerCount;
  $('#info').html(`You are in room ${player.room}
  <br>Balance: ${player.balance}<br>WAC tokens:
  ${(await contract2.methods.balanceOf(acct[0]).call()) / 1e18}`);
  if (player.room > 0) {
    players = await contract.getRoomInfo(player.room).call();
    dealt = balance > 0;
    host = players.b[0].toLowerCase() == acct[0];
    str = `Room#${player.room} | ${balance}-Balance | ${playerCount}-Players${
      host
        ? ` | <a id="deal"onclick="deal()">${dealt ? 'Check' : 'Deal'}</a>`
        : ``
    } | <a onclick="leave()">Leave</a><br>`;
    if (dealt) {
      p = players[0];
      for (i = 0; i < p.length; i++) {
        str += `<div class="table">0x${p[i].substring(38)}<i>
        ${p[i].toLowerCase() == acct[0] ? 'You' : ''}
        ${host ? 'Host' : ''}</i><br>`;
        for (j = 0; j < 5; j++)
          str += `<p class="cards c${players[i + 1][j]}"></p>`;
        str += '</div>';
      }
    }
  } else {
    str =
      '<input id="txtRoom"placeholder="Room Number"><button onclick="search()">Search Room #</button>';
    $('#rooms').show();
    for (i = 1; i < 13; i++) {
      rm = await contract.room(i).call();
      $('#rooms').append(
        `<div class="tables"><b>Room ${i}</b><br>Balance: ${rm.balance}<br>Bet size: 
        ${rm.betSize}<br>Players: ${rm.playerCount}<br><a onclick="$('#txtRoom').val(${i});window.search();">Explore</a></div>`
      );
    }
  }
  $('#room').html(str);
  x = -1;
  y = -142;
  for (i = 0; i < 52; i++) {
    $('.c' + i).css('background-position', x + 'px ' + y + 'px');
    if ((i + 1) % 13 == 0) {
      x = -1;
      y = i == 25 ? -212 : i == 38 ? -2 : -72;
    } else x -= 50;
  }
}
async function search() {
  rmNum = $('#txtRoom').val();
  d = await contract.room(rmNum).call();
  if (d.playerCount == 0)
    str = `<input id="amt"type="number"min="10"placeholder="Room Min Bet Size"> <a onclick="join(0)">Create a new room</a>`;
  else if (d.playerCount < 5) str = '<a onclick="join(1)">Join</a>';
  else str = 'This room is full';
  $('#room').html(str);
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
async function deal() {
  waitTxt();
  ($('#deal').text() == 'Deal' ? contract.DEAL : contract.CHECK)(
    player.room
  ).send(frm);
}
async function join(a) {
  b = a == 0 ? parseInt($('#amt').val()) : rm.betSize;
  str = '';
  if (a == 0 && b < 10) str = 'Minimum bet size is 10';
  if (player.balance < b) str = 'Insufficent balance';
  $('#room').html(str);
  if (str == '') {
    waitTxt();
    await contract.JOIN(rmNum, b).send(frm);
    refreshInfo();
  }
}
async function leave() {
  waitTxt();
  await contract.LEAVE(player.room, acct[0]).send(frm);
  refreshInfo();
}
function waitTxt() {
  $('#info').html(' <i>Waiting for transaction...</i>');
}
async function load() {
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
              name: '',
              type: 'uint256[5]',
            },
            {
              internalType: 'uint256[5]',
              name: '',
              type: 'uint256[5]',
            },
            {
              internalType: 'uint256[5]',
              name: '',
              type: 'uint256[5]',
            },
            {
              internalType: 'uint256[5]',
              name: '',
              type: 'uint256[5]',
            },
            {
              internalType: 'uint256[5]',
              name: '',
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
      '0x80BB34c189D43C6c3b3FB8B7921A6A389Ed92198'
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
        rm = await contract.room(player.room).call();
        if (rm.balance != balance || rm.playerCount != playerCount)
          refreshInfo();
      } else $('#connect').show();
    } else $('#connect').html('No Metamask');
  }, 1000);
});
