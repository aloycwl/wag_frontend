var balance = 0,
  playerCount = 0;
async function refreshInfo() {
  player = await contract.player(acct[0]).call();
  rm = await contract.room(player.room).call();
  balance = rm.balance;
  playerCount = rm.playerCount;
  $('#info').html(`You are in room ${player.room}
  <br>Balance: ${parseInt(player.balance).toLocaleString()}<br>WAG tokens:
  ${(
    (await contract2.methods.balanceOf(acct[0]).call()) / 1e18
  ).toLocaleString()}`);
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
    u1 = {
      internalType: 'uint256',
      name: '',
      type: 'uint256',
    };
    contract = new web3.Contract(
      [
        {
          inputs: [u1],
          name: 'DEAL',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [u1, u1],
          name: 'JOIN',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [
            u1,
            {
              internalType: 'address',
              name: '',
              type: 'address',
            },
          ],
          name: 'LEAVE',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [u1],
          name: 'getRoomInfo',
          outputs: [
            {
              internalType: 'address[]',
              name: '',
              type: 'address[]',
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
            u1,
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
          outputs: [u1, u1],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      '0xc7300d5452ee8DCDB2A862E7f2C56B35e040E457'
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
      '0xFf53E86755fddadFB671a338d4D5b3CacD9c07c1'
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
