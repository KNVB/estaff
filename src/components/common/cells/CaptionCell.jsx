export default function CaptionCell(props) {
    return (
        <th className="captionCell" colSpan={props.colSpan}>
            {props.children}
        </th>
    );
}