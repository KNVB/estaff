import { Col, Container, Row } from "react-bootstrap";

export default function ShiftInfoLegend({ activeShiftList }) {
    
    return (
        <Container fluid className="border m-0">
            {Object.values(activeShiftList).map(activeShift => (
                <Row key={activeShift.timeSlot}>
                    <Col className={activeShift.cssClassName}>
                        {activeShift.type} : {activeShift.timeSlot}
                    </Col>
                </Row>
            ))
            }
        </Container>
    )
}