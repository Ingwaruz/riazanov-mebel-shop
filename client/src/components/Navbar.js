import React, { useContext } from 'react';
import { Navbar as BootstrapNavbar, Container, Nav } from 'react-bootstrap';
import { Context } from "../index";

const MyNavbar = () => {
    const { user } = useContext(Context);

    return (
        <div>
            <BootstrapNavbar bg="dark" data-bs-theme="dark">
                <Container>
                    <BootstrapNavbar.Brand href="#home">Navbar</BootstrapNavbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#features">Features</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link>
                    </Nav>
                </Container>
            </BootstrapNavbar>
        </div>
    );
};

export default MyNavbar;
