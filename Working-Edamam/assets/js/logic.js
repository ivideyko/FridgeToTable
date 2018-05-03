$(document).ready(function(){
  var appId = "a14e56b9";
  var appKey = "f8fa949610a90e86f7508bbf80978218";
  var chopKey = "616a792487dea73d933609aaa6e40ea0";

  var searchTerms = [];
  var searchString = "";

  function displaySearchedIngredients() {
    $("#ingredient-list").empty();
    for (var i = 0; i < searchTerms.length; i++) {
      var p = $("<p>").text(searchTerms[i]);
      var b = $("<button class='delete'>").text("x").attr("data-index", i);
      p.prepend(b);
      $("#ingredient-list").prepend(p);
    }
  }

  function searchIngredients () {
    searchString = "";
    $("#recipe-list").empty();

    if (searchTerms.length === 0) {
      return false;
    }

    for (var i = 0; i < searchTerms.length; i++) {
      searchString = searchString + searchTerms[i] + "+";
    }

    var queryURL = "https://api.yummly.com/v1/api/recipes?" +
        "_app_id=" + appId +
        "&_app_key=" + appKey + 
        "&q=" + searchString + 
        "&requirePictures=true";

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      
      console.log(response);

      $("#recipe-list").empty();

      for (var j = 0; j < response.matches.length; j++) {
        if (response.matches[j].smallImageUrls) {
          var recipeDiv = $("<div>");
          var recipeTitle = $("<div>");
          var recipeImage = $("<img>");
          var recipeIngredients = $("<div>");
          var recipeInstructions = $("<div>");

          var ul = $("<ul>");

          for (var i = 0; i < response.matches[j].ingredients.length; i++) {
            // console.log(response.matches[j].ingredients[i]);
            var li = $("<li>");
            li.attr("class", "recipe-ingredient");
            li.text(response.matches[j].ingredients[i]);

            for (var k = 0; k < searchTerms.length; k++) {
              if (new RegExp(searchTerms[k]).test(response.matches[j].ingredients[i])) {
                li.css("text-decoration-line", "line-through");
                // alert(searchTerms[k]);
              }
            }
            ul.append(li);
          }

          recipeIngredients.append(ul);

          recipeImage.attr("class", "recipeImage");
          recipeImage.attr("data-id", response.matches[j].id);
          recipeImage.attr("src", response.matches[j].smallImageUrls[0]);

          recipeTitle.text(response.matches[j].recipeName);
          recipeTitle.attr("class", "recipeTitle");
          recipeTitle.attr("data-id", response.matches[j].id);

          // recipeInstructions.text(response.matches[j].id);
          // recipeInstructions.attr("data-id", response.matches[j].id);
          recipeInstructions.text(getRecipe(response.matches[j].id));

          recipeDiv.append(recipeTitle).append(recipeImage).append(recipeIngredients).append(recipeInstructions);
          
          $("#recipe-list").append(recipeDiv);
        }
      }
    });
  }

  function getRecipe(recipe) {
    var recipeUrl = "";

    var queryURL = "https://api.yummly.com/v1/api/recipe/" + recipe + "?" +
          "_app_id=" + appId +
          "&_app_key=" + appKey;

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(recipeResponse) {
      recipeUrl = recipeResponse.source.sourceRecipeUrl;  
      console.log(recipeUrl);
      return (recipeUrl);
    });
  }

  $(document).on("click", "recipeImage recipeTitle", function(){
    // event.preventDefault();
    var currentRecipe = $(this).attr("data-id");
    searchTerms.splice(currentIndex, 1);
    displaySearchedIngredients();
    searchIngredients();
  });

  $(document).on("click", "button.delete", function(){
    event.preventDefault();
    var currentIndex = $(this).attr("data-index");
    searchTerms.splice(currentIndex, 1);
    displaySearchedIngredients();
    searchIngredients();
  });

  
  $("#add-ingredient").on("click", function(){
    event.preventDefault();
    var ingredient = $("#input-ingredient").val().trim()
    if(ingredient){
      searchTerms.push(ingredient);
      $("#input-ingredient").val("");
      displaySearchedIngredients();
      searchIngredients();
    }
  });
});