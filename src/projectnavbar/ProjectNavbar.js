import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

function ProjectNavbar() {
  return (
    <div>
      <div>
        <Navbar
          className="px-5"
          expand="lg"
          style={{ backgroundColor: "#03346E" }}
        >
          <Navbar.Brand
            className="text-white"
            style={{ fontFamily: "Lexend, sans-serif" }}
            href="/"
          >
            Narayana 1.0
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link className="text-white" href="/gradcam">
                <Navbar.Brand
                  className="text-white"
                  style={{ fontFamily: "Lexend, sans-serif" }}
                  href="/gradcam"
                >
                  GradCam
                </Navbar.Brand>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    </div>
  );
}

export default ProjectNavbar;
