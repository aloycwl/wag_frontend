balance = 0;
async function refreshInfo() {
  waitTxt(1);
  player = await contract.player(acct[0]).call();
  balance = (await contract2.methods.balanceOf(acct[0]).call()) / 1e18;
  $('#info').html(`WAG: <b>${balance.toLocaleString()}</b>`);
  str = '';
  if (player[1] > 0) {
    players = await contract.getRoomInfo(player[1]).call();
    p = players[0];
    host = p[0].toLowerCase() == acct[0];
    $('#info').append(
      `<br><br>Room: <b>${
        player[1]
      }</b> <i>(<a onclick="leave()">Leave</a>)</i><br>Players: <b>${
        p.length
      }</b>/5${host ? `<br><b><a id="deal"onclick="deal()">Deal</a><b>` : ``}`
    );
    for (i = 0; i < p.length; i++) {
      str += `<div class="table">0x${p[i].substring(38)}<i>
        ${p[i].toLowerCase() == acct[0] ? '<b>You</b>' : ''}
        ${host ? 'Host' : ''}</i><br><br>`;
      p1 = players[1];
      p2 = players[2];
      p3 = players[3];
      s2 = '';
      c2 = i * 3;
      for (j = 0; j < 5; j++) {
        c1 = i * 5 + j;
        s3 = '';
        if (
          (p2[c2] == j || p2[c2 + 1] == j || p2[c2 + 2] == j) &&
          p2[c2] != p2[c2 + 1]
        )
          s3 = ' niu';
        s2 += p1[c1] < 1 ? `` : `<p class="cards c${p1[c1]}${s3}"></p>`;
      }
      p1 = await contract.player(p[i]).call();
      str += `${
        s2 == '' ? `<br>No previous results` : s2
      }<br><br><p id="n${i}">${
        p3[i] > 0
          ? `You got niu! <b>${p3[i]}</b> points ${
              Math.max(p3) == p3[i] ? `<br><b>***WINNER***</b>` : ``
            }`
          : `No niu =(`
      }</p></div>`;
    }
  } else {
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
  $('#room').html(str);
  x = -1;
  y = -142;
  for (i = 1; i < 53; i++) {
    $('.c' + i).css('background-position', x + 'px ' + y + 'px');
    if (i % 13 == 0) (x = -1), (y = i == 25 ? -212 : i == 38 ? -2 : -72);
    else x -= 50;
  }
  waitTxt(0);
}
async function deal() {
  waitTxt(1);
  await contract.DEAL(player[1]).send(frm);
}
async function join(a) {
  b = $('#i' + a).length > 0 ? parseInt($('#i' + a).val()) : 10;
  str =
    b < 10
      ? 'Minimum bet size is 10'
      : balance < b
      ? 'Insufficent balance'
      : '';
  $('#load').html(str);
  if (str == '') {
    waitTxt(1);
    await contract.JOIN(a, b).send(frm);
    refreshInfo();
  }
}
async function leave() {
  waitTxt(1);
  await contract.LEAVE(player[1], acct[0]).send(frm);
  refreshInfo();
}
function waitTxt(a) {
  $('#load').html(a > 0 ? 'Loading...' : '');
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
          outputs: [u4, u2, u2, u2],
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
      '0x45332052182A16558d905BE653Ef77c79eBBbbF6'
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
        gB2 = (await contract2.methods.balanceOf(acct[0]).call()) / 1e18;
        if (gB2 != balance) {
          balance = gB2;
          refreshInfo();
        }
      } else $('#connect').show();
    } else $('#connect').html('No Metamask');
  }, 1000);
});
