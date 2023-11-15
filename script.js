const blogArea = document.querySelector('.blog-area');
const form = document.querySelector('form');
const inputs = document.querySelectorAll('[data-type]');
const loading = document.querySelector('[data-loading]');

let pagination = 1;

let loadingObserver = new IntersectionObserver((entrie) => {
    if (entrie[0].isIntersecting) {
        pagination++;
        getBlogPosts();
    }
});

async function getBlogPosts() {
    try {
        let response = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=10&_page=${pagination}`);
        let json = await response.json();

        if (blogArea.querySelector('h2')) {
            blogArea.querySelector('h2').remove();
        }

        for (post of json) {
            console.log('entrou')
            const articlePost = document.createElement('article');
            const articleImg = document.createElement('img');
            const blogPostArea = document.createElement('div');
            const blogTitle = document.createElement('h1');
            const blogDescription = document.createElement('p');

            articlePost.classList.add('blog-post');
            articlePost.classList.add('blog-info-area');
            articleImg.setAttribute('src', post.url);
            blogTitle.textContent = post.title;
            blogDescription.textContent = post.title;
            blogPostArea.append(blogTitle, blogDescription);
            articlePost.append(articleImg, blogPostArea);
            blogArea.appendChild(articlePost);
        }
        if (json.length > 0) {
            loading.style.display = 'block';
        } else {
            loading.style.display = 'none';
        }
    } catch(error) {
        console.log(error);
    }
}

async function handleSubmit(event) {
    event.preventDefault();
    try {
        let body = {
            userId: 2,
        };
        for (let input of inputs) {
            body = {
                ...body,
                [input.attributes['data-type'].value]: input.value,
            }
        }
        if (body.title && body.body) {
            let response = await fetch('https://jsonplaceholder.typicode.com/photos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            if (response.status === 200 || response.status === 201) {
                alert('Post criado com sucesso!');
                getBlogPosts();
            }
            let json = await response.json();
        } else {
            alert('Insira todos os dados!');
        }
    } catch(error) {
        console.log(error);
    }
}


form.addEventListener('submit', handleSubmit);
loadingObserver.observe(loading);
getBlogPosts();
