export default class EventHandler {
    #dataAction;
    #rosterSchedulerTableUtil
    constructor(dataAction, rosterSchedulerTableUtil) {
        this.#dataAction = dataAction;
        this.#rosterSchedulerTableUtil = rosterSchedulerTableUtil;
    }
    handleCopy = e => {
        e.preventDefault();
        let copyRegion = this.#rosterSchedulerTableUtil.getCopyRegionLocation();
        this.#dataAction.copyRosterData(copyRegion);
    }
    handleDoubleClick = e => {
        this.#rosterSchedulerTableUtil.setFocusCell(e);
    }
    handleKeyDownEvent = e => {
        switch (e.key) {
            case "ArrowDown"://handle down arrow key event
                this.#handleArrowKeyEvent(e, 0, 1, this.#rosterSchedulerTableUtil);
                break;
            case "ArrowLeft"://handle left arrow key event
                this.#handleArrowKeyEvent(e, -1, 0, this.#rosterSchedulerTableUtil);
                break;
            case "ArrowRight"://handle right arrow key event
                this.#handleArrowKeyEvent(e, 1, 0, this.#rosterSchedulerTableUtil);
                break;
            case "ArrowUp"://handle up arrow key event
                this.#handleArrowKeyEvent(e, 0, -1, this.#rosterSchedulerTableUtil);
                break;
            case "Delete"://handle delete key event
                this.#handleDelKeyEvent(e, this.#dataAction, this.#rosterSchedulerTableUtil);
                break;
            case "Escape"://handle esc key event
                this.#handleEscKeyEvent(e, this.#rosterSchedulerTableUtil);
                break;
            case "Tab"://handle tab key
                if (e.shiftKey) {
                    this.#handleArrowKeyEvent(e, -1, 0, this.#rosterSchedulerTableUtil);
                } else {
                    this.#handleArrowKeyEvent(e, 1, 0, this.#rosterSchedulerTableUtil);
                }
                break;
            case "y"://handle redo 
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.#dataAction.reDo();
                }
                break
            case "z"://handle undo 
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.#dataAction.unDo();
                }
                break
            default:
                break
        }
    }
    handleMouseDownEvent = e => {
        this.#rosterSchedulerTableUtil.startSelect(e);
    }

    handleMouseEnterEvent = e => {
        e.preventDefault();
        let cell = e.target.closest("td");
        let rowIndex = cell.closest("tr").rowIndex;
        this.#rosterSchedulerTableUtil.updateHighLightCell(cell.cellIndex, rowIndex);
    }
    handleMouseLeaveEvent = e => {
        e.preventDefault();
        this.#rosterSchedulerTableUtil.updateHighLightCell(-1, -1);
    }
    handlePaste = (e, dateOfMonth) => {
        e.preventDefault();
        let rowCount = this.#dataAction.getCopyDataRowCount();
        if (rowCount > -1) {
            let selectedLocation = this.#rosterSchedulerTableUtil.getSelectedLocation();
            this.#dataAction.paste(
                dateOfMonth,
                this.#rosterSchedulerTableUtil.getRosterRowIdList(),
                selectedLocation
            );
        }
    }
    //===============================================================================
    #handleArrowKeyEvent = (e, xOffset, yOffset) => {
        e.preventDefault();
        let cell = e.target.closest("td");
        this.#rosterSchedulerTableUtil.handleArrowKeyEvent(cell, xOffset, yOffset);
    }
    #handleDelKeyEvent = e => {
        e.preventDefault();
        let selectedLocation = this.#rosterSchedulerTableUtil.getSelectedLocation();
        this.#dataAction.deleteSelectedData(selectedLocation);
    }
    #handleEscKeyEvent = e => {
        e.preventDefault();
        this.#rosterSchedulerTableUtil.handleEscKeyEvent();
        this.#dataAction.handleEscKeyEvent();
    }
}