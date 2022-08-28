export function getHighestId(): number{
    let id = 0; 
    Object.keys(localStorage).forEach(item => id = id < parseInt(item) ? parseInt(item) : id);
    return id;
}
