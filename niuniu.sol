pragma solidity^0.8.13;//SPDX-License-Identifier:None
interface IWAC{
    function BURN(address a,uint256 m)external;
    function MINT(address a,uint256 m)external;
} 
contract NiuNiu{
    struct Room{
        Player[]players;
        uint256 betSize;
        uint256 host;
        bool hidden;
    }
    struct Player{
        address id;
        uint256[]cards;
        bool playing;
    }
    struct Account{
        uint256 room;
        uint256 balance;
    }
    IWAC private iWAC;
    address private _owner;
    mapping(uint256=>Room)public room;
    mapping(address=>Account)public account;
    modifier onlyOwner(){require(_owner==msg.sender);_;}
    //player in which room
    //exit and enter
    //player tracking

    //new room scenario

    //users temp credit
        //cashing out and deposit

    //when last user leave room will delete the room
    //kick player when afk? and remove profile.room 

    constructor(){
        _owner=msg.sender;
    }

    function TokenAddress(address a)external onlyOwner{
        iWAC=IWAC(a);
    }

    function deposit(uint256 a)external{
        iWAC.BURN(msg.sender,a);
        account[msg.sender].balance+=a;
    }

    function withdraw(uint256 a)external{
        require(account[msg.sender].balance>=a);
        account[msg.sender].balance-=a;
        iWAC.MINT(msg.sender,a);
    }

    function joinRoom(uint256 a,uint256 b)external{
        require(room[a].players.length<5); //Only able to join empty room
        if(room[a].players.length==0){ //Initial the room
            room[a].host=0;
            room[a].betSize=b;
        }
        Player memory p; //Instantiate new player to be added
        p.id=msg.sender;
        p.playing=true;
        room[a].players.push(p); //Add a player
    }

    function _cardValue(uint256 a)private pure returns(uint256){unchecked{
        require(a>0&&a<53);
        a%=13;
        return a==0||a>9?10:a;
    }}

    function _distribute(uint256 a)private{unchecked{
        uint256[52]memory table=[uint256(3),39,19,36,6,24,46,16,29,34,47,1,7,13,15,44,25,18,37,21,28,31,41,12,42,14,4,32,23,9,17,51,2,5,43,33,20,40,8,49,52,30,22,27,38,35,45,50,26,48,10,11];
        uint256 hash=uint256(keccak256(abi.encodePacked(block.timestamp))); //Generate random long number
        uint256 count=51; //Length of cards remaining
        for(uint256 i=0;i<room[a].players.length;i++){ //Number of active players in the room
            if(room[a].players[i].playing&&account[room[a].players[i].id].balance>=room[a].betSize){
            //Only when they are choose to play the round and have enough tokens
                for(uint256 j=0;j<5;j++){ //Only distribute 5 cards
                    uint256 ran=hash%count; //Pick the remaining cards
                    room[a].players[i].cards.push(table[ran]); //Set the cards
                    table[ran]=table[count]; //Move the last position to replace the current position
                    hash/=count; //Create different random
                    count--; //Take away the last position
                }
            }
        }
    }}

    function test()external returns(uint256[]memory){
        _distribute(1);
        return room[1].players[0].cards;
    }
    
}