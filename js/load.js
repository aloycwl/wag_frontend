var loaded = 0;
async function refreshInfo() {
  player = await contract.player(acct[0]).call();
  balance = (await contract2.methods.balanceOf(acct[0]).call()) / 1e18;
  $('#info').html(`WAG tokens: ${balance.toLocaleString()}`);
  str = '';
  if (player[1] > 0) {
    $('#info').append(
      `<br>Room: ${player[1]} <i><a onclick="leave()">Leave</a></i><br>`
    );
    players = await contract.getRoomInfo(player[1]).call();
    host = players[0][0].toLowerCase() == acct[0];
    str = `Room#${player.room} | ${players[0].length}-Players${
      host ? ` | <a id="deal"onclick="deal()">Deal</a>` : ``
    }`;
    p = players[0];
    for (i = 0; i < p.length; i++) {
      str += `<div class="table">0x${p[i].substring(38)}<i>
        ${p[i].toLowerCase() == acct[0] ? 'You' : ''}
        ${host ? 'Host' : ''}</i><br>`;
      for (j = 0; j < 5; j++)
        str += `<p class="cards c${players[i + 1][j]}"></p>`;
      str += '</div>';
    }
  } else {
    waitTxt();
    for (i = 1; i < 13; i++) {
      rm = await contract.getRoomInfo(i).call();
      rl = rm[0].length;
      i = i > 11 ? 12 : i;
      s = `<a onclick="join(${i})">`;
      str2 =
        rl == 0
          ? `<input id="i${i}" placeholder="Amount"> ${s}Create</a>`
          : rl == 5
          ? `Full`
          : `${s}Join</a>`;
      str += `<div class="tables"><b>Room ${
        i < 12
          ? `${i}</b><br>Bet size: ${rm[3]}<br>Players: ${rm[0].length}/5`
          : `<input id="r99" placeholder="custom"><br><br>`
      }<br>${str2}</div>`;
    }
  }
  $('#room').append(str);
  loaded();
}
async function deal() {
  waitTxt();
  contract.DEAL(player.room).send(frm);
}
async function join(a) {
  b = $('#i' + a).length > 0 ? parseInt($('#i' + a).val()) : 10;
  str = '';
  if (b < 10) str = 'Minimum bet size is 10';
  if (balance < b) str = 'Insufficent balance';
  $('#load').html(str);
  if (str == '') {
    waitTxt();
    await contract.JOIN(a, b).send(frm);
    refreshInfo();
  }
}
async function leave() {
  waitTxt();
  await contract.LEAVE(player.room, acct[0]).send(frm);
  refreshInfo();
}
function waitTxt() {
  $('#load').html('Loading...');
}
function loaded() {
  $('#load').html('');
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
          inputs: [u1, u3],
          name: 'LEAVE',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
        {
          inputs: [u1],
          name: 'getRoomInfo',
          outputs: [u4, u2, u2, u1],
          stateMutability: 'view',
          type: 'function',
        },
        {
          inputs: [u3],
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
load();
$(document).ready(function () {
  setInterval(async function () {
    if (typeof ethereum != 'undefined') {
      d = await web3.getAccounts();
      if (d.length > 0) {
        $('#connect').hide();
        $('#root').show();
        if (loaded < 1) {
          loaded = 1;
          refreshInfo();
        }
      } else $('#connect').show();
    } else $('#connect').html('No Metamask');
  }, 1000);
});
