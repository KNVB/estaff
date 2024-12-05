import "../CalendarPicker.css";
import "./CalendarTable.css";
import Utility from "../Utility";
export default function CalendarTable({
    bigPrev,
    bigNext,
    bodyRow,
    headerRow,
    hasBigPrev = false,
    hasBigNext = false,
    hasSmallPrev = false,
    hasSmallNext = false,
    getSelectedItem,
    smallPrev,
    smallNext,
    title
}) {
    let bodyRowList = [];
    let colCount, colSpan;
    //console.log(bodyRow);
    colCount = (Utility.isNull(headerRow) ? bodyRow.rowList[0].length : headerRow.columnList.length);
    colSpan = colCount;
    if (hasBigNext) {
        colSpan--;
    }
    if (hasSmallNext) {
        colSpan--;
    }
    if (hasBigPrev) {
        colSpan--;
    }
    if (hasSmallPrev) {
        colSpan--;
    }
    if (bodyRow) {
        bodyRow.rowList.forEach((row, index) => {
            let colList = [];
            row.forEach((col, colIndex) => {
                if (col.disabled) {
                    colList.push(<td className={(col.className ?? null)}
                        key={"calendartable_body_row_" + index + "_col_" + colIndex}>
                        {col.text ?? col.value}
                    </td>);
                } else {
                    colList.push(
                        <td className={(col.className ?? null)}
                            key={"calendartable_body_row_" + index + "_col_" + colIndex}
                            onClick={() => getSelectedItem(col.value)}>
                            {col.text ?? col.value}
                        </td>
                    );
                }
            });
            bodyRowList.push(
                <tr className={(row.className ?? null)} key={"calendartable_body_row_" + index}>
                    {colList}
                </tr>
            );
        });
    }
    return (
        <table className="calendarTable">
            <thead>
                <tr>
                    {
                        (hasBigPrev) &&
                        <td className="clickable" onClick={bigPrev}>&lt;&lt;</td>
                    }
                    {
                        (hasSmallPrev) &&
                        <td className="clickable" onClick={smallPrev}>&lt;</td>
                    }
                    <td colSpan={colSpan}>{title}</td>
                    {
                        (hasSmallNext) &&
                        <td className="clickable" onClick={smallNext}>&gt;</td>
                    }
                    {
                        (hasBigNext) &&
                        <td className="clickable" onClick={bigNext}>&gt;&gt;</td>
                    }
                </tr>
                {
                    headerRow &&
                    <tr className={(headerRow.className ?? null)}>
                        {
                            headerRow.columnList.map((headerColumn, index) => (
                                <td className={(headerColumn.className ?? null)} key={"calendartable_header_row_" + index}>{headerColumn.value}</td>
                            ))
                        }
                    </tr>
                }
            </thead>
            {bodyRow &&
                <tbody>
                    {bodyRowList}
                </tbody>
            }
            <tfoot>
                <tr><td colSpan={colCount}></td></tr>
            </tfoot>
        </table>
    )
}