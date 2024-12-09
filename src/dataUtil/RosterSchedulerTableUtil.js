import { CopiedRegion } from "./CopiedRegion";
import RosterTableUtil from "./RosterTableUtil";
export default class RosterSchedulerTableUtil extends RosterTableUtil {
    #copiedRegion = new CopiedRegion();
    #firstX = -1; #firstY = -1;
    #isSelectMode = false; #isFirstInput = false;
    #maxCellIndex; #maxRowIndex; #minCellIndex;
    #minX = -1; #minY = -1; #maxX = -1; #maxY = -1;
    #minRowIndex = 5;
    constructor() {
        super();
        this.rosterRowIdList = [];
    }
    clearCopiedRegion = () => {
        this.#copiedRegion.clear();
    }
    endSelect = () => {
        if (this.#isSelectMode) {
            this.#isSelectMode = false;
            this.#isFirstInput = true;
        }
    }
    getCopyRegionLocation = () => {
        let result = this.getSelectedLocation();
        this.#copiedRegion.init({ maxX: this.#maxX, minX: this.#minX, minY: this.#minY, maxY: this.#maxY });
        return result;
    }
    getNextCell = (cell, xOffset, yOffset) => {
        let nextCellIndex, nextRowIndex;
        let row = cell.closest("tr");
        //console.log(this.#minCellIndex, this.#maxCellIndex, this.#minRowIndex, this.#maxRowIndex);
        switch (true) {
            case (yOffset < 0):
                nextRowIndex = row.rowIndex - 1;
                break;
            case (yOffset > 0):
                nextRowIndex = row.rowIndex + 1;
                break;
            default:
                nextRowIndex = row.rowIndex;
        }
        switch (true) {
            case (nextRowIndex > this.#maxRowIndex):
                nextRowIndex = this.#minRowIndex;
                break;
            case (nextRowIndex < this.#minRowIndex):
                nextRowIndex = this.#maxRowIndex;
                break;
            default:
                break;
        }
        switch (true) {
            case (xOffset < 0):
                nextCellIndex = cell.cellIndex - 1;
                break;
            case (xOffset > 0):
                nextCellIndex = cell.cellIndex + 1;
                break;
            default:
                nextCellIndex = cell.cellIndex;
                break;
        }
        switch (true) {
            case (nextCellIndex > this.#maxCellIndex):
                nextCellIndex = this.#minCellIndex;
                break;
            case (nextCellIndex < this.#minCellIndex):
                nextCellIndex = this.#maxCellIndex;
                break;
            default:
                break
        }
        return { cellIndex: nextCellIndex, rowIndex: nextRowIndex }
    }
    getRowIndex = rowName => {
        return this.rosterRowIdList.indexOf(rowName) + this.#minRowIndex;
    }
    getSelectedCssClass = (cellIndex, rowIndex) => {
        let result = this.#copiedRegion.getCopiedClass(cellIndex, rowIndex);
        if (result.length === 0) {
            if ((rowIndex === this.#minY) && (cellIndex >= this.#minX) && (cellIndex <= this.#maxX)) {
                result.push("selectCellBorderTop");
            }
            if ((rowIndex === this.#maxY) && (cellIndex >= this.#minX) && (cellIndex <= this.#maxX)) {
                result.push("selectCellBorderBottom");
            }
            if ((cellIndex === this.#maxX) && (rowIndex >= this.#minY) && (rowIndex <= this.#maxY)) {
                result.push("selectCellBorderRight");
            }
            if ((cellIndex === this.#minX) && (rowIndex >= this.#minY) && (rowIndex <= this.#maxY)) {
                result.push("selectCellBorderLeft");
            }
        }
        return result;
    }
    getSelectedLocation=()=>{
        let result = { column: { start: this.#minX, end: this.#maxX }, rows: [] };
        let row;
        let table = document.querySelector("table.rosterTable");
        for (let y = this.#minY; y <= this.#maxY; y++) {
            row = table.rows[y];
            result.rows.push(row.id);
        }
        return result;
    }
    init = (calendarDateList, staffIdList, systemParam) => {
        this.#maxCellIndex = systemParam.noOfPrevDate + calendarDateList.length;
        //this.#maxRowIndex = staffIdList.length * 2 + 4;
        this.#maxRowIndex = staffIdList.length * 2 + this.#minRowIndex - 1;
        this.#minCellIndex = systemParam.noOfPrevDate + 1;
        this.#minX = -1; this.#minY = -1; this.#maxX = -1; this.#maxY = -1;
        this.#copiedRegion.clear();
        this.rosterRowIdList = [];
        staffIdList.forEach(staffId => {
            this.rosterRowIdList.push("rosterRow_" + staffId);
            this.rosterRowIdList.push("preferredShiftRow_" + staffId);
        });
    }
    select = (cellIndex, rowIndex) => {
        this.#minX = cellIndex;
        this.#minY = rowIndex;
        this.#firstX = cellIndex;
        this.#firstY = rowIndex;
        this.#maxX = cellIndex;
        this.#maxY = rowIndex;
        this.#isSelectMode = false;
        this.#isFirstInput = true;
    }
    selectCell = (columnIndex, rowIndex) => {
        let table = document.querySelector("table.rosterTable");
        let cell = table.rows[rowIndex].cells[columnIndex];
        let range = document.createRange();
        let sel = window.getSelection();
        range.selectNodeContents(cell.firstChild);
        sel.removeAllRanges();
        sel.addRange(range);
    }
    setFocusCell = (e) => {
        let cell = e.target.closest("td");
        let sel = window.getSelection();
        let shiftContentDiv = cell.firstChild;
        shiftContentDiv.focus();
        sel.collapse(shiftContentDiv.firstChild, 1);
        this.#isFirstInput = false;
    }
    startSelect = (cellIndex, rowIndex) => {
        this.#minX = cellIndex;
        this.#minY = rowIndex;
        this.#firstX = cellIndex;
        this.#firstY = rowIndex;
        this.#maxX = cellIndex;
        this.#maxY = rowIndex;
        this.#isSelectMode = true;
    }
    updateHighLightCell = (cellIndex, rowIndex) => {
        super.updateHighLightCell(cellIndex, rowIndex);
        this.#updateSelectRegion(cellIndex, rowIndex);
    }
    //=============================================================================================================================================    
    #updateSelectRegion = (cellIndex, rowIndex) => {
        if ((this.#isSelectMode) && (cellIndex > -1) && (rowIndex > -1)) {
            let isChanged = false;
            let newMaxX = this.#maxX, newMinX = this.#minX;
            let newMaxY = this.#maxY, newMinY = this.#minY;
            if (cellIndex < this.#firstX) {
                newMinX = cellIndex;
                isChanged = true;
            }
            else {
                if (cellIndex > this.#firstX) {
                    newMaxX = cellIndex;
                    isChanged = true;
                }
                else {
                    newMinX = this.#firstX;
                    newMaxX = this.#firstX;
                    isChanged = true;
                }
            }
            if (rowIndex > this.#firstY) {
                newMaxY = rowIndex;
                isChanged = true;
            }
            else {
                if (rowIndex < this.#firstY) {
                    newMinY = rowIndex;
                    isChanged = true;
                }
                else {
                    newMinY = this.#firstY;
                    newMaxY = this.#firstY;
                    isChanged = true;
                }
            }
            if (isChanged) {
                this.#minX = newMinX;
                this.#maxX = newMaxX;
                this.#minY = newMinY;
                this.#maxY = newMaxY;
            }
        }
    }
}