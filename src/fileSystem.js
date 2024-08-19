const fileSystem = { 
    read:function(url){
        let http = new XMLHttpRequest();
        http.open('GET', url, false);
        http.send();
        return http.response
    },

    exists:function(url){
        let http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status!=404;
    }
}

export default fileSystem;