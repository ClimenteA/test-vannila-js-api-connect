// Test JavaScript standard

// Folosind API-urile puse la dispoziție de https://jsonplaceholder.typicode.com/ 
// Dezvoltați o pagină care să afișeze 
// - lista de utilizatori și detaliile acestora. 
// Pentru fiecare utilizator va exista 
// - un buton sau un link care va afișa albumele foto ale acestuia. 
// Coperta albumului va fi thumb-ul primei poze din album.

// Se va folosi doar cod JavaScript și CSS standard, fără librării externe sau framework-uri. 
// Este suficient să funcționeze doar pe browsere moderne. 
// Afișarea listei de utilizatori și de albume trebuie să fie tip grilă și responsive, în rest design-ul este la alegere.

// Aplicațiile pot fi predate sub forma unei arhive, cu link către un repository git sau pot fi puse online.

// https://jsonplaceholder.typicode.com/guide.html


(async function main() {

    try {

        default_store()
        // Get and append users to body
        let users = await get_users()
        let users_to_append = user_component_list(users)
        mount_users(users_to_append)

        add_listeners_to_user_btn()

    } catch (error) {
        document.body.innerHTML = `
        <h1>Something went terribly wrong..</h1>
        <p style="color:red;">${error}</p>
        `
    }

})()


var store

function default_store() {
    store = {
        users: undefined,
        albums: undefined,
        current_user_id: undefined,
        see_albums_btn_clicked: false,
    }
}


async function get_users() {

    let url = "https://jsonplaceholder.typicode.com/users"
    let response = await fetch(url)
    let users_obj = await response.json()
    store.users = users_obj
    // console.log("get_users:" users_obj)
    return users_obj
} 


function user_component_list(users){

    // console.log("Component inputs:", users)

    let user_components = []

    users.forEach(user => {
        
        let user_container = document.createElement("div")
        user_container.setAttribute("class", "user")
        
        // console.log("UserID", user.id,  user)

        user_container.innerHTML = `
            <div class="about">
                <h2 title="${user.username}">${user.name}</h2>
                <a title="Go to company website" href="${user.website}" target="_blank">${user.company.name}</a>
            </div>

            <div class="contact">
                <span>${user.phone}</span>
                <span>${user.email}</span>
            </div>

            <button id="${user.id}">See albums</button>
        `
        user_components.push(user_container)
    })

    // console.log(user_components)

    return user_components

}


function mount_users(users_to_append) {
    // console.log(users_to_append)
    users_to_append.forEach(user_container => {
        // console.log(user_container)
        document.body.appendChild(user_container)
    })
}


function add_listeners_to_user_btn() {
    
    let users =  document.getElementsByClassName("user")

    Array.from(users).forEach(user_el => {
        // console.log(user_el)
        let btn = user_el.getElementsByTagName("button")[0]
        // console.log(btn)
        btn.onclick = async event => {
            event.target.disabled = true
            let userID = event.target.getAttribute("id")
            
            // console.log("See albums for user_id: ", userID)
            
            let albums = await get_albums(userID)
            let photos = get_photos_from_album(albums)

            // TODO
            
            console.log("user, albums, photos", userID, albums)
            console.log(photos)

            store.current_user_id = userID
            store.see_albums_btn_clicked = true
             
        }
    })
    
    // console.log(users)
}


// Albums for user_id 1
// https://jsonplaceholder.typicode.com/users/1/albums

// Photos for album_id 1
// https://jsonplaceholder.typicode.com/albums/1/photos


async function get_albums(user_id) {

    let url = `https://jsonplaceholder.typicode.com/users/${user_id}/albums`
    let response = await fetch(url)
    let albums_obj = await response.json()
    store.albums = albums_obj

    // console.log(`Albums for userid ${user_id}`, albums_obj)

    return albums_obj
} 


function get_photos_from_album(albums_obj) {

    let photos = []

    albums_obj.forEach(async album => {
        // console.log(album)

        let url = `https://jsonplaceholder.typicode.com/albums/${album.id}/photos`
        let response = await fetch(url)
        let photos_obj = await response.json()

        photos.push(photos_obj)

        store.photos = photos

        // console.log(`Photos for ${album.id}`, photos_obj)
    })

    return photos
} 







