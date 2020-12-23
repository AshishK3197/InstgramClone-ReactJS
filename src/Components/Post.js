import React, { useEffect, useState } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "../firebase";
import firebase from "firebase";

function Post({ postId, imageUrl, user, username, caption }) {
	const [comment, setComment] = useState(""); //state tracking comment entered into input field
	const [comments, setComments] = useState([]); //state for getting all the comments from the db from a single post

	useEffect(() => {
		let unsubscribe;
		if (postId) {
			unsubscribe = db
				.collection("posts")
				.doc(postId)
				.collection("comments")
				.orderBy("timestamp", "desc")
				.onSnapshot((snapshot) => {
					setComments(snapshot.docs.map((doc) => doc.data()));
				});
		}

		return () => {
			unsubscribe();
		};
	}, [postId]);

	const postComment = (event) => {
		event.preventDefault();
		db.collection("posts").doc(postId).collection("comments").add({
			text: comment,
			username: user.displayName,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		});

		setComment("");
	};

	return (
		<div className="post">
			{/* header -- avatar + username */}
			<div className="post__header">
				<Avatar
					className="post__avatar"
					alt="Ashish Kumar"
					src="/static/images/avatar/1.jpg"
				/>
				<h3>{username}</h3>
			</div>

			<img className="post__image" src={imageUrl} alt="ReactSample" />
			<h4 className="post__text">
				<strong className="post__username">{username}</strong>
				{caption}
			</h4>

			{/* View the comments */}

			<div className="post__comments">
				{comments.map((comment) => (
					<p>
						<strong>{comment.username}</strong> {comment.text}
					</p>
				))}
			</div>

			{/* like , comment,post comment button, share */}
			{user && (
				<form className="post__commentBox">
					<input
						type="text"
						placeholder="Add a Comment..."
						className="post__input"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
					<button
						disabled={!comment}
						type="submit"
						className={
							!comment ? "post__buttondisabled" : "post__buttonenabled" //to apply color to post button text depending upon the comment in the text box.
						}
						onClick={postComment}
					>
						Post
					</button>
				</form>
			)}
		</div>
	);
}

export default Post;
