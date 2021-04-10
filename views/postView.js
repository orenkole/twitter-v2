export const postView = ({
	postData, 
	userData, 
}) => {
	const postHTML = `
		<div class="card p-0 m-3" data-card-id="${postData.id}">
		  <div class="card-header df">
		    <h6 class="card-subtitle mb-2 user-name" data-user-id="${postData.userId}">${userData.name}</h6>
		    <span class="card-subtitle mb-2 text-muted user-email">${userData.email}</span>
		  </div>
		  <div class="card-body">
		  	<h5 class="card-title">${postData.title}</h5>
		    <p class="card-text">${postData.body}</p>
		  </div>
		  <div class="card-footer">
			<button type="button" class="btn btn-primary edit-btn">Edit</button>
		    <button type="button" class="btn btn-danger delete-btn">Delete</button>
		  </div>
		</div>
	`;
	const postElement =  new DOMParser().parseFromString(postHTML, 'text/html').body.childNodes[0];
	return postElement;
}