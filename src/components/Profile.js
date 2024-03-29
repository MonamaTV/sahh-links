import React, { useState, useContext } from 'react';
import {Link } from 'react-router-dom';
import './Profile.css'
import Bio from './Bio';
import Track from './Track';
import Loading from './Loading';
import { AuthContext } from '../auth/Auth';
import useFirestore from '../data/useFirestore';
import firebase from 'firebase';
import { Helmet } from 'react-helmet';
import contentImage from '../assets/img/mainpicture.svg';
import Table from './Table';

function Profile() {
    const { currentUser } = useContext(AuthContext);
    const { documents } = useFirestore("musicinfo", currentUser.uid);

    // const [loading, setLoading] = useState(false);
    const [code, setCode] = useState(null);
    const [name, setName] = useState(currentUser.displayName || '');
   
    const updateArtistName = (id) => {
        const updateRef = firebase.firestore().collection("musicinfo");
        updateRef.where("userID", "==", id)
        .onSnapshot((snap) => {
            snap.forEach((doc) =>{
                doc.ref.update({artist: name});
            }); 
        });
    }
    const getNextLinks = () => {
        
    }
    const getPrevLinks = () => {

    }

    const onSave = (e) => {
        e.preventDefault();
        //Check if the display name has changed
        if(currentUser.displayName !== name) {
            const user = firebase.auth().currentUser;
            try {
                user.updateProfile({
                    displayName: name
                })
                .then(() => {
                    setCode("Your name has been changed");
                })
                .catch(() => {
                    setCode("Failed to change your name"); //Failure
                })
                .finally(() => {
                    updateArtistName( currentUser.uid);
                    setTimeout(() => { 
                        setCode(null);
                    }, 3000);
                })
            } catch (error) {
                setCode("Error: please try again");
                setTimeout(() => { 
                    setCode(null);
                }, 3000);
            }

        }
        
    }

    const headers = ["Track art", "Track name", "Description","Uploaded at", "Action"];

    return (
        <div className="profile my-margin">
            <Helmet>
                <title>Your SAHHLinks Profile</title>
                <meta http-equiv="Content-Type" content="text/html;charset=UTF-8"/>
                <meta name="description" content="All the links you have published"/>
                <meta name="keywords" content="Music, Links, SAHHLinks"/>
                {/* Twitter card */}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:site" content="@SA_HipHop_ZA" />
                <meta name="twitter:title" content="Your SAHHLinks Profile" />
                <meta name="twitter:description" content="All the links you have published"/>
                <meta name="twitter:image" content={contentImage} />
            </Helmet>
            <div className="container">
            <div className="row">
                <div className="col-lg-3">
                    <Bio 
                        setName={setName}
                        email={currentUser.email}
                        name={name}
                        onSave={onSave}
                        code={code}
                    />
                </div>
                <div className="col-lg-1"></div>
                <div className="col-lg-8 my-5 background">
                    <h4>Music published</h4>
                    <Table headers={headers}>
                        {
                            documents.length > 0 ? 
                            (
                                documents.map((doc, index) => (
                                    <Track doc={doc} key={index}/>
                                ))
                            ) : (documents.length === 0? null :<Loading translateValue={-200} />)
                        }
                    </Table>
                    {/* Pagination */}
                    <div className="pagination">
                        <button>Prev</button>
                        <button>Next</button>
                    </div>
                </div>
            </div>
            </div>
            {
                code && <div id="snackbar" className={code && 'show'}>{code}</div>
            }
        </div>
    )
}
export default Profile;
