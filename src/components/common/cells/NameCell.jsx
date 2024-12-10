export default function NameCell(props){
    return(
        <td className={"borderCell nameCell"+ (props.isHighLightRow ? " highlightCell" : "")}>{props.children}</td>
    )
    
}