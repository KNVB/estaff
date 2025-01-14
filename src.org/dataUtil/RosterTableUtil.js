export default class RosterTableUtil {
    #highLightCellIndex = -1
    #highLightRowIndex = -1;
    isHighLightCol = cellIndex => {
        return (this.#highLightCellIndex === cellIndex);
    }
    isHighLightRow = rowIndex => {
        return (this.#highLightRowIndex === rowIndex);
    }
    updateHighLightCell(cellIndex, rowIndex) {
        this.#highLightCellIndex = cellIndex;
        this.#highLightRowIndex = rowIndex;
    }
}