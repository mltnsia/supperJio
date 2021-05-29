import React from "react"
import NavBar from '../layout/NavBar.js'
import { Data } from './Data.js'
import Accordion from "./Accordion"

export default function FAQ() {
    return (
        <div>
        <NavBar></NavBar>
            <Container>
                
                {Data.map((item ,index) => {
                    return (
                        <div>
                            <h1>{item.question}</h1>
                            <p>{item.answer}</p>
                        </div>
                    )
                })}
            </Container>
        </div>
    );
}