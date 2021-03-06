import React from "react"
import { Button, Container } from "react-bootstrap"
import NavBar from "../layout/NavBar"
import './LandingPage.css'
import firebase from "firebase/app";
import { messaging } from "../../firebase.js"

export default function LandingPage() {

  let user = firebase.auth().currentUser

  return ( 
    <div className="page">
      <NavBar></NavBar>
      <Container className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}>
          <div className="w-100" style={{ maxWidth: "1000px" }}>
            <h2>Welcome {user.email}!</h2>
            <div className="buttons">
              <Button href="/start-a-jio" style={{padding: "20px"}} variant="outline-primary">Start A Jio</Button>{' '}
              <Button href="/join-a-jio" style={{padding: "20px"}} variant="outline-primary">Join A Jio</Button>{' '}
              <Button href="/my-started-jio" style={{padding: "20px"}} variant="outline-primary">My Started Jio</Button>{' '}
              <Button href="/my-joined-jio" style={{padding: "20px"}} variant="outline-primary">My Joined Jio</Button>{' '}
            </div>   
          </div>
      </Container>     
    </div>
  );
}


