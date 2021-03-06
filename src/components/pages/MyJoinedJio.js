import React, { useState, useEffect } from "react"
import { db } from '../../firebase.js'
import { Container, Button, Nav } from "react-bootstrap"
import NavBar from '../layout/NavBar.js'
import './MyJoinedJio.css'
import moment from "moment";
import firebase from "firebase/app";

export default function MyJoinedJio() {
    var user = firebase.auth().currentUser;

    const jioRef = db.collection("jio");
    const userRef = db.collection("users");
    const [startAJio, setStartAJio] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loader, setLoader] = useState(false);
    const [username, setUsername] = useState("");
    const [currentUser, setCurrentUser] = useState(null); // details of current user

    function setUser() {
        var docRef = userRef.doc(user.email);
        docRef.get().then((doc) => {
            setUsername(doc.data().username);
            setCurrentUser(doc.data());
        });
    }

    useEffect(() => {
        setUser();
        // eslint-disable-next-line
    }, []);

    function getJio() {
        setLoading(true);
        jioRef.onSnapshot((querySnapshot) => {
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push(doc.data());
            });
            setStartAJio(items);
            setLoading(false);
        });
    }

    useEffect(() => {
        getJio();
        // eslint-disable-next-line
    }, []);

    if (loading) {
        return <h1>Loading...</h1>
    }

    function filterByUsername(jio) {
        var i;
        for (i = 0; i < jio.joinerUsernames.length; i++) {
            if (username === jio.joinerUsernames[i]) {
                return true;
            }
        }
        return false;
    }

    function filterJio() {
        return startAJio.filter(jio => filterByUsername(jio))
    }

    function displayOrders(jio) {
        var i;
        let output = "";
        for (i = 0; i < jio.orders.length; i++) {
            if (username === jio.joinerUsernames[i]) {
                output = jio.orders[i];
            }
        }
        return output;
    }

    function viewReceipt(e, jio) {
        e.preventDefault();

        if (jio.receiptURL === "") {
            alert("Receipt has not been uploaded!");
        } else {
            return window.open(jio.receiptURL, "_blank");
        }
    }

    const handleSubmit = (e, jio) => {
        e.preventDefault();
        setLoader(true);

        var docRef = userRef.doc(user.email);
        docRef.get().then((doc) => {
            setCurrentUser(doc.data());
        });

        var joinerUsernameArray = [];
        var orderArray = [];
        var i;
        var j;
        var idxForOrders = [];
        var k = 0;
        var newActiveJio = [];
        var newActiveJioTracker = [];

        for (i = 0; i < jio.joinerUsernames.length; i++) {
            if (jio.joinerUsernames[i] !== username) {
                joinerUsernameArray.push(jio.joinerUsernames[i]);
            } else {
                idxForOrders.push(i);
            }
        }

        for (j = 0; j < jio.orders.length; j++) {
            if (j !== idxForOrders[k]) {
                orderArray.push(jio.orders[j]);
            } else {
                k = (idxForOrders.length !== k + 1) ? k + 1 : k;
            }
        }

        // updating starter's activeJioTracker
        userRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                newActiveJioTracker = [];
                var newUsers = [];
                var newReviewDone = [];
                if (doc.data().username === jio.starterUsername) {
                    for (i = 0; i < doc.data().activeJioTracker.length; i++) {
                        if (doc.data().activeJioTracker[i].jioID === jio.jioID) {
                            var idx;
                            for (idx = 0; idx < doc.data().activeJioTracker[i].users.length; idx++) {
                                if (doc.data().activeJioTracker[i].users[idx] !== username) {
                                    newUsers.push(doc.data().activeJioTracker[i].users[idx]);
                                    newReviewDone.push(doc.data().activeJioTracker[i].reviewDone[idx]);
                                }
                            }
                        } else {
                            newActiveJioTracker.push(doc.data().activeJioTracker[i]);
                        }
                    }

                    var t = { jioID: jio.jioID, users: newUsers, reviewDone: newReviewDone };
                    newActiveJioTracker.push(t);

                    userRef.doc(doc.data().email).update({
                        activeJioTracker: newActiveJioTracker
                    })
                }
            })
        })

        // updating user's activeJio and activeJioTracker
        for (i = 0; i < currentUser.activeJio.length; i++) {
            if (jio.jioID !== currentUser.activeJio[i]) {
                newActiveJio.push(currentUser.activeJio[i]);
            }
        }

        newActiveJioTracker = [];

        for (i = 0; i < currentUser.activeJioTracker.length; i++) {
            if (jio.jioID !== currentUser.activeJioTracker[i].jioID) {
                newActiveJioTracker.push(currentUser.activeJioTracker[i]);
            }
        }

        userRef.doc(user.email).update({ activeJio: newActiveJio, activeJioTracker: newActiveJioTracker });
        jioRef.doc(jio.jioID).update({ joinerUsernames: joinerUsernameArray, orders: orderArray }
        )
            .then(() => {
                alert('You have successfully removed your order!')
                setLoader(false);
            })
            .catch(error => {
                alert(error.message);
                setLoader(false);
            });
    }

    return (
        <div className="page">
            <NavBar></NavBar>
            <Button href="/" className="button">Back to Home</Button>
            <div className="title">My Joined Jio</div>
            <Container style={{ width: "600px", justify: "center" }}>
                {filterJio()
                    .map((jio) => (
                        <div key={jio.id} className="jio">
                            <h2>{jio.foodStore}</h2>
                            <p>Delivery App: {jio.deliveryApp}</p>
                            <p>Region: {jio.region.label}</p>
                            <p>Collection Point: {jio.collectionPoint}</p>
                            <p>Order Time: {moment(jio.orderTime.toDate()).format('MMMM Do YYYY, h:mm:ss a')}</p>
                            <p>Order Status: {jio.orderStatus}</p>
                            <p>Starter: {jio.starterUsername}</p>
                            <p>My Orders: {displayOrders(jio)}</p>
                            <div className="set">
                                <Nav.Link className="button2" href={'/user/' + jio.starterUsername}>View Starter Profile</Nav.Link>
                                <td className="button2" onClick={e => viewReceipt(e, jio)}>View Receipt</td>
                            </div>
                            <br />
                            <button type="submit"
                                onClick={e => { handleSubmit(e, jio) }}
                                disabled={jio.orderTime.toDate().getTime() <= new Date().getTime()}
                                style={{ background: loader ? "#ccc" : "#bdc1eb" }}
                            >
                                Remove My Order
                            </button>
                        </div>
                    ))}
            </Container>
        </div>
    );
}