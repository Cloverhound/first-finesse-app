
function openURL(){
    let jQueryStyle = window.location.search
    let urlParams = new URLSearchParams(jQueryStyle)
    let mySingleUrl = urlParams.get('url')
    window.open(mySingleUrl, '_blank')
}