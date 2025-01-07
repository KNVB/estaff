import { useReducer } from "react";
import EMSTFUtil from "../../dataUtil/EMSTFUtil";
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
            result.loginError="";
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
        loginError:""
    });
    let login=async()=>{
        try{
            if ((itemList.adPassword !=="") && (itemList.adUserName!=="")){
                let result=await itemList.emstfUtil.login(itemList.adUserName,itemList.adPassword);
                console.log("result="+result);
            }else{
                throw "HKO AD account name or password is missing.";
            }            
        }catch (error){
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
        loginError:itemList.loginError,
        login,
        updateTextField
    }
}