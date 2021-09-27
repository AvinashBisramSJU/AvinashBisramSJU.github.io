document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#red').onclick = function() {
        document.querySelector('#style_me').style.color = 'red';
    }

    document.querySelector('#green').onclick = function() {
        document.querySelector('#style_me').style.color = 'green';
    }

    document.querySelector('#blue').onclick = function() {
        document.querySelector('#style_me').style.color = 'blue';
    }

    document.querySelector('#left').onclick = function() {
        document.querySelector('#style_me').style.cssFloat = 'left';
    }
    
    document.querySelector('#right').onclick = function() {
        document.querySelector('#style_me').style.cssFloat = 'right';
    }

})