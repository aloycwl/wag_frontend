pragma solidity^0.8.13;//SPDX-License-Identifier:None
contract NiuNiu{
    struct Room{
        address[]players;
        uint256 maxPlayers;
    }
    struct Player{
        uint256 room;
        uint256 card1;
        uint256 card2;
        uint256 card3;
        uint256 card4;
        uint256 card5;
    }
    address private _owner;
    mapping(uint256=>Room)public room;
    mapping(address=>Player)public player;
    //player in which room
    //exit and enter
    //player tracking

    //new room scenario

    //interface ERC20
    //users temp credit
        //cashing out and deposit

    //when last user leave room will delete the room

    constructor(){
        _owner=msg.sender;
    }

    function _cardValue(uint256 a)private pure returns(uint256){unchecked{
        require(a>0&&a<53);
        a%=13;
        return a==0||a>9?10:a;
    }}

    function _distribute(uint256 a)private{
        //room number
        uint256[52]memory cards=[uint256(3),39,19,36,6,24,46,16,29,34,47,1,7,13,15,44,25,18,37,21,28,31,41,12,42,14,4,32,23,9,17,51,2,5,43,33,20,40,8,49,52,30,22,27,38,35,45,50,26,48,10,11];
        //move card to the back
        //reduce count
    }
    
}