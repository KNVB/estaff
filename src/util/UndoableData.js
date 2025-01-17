export default class UndoableData {
    #futureValue = [];
    #pastValue = [];
    #presentValue;
    constructor(initialValue) {
        this.#presentValue=structuredClone(initialValue);
    }
    canRedo = () => (this.#futureValue.length > 0);
    canUndo = () => (this.#pastValue.length > 0);
    redo = () => {
        console.log('UndoableData:redo:' + this.canRedo());
        if (this.#futureValue.length > 0) {
            this.#pastValue.push(this.#presentValue);
            this.#presentValue = this.#futureValue.pop();
            return structuredClone(this.#presentValue);
        }
    }
    reset = (newValue) => {
        console.log('UndoableData:reset');
        this.#futureValue = [];
        this.#pastValue = [];
        this.#presentValue = structuredClone(newValue);
    }
    set = (newValue) => {
        console.log('UndoableData:set');
        this.#pastValue.push(this.#presentValue);
        this.#presentValue = structuredClone(newValue);
    }
    undo = () => {
        console.log('UndoableData:undo:' + this.canUndo());
        if (this.#pastValue.length > 0) {
            this.#futureValue.push(this.#presentValue);
            this.#presentValue = this.#pastValue.pop();
            return structuredClone(this.#presentValue);
        }
    }
}