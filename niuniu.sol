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

    function CardValue(uint256 a)external pure returns(uint256){unchecked{
        require(a>0&&a<53);
        a%=13;
        return a==0||a>9?10:a;
    }}
    
}