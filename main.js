const SHA256= require('crypto-js/sha256');
class Block{
    constructor(index,timestamp,data,previousHash='')
    {
        this.index=index;
        this.timestamp=timestamp;
        this.data=data;
        this.previousHash=previousHash;
        this.hash=this.calculateHash();
        this.nonce=0;
    }

    calculateHash()
    {
        return SHA256(this.index+this.timestamp+JSON.stringify(this.data)+this.previousHash+this.nonce).toString();
    }

    mineBlock(nzeros)
    {
        while(this.hash.substr(0,nzeros)!=Array(nzeros+1).join("0")) 
        {
            this.nonce++;
            this.hash=this.calculateHash();
        }
        console.log("Block Mined" + this.hash);
    }
}

class Blockchain
{
    constructor()
    {
        this.chain=[this.createGenesisBlock()];
        this.nzeros=5;
    }
    createGenesisBlock()
    {
        return new Block(0,"29-04-2020","Genesis Block","0");
    }

    getLatestBlock()
    {
        return this.chain[this.chain.length-1];
    }

    addnewBlock(newBlock)
    {
        newBlock.previousHash=this.getLatestBlock().hash;
        newBlock.mineBlock(this.nzeros);
        this.chain.push(newBlock);
    }

    isChainValid()
    {
        for(let i=1;i<this.chain.length;i++)
        {
            let currentBlock=this.chain[i];
            let previousBlock=this.chain[i-1];

            if(currentBlock.hash!=currentBlock.calculateHash())
            {
                return false;
            }

            if(currentBlock.previousHash!=previousBlock.hash)
            {
                return false;
            }
        }
        return true;
    }
}

let bitcoin=new Blockchain;

console.log("mining block 1...");
bitcoin.addnewBlock(new Block(1,"30-3-2020",{amount:100}));
console.log("mining block 2...");
bitcoin.addnewBlock(new Block(1,"31-3-2020",{amount:5}));

// console.log(JSON.stringify(bitcoin,null,5)); //prints blockchain 


// console.log(bitcoin.isChainValid());  //returns if blockchain is valid or not
// bitcoin.chain[1].data="1000"  //tampering the data
// bitcoin.chain[1].hash=bitcoin.chain[1].calculateHash();//tampering the hash of tampered block
// bitcoin.chain[2].previousHash=bitcoin.chain[1].hash;  //tammpering all the blocks ahead to lead to a true blockchain
// bitcoin.chain[2].hash=bitcoin.chain[2].calculateHash();
// console.log(bitcoin.isChainValid());

