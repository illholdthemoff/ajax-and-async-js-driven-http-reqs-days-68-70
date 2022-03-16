const loadCommentsBtnElement = document.getElementById("load-comments-btn");

async function fetchCommentsForPost() {
  // async, but in browserside JS this time!!
  //the event is triggered when the event happens, therefore we get access to the particular comment. Here we do not need event as an argument, as we already have access.

  //   const btn = event.target; // not needed, as we already have access to the button up at the top loadCommentsBtnElement.

  const postId = loadCommentsBtnElement.dataset.postid; // gives us access to the postid which we added to the comment via data-postid

  const response = await fetch(`/posts/${postId}/comments`); // starts process of fetching a resource from the network, and returns a promise which is fulfilled when the response is available. Using a string here, specifically a URL (that of the postID) as the parameter value to which we want to send a get request. Here we use the special backtick quotes since we are injecting js into it. The response is simply an object with a bunch of data about the response (lol)

  const responseData = await response.json(); // gives extracted and already parsed response data as a js object. async because it can take some time theoretically.

  console.log(responseData);
}

loadCommentsBtnElement.addEventListener("click", fetchCommentsForPost); //
