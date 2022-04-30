pragma solidity^0.8.13;//SPDX-License-Identifier:None
interface IWAC{
    function BURN(address a,uint256 m)external;
    function MINT(address a,uint256 m)external;
} 
contract NiuNiu{
    struct Room{
        address[]players;
        uint256 betSize;
        uint256 host;
        bool hidden;
    }
    struct Player{
        uint256[5]cards;
        uint256 points;
        bool playing;
        uint256 room;
        uint256 balance;
    }
    IWAC private iWAC;
    address private _owner;
    mapping(uint256=>Room)public room;
    mapping(address=>Player)public player;
    modifier onlyOwner(){require(_owner==msg.sender);_;}


    //when last user leave room will delete the room
    //kick player when afk? and remove profile.room 

    constructor(){
        _owner=msg.sender;
        //test
        player[msg.sender].balance=10;
        player[0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2].balance=20;
    }

    function tokenAddress(address a)external onlyOwner{
        iWAC=IWAC(a);
    }

    function DEPOSIT(uint256 a)external{
        iWAC.BURN(msg.sender,a);
        player[msg.sender].balance+=a;
    }

    function WITHDRAW(uint256 a)external{
        require(player[msg.sender].balance>=a);
        player[msg.sender].balance-=a;
        iWAC.MINT(msg.sender,a);
    }

    function JOINROOM(uint256 a,uint256 b)external{
        require(room[a].players.length<5&&player[msg.sender].room!=a); //Only empty room and not same room
        if(room[a].players.length==0){ //Initiate the room
            require(b>0); //Bet size must be more than 0
            room[a].host=0; //Set the new host
            room[a].betSize=b;
        }
        require(player[msg.sender].balance>=room[a].betSize);
        player[msg.sender].playing=true;
        player[msg.sender].room=a;
        room[a].players.push(msg.sender); //Add a player
    }

    function DEAL(uint256 a)external{unchecked{
        require(msg.sender==room[a].players[room[a].host]); //Only host can deal
        uint256[52]memory table=[uint256(3),39,19,36,6,24,46,16,29,34,47,1,7,13,15,44,25,18,37,21,28,31,41,12,42,14,4,32,23,9,17,51,2,5,43,33,20,40,8,49,52,30,22,27,38,35,45,50,26,48,10,11];
        uint256 hash=uint256(keccak256(abi.encodePacked(block.timestamp))); //Generate random long number
        uint256 count=51; //Length of cards remaining
        for(uint256 i=0;i<room[a].players.length;i++) //Number of active players in the room
        if(player[room[a].players[i]].playing&&player[msg.sender].balance>=room[a].betSize){
            //Only when they are choose to play the round and have enough tokens
            for(uint256 j=0;j<5;j++){ //Only distribute 5 cards
                uint256 ran=hash%count; //Pick the remaining cards
                player[room[a].players[i]].cards[i]=table[ran]; //Set the cards
                table[ran]=table[count]; //Move the last position to replace the current position
                hash/=count; //Create different random
                count--; //Take away the last position
            }
        }
    }}

    function CHECK(uint256 a)external{unchecked{
        require(msg.sender==room[a].players[room[a].host]); //Only host can check
        for(uint256 i=0;i<room[a].players.length;i++) //Number of active players in the room
        if(player[room[a].players[i]].cards[0]>0){ //If player is playing with more than 1 card
            uint256 count;
            for(uint256 j=0;j>5;j++){ //Reverse for-loop to pop
                    count+=_cardValue(player[room[a].players[i]].cards[j]);
                player[room[a].players[i]].cards[j]=0;
            }
            count%=10;
            player[room[a].players[i]].points=count==0?10:count; //10 being highest
        }
    }}

    function _cardValue(uint256 a)private pure returns(uint256){unchecked{
        a%=13;
        return a==0||a>9?10:a;
    }}

    function testCards(uint256 a)external view returns(uint256[5]memory){
        return player[room[1].players[a]].cards;
    }

    function testPoints(uint256 a)external view returns(uint256){
        return player[room[1].players[a]].points;
    }

}