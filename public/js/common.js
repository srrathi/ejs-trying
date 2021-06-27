const refreshTweets = async () => {
  $("#allTweets").empty();

  const tweets = await axios.get("/api/post");

  for (let post of tweets.data) {
    $("#allTweets").append(`<div class="card my-3">
    <div class="card-body">
        <h5 class="card-title">@${post.postedBy}</h5>
        <p class="card-text">${post.content}</p>
    </div>
</div>`);
  }
  console.log(tweets);
};

refreshTweets();

$("#submitPostButton").click(async () => {
  const postText = $("#post-text").val();

  const newPost = await axios.post("/api/post", { content: postText });
  console.log(newPost);

  refreshTweets();
  $("#post-text").val("");
});
