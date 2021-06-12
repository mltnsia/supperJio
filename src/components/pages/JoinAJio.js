import React, { useState, useEffect } from "react"
import { db } from '../../firebase.js'
import { Container } from "react-bootstrap"
import NavBar from '../layout/NavBar.js'
import './JoinAJio.css'
import moment from "moment";
import firebase from "firebase/app";
import Select from "react-select";
import { groupedOptions } from "./regionData.js";

export default function JoinAJio() {
    var user = firebase.auth().currentUser;

    const [startAJio, setstartAJio] = useState([]);
    const [loading, setLoading] = useState(false);
    const [region, setRegion] = useState("");
    const [order, setOrder] = useState("");
    var selectedOption = "";

    const ref = db.collection("jio");

    const [loader, setLoader] = useState(false);

    const handleRegionChange = (selectedOption) => {
        setRegion(selectedOption);
    };

    function getJio() {
        setLoading(true);
        ref.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            setstartAJio(items);
            setLoading(false);
        });
    }

    function getAvailableJio(jio) {
        return jio.orderTime.toDate().getTime() >= new Date().getTime();
    }

    function filterByRegion(selectedRegion, jio) {
        return selectedRegion.label == jio.region.label;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoader(true);

        ref.doc("").set({
            join: { joinerID: user.uid, order: order }
        })
            .then(() => {
                alert('You have successfully joined a Jio!')
                setLoader(false);
            })
            .catch(error => {
                alert(error.message);
                setLoader(false);
            });

        setOrder("");
    };

    // function getJio() {
    //     setLoading(true);
    //     ref.get().then((item) => {
    //         const items = item.docs.map((doc) => doc.data());
    //         setstartAJio(items);
    //         setLoading(false);
    //     });
    // }

    useEffect(() => {
        getJio();
        // eslint-disable-next-line
    }, []);

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <div className="page">
            <NavBar></NavBar>
            <label>Region</label>
            <Select
                placeholder="Region"
                value={selectedOption.label}
                options={groupedOptions}
                onChange={handleRegionChange}
            />
            <Container
                className="d-flex align-items-center justify-content-center"
                style={{ minHeight: "100vh" }}>
                <div className="w-100" style={{ maxWidth: "400px" }}>
                    <form className="form" onSubmit=
                        {handleSubmit}>
                        <h1>Available Jio</h1>
                        {startAJio.filter(jio => getAvailableJio(jio)).filter(jio => filterByRegion(region, jio)).map((jio) => (
                            <div key={jio.id} className="jio">
                                <h2>{jio.foodStore}</h2>
                                <p>Delivery App: {jio.deliveryApp}</p>
                                <p>Region: {jio.region.label}</p>
                                <p>Collection Point: {jio.collectionPoint}</p>
                                <p>Order Time: {moment(jio.orderTime.toDate()).format('MMMM Do YYYY, h:mm:ss a')}</p>
                                <input
                                    placeholder="Order"
                                    value={order}
                                    onChange={(e) => setOrder(e.target.value)} />
                                <button type="submit" style={{
                                    background: loader
                                        ? "#ccc" : "#5C65CF"
                                }}
                                >
                                    Submit
                                </button>
                            </div>
                        ))}
                    </form>
                </div>
            </Container>
        </div>
    );
}