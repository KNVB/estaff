import "../CalendarPicker.css";
import "./MonthPicker.css";
import { useCallback, useEffect, useRef } from "react";
import useMonthPicker from "./useMonthPicker";
import CalendarTable from "../calendarTable/CalendarTable";
export default function MonthPicker({ maxDate, minDate, onChange, value }) {
    const obj = useRef();
    let monthFormatter = new Intl.DateTimeFormat('en-ZA', {
        month: "long",
        year: "numeric"
    });
    const { 
        bodyRow,
        hasNextMonth, hasNextYear,
        hasPrevMonth, hasPrevYear,
        isShowPicker, result,
        tempResult, action } = useMonthPicker( value, maxDate, minDate);
    let getSelectedItem = value => {
        let temp = new Date(tempResult.getFullYear(), value, 1);
        action.updateValue(temp);
        onChange(temp);
    }
    let nextMonth = () => {
        let temp = new Date(result.getTime());
        temp.setMonth(temp.getMonth() + 1);
        action.updateValue(temp);
        onChange(temp);
    }
    let prevMonth = () => {
        let temp = new Date(result.getTime());
        temp.setMonth(temp.getMonth() - 1);
        action.updateValue(temp);
        onChange(temp);
    }
    let thisMonth=()=>{
        let temp = new Date();
        action.updateValue(temp);
        onChange(temp);
    }
    let mouseDown = useCallback(e => {
        if (isShowPicker && (!obj.current.contains(e.target))) {
            action.closePicker();
        }
    },[isShowPicker,action]);
    
    useEffect(() => {
        document.addEventListener('mousedown', mouseDown);
        return () => {
            document.removeEventListener('mousedown', mouseDown);
        }
    }, [mouseDown]);
    return (
        <div className="monthPicker" ref={obj}>
            <div
                className="monthPickResult">
                {
                    hasPrevMonth &&
                    <span onClick={prevMonth}>&lt;&nbsp;</span>
                }
                <span onClick={action.togglePicker}>{monthFormatter.format(result)}</span>
                {
                    hasNextMonth &&
                    <span onClick={nextMonth}>&nbsp;&gt;</span>
                }
            </div>
            {isShowPicker &&
                <div className="pickerContainer p-1">
                    <CalendarTable
                        bodyRow={bodyRow}
                        getSelectedItem={getSelectedItem}
                        hasSmallPrev={hasPrevYear}
                        hasSmallNext={hasNextYear}
                        smallPrev={action.prevYear}
                        smallNext={action.nextYear}
                        title={tempResult.getFullYear()}
                    />
                    <div className="thisMonth" onClick={thisMonth}>This Month</div>
                </div>
            }
        </div>
    );


}