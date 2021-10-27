const appState = {
    current_quiz : "",
    current_view : "#intro_view",
    current_question : -1,
    current_model : {}    
}

document.addEventListener('DOMContentLoaded', () => {
    appState.current_view = "#intro_view"
    appState.current_model = {
        action : "start"
      }
    update_view(appState);

    document.querySelector("#page_container").onclick = (e) => {
        handle_button_click(e)
    }
});

function handle_button_click(e) {
    if (appState.current_view == "#intro_view") {
        if (e.target.dataset.action == "start") {
            appState.current_question = 0;
            // Connect to the right API depending on the quiz they selected

            // Access the api to get the right model
            appState.current_model = "";
            //appState.current_model = questions[appState.current_question];

            setQuestionView(appState);
            update_view(appState);
        }
    }
    if (appState.current_view = "#true_false_view") {

    }


}

// Sets the current_view of appState given the questionType of the current_model
function setQuestionView(appState) {
    if (appState.current_question == -2) {
        appState.current_view = "#end_view";
        return
    }

    if (appState.current_model.questionType == "true_false") {

    }
    else if (appState.current_model.questionType == "multiple_choice") {

    }
    else if (appState.current_model.questionType == "text_input") {

    }
}

// Displays the desired Handlebars template on-screen
function update_view(appState) {
    const html_element = render_widget(appState.current_model, appState.current_view)
    document.querySelector("#page_container").innerHTML = html_element;
}


// Returns the populated handlebar template given the desired model and view
const render_widget = (model,view) => {
    template_source = document.querySelector(view).innerHTML
    var template = Handlebars.compile(template_source);
    var html_widget_element = template({...model,...appState})
    return html_widget_element;
}

