const appState = {
    current_quiz : "",
    current_view : "#intro_view",
    current_question : -1,
    current_model : {},
    correctAnswers : 0,
    totalAnswers : 0    
}

let user_fname = "";
let user_lname = "";
var user_response = "";
var elapsed_time = 0;
var timerInterval;

document.addEventListener('DOMContentLoaded', () => {
    appState.current_view = "#intro_view"
    appState.current_model = {
        action : "start"
    }
    update_view(appState);

    document.querySelector("#page_container").onclick = (e) => {
        handle_button_click(e);
    }
});

// Event Delegation Handler for any button press within the main quiz screen
async function handle_button_click(e) {
    console.clear();
    console.log("Widget interaction registered in");
    console.log(e.target);
    if (appState.current_view == "#intro_view") {
        if (e.target.dataset.action == "start") {
            // Set current question to 0
            appState.current_question = 0;

            // Store the user's first and last name
            user_fname = document.querySelector("#fname").value;
            user_lname = document.querySelector("#lname").value;

            // Connect to the right API depending on the quiz they selected
            let base_url = "https://my-json-server.typicode.com/AvinashBisramSJU/"
            let extension = ""
            if (document.querySelector("#python").checked == true) {
                extension = "PythonQuizQuestions/questions";
            }
            else {
                extension = "SQLQuizQuestions/questions";
            }
            let final_url = base_url+extension;
            appState.current_quiz = final_url;
            
            // Access the api to get the right model
            appState.current_model = await getModel(final_url,appState);
            console.log(appState);
            setQuestionView(appState);
            update_view(appState);

            // change page container size to reveal scoreboard
            showScoreBoard();
            timerInterval = setInterval(async()=>{
                elapsed_time++;
                document.querySelector("#elapsed_time_display").querySelector("span").innerHTML = `${elapsed_time}`;  
            },1000);
            update_counters(appState);
        }
    }

    if (appState.current_view == "#true_false_view") {
        if (e.target.dataset.action == "answer") {
            // Store their answer
            user_response = e.target.dataset.answer;
            console.log("Selected answer: "+user_response);

            // Enable the submit button
            submit_button = document.querySelector('button[data-action="submit"]');
            if (submit_button.disabled == true) {
                submit_button.disabled = false;
            }
        }
        if (e.target.dataset.action == "submit") {
            
            // Temporary code for now
            check_user_response(user_response,appState.current_model)
        }
    }

    if (appState.current_view == "#multiple_choice_view") {
        console.clear();
        console.log("multiple choice interaction registered");
        console.log("The interaction target was");
        console.log(e.target);
        if (e.target.type == "radio") {
            user_response = e.target.value;

            submit_button = document.querySelector('button[data-action="submit"]');
            if (submit_button.disabled == true) {
                submit_button.disabled = false;
            }
        }
        if (e.target.dataset.action == "submit") {
            // Temporary code for now
            check_user_response(user_response,appState.current_model)
        }
    }

    if (appState.current_view == "#text_input_view") {
        console.log("text input interaction registered")
        // Keep the submit button disabled until the user types something
        if (e.target.type == "text") {
            submit_button = document.querySelector('button[data-action="submit"]');
            if (submit_button.disabled == true) {
                submit_button.disabled = false;
            }
        }
        if (e.target.dataset.action == "submit") {

            user_response = document.querySelector('input[name="answer"]').value;

            // Temporary code for now
            check_user_response(user_response,appState.current_model)
        }
    }

    if (appState.current_view == "#fill_blank_view") {
        console.log("fill blank interaction registered");
        if (e.target.type == "text") {
            submit_button = document.querySelector('button[data-action="submit"]');
            if (submit_button.disabled == true) {
                submit_button.disabled = false;
            }
        }
        if (e.target.dataset.action == "submit") {
            
            user_response = document.querySelector('input[type="text"]').value;

            // Temporary code for now
            check_user_response(user_response,appState.current_model)
        }
    }

    if (appState.current_view == "#fix_error_view") {
        console.log("fix error interaction registered");
        if (e.target.type == "text") {
            submit_button = document.querySelector('button[data-action="submit"]');
            if (submit_button.disabled == true) {
                submit_button.disabled = false;
            }
        }
        if (e.target.dataset.action == "submit") {

            user_response = document.querySelector('input[type="text"]').value;

            // Temporary code for now
            check_user_response(user_response,appState.current_model)
        }
    }

    if (appState.current_view == "#feedback_view") {
        console.log("feedback interaction registered");
        if (e.target.dataset.action == "gotIt") {
            updateQuestion(appState);
        }

    }

    if (appState.current_view == "#end_view") {
        console.log("end view interaction registered");
        console.log(`Stored name: ${user_fname} ${user_lname}`);
        console.log(`Correct Answers: ${appState.correctAnswers}/${appState.totalAnswers}`);
        if (e.target.dataset.action == "retake") {
            /*
            Set current_question to 0 and update_view
            Reset the counts for total questions answered and correct answers given
            */
            appState.current_question = 0;
            appState.correctAnswers = 0;
            appState.totalAnswers = 0;
            appState.current_model = await getModel(appState.current_quiz,appState);
            setQuestionView(appState);
            update_view(appState);
            update_counters();
        }
        if (e.target.dataset.action == "return") {
            window.location.reload();
        }
    }

}

// Returns the desired model given the API url (that contains a json) and appState
async function getModel(url,appState) {
    const response = await fetch(url);
    const result = await response.json();
    let model = result[appState.current_question];
    return model;
}


// Checks if user_response is correct and displays appropriate feedback screen.
function check_user_response(user_answer, model) {
    console.log(`Checking response...\nAnswer given: ${user_response}\nCorrect Answer: ${appState.current_model.correctAnswer}`);
    
    if (user_answer == model.correctAnswer) {
        console.log("You answered correct!")
        /* alert("Correct!"); */
        appState.correctAnswers++;
        document.querySelector("#page_container").innerHTML = `<h1 style="color:green">Correct!<h1>`;
        setTimeout(()=> {
            updateQuestion(appState);
        }, 500);
    }
    else {
        console.log(`You answered incorrectly.\nExplanation: ${appState.current_model.explanation}`);
        appState.current_view = "#feedback_view";
        update_view(appState);
    }
    appState.totalAnswers++;
    update_counters(appState);
}

// Increments the current_question and current_model
async function updateQuestion(appState) {
    console.log(`URL being accessed: ${appState.current_quiz}`)
    const response = await fetch(appState.current_quiz);
    const result = await response.json();
    console.log("Current Question Index: "+appState.current_question);
    console.log("Last Question Index: "+(result.length-1));
    if (appState.current_question < (result.length-1)) {
        appState.current_question = appState.current_question + 1;
        appState.current_model = await getModel(appState.current_quiz,appState);
    }
    else {
        appState.current_question = -2;
        appState.current_model = {};
        clearInterval(timerInterval);
    }
    setQuestionView(appState);
    update_view(appState);
}

// Sets the current_view of appState given the questionType of the current_model
function setQuestionView(appState) {
    if (appState.current_question == -2) {
        appState.current_view = "#end_view";
        return
    }
    if (appState.current_model.questionType == "true_false") {
        appState.current_view = "#true_false_view";
    }
    else if (appState.current_model.questionType == "multiple_choice") {
        appState.current_view = "#multiple_choice_view";
    }
    else if (appState.current_model.questionType == "text_input") {
        appState.current_view = "#text_input_view";
    }
    else if (appState.current_model.questionType == "fill_blank") {
        appState.current_view = "#fill_blank_view";
    }
    else if (appState.current_model.questionType == "fix_error") {
        appState.current_view = "#fix_error_view";
    }
}

// Displays the desired Handlebars template on-screen
function update_view(appState) {
    const html_element = render_widget(appState.current_model, appState.current_view)
    document.querySelector("#page_container").innerHTML = html_element;

    if (appState.current_view == "#end_view") {
        var correctPercent = appState.correctAnswers / appState.totalAnswers;
        correctPercent = Math.floor(correctPercent*100);
        if (correctPercent > 80) {
            document.querySelector("#completion_text").innerHTML = `Congratulations ${user_fname} ${user_lname}!\nYou passed the quiz with a score of ${correctPercent}%!`
        }
        else {
            document.querySelector("#completion_text").innerHTML = `Sorry ${user_fname} ${user_lname}, you did not pass.\nYour final score was a ${correctPercent}%`
        }
    }
}

// Returns the populated handlebar template given the desired model and view
const render_widget = (model,view) => {
    template_source = document.querySelector(view).innerHTML;
    var template = Handlebars.compile(template_source);
    var html_widget_element = template(model);
    return html_widget_element;
}


// Updates the display for correct and total answer displays
function update_counters(appState) {
    document.querySelector("#questions_answered_display").querySelector("span").innerHTML = `Questions Answered:<br>${appState.totalAnswers}`;
    var correctPercent = appState.correctAnswers / appState.totalAnswers;
        correctPercent = Math.floor(correctPercent*100);
    document.querySelector("#current_score_display").querySelector("span").innerHTML = `Current Score:<br>${correctPercent}%`;
}

// Reveals and formats the scoreboard upon starting a quiz
function showScoreBoard() {
    // Change the size of page container
    document.querySelector("#page_container").classList = "col-sm-9";

    // Change the borders of the different containers
    document.querySelector("#questions_answered_display").style.borderWidth  = "1px";
    document.querySelector("#current_score_display").style.borderWidth  = "1px";
    document.querySelector("#elapsed_time_display").style.borderWidth  = "1px";

    // Start the time elapsed timer
    document.querySelector("#elapsed_time_display").querySelector("p").innerHTML = "Elapsed Time:";
}