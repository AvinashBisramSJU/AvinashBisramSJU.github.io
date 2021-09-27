document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#form').onsubmit = function() {
        alert(document.querySelector('#message').value);
    }
    document.querySelector('#abutton').onclick = function() {
        let message = document.querySelector('#message').value
        alert('${message} :)' )
    }
})