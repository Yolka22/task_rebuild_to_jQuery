// JavaScript (script.js)
const url = "https://jsonplaceholder.typicode.com/users";
const usersDOM = $('#users-container');
let newscounter = 0;
const loadmore = $('#loadmore');

const load = async () => {
  loadmore.prop('hidden', true);
  newscounter = 0;
  usersDOM.empty();

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const users = await response.json();
    users.forEach((element) => {
      const user = $('<div></div>').addClass('user').html(`
        <p>Name: ${element.name}</p>
        <p>Username: ${element.username}</p>
        <p>Email: ${element.email}</p>
      `);
      user.on('click', () => {
        loadUserData(element.id);
      });
      usersDOM.append(user);
    });
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const loadUserPosts = async (userId) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const posts = await response.json();

    const userPosts = posts.filter(post => post.userId === userId);

    const userPostsUl = $('#user-posts');
    userPostsUl.empty();
    userPosts.forEach(post => {
      const li = $('<li></li>').text(post.title);
      li.on('click', () => {
        LoadComents(userId);
      });
      userPostsUl.append(li);
    });

  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const loadUserData = async (id) => {
  usersDOM.empty();

  try {
    const response = await fetch(url + '/' + id);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const user = await response.json();

    const userDiv = $('<div></div>').addClass('userfullinfo').html(`
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Username:</strong> ${user.username}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Address:</strong> ${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}</p>
      <p><strong>Phone:</strong> ${user.phone}</p>
      <p><strong>Website:</strong> ${user.website}</p>
      <p><strong>Company:</strong> ${user.company.name}</p>
      <p><strong>Catch Phrase:</strong> ${user.company.catchPhrase}</p>
      <p><strong>Business:</strong> ${user.company.bs}</p>
      <ul id="user-posts"></ul>
    `);
    usersDOM.append(userDiv);
  } catch (error) {
    console.error('Fetch error:', error);
  }
  loadUserPosts(id);
};

const LoadComents = async (userId) => {
  loadmore.prop('hidden', true);

  const response = await fetch('https://jsonplaceholder.typicode.com/comments');
  const comments = await response.json();

  const Post = await fetch(`https://jsonplaceholder.typicode.com/posts/${userId}`);
  const PostInfo = await Post.json();

  const User = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
  const UserInfo = await User.json();

  usersDOM.empty();

  const userComments = comments.filter(comment => comment.postId === userId);

  const ComentsDiv = $('<div></div>').addClass('userfullinfo').html(`
    <p class="author" onclick="loadUserData(${userId})">Name : ${UserInfo.name}</p>
    <p>Title : ${PostInfo.title}</p>
    <p>Body : ${PostInfo.body}</p>
  `);

  userComments.forEach(comment => {
    const p = $('<p></p>').text(comment.body);
    ComentsDiv.append(p);
  });

  usersDOM.append(ComentsDiv);
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const NewsLoad = async () => {
  const ResponsePosts = await fetch('https://jsonplaceholder.typicode.com/posts');
  const Posts = await ResponsePosts.json();

  const shuffledPosts = shuffleArray(Posts);
  return shuffledPosts;
};

const NewsDisplay = async () => {
  usersDOM.empty();
  loadmore.prop('hidden', false);
  newscounter += 5;
  const NewsPosts = await NewsLoad();

  for (let i = newscounter - 5; i < newscounter; i++) {
    const newsElement = $('<p></p>').addClass('news').text(NewsPosts[i].title);
    newsElement.on('click', () => LoadComents(NewsPosts[i].userId));
    usersDOM.append(newsElement);
  }

  loadmore.on('click', () => {
    for (let i = newscounter; i < newscounter + 5; i++) {
      const newsElement = $('<p></p>').addClass('news').text(NewsPosts[i].title);
      newsElement.on('click', () => LoadComents(NewsPosts[i].userId));
      usersDOM.append(newsElement);
    }
  });
};

load();
$('#Home').on('click', load);
$('#News').on('click', NewsDisplay);