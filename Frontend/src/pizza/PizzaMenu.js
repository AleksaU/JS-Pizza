/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = require('../Pizza_List');
var API = require('../API');

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list");

function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онoвлення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({pizza: pizza});

        var $node = $(html_code);

        $node.find(".buy-big").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy-small").click(function(){
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    list.forEach(showOnePizza);
}

function isMeat(obj) {
    if (obj.content.meat)
        return true;
    else return false;
}
function isVega(obj) {
    if (!obj.content.meat && !obj.content.ocean)
        return true;
    else return false;
}

function isOcean(obj) {
    if (obj.content.ocean)
        return true;
    else return false;
}
function isPineapple(obj) {
    if (obj.content.pineapple)
        return true;
    else return false;
}
function isMushroom(obj) {
    if (obj.content.mushroom)
        return true;
    else return false;
}


$(".pizza-type").click(function () {
    $(".nav-pizza").find(".active").removeClass("active");
    $(this).addClass("active");

    var type = $(this).find("a").html();
    switch (type) {
        case "Мясні":
            filterPizza(isMeat);
            break;
        case "З ананасами":
            filterPizza(isPineapple);
            break;
        case "З морепродуктами":
            filterPizza(isOcean);
            break;
        case "З грибами":
            filterPizza(isMushroom);
            break;
        case "Вега":
            filterPizza(isVega);
            break;
        case "Усі":
            filterPizza();
            break;
    }

});




function filterPizza(filter) {
    //Масив куди потраплять піци які треба показати
    if (filter) {
        var pizza_shown = Pizza_List.filter(filter);

        //Показати відфільтровані піци
        showPizzaList(pizza_shown);
    }else {showPizzaList(Pizza_List);}
}

function initialiseMenu() {
    //Показуємо усі піци

   API.getPizzaList(function(err, list) {
        if(err) {
            alert("Error arised ");
        } else {
            Pizza_List = list;
            showPizzaList(Pizza_List);
            $(".number").html(Pizza_List.length);
        }
    });


}


exports.filterPizza = filterPizza;
exports.initialiseMenu = initialiseMenu;