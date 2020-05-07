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

        this.hitsL1 = 0
        this.missL1 = 0
        this.hitsL2 = 0
        this.missL2 = 0
    }

    searchInCacheL1(tag, index, offset){
        if(offset.length === 0) offset = '0'
        let setStartBlk = parseInt(index, 2)*(this.nbLinesL1/Math.pow(2, index.toString().length))
        // console.log("In L1")
        // console.log(tag, index, offset, set)
        for(let i=0; i<parseInt(this.nbLinesL1/Math.pow(2, index.toString(2).length)); i++){
            var fetchedTag = this.tagL1[setStartBlk + i]
            // console.log((set*(this.nbLinesL1/Math.pow(2, index.toString(2).length))*Math.pow(2, this.offsetBitsL1)) + (i*Math.pow(2, this.offsetBitsL1)) + parseInt(offset, 2))
            if(tag === fetchedTag){
                // console.log("String Found at idx " + (((set + i)*Math.pow(2, this.offsetBitsL1)) + parseInt(offset, 2)))
                return this.dataL1[((setStartBlk + i)*Math.pow(2, this.offsetBitsL1)) + parseInt(offset, 2)]
            }
        }      
        return null
    }

    searchInCacheL2(tag, index, offset, nbBlocks){
        // console.log(this.dataL2)
        // console.log(this.tagL2)
        // console.log(tag, index, offset)
        // console.log(nbBlocks)

        let setStartBlk = parseInt(index, 2)*(this.nbLinesL2/Math.pow(2, index.toString().length))
        // console.log("StrtBlk")
        // console.log(setStartBlk)
        // console.log("NbBlocks")
        // console.log(this.nbLinesL2/Math.pow(2, index.toString(2).length))
        // // console.log("In L1")
        // console.log(tag, index, offset, set)
        for(let i=0; i<parseInt(this.nbLinesL2/Math.pow(2, index.toString(2).length)); i++){
            var fetchedTag = this.tagL2[setStartBlk + i]
            // console.log((set*(this.nbLinesL1/Math.pow(2, index.toString(2).length))*Math.pow(2, this.offsetBitsL1)) + (i*Math.pow(2, this.offsetBitsL1)) + parseInt(offset, 2))
            if(tag === fetchedTag){
                // console.log("String Found at idx " + (((set + i)*Math.pow(2, this.offsetBitsL1)) + parseInt(offset, 2)))
                let data = []
                for(let j=0; j<nbBlocks; j++){
                    let temp = this.dataL2[((setStartBlk + i)*Math.pow(2, this.offsetBitsL2)) + parseInt(offset, 2) + j]
                    if(temp) {
                        data.push(temp)
                    }
                    else{
                        return null
                    }
                }
                return data
            }
        }      
        return null
    }

    writeToCacheL1(tag, index, data, cycle, offset = null){
        // console.log(data)
        console.log(data)
        if(typeof(offset) === "string" && offset.length === 0) offset = '0'
        console.log(tag, index, offset)
        
        let set = parseInt(index, 2)
        
        let startBlk = (set*(this.nbLinesL1/Math.pow(2, index.toString(2).length)))

        console.log("StartBlk: ", startBlk)
        
        // if same tag is present
        for(let i=startBlk; i<startBlk+this.nbLinesL1/Math.pow(2, index.toString(2).length) && offset!==null; i++){
            console.log(this.tagL1[i])
            if(this.tagL1[i] === tag){
                console.log("writing to cache L1 only")
                this.dataL1[i*Math.pow(2, this.offsetBitsL1) + parseInt(offset, 2)] = data
                this.tagL1[i] = tag
                this.cntL1[i] = cycle
                return
            }
        }

        // finding empty or LRU blk and replacing
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
        // console.log("Evicted Data: ")
        // console.log(evictedData)
        // console.log(evictedData.some(value => typeof(parseInt(value, 2))==="number"))
        let tagBlk = (set*(this.nbLinesL1/Math.pow(2, index.toString(2).length))) + lruBlk
        if(evictedData.some(value => typeof(parseInt(value, 2))==="number")){
            let data = []
            evictedData.forEach(item => {
                if(item) data.push(item)
            })
            // console.log(data)
            this.writeToCacheL2(this.tagL1[tagBlk].toString(2) + index.toString(2) + (blk % Math.pow(2, this.offsetBitsL1)).toString(2), data, cycle)
        }
        this.tagL1[tagBlk] = tag
        this.cntL1[tagBlk] = cycle
    }

    writeToCacheL2(addr, data, cycle){
        console.log("EvictedData: " + addr)
        console.log(data)
        addr = addr.slice(0, 32)

        let offset = addr.slice(32-this.offsetBitsL2)
        let index = addr.slice(32-(this.offsetBitsL2 + this.indexBitsL2), 32-this.offsetBitsL2)
        let tag = addr.slice(0, this.tagBitsL2)

        console.log("addr split: ")
        console.log(tag, index, offset)
        // console.log(data)

        let set = parseInt(index, 2)
        let startBlk = (set*(this.nbLinesL2/Math.pow(2, index.toString(2).length)))
        console.log("StartBlk: ", startBlk)
        
        // if empty space or same tag is present
        for(let i=startBlk; i<startBlk+this.nbLinesL2/Math.pow(2, index.toString(2).length); i++){
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
        this.dataL2.splice(blk, data.length, ...data)
        let tagBlk = (set*(this.nbLinesL2/Math.pow(2, index.toString(2).length))) + lruBlk
        this.tagL2[tagBlk] = tag
        this.cntL2[tagBlk] = cycle
    }

    readFromCache(addr, currentCycle){
        console.log("Given Dec Addr: ", addr) 
        addr = addr + 268500992
        addr = addr.toString(2) // 268500992 -> the start addr
        
        for(let i=addr.length; i<32; i++){
            addr = "0" + addr
        }
        // console.log("In ReadFromCache : ", addr, currentCycle)

        // console.log("Addr: " + addr)

        // console.log("Searching CacheL1")
        var offset1 = addr.slice(32-this.offsetBitsL1)
        var index1 = addr.slice(32-(this.offsetBitsL1 + this.indexBitsL1), 32-this.offsetBitsL1)
        var tag1 = addr.slice(0, this.tagBitsL1)
       
        var data = this.searchInCacheL1(tag1, index1, offset1)
        var foundAt = "l1"
        console.log("L1Data: ")
        console.log(data)
        
        // the search in CacheL2
        if(data === null){
            // console.log("Searching CacheL2")
            let offset = addr.slice(32-this.offsetBitsL2)
            let index = addr.slice(32-(this.offsetBitsL2 + this.indexBitsL2), 32-this.offsetBitsL2)
            let tag = addr.slice(0, this.tagBitsL2)
            
            data = this.searchInCacheL2(tag, index, offset, Math.pow(2, this.offsetBitsL1))
            foundAt = "l2"

            if(data !== null){
                this.writeToCacheL1(tag1, index1, data, currentCycle)
                data = data[parseInt(offset1, 2) | 0]
            }
        }

        // the search in main memory
        if(data === null){
            // console.log("Searching Main Memory")
            let nbBlocks = Math.pow(2, this.offsetBitsL1)
            addr = (parseInt(addr, 2) - 268500992)
            addr = addr - addr % Math.pow(2, this.offsetBitsL1)
            data = []
            for(let i=0; i<nbBlocks; i++){
                // console.log(" Getting Data at: " + (addr + i))
                data.push(processor.memory[addr + i])
            }
            foundAt = "mm"
            this.writeToCacheL1(tag1, index1, data, currentCycle)
            data = data[parseInt(offset1, 2) | 0]
            console.log("MM data: ", data)
        }

        // console.log("Final Data: ")
        // console.log(parseInt(data, 2))
        // console.log("Fetched Value = ", parseInt(data, 2))
        return [parseInt(data, 2), foundAt]
    }

    writeThrough(addr, data, currentCycle){
        // console.log("Writing Through")
        // console.log("Given DecAddr: ", addr)
        // check for the presence of data addr in cacheL1 and update
        addr = addr + 268500992
        addr = addr.toString(2) // 268500992 -> the start addr

        for(let i=addr.length; i<32; i++){
            addr = "0" + addr
        }

        // console.log("In WriteThrough ", addr, currentCycle)
        // console.log("Writing Val = ", data)

        var offset = addr.slice(32-this.offsetBitsL1)
        var index = addr.slice(32-(this.offsetBitsL1 + this.indexBitsL1), 32-this.offsetBitsL1)
        var tag = addr.slice(0, this.tagBitsL1)

        var dataFetched = this.searchInCacheL1(tag, index, offset)
        if(dataFetched !== null){
            // console.log("FetchedData: ")
            // console.log(dataFetched)
            // dataFetched[parseInt(offset, 2)] = data
            this.writeToCacheL1(tag, index, data, currentCycle, offset)
        }

        // check for the presence of data addr in cacheL2 and update
        offset = addr.slice(32-this.offsetBitsL2)
        index = addr.slice(32-(this.offsetBitsL2 + this.indexBitsL2), 32-this.offsetBitsL2)
        tag = addr.slice(0, this.tagBitsL2)

        dataFetched = this.searchInCacheL2(tag, index, offset, 1)
        // console.log(tag, index, offset)
        // console.log("Writing Through L2 ", dataFetched)
        if(dataFetched !== null){
            this.writeToCacheL2(tag.toString()+index.toString()+offset.toString(), [data], currentCycle)
        }

        // update the contents of main memory
        addr = (parseInt(addr, 2) - 268500992)
        processor.memory[addr] = data
    }
}

export default cacheController