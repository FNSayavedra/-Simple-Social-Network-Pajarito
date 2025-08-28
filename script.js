const urlBase = 'https://jsonplaceholder.typicode.com/posts'; // esta es la URL con la que interactuamos
let posts = []; // Array para almacenar los posts

function getData(){ // Función para obtener los posts
    fetch(urlBase) // Llamada a la API
    .then(response => response.json()) // Convertimos la respuesta a JSON
    .then(data => {
        posts = data; // Guardamos los posts en el array
        renderPostList();// Renderizamos los posts en el DOM
    })
    .catch(error => console.error('Error al llamar a la API:', error));
}

getData()

function renderPostList(){
    const postList = document.getElementById('postList'); // Obtenemos el elemento UL donde se mostrarán los posts
    postList.innerHTML = ''; // Limpiamos el contenido actual

    posts.forEach(post => { // Iteramos sobre cada post
        const listItem = document.createElement('li'); // Creamos un elemento LI para cada post
        listItem.classList.add('post-item'); // Agregamos una clase para estilos
        listItem.innerHTML = `
        <strong>${post.title}</strong>
        <p>${post.body}</p>
        <button onclick="editPost(${post.id})">Editar</button>
        <button onclick="deletePost(${post.id})">Eliminar</button>

        <div id="editForm-${post.id}" class="edit-form" style="display:none;">

        <label for="editTitle-${post.id}">Título:</label>
        <input type="text" id="editTitle-${post.id}" value="${post.title}">
        <label for="editBody">Comentario: </label>
        <textarea id="editBody-${post.id}" required>${post.body}</textarea>
        <button onclick="updatePost(${post.id})">Actualizar</button>
        </div>
        `;

        postList.appendChild(listItem); // Agregamos el LI al UL
    });   
}

function postData(){
    const postTitleInput = document.getElementById('postTitle');
    const postBodyInput = document.getElementById('postBody');
    const postTitle = postTitleInput.value;
    const postBody = postBodyInput.value;
    
    if(postTitle.trim() == '' || postBody.trim() == '' ){
        alert('Los campos son obligatorios')
    }

    fetch(urlBase, {
  method: 'POST',
  body: JSON.stringify({
    id: 1,
    title: postTitle,
    body: postBody,
    userId: 1,
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8',
  },
})

.then(res => res.json())
.then(data => {
    posts.unshift(data);
    renderPostList()
    postTitleInput = ''
    postBodyInput = ''
    
})
.catch(error => console.error('Error al querer crear posteo: ', error));
}

function editPost(id){
    const editForm = document.getElementById(`editForm-${id}`);
    editForm.style.display =
      editForm.style.display == 'none' ? 'block' : 'none';
}

function updatePost(id){
    const editTitle = document.getElementById(`editTitle-${id}`).value;
    const editBody = document.getElementById(`editBody-${id}`).value;

    fetch(`${urlBase}/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        id: id,
        title: editTitle,
        body: editBody,
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const index = posts.findIndex((post) => post.id === data.id);
        if (index != -1) {
          posts[index] = data;
        } else {
          alert("Hubo un error, no se pudo actualizar el post");
        }

        renderPostList();
      })
      .catch((error) => console.error('Error al querer crear posteo: ', error));
}

function deletePost(id){
    fetch(`${urlBase}/${id}`, {
  method: 'DELETE',
})
.then(res => {
    if(res.ok){
        posts = posts.filter(post => post.id != id)
        renderPostList();
    }else{
        alert('Hubo un error, no se pudo eliminar el post')
    }
})
.catch(error => console.error('Error al querer eliminar posteo: ', error));



}