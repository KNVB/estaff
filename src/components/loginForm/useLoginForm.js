import { useReducer } from "react";
import { useNavigate } from 'react-router-dom';
import EMSTFUtil from "../../util/EMSTFUtil";
import Utility from "../../util/Utility";
let reducer = (state, action) => {
    let result = { ...state };
    switch (action.type) {
        case "updateTextField":
            result[action.fieldName] = action.value;
            if (action.fieldName === "adPassword") {
                if (action.value === "") {
                    result.error.adPassword = "Please enter your AD account password."
                } else {
                    result.error.adPassword = ""
                }
            }

            if (action.fieldName === "adUserName") {
                if (action.value === "") {
                    result.error.adUserName = "Please enter your AD account name."
                } else {
                    result.error.adUserName = ""
                }
            }
            result.loginError = "";
            break;
        case "setLoginError":
            result.loginError = action.error;
            break;
        default:
            break;
    }
    return result;
}
export function useLoginForm() {
    const [itemList, updateItemList] = useReducer(reducer, {
        adPassword: "",
        adUserName: "",
        error: {
            adPassword: "",
            adUserName: ""
        },
        emstfUtil: new EMSTFUtil(),
        loginError: ""
    });
    const navigate = useNavigate();
    let login = async () => {
        try {
            if ((itemList.adPassword !== "") && (itemList.adUserName !== "")) {
                let result = await itemList.emstfUtil.login(itemList.adUserName, itemList.adPassword);
                result = Utility.decodeJWT(result);
                sessionStorage.setItem("accessToken", result);
                navigate("/staff");
            } else {
                throw "HKO AD account name or password is missing.";
            }
        } catch (error) {
            if (error === 'Invalid Credentials') {
                error = "Invalid AD user name or password";
            }
            updateItemList({ "error": error, "type": "setLoginError" });
        }
    }
    let updateTextField = e => {
        let field = e.target;
        updateItemList({
            fieldName: field.name,
            value: field.value,
            type: "updateTextField"
        })
    }
    return {
        adPassword: itemList.adPassword,
        adUserName: itemList.adUserName,
        error: itemList.error,
        loginError: itemList.loginError,
        login,
        updateTextField
    }
}