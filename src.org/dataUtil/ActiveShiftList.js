import FetchAPI from "../util/FetchAPI";
export default async function ActiveShiftList(){
    let fetchAPI=new FetchAPI();
    return await fetchAPI.getActiveShiftList(); 
}