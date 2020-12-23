import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { db, storage } from "../firebase";
import firebase from "firebase";
import "./ImageUpload.css";
import LinearProgressWithLabel from "./Progressbar";
import { makeStyles } from "@material-ui/core/styles";

function ImageUpload({ username }) {
	const [caption, setCaption] = useState("");
	const [image, setImage] = useState(null);
	const [progress, setProgress] = useState("");

	// Progress bar Functions
	const useStyles = makeStyles({
		root: {
			width: "100%",
		},
	});

	const classes = useStyles();

	const handleChange = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	const handleUpload = (e) => {
		const uploadTask = storage.ref(`images/${image.name}`).put(image);
		// image name is the ref. name i.e- file name when we select a file to open to upload.
		//attaching a listener to statechanged which tells on statechanged take a anapshot and update the progress
		uploadTask.on(
			"stateChanged",
			(snapshot) => {
				//progress function...
				const progress = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				setProgress(progress);
			},
			(error) => {
				console.log(error);
				alert(error.message);
			},
			() => {
				//complete function
				storage
					.ref("images")
					.child(image.name)
					.getDownloadURL() // getting download url of the image just posted so that we could use that to do other things
					.then((url) => {
						//post image to db
						db.collection("posts").add({
							timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							caption: caption,
							imageUrl: url,
							username: username,
						});

						setProgress(0);
						setCaption("");
						setImage(null);
					});
			}
		);
	};

	return (
		<div className="imageupload">
			{/* <progress value={progress} max="100" className="imageupload__progress" /> */}
			<div className={classes.root}>
				<LinearProgressWithLabel value={progress} />
			</div>
			<input
				type="text"
				placeholder="Enter a caption"
				value={caption}
				onChange={(event) => setCaption(event.target.value)}
			/>
			<input type="file" onChange={handleChange} />
			{/* when we click on the choose file button, it triggers a popup to select the file, and when we click on the file and open, it triggers handleChange*/}
			<Button onClick={handleUpload}>Upload</Button>
		</div>
	);
}

export default ImageUpload;
