export class CopiedRegion {
    constructor() {
        let isCopyMode = false;
        let maxX = -1;
        let minX = -1;
        let maxY = -1;
        let minY = -1;
        this.clear=()=>{
            isCopyMode = false;
            maxX = -1;
            minX = -1;
            maxY = -1;
            minY = -1;
        }
        this.getCopiedClass = (cellIndex, rowIndex) => {
            let result = [];
            if (isCopyMode) {
                if ((rowIndex === minY) && (cellIndex >= minX) && (cellIndex <= maxX)) {
                    result.push("copiedShiftCellBorderTop");
                }
                if ((rowIndex === maxY) && (cellIndex >= minX) && (cellIndex <= maxX)) {
                    result.push("copiedShiftCellBorderBottom");
                }
                if ((cellIndex === maxX) && (rowIndex >= minY) && (rowIndex <= maxY)) {
                    result.push("copiedShiftCellBorderRight");
                }
                if ((cellIndex === minX) && (rowIndex >= minY) && (rowIndex <= maxY)) {
                    result.push("copiedShiftCellBorderLeft");
                }
            }
            return result;
        }
        this.getCopiedRegion=()=>{
            return {
                maxX,
                minX,
                maxY,
                minY
            }
        }
        this.init = (data) => {            
            isCopyMode = true;
            maxX = data.maxX;
            minX = data.minX;
            maxY = data.maxY;
            minY = data.minY;
        }
    }
}