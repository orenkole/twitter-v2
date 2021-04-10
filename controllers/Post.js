import {editCardFormView} from "../views/editCardFormView.js";
import {postView} from "../views/postView.js";
import {editPost} from "../services/editPost.js";
import {deletePost} from "../services/deletePost.js";

export class Post {
	constructor({
		postsData,
		postData, 
		userData, 
		deleteCardHandler, 
		showEditFormHandler
	}) {
		this.postsData = postsData;
		this.postData = postData;
		this.userData = userData;
		this.postElement = postView({
			postData: this.postData, 
			userData: this.userData, 
		});
		this.deleteBtn = this.postElement.querySelector(".delete-btn");
		this.editBtn = this.postElement.querySelector(".edit-btn");
		this.deleteBtn.addEventListener("click", () => {
			this.deleteCardHandler()
		});
		this.editBtn.addEventListener("click", () => {
			this.showEditFormHandler();
		});
		return this;
	}

	deleteCardHandler = async () => {
		this.deleteBtn.disabled = true;
		await deletePost(this.postData.id);
		this.postElement.remove();
		this.deleteBtn.disabled = false;
	}

	showEditFormHandler = () => {
		console.log("EDITING")
		this.postElement.querySelector(".card-body").style.display = "none";
		this.postElement.querySelector(".card-footer").style.display = "none";
		this.editCardFormElement = editCardFormView({postData: this.postData});
		this.editCardFormElement.addEventListener("submit", (e) => {
			e.preventDefault();
			this.updatePost({
				editCardFormElement: this.editCardFormElement, 
			});
		})
		this.postElement.append(this.editCardFormElement);
	}


	updatePost = async ({editCardFormElement}) => {
		const editFormData = new FormData(editCardFormElement);
		editFormData.append("id", `${this.postData.id}`);
		editFormData.append("userId", `${this.userData.id}`);
		const updatedPostData = await editPost(editFormData);
		console.log(this.postsData)
		this.postsData = this.postsData.map(postData => (
			postData.id = updatedPostData.id
			? updatedPostData
			: postData
		))
		this.postData = updatedPostData;
		this.refreshPostContent({updatedPostData});
		console.log(this.postsData)
	}

	refreshPostContent = ({updatedPostData}) => {
		const title = this.postElement.querySelector(".card-title");
		title.textContent = updatedPostData.title;
		const body = this.postElement.querySelector(".card-text");
		body.textContent = updatedPostData.body;
		this.editCardFormElement.style.display = "none";
		this.postElement.querySelector(".card-body").style.display = "block";
		this.postElement.querySelector(".card-footer").style.display = "block";

	}
}