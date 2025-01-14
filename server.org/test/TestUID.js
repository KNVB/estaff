let characters="abcdefghijklmnopqrstuvwxyz0123456789";
let uid="";
for (let i=0;i<10;i++){
    let index=Math.floor(Math.random() * (characters.length-1));
    uid+=characters[index];
}
console.log(uid);