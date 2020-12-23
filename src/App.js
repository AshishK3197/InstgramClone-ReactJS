import { useState, useEffect } from "react";
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Post from "./Components/Post";
import { db, auth } from "./firebase";
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./Components/ImageUpload";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: "absolute",
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}));

function App() {
	const classes = useStyles();
	const [modalStyle] = useState(getModalStyle);

	const [posts, setposts] = useState([]);
	const [open, setopen] = useState(false);
	const [openSignIn, setopenSignIn] = useState(false);
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [user, setUser] = useState(null);

	useEffect(() => {
		//listens for every single time an authentication change happens like login ,logout or create a new user
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				//user logged in
				console.log(authUser);
				setUser(authUser); //survives refresh of webpage by cookie tracking , as user will still be logged in if the page gets reloaded
			} else {
				//	user logged out
				setUser(null);
			}
		});

		return () => {
			//perform some cleanup actions
			unsubscribe(); // so we dont end up having more than 1 listener for evertime the user and username changes , hence we clear it out first before firing useEffect again
		};
	}, [user, username]);

	useEffect(() => {
		db.collection("posts")
			.orderBy("timestamp", "desc")
			.onSnapshot((snapshot) => {
				setposts(
					snapshot.docs.map((doc) => {
						// console.log({ id: doc.id, post: doc.data() });
						return { id: doc.id, post: doc.data() };
					})
				);
			});
	}, []);

	const signup = (event) => {
		event.preventDefault();
		auth
			.createUserWithEmailAndPassword(email, password)
			.then((authUser) => {
				return authUser.user.updateProfile({
					//go to  the user that youy just logged in with, go to their profile and set their displayname as the username
					displayName: username,
				});
			})
			.catch((error) => alert(error.message));
		setopen(false);
	};

	const signin = (event) => {
		event.preventDefault();
		auth
			.signInWithEmailAndPassword(email, password)
			.catch((error) => alert(error.message));

		setopenSignIn(false);
	};

	return (
		<div className="app">
			{/*  */}

			<Modal
				open={open}
				onClose={() => {
					setopen(false);
				}}
			>
				<div style={modalStyle} className={classes.paper}>
					<form className="app__signup">
						<center>
							<img
								className="app__headerImage"
								src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt=""
							/>
						</center>
						<Input
							placeholder="username"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>

						<Input
							placeholder="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							placeholder="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button onClick={signup}>Login</Button>
					</form>
				</div>
			</Modal>
			<Modal
				open={openSignIn}
				onClose={() => {
					setopenSignIn(false);
				}}
			>
				<div style={modalStyle} className={classes.paper}>
					<form className="app__signup">
						<center>
							<img
								className="app__headerImage"
								src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
								alt=""
							/>
						</center>
						<Input
							placeholder="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input
							placeholder="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button onClick={signin}>Sign In</Button>
					</form>
				</div>
			</Modal>
			{/* Header */}
			<div className="app__header">
				<img
					className="app__headerImage"
					src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
					alt=""
				/>

				{/* conditional rendering of login logout buttons */}
				{user ? (
					<Button
						onClick={() => {
							auth.signOut();
						}}
					>
						Sign Out
					</Button>
				) : (
					<div className="app__loginContainer">
						<Button
							onClick={() => {
								setopenSignIn(true);
							}}
						>
							Sign In
						</Button>
						<Button
							onClick={() => {
								setopen(true);
							}}
						>
							Sign Up
						</Button>
					</div>
				)}
			</div>

			{/* Posts */}
			{/* <Post
				imageUrl="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
				username="Ashish"
				caption="Hey there"
			/> */}

			<div className="app__posts">
				<div className="app__postsleft">
					{posts.map(({ id, post }) => {
						return (
							<Post
								key={id}
								postId={id}
								imageUrl={post.imageUrl}
								user={user}
								username={post.username}
								caption={post.caption}
							/>
						);
					})}
				</div>
				<div className="app__postsright">
					<InstagramEmbed
						url="https://www.instagram.com/p/B_uf9dmAGPw/"
						maxWidth={320}
						hideCaption={false}
						containerTagName="div"
						protocol=""
						injectScript
						onLoading={() => {}}
						onSuccess={() => {}}
						onAfterRender={() => {}}
						onFailure={() => {}}
					/>
				</div>
			</div>

			{/* Upload Button, choose file and add caption */}
			{user?.displayName ? (
				<ImageUpload username={user.displayName} />
			) : (
				<h3>Sorry you need to login to upload 😄</h3>
			)}
		</div>
	);
}

export default App;
