let python_url =  "http://ec2-52-200-53-62.compute-1.amazonaws.com:5000/";
let java_url =    "http://ec2-52-200-53-62.compute-1.amazonaws.com:8080/";

async function getUserInGroups() {
    groupId = localStorage.getItem("groupId")
    url = python_url + `GroupJunction/UserList/${groupId}`

    let response = await fetch(url);

    if(response.status === 200){
        let body = await response.json()
         //console.log(body)
         createList(body)
         buttonCheck(body)

    }

}

function createList(response) {
        let groupSectionDiv = document.getElementById("member-3")
        //console.log(response)
        for (let group of response){
            let groupsDiv = document.createElement("div");
            groupsDiv.setAttribute("class", "group-in-list");

            let groupImage = document.createElement("img");
            groupImage.setAttribute("class", "friend");

            let groupNameDiv = document.createElement("div");
            groupNameDiv.setAttribute("class", "name valign-text-middle poppins-bold-astronaut-22px");
            groupNameDiv.textContent = group.first_name;
            console.log(group)
            groupNameDiv.innerHTML = `<a onclick="goToProfilePage(${group.user_id})" id="profileLink-${group.user_id}"`+
                ` class="name valign-text-middle poppins-bold-astronaut-22px"`+
                ` href="../../visitprofilepage/visit-profile-page.html">${group.first_name}</a>`;

            groupSectionDiv.appendChild(groupsDiv);
            groupsDiv.appendChild(groupImage);
            groupsDiv.appendChild(groupNameDiv);

        }
    }

function goToProfilePage(user_id){
    localStorage.setItem("targetId", user_id);
}

async function deleteRequest() {
    userId = localStorage.getItem("userId")
    groupId = localStorage.getItem("groupId")
    url = python_url + `group/leave/${userId}/${groupId}`
    let response = await fetch(url, { method: "DELETE", headers: { "Content-Type": "application/json" }});
    if(response.status === 200){
        location.replace("../group-page.html");

    }if(response.status === 400){
        let message = document.getElementById("message");
        message.textContent = response.statusText;
    }

}

async function creatorOf() {
    groupId = localStorage.getItem("groupId")
    url = python_url + `creator/${groupId}`
    let response = await fetch(url)
    if(response.status === 200){
        let body = await response.json();
        console.log(body);
        let newSect = document.getElementById("groupCreator");
        newSect.innerHTML = ` <div id="groupCreator" class="creator valign-text-middle">${body[0][0]},${body[0][1]}</div>`;
        let username = document.getElementById("creatorUserName");
        username.innerHTML = `<div id="creatorUserName"
        class="creator-username valign-text-middle poppins-medium-dove-gray-18px">
        @${body[0][2]}
        </div>`
    }


}

async function getGroup() {
    groupId = localStorage.getItem("groupId")

    let url =  python_url + `group/${groupId}`

    let response = await fetch(url);

    if(response.status === 200){
        let body = await response.json();
        console.log(body);
        groupdef = document.getElementById("groupName");
        groupdef.innerHTML = body.groupName;

    }

}

function buttonCheck(response) {
    userId = localStorage.getItem('userId');
    groupId = localStorage.getItem('groupId');
    if (response == undefined ) {
        let button = document.getElementById('tbd');
        button.style.display = "none";
    }else{
        for (const users of response) {
            //console.log(response)
            if (userId == users.user_id) {
                let button = document.getElementById("tbd");
                button.style.display = "block";
            } else {
                let button = document.getElementById('tbd');
                button.style.display = "none";
            }

        }
    }
}
getUserInGroups()
creatorOf()
getGroup();
//buttonCheck(); This is run in getUserInGroups