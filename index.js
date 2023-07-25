const url = "https://jsonplaceholder.typicode.com/users";
const usersDOM = $('#users-container');
let newscounter = 0;
const loadmore = $('#loadmore');

const load = async () => {
  loadmore.prop('hidden', true);
  newscounter = 0;
  usersDOM.empty();

  try {
    const users = await $.ajax({
      url: url,
      method: 'GET',
    });

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
    const posts = await $.ajax({
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'GET',
    });

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
    const user = await $.ajax({
      url: `${url}/${id}`,
      method: 'GET',
    });

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

  try {
    const comments = await $.ajax({
      url: 'https://jsonplaceholder.typicode.com/comments',
      method: 'GET',
    });

    const post = await $.ajax({
      url: `https://jsonplaceholder.typicode.com/posts/${userId}`,
      method: 'GET',
    });

    const userInfo = await $.ajax({
      url: `https://jsonplaceholder.typicode.com/users/${userId}`,
      method: 'GET',
    });

    usersDOM.empty();

    const userComments = comments.filter(comment => comment.postId === userId);

    const ComentsDiv = $('<div></div>').addClass('userfullinfo').html(`
      <p class="author" onclick="loadUserData(${userId})">Name : ${userInfo.name}</p>
      <p>Title : ${post.title}</p>
      <p>Body : ${post.body}</p>
    `);

    userComments.forEach(comment => {
      const p = $('<p></p>').text(comment.body);
      ComentsDiv.append(p);
    });

    usersDOM.append(ComentsDiv);
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const NewsLoad = async () => {
  try {
    const posts = await $.ajax({
      url: 'https://jsonplaceholder.typicode.com/posts',
      method: 'GET',
    });

    const shuffledPosts = shuffleArray(posts);
    return shuffledPosts;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
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