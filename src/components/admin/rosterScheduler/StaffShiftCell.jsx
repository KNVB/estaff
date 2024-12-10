import ShiftCell from "../../common/cells/ShiftCell";
export default function ITOShiftCell({ children, cssClassName, eventHandler, onBlur, onPaste, title }) {
    let isLastCell = ((cssClassName.indexOf("selectCellBorderRight") > -1) && (cssClassName.indexOf("selectCellBorderBottom") > -1));
    return (
        <ShiftCell
            cssClassName={cssClassName + " m-0 p-0 position-relative"}
            onMouseDown={eventHandler.handleMouseDownEvent}
            onMouseEnter={eventHandler.handleMouseEnterEvent}
            onMouseLeave={eventHandler.handleMouseLeaveEvent}
            onPaste={onPaste}
            title={title}>
            <div
                className="shiftContent m-0 p-0"
                contentEditable={true}
                onBlur={onBlur}
                onDoubleClick={eventHandler.handleDoubleClick}
                onCopy={eventHandler.handleCopy}
                onKeyDown={eventHandler.handleKeyDownEvent}
                suppressContentEditableWarning={true}>
                {children}
            </div>
            {
                isLastCell &&
                <div className="littleSquareDiv m-0 p-0"></div>
            }
        </ShiftCell>
    );
}