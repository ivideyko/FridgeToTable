$(document).ready(function(){
  // Edamam API
  var appId = "8666c2e4";
  var appKey = "5e7ed41f54702cd0b4a05804a1699162";

  var searchTerms = [];
  var searchString = "";


  //////////////////////////////////////////////////////////////////////////
  //  FUNCTIONS
  //////////////////////////////////////////////////////////////////////////

  function displayIngredients() {
    $("#ingredient-list").empty();
    for (var i = 0; i < searchTerms.length; i++) {
      var p = $("<p>").text(searchTerms[i]);
      var b = $("<button class='delete'>").text("x").attr("data-index", i);
      p.prepend(b);
      $("#ingredient-list").prepend(p);
    }
  }

  function findRecipes () {
    // Clear ajax "q" search string
    searchString = "";
    // Clear displayed recipes
    $("#recipe-list").empty();

    // Stop function if there are no search terms
    if (searchTerms.length <= 0) { return; }    

    // Build ajax "q" search string
    for (var i = 0; i < searchTerms.length; i++) {
      searchString += searchTerms[i] + "+"; //?
    }

    // Build ajax query
    var queryURL = "https://api.edamam.com/search?" +
          "q=" + searchString + 
          "&app_id=" + appId +
          "&app_key=" + appKey;

    // Call Edamam API
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      var results = response.hits;

      console.log(response);

      for (var j = 0; j < results.length; j++) {
        // if (results[j].smallImageUrls) {
        var recipeDiv = $("<div>");
        var recipeTitle = $("<div>");
        var recipeImage = $("<img>");
        var recipeIngredients = $("<div>");
        var recipeInstructions = $("<div>");

        var ul = $("<ul>");

        for (var i = 0; i < results[j].recipe.ingredientLines.length; i++) {
          // console.log(results[j].ingredients[i]);
          var li = $("<li>");
          li.attr("class", "recipe-ingredient");
          li.text(results[j].recipe.ingredientLines[i]);

            for (var k = 0; k < searchTerms.length; k++) {
              if (new RegExp(searchTerms[k]).test(results[j].recipe.ingredientLines[i])) {
                li.css("text-decoration-line", "line-through");
              }
            }

          ul.append(li);
          // }

          recipeIngredients.append(ul);

          recipeImage.attr("class", "recipe-image");
          recipeImage.attr("data-id", results[j].recipe.label);
          recipeImage.attr("src", results[j].recipe.image);

          recipeTitle.text(results[j].recipe.label);
          recipeTitle.attr("class", "recipe-title");
          recipeTitle.attr("data-id", results[j].id);

          // recipeInstructions.text(results[j].id);
          // recipeInstructions.attr("data-id", results[j].id);
          // recipeInstructions.text(getRecipe(results[j].recipe.label);

          recipeDiv.append(recipeTitle).append(recipeImage).append(recipeIngredients).append(recipeInstructions);
          
          $("#recipe-list").append(recipeDiv);
        }
      }
    });
  }

  // function getRecipe(recipe) {
  //   var recipeUrl = "";

  //   var queryURL = "https://api.yummly.com/v1/api/recipe/" + recipe + "?" +
  //         "_app_id=" + appId +
  //         "&_app_key=" + appKey;

  //   $.ajax({
  //     url: queryURL,
  //     method: "GET"
  //   }).then(function(recipeResponse) {
  //     recipeUrl = recipeResponse.source.sourceRecipeUrl;  
  //     console.log(recipeUrl);
  //     return (recipeUrl);
  //   });
  // }

  // $(document).on("click", "recipeImage recipeTitle", function(){
  //   // event.preventDefault();
  //   var currentRecipe = $(this).attr("data-id");
  //   searchTerms.splice(currentIndex, 1);
  //   displayIngredients();
  //   findRecipes();
  // });


  //////////////////////////////////////////////////////////////////////////
  //  EVENT HANDLERS
  //////////////////////////////////////////////////////////////////////////

  $(document).on("click", "button.delete", function(){
    var currentIndex = $(this).attr("data-index");
    searchTerms.splice(currentIndex, 1);
    displayIngredients();
    findRecipes();
  });

  $("#add-ingredient").on("click", function(){
    event.preventDefault();
    var ingredient = $("#input-ingredient").val().trim();
    if(ingredient){
      searchTerms.push(ingredient);
      $("#input-ingredient").val("");
      displayIngredients();
      findRecipes();
    }
  });
});