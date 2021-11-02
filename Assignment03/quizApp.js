const appState = {
    current_quiz : "",
    current_view : "#intro_view",
    current_question : -1,
    current_model : {}    
}

let user_fname = "";
let user_lname = "";
var user_response = "";

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

async function handle_button_click(e) { // ERROR: it seems that this function is only working once
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
            if (document.querySelector("#python").checked == "true") {
                extension = "PythonQuizQuestions/questions";
            }
            else {
                extension = "SQLQuizQuestions/questions";
            }
            let final_url = base_url+extension;
            appState.current_quiz = final_url;
            
            // Access the api to get the right model
            appState.current_model = await getModel(final_url,appState);
            setQuestionView(appState);
            update_view(appState);
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
            if (check_user_response(user_response,appState.current_model)) {
                console.log("Answer was correct");
            }
            else {
                console.log("Answer was incorrect");
            }

            // Move on to the next question
            await updateQuestion(appState);
            setQuestionView(appState);
            update_view(appState);
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
            if (check_user_response(user_response,appState.current_model)) {
                console.log("Answer was correct");
            }
            else {
                console.log("Answer was incorrect");
            }
            console.log(`Stored user response is ${user_response}`)
            
            await updateQuestion(appState);
            /* setQuestionView(appState);
            update_view(appState); */
        }
    }

    if (appState.current_view == "#text_input_view") {
        /* console.log("text input interaction registered")
        // Keep the submit button disabled until the user types something
        if (e.target.type == "text") {
            submit_button = document.querySelector('button[data-action="submit"]');
            if (submit_button.disabled == true) {
                submit_button.disabled = false;
            }
        }
        if (e.target.dataset.action == "submit") {
            // Temporary code for now
            if (check_user_response(user_response,appState.current_model)) {
                console.log("Answer was correct");
            }
            else {
                console.log("Answer was incorrect");
            }
            await updateQuestion(appState);
            setQuestionView(appState);
            update_view(appState);
        } */
    }

    if (appState.current_view == "#fill_blank_view") {

    }

    if (appState.current_view == "#fix_error_view") {

    }

    if (appState.current_view == "#feedback_view") {

    }

    if (appState.current_view == "#end_view") {

    }


}

// Returns the desired model given the API url (that contains a json) and appState
async function getModel(url,appState) {
    const response = await fetch(url);
    const result = await response.json();
    let model = result[appState.current_question];
    return model;
}


function check_user_response(user_answer, model) {
    if (user_answer == model.correctAnswer) {
        /*
        Increment correct answer counter
        Cue the "Great job!" popup
        */
        return true;
    }
    else {
        /*
        Cue the Feedback view
        */
        return false;
    }
}

// Increments the current_question and current_model
async function updateQuestion(appState) {
    console.log(`URL being accessed: ${appState.current_quiz}`)
    const response = await fetch(appState.current_quiz);
    const result = await response.json();
    console.log("Current Question Index: "+appState.current_question);
    console.log("Last Question Index: "+result.length-1);
    if (appState.current_question < result.length-1) {
        appState.current_question = appState.current_question + 1;
        appState.current_model = await getModel(appState.current_quiz,appState);
    }
    else {
        appState.current_question = -2;
        appState.current_model = {};
    }
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
}


// Returns the populated handlebar template given the desired model and view
const render_widget = (model,view) => {
    template_source = document.querySelector(view).innerHTML;
    var template = Handlebars.compile(template_source);
    var html_widget_element = template(model);
    return html_widget_element;
}
