const loadCommentsBtnElement = document.getElementById("load-comments-btn");
const commentsSectionElement = document.getElementById("comments");
const commentsFormElement = document.querySelector("#comments-form form"); // grannomg tje secition in post-detail, the form inside of the comments form section.
const commentTitleElement = document.getElementById("title");
const commentTextElement = document.getElementById("text"); // these two get the title and the text of their respective boxes in the post-detail file and give us access to them.

function createCommentsList(comments) {
  // this function creates a list of all the comments we have and places them on the page dynamically. It is to work with the event listener below so taht it replaces the "Load Comments" button on the comments page
  const commentListElement = document.createElement("ol");

  for (const comment of comments) {
    const commentElement = document.createElement("li");
    commentElement.innerHTML = `
    <article class="comment-item">
      <h2>${comment.title}</h2>
      <p>${comment.text}</p>
    </article>
  `; // goes through each comment in the document and posts them with the appropriate title and text.

    commentListElement.appendChild(commentElement);
  }

  return commentListElement;
}

async function fetchCommentsForPost() {
  // async, but in browserside JS this time!!
  //the event is triggered when the event happens, therefore we get access to the particular comment. Here we do not need event as an argument, as we already have access.

  //   const btn = event.target; // not needed, as we already have access to the button up at the top loadCommentsBtnElement.

  const postId = loadCommentsBtnElement.dataset.postid; // gives us access to the postid which we added to the comment via data-postid

  const response = await fetch(`/posts/${postId}/comments`); // starts process of fetching a resource from the network, and returns a promise which is fulfilled when the response is available. Using a string here, specifically a URL (that of the postID) as the parameter value to which we want to send a get request. Here we use the special backtick quotes since we are injecting js into it. The response is simply an object with a bunch of data about the response (lol)

  const responseData = await response.json(); // gives extracted and already parsed response data as a js object. async because it can take some time theoretically.

  if (responseData && responseData > 0) {
    const commentsListElement = createCommentsList(responseData); // creates a list of comments using the responseData we got from the page/document

    commentsSectionElement.innerHTML = ""; // emptying the current shit on that section (which in this case is just the button + the paragraph talking about loading them)

    commentsSectionElement.appendChild(commentsListElement); // populates the above now empty space with a list of our comments.
  } else {
    commentsSectionElement.firstElementChild.textContent =
      "We could not find any comments."; // this will set the text content of paragraph in the comments section to the above there. We use firstElementChild because it is the first element child of the comments section.
  }
}

async function saveComment(event) {
  event.preventDefault(); // stops the default event when this function is fired (in this case it would stop the page from 'submitting' the content and thus reloading the page.)
  const postId = commentsFormElement.dataset.postid;

  const enteredTitle = commentTitleElement.value;
  const enteredText = commentTextElement.value;

  const comment = { title: enteredTitle, text: enteredText };

  const response = await fetch(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(comment), // converting our comment there into JSON so that it can be posted
    headers: {
      // setting the headers, since as we are essentially building our own post request here without reloading the page, we need to manually add headers so that our middleware knows to pick it up (ie express.json)
      "Content-Type": "application/json", // tells the middleware that it contains json data.
    },
  });

  fetchCommentsForPost();
}

loadCommentsBtnElement.addEventListener("click", fetchCommentsForPost);
commentsFormElement.addEventListener("submit", saveComment); // using the submit as a listener instead of click, this is good practice.
