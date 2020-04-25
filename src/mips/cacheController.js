import processor from "./processor";

class cacheController{
    constructor(l1CacheConfig, l2CacheConfig){
        this.indexBitsL1 = Math.log2(l1CacheConfig.associativity)
        this.offsetBitsL1 = Math.log2(l1CacheConfig.blockSize/4)
        this.tagBitsL1 = 32 - (this.indexBitsL1 + this.offsetBitsL1)

        this.indexBitsL2 = Math.log2(l2CacheConfig.associativity)
        this.offsetBitsL2 = Math.log2(l2CacheConfig.blockSize/4)
        this.tagBitsL2 = 32 - (this.indexBitsL2 + this.offsetBitsL2)

        this.nbLinesL1 = l1CacheConfig.cacheSize/l1CacheConfig.blockSize
        this.tagL1 = new Array(this.nbLinesL1)
        this.cntL1 = new Array(this.nbLinesL1).fill(0)
        this.dataL1 = new Array(l1CacheConfig.cacheSize/4)
        this.nbLinesL2 = l2CacheConfig.cacheSize/l2CacheConfig.blockSize
        this.tagL2 = new Array(this.nbLinesL2)
        this.cntL2 = new Array(this.nbLinesL2).fill(0)
        this.dataL2 = new Array(l2CacheConfig.cacheSize/4)
    }

    searchInCacheL1(tag, index, offset){
        let set = parseInt(index, 2)
        // console.log(tag, index, offset)
        for(let i=0; i<parseInt(this.nbLinesL1/Math.pow(2, index.toString(2).length)); i++){
            var fetchedTag = this.tagL1[set + i]
            // console.log((set*(this.nbLinesL1/Math.pow(2, index.toString(2).length))*Math.pow(2, this.offsetBitsL1)) + (i*Math.pow(2, this.offsetBitsL1)) + parseInt(offset, 2))
            if(tag === fetchedTag){
                return this.dataL1[(set*(this.nbLinesL1/Math.pow(2, index.toString(2).length))*Math.pow(2, this.offsetBitsL1)) + (i*Math.pow(2, this.offsetBitsL1)) + parseInt(offset, 2)]
            }
        }      
        return null
    }

    searchInCacheL2(tag, index, offset, nbBlocks){
        let set = parseInt(index, 2)
        // console.log("NBBlocks: " + this.nbLinesL1/Math.pow(2, index.toString(2).length))
        for(let i=0; i<this.nbLinesL1/Math.pow(2, index.toString(2).length); i++){
            var fetchedTag = this.tagL1[set + i]
            // console.log(set*this.nbLinesL1/Math.pow(2, index.toString(2).length)*Math.pow(2, offset.length) + i + parseInt(offset, 2))
            if(tag === fetchedTag){
                var startBlk = parseInt(offset, 2) - (parseInt(offset, 2) % nbBlocks)
                var data = []
                for(let j=0; j<nbBlocks; j++){
                    data.push(this.dataL1[(set*(this.nbLinesL1/Math.pow(2, index.toString(2).length))*Math.pow(2, this.offsetBitsL1)) + (i*Math.pow(2, this.offsetBitsL1)) + startBlk + j])
                }
                return data
            }
        }      
        return null
    }

    writeToCacheL1(tag, index, data, cycle){
        // console.log(data)
        let set = parseInt(index, 2)
        let startBlk = (set*(this.nbLinesL1/Math.pow(2, index.toString(2).length)))
        let i =  startBlk + 1
        // console.log("StartBlk: " + startBlk)
        let lruBlk = 0
        while(i<this.nbLinesL1/Math.pow(2, index.toString(2).length) + startBlk){
            if(this.cntL1[lruBlk+startBlk] > this.cntL1[i]){
                lruBlk = i - startBlk
            }
            i++;
        }
        // console.log("lruBlk: " + lruBlk)
        let blk = (set*(this.nbLinesL1/Math.pow(2, index.toString(2).length))*Math.pow(2, this.offsetBitsL1)) + (lruBlk*Math.pow(2, this.offsetBitsL1))
        let evictedData = this.dataL1.splice(blk, data.length, ...data)
        let tagBlk = (set*(this.nbLinesL1/Math.pow(2, index.toString(2).length))) + lruBlk
        if(!evictedData.includes(undefined)){
            this.writeToCacheL2(this.tagL1[tagBlk].toString(2) + index.toString(2) + (blk % Math.pow(2, this.offsetBitsL1)).toString(2), evictedData, cycle)
        }
        this.tagL1[tagBlk] = tag
        this.cntL1[tagBlk] = cycle
    }

    writeToCacheL2(addr, data, cycle){
        console.log("EvictedData: " + addr)
        console.log(data)

        let offset = addr.slice(32-this.offsetBitsL2)
        let index = addr.slice(32-(this.offsetBitsL2 + this.indexBitsL2), 32-this.offsetBitsL2)
        let tag = addr.slice(0, this.tagBitsL2)

        console.log(tag, index, offset)

        let set = parseInt(index, 2)
        let startBlk = (set*(this.nbLinesL1/Math.pow(2, index.toString(2).length)))
        
        // if empty space or same tag is present
        for(let i=startBlk; i<startBlk+this.nbLinesL1/Math.pow(2, index.toString(2).length); i++){
            if(this.tagL2[i] === undefined || this.tagL2[i] === tag){
                this.dataL2.splice(i*Math.pow(2, this.offsetBitsL2) + parseInt(offset, 2), data.length, ...data)
                this.tagL2[i] = tag
                this.cntL2[i] = cycle
                return
            }
        }

        // Else LRU policy to be applied
        let i =  startBlk + 1
        // console.log("StartBlk: " + startBlk)
        let lruBlk = 0
        while(i<this.nbLinesL2/Math.pow(2, index.toString(2).length) + startBlk){
            if(this.cntL2[lruBlk+startBlk] > this.cntL2[i]){
                lruBlk = i - startBlk
            }
            i++;
        }
        // console.log("lruBlk: " + lruBlk)
        let blk = (set*(this.nbLinesL2/Math.pow(2, index.toString(2).length))*Math.pow(2, this.offsetBitsL2)) + (lruBlk*Math.pow(2, this.offsetBitsL2))
        this.dataL1.splice(blk, data.length, ...data)
        let tagBlk = (set*(this.nbLinesL1/Math.pow(2, index.toString(2).length))) + lruBlk
        this.tagL1[tagBlk] = tag
        this.cntL1[tagBlk] = cycle
    }

    readFromCache(addr, currentCycle){
        var offset1 = addr.slice(32-this.offsetBitsL1)
        var index1 = addr.slice(32-(this.offsetBitsL1 + this.indexBitsL1), 32-this.offsetBitsL1)
        var tag1 = addr.slice(0, this.tagBitsL1)
        // console.log(tag, index, offset)
       
        var data = this.searchInCacheL1(tag1, index1, offset1)
        
        // the search in CacheL1
        if(data === null){
            let offset = addr.slice(32-this.offsetBitsL2)
            let index = addr.slice(32-(this.offsetBitsL2 + this.indexBitsL2), 32-this.offsetBitsL2)
            let tag = addr.slice(0, this.tagBitsL2)
            
            data = this.searchInCacheL2(tag, index, offset, Math.pow(2, this.offsetBitsL1))

            if(data !== null){
                this.writeToCacheL1(tag1, index1, data, currentCycle)
                data = data[parseInt(offset1, 2)]
            }
        }

        // the search in main memory
        if(data === null){

        }

        return data
    }
}

export default cacheController