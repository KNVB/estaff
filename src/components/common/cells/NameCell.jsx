export default function NameCell(props){
    return(
        <td className={"borderCell itoNameCell"+ (props.isHighLightRow ? " highlightCell" : "")}>{props.children}</td>
    )
    
}