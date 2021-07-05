const refreshTweets = async () => {
  $("#allTweets").empty();

  const tweets = await axios
    .get("/api/post")
    .then((resp) => {
      console.log(resp);
      return resp;
    })
    .catch((error) => {
      console.log(error.message);
    });

  for (let post of tweets.data) {
    const html = createPostHtml(post);
    $("#allTweets").prepend(html);
  }
  // console.log(tweets);
};

refreshTweets();

//Creating a new post
$("#submitPostButton").click(async () => {
  const postText = $("#post-text").val();

  const newPost = await axios.post("/api/post", { content: postText });
  console.log(newPost);
  refreshTweets();
  $("#post-text").val("");
});

$("#allTweets").on("click", ".likeButton", async (event) => {
  const button = $(event.target);
  const postId = getPostIdByElement(button);
  // console.log(button, postId);

  const postData = await axios.patch(`/api/posts/${postId}/like`);
  // console.log(postData);
  button.find("span").text(postData.data.likes.length);
  postData.data.likes.length > 0
    ? button.find("i").addClass("text-danger")
    : button.find("i").removeClass("text-danger");
  console.log(postData.data.likes.length);
});

function createPostHtml(postData) {
  const postedBy = postData.postedBy;

  if (postedBy._id === undefined) {
    return console.log("User object not populated");
  }

  const displayName = postedBy.firstName + " " + postedBy.lastName;
  const timestamp = timeDifference(new Date(), new Date(postData.createdAt));

  return `
  <div class="col-md-12 post mb-5" data-id=${postData._id}>
    <div class="card bg-light border border-primary text-dark p-3 pb-0">
      <div class="d-flex justify-content-between">
        <div class="d-flex flex-row align-items-center">
            <div class="icon"> <img class="img-fluid" src=${
              postedBy.profilePic
            } > </div>
            <div class="ms-2 m-2 c-details">
                <h6 class="mb-0"><a class="text-dark font-weight-bold text-uppercase" href='/profile/${
                  postedBy.username
                }' id="name">${displayName}</a></h6> <span>${timestamp}</span>
            </div>
        </div>
        <h5> <span class="badge badge-primary">@${
          postedBy.username
        }</span> </h5>
      </div>
      <div class="mt-5">
        <h5 class="heading text-wrap">${postData.content}</h5>
      </div>
    </div>
    <div class="rounded-bottom bg-primary p-2 w-100">
      <div class="contact-wrapper d-flex justify-content-between">
        <button class="btn btn-light">
          <i class='far fa-comment'></i>
        </button>
        <button class="btn btn-light">
          <i class='fas fa-retweet'></i>
        </button>
        <button class='btn btn-light likeButton'>
          <i class='far ${
            postData.likes.length > 0 ? "text-danger" : null
          } fa-heart'></i>
          <span>${postData.likes.length}</span>
        </button>
      </div>            
    </div>
  </div>`;
}

const getPostIdByElement = (element) => {
  const isRoot = element.hasClass("post");
  const rootElement = isRoot ? element : element.closest(".post");
  // console.log(element, isRoot, rootElement);
  const postId = rootElement.data().id;

  return postId;
};

function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if (elapsed / 1000 < 30) {
      return "Just now";
    }

    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return Math.round(elapsed / msPerYear) + " years ago";
  }
}
