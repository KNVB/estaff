import Roster from "../classes/Roster.js";

let roster=new Roster();
console.log(JSON.stringify(await roster.getRoster(2024,9)));