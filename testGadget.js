
function openURL(){
    let url = window.location.href
    let cleanURL = url.split('url=')[1];
    window.open(cleanURL, '_blank')
}