import "./TimeSelector.css";
import useTimeSelector from "./useTimeSelector";
export default function TimeSelector({ getSelectedTime, value }) {
    const { aPM, hour, minute, selectedItem, action } = useTimeSelector(value);
    let downValue = () => {
        switch (selectedItem) {
            case "APM":
                toggleAPM();
                break;
            case "hour":
                getSelectedTime(action.downHour());
                break;
            case "minute":
                getSelectedTime(action.downMin());
                break;
            default:
                break;
        }
    }
    let handleClick = (fieldName, element) => {
        action.updateSelectedItem(fieldName);
        let value = element.value;
        element.value = "";   //This is a trick for 
        element.value = value;//setting cursor at the end of the input box
    }
    let toggleAPM = () => {
        getSelectedTime(action.toggleAPM());
    }
    let updateHourFieldValue = (element) => {
        let temp = element.value;
        let result;
        //console.log(temp,(Number(temp) < Number(element.max)));
        if (Number(temp) < Number(element.max)) {
            if ((temp === "0") || (temp === "")) {
                result = 12;
            } else {
                result = Number(temp);
            }
        } else {
            switch (true) {
                case (Number(temp) === Number(element.max)):
                    result = 1;
                    break;
                case (temp === "0"):
                    result = 12;
                    break;
                default:
                    temp = temp.substring(temp.length - 1);
                    result = Number(temp);
                    break;
            }
        }
        //console.log("result="+result);
        getSelectedTime(action.updateTimeFieldValue("hour", String(result).padStart(2, '0')));
    }
    let updateMinuteField = element => {
        let temp = element.value;
        let result;
        if (Number(temp) < Number(element.max)) {
            result = Number(temp);
        } else {
            temp = temp.substring(temp.length - 1);
            result = Number(temp);
        }
        getSelectedTime(action.updateTimeFieldValue("minute", String(result).padStart(2, '0')));
    }
    let upValue = () => {
        switch (selectedItem) {
            case "APM":
                toggleAPM();
                break;
            case "hour":
                getSelectedTime(action.upHour());
                break;
            case "minute":
                getSelectedTime(action.upMin());
                break;
            default:
                break;
        }
    }
    return (
        <div className="timeSelector">
            <input
                className={"timeSelectorDigit" + (selectedItem === "hour" ? " selectedItem" : "")}
                max="13"
                min="0"
                onChange={e => updateHourFieldValue(e.target)}
                onClick={e => handleClick("hour", e.target)}
                type="number"
                value={hour} />&nbsp;:&nbsp;
            <input
                className={"timeSelectorDigit" + (selectedItem === "minute" ? " selectedItem" : "")}
                max="60"
                min="-1"
                onChange={e => updateMinuteField(e.target)}
                onClick={e => handleClick("minute", e.target)}
                type="number"
                value={minute} />&nbsp;
            <span
                className={"timeSelectorDigit" + (selectedItem === "APM" ? " selectedItem" : "")}
                onClick={() => action.updateSelectedItem("APM")}
                >{aPM}
            </span>
            <div className="timeSelectorUpDown">
                <div onClick={upValue}>▲</div>
                <div onClick={downValue}>▼</div>
            </div>      
        </div>
    );
}