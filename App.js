import {PostsList} from "./controllers/PostsList.js";
import {getPosts} from "./services/getPosts.js";
import {getUsers} from "./services/getUsers.js";
import {createNewPost} from "./services/createNewPost.js";
import {Spinner} from "./views/SpinnerView.js";
import {postView} from "./views/postView.js";
import {createBtnView} from "./views/createBtnView.js";
import {createPostModalView} from "./views/createPostModalView.js";
import {Post} from "./controllers/Post.js";
export class App {

	start =  async () => {
		this.root = document.querySelector("#root");
		this.renderCreateBtn({element: this.root});
		this.renderCreatePostModal({element: this.root});
		const spinner = new Spinner();
		spinner.render(this.root);
		this.postsList = await this.createPostsList();
		this.renderPostsList(this.postsList, spinner)
	}

	getPostsAndUsersData = async () => {
		const postsDataPromise = getPosts();
		const usersDataPromise = getUsers();
		this.postsData = await postsDataPromise;
		this.usersData = await usersDataPromise;
		return {postsData: this.postsData, usersData: this.usersData};
	}

	createPostsList = async () => {
		const {usersData, postsData} = await this.getPostsAndUsersData();
		const postsList = new PostsList({
			postsData, 
			usersData, 
			deleteCardHandler: this.deleteCard,
			showEditFormHandler: this.showEditForm,
		});
		return postsList;
	}

	renderPostsList = (postsList, spinner) => {
		spinner.removeElement();
		postsList.render(root);
	}

	renderCreateBtn = ({element}) => {
		const createBtnElement = createBtnView({
			element, 
			showCreatePostModal: () => {
				this.createPostModalElement.style.display = "grid";
			}
		});
	}

	renderCreatePostModal = ({element}) => {
		this.createPostModalElement = createPostModalView({
			element,
			createPostHandler: this.createPostHandler,
			hideCreatePostModal: this.hideCreatePostModal,
		});
	}

	hideCreatePostModal = (e) => {
		if(e.target.contains(this.createPostModalElement)) {
			console.log(e.target.querySelector("#postTitle"))
			e.target.querySelector("#postTitle").value = "";
			e.target.querySelector("#postBody").value = "";
			e.target.style.display = "none";
		};
	}	

	deleteCard = async ({button, postId, postElement}) => {
		try {
			button.disabled = true;
			await deletePost(postId);
			postElement.remove();
		} catch(err) {
			console.log(err.message);
			button.disabled = false;
		}
	}

	createPostHandler = async (e) => {
		const postBody = new FormData(e.target);
		postBody.append("userId", 1);
		const newPostData = await createNewPost(postBody);
		this.postsData.push(newPostData)
		const post = new Post({
			postsData: this.postsData,
			postData: newPostData, 
			userData: this.usersData.find(userData => userData.id == 2), 
			deleteCardHandler: this.deleteCard,
			showEditFormHandler: this.showEditForm,
		});
		this.postsList.postsListElement.prepend(post.postElement);
		this.createPostModalElement.querySelector("#postTitle").value = "";
		this.createPostModalElement.querySelector("#postBody").value = "";
		this.createPostModalElement.style.display = "none";
	}
}