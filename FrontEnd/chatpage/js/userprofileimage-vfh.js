
// let userId = 9000;

async function getUserImage(){
  let url = "http://ec2-52-200-53-62.compute-1.amazonaws.com:5000/user/image/" + loggedInUserId;
  console.log(url);
  let response = await fetch(url);
  console.log(response);

  if(response.status === 200){

      let image_text = await response.text();
      // const image_Element = document.createElement('img');
      // image_Element.src = image_text;
      // document.getElementById("userImage").appendChild(image_Element);
      let image_Element = document.getElementById("userImageFile");
      if(!image_text.includes("data:image")){
        image_text= "data:image/PNG;base64,"+image_text;
      }
      image_Element.src = image_text;
      
  }
}
getUserImage()

async function createUserWithImage() {
    let file    = document.getElementById('userImageFileInput').files[0];
    let reader  = new FileReader();
    let base64gif;
  
    reader.addEventListener("load", async function () {
      base64gif = reader.result;
      console.log(base64gif.slice(11, 14));


      if (base64gif.length < 1_000_000 && base64gif.startsWith("data:image/")){
        // let userText = document.getElementById("userText");
        // let userJson = JSON.stringify({"user_id":userId, "user_text": userText.value, "image_format": "true"});
        // let url = "http://127.0.0.1:5000/post"
        
        //ADJUSTING
        // console.log(theUser["user_id"]);
        let response = await fetch(
            //"http://127.0.0.1:5000/user/image/" + theUser["user_id"], 
            "http://ec2-52-200-53-62.compute-1.amazonaws.com:5000/user/image/" + loggedInUserId, { 
              method: "POST",
              headers: {"Content-Type": "application/json"},
              body: String(base64gif)
          });
          let imageText = await response.text();
          let image_Element = document.getElementById("userImageFile");
          image_Element.src = imageText;
      
      }
      else{
        alert("File Error")
      }
    }, false);
  
    if (file) {
      reader.readAsDataURL(file);
    }else{ 
      createUser()
    }
  }



