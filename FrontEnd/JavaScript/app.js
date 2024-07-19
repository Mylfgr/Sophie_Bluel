// Récupération API Works

async function getWorks() {
    const url = "http://localhost:5678/api/works";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);

    for (let i = 0; i < json.length; i++) {
        setfigure(json[i]);
    }
    } catch (error) {
      console.error(error.message);
    }
}
getWorks();

function setfigure(data) {
const figure = document.createElement("figure");
figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
				<figcaption>${data.title}</figcaption>`;

document.querySelector(".gallery").append(figure);
}


async function getCategories() {
    const url = "http://localhost:5678/api/categories";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const json = await response.json();
      console.log(json);

    for (let i = 0; i < json.length; i++) {
        setFilters(json[i]);
    }
    } catch (error) {
      console.error(error.message);
    }
}
getCategories();

function setFilters(data) {
    const div = document.createElement("div");
    div.innerHTML = `${data.name}`;
    document.querySelector(".div-content").append(div);
    }