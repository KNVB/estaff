import { Button } from "react-bootstrap";
import './LoginForm.css';
import { useLoginForm } from "./useLoginForm";
export default function LoginForm() {
    const { adPassword, adUserName, error, updateTextField,login,loginError } = useLoginForm();
    document.title = "EMSTF Staff OT and Time Off Application";
    return (
        <div className='main'>
            <div className='d-flex flex-column flex-grow-1 m-1'>
                <div className="d-flex flex-row justify-content-center">
                    <table>
                        <thead>
                            <tr>
                                <th colSpan={2}>
                                    <h1>EMSTF Staff OT and Time Off Application</h1>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='align-top text-end p-1'>
                                    HKO AD account name:<br/>
                                </td>
                                <td>
                                    <input name="adUserName" onChange={updateTextField} required type="text" value={adUserName} />
                                    <div className="text-danger">{(error) ? error.adUserName : ""}</div>
                                </td>
                            </tr>
                            <tr>
                                <td className='align-top text-end p-1'>
                                    HKO AD account password:<br/>
                                </td>
                                <td>
                                    <input name="adPassword" onChange={updateTextField} required type="password" value={adPassword} />
                                    <div className="text-danger">{(error) ? error.adPassword : ""}</div>
                                </td>
                            </tr>
                            {
                                (loginError!=="") &&
                                <tr className="text-center text-danger">
                                    <td colSpan={2}>
                                        {loginError}
                                    </td>
                                </tr>
                            }
                                                        
                        </tbody>
                        <tfoot>
                            <tr>
                                <td className="text-center pt-3" colSpan={2}>
                                    <Button onClick={login}>Login</Button>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    )
}