import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function FooterNav() {
    return (
        <>
            <Container fluid>
                <Navbar fixed="bottom">
                    <Container>
                        <Navbar.Collapse className="justify-content-end">
                            <Navbar.Text>
                                &copy; <a href="https://evistechnology.com/">Evis Technology</a> All Rights Reserved.
                            </Navbar.Text>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </Container>
        </>
    )
}

export default FooterNav;