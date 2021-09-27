document.addEventListener('DOMContentLoaded', function() {
    document.querySelector("button").onclick = inc;    
    }
)

let counter = 0
function inc() {
    counter = counter + 1;
    document.querySelector('#score').innerHTML = 'Score: ${counter}';

    if (counter >= 10) {
        counter = 0
        document.querySelector('#score').innerHTML = "You Win!"
    }
}