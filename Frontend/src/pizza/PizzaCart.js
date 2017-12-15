/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

var Storage = require('../LocalStorage');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#order_itself");

var total_sum = 0;
var orders_number = 0;


function updateTotalSum(){
    $("#total_sum").html(total_sum);
    Storage.set("total_sum",total_sum);
}

function updateOrderNumber(){
    $(".number_of_orders").html(orders_number);
    Storage.set("orders_number",orders_number);
}



function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок

    //Приклад реалізації, можна робити будь-яким іншим способом

    function samePizza(obj) {
        return obj.pizza.id === pizza.id && obj.size === size;
    }

    var same = Cart.filter(samePizza);
    if (same.length > 0) {
        same[0].quantity++;
    } else {



    Cart.push({
        pizza: pizza,
        size: size,
        quantity: 1
    });
        orders_number++;
        updateOrderNumber();
    }
    // Оновлюємо суму
    total_sum += pizza[size].price;
    updateTotalSum();
    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика
    Cart.splice(Cart.indexOf(cart_item), 1);

    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки
    //Тут можна наприклад, зчитати вміст корзини який збережено в Local Storage то показати його
    var saved_orders = Storage.get("cart");
    if (saved_orders) {
        Cart = saved_orders;
        total_sum = Storage.get("total_sum");
        updateTotalSum();
        orders_number = Storage.get("orders_number");
        updateOrderNumber();
    }
    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.html("");
    //Storage.write("cart",Cart);

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);

        var $node = $(html_code);

        $node.find(".plus").click(function(){
            //Збільшуємо кількість замовлених піц
            cart_item.quantity += 1;
            total_sum += cart_item.pizza[cart_item.size].price;
            //Оновлюємо відображення
            updateCart();
            updateTotalSum();
        });

        $node.find(".minus").click(function () {
            //Зменшуємо кількість замовлених піц
            if (cart_item.quantity == 1) {
                removeFromCart(cart_item);
                orders_number--;
                updateOrderNumber();
            }
            cart_item.quantity -= 1;
            total_sum -= cart_item.pizza[cart_item.size].price;
            //Оновлюємо відображення
            updateCart();
            updateTotalSum();
        });
        $node.find(".delete").click(function () {
            removeFromCart(cart_item);
            total_sum -= cart_item.pizza[cart_item.size].price * cart_item.quantity;
            orders_number--;
            updateOrderNumber();
            updateTotalSum();
            //Оновлюємо відображення
            updateCart();
            updateTotal();
        });

        $cart.append($node);
    }

    Cart.forEach(showOnePizzaInCart);
    Storage.set("cart",	Cart);
    if (Cart.length === 0){
        $("#orderButt").attr( "disabled", "disabled" );
    } else {
        $("#orderButt").removeAttr( "disabled" );
    }

}

$("#clear").click(function () {
    clear();
});

function clear(){
    Cart = [];
    updateCart();
    total_sum = 0;
    updateTotalSum();
    orders_number = 0;
    updateOrderNumber();
}


$("#orderButt").click(function () {
    if(Cart.length !== 0){
        location.href="/order.html";
    }
});

$("#editButt").click(function () {
    if(Cart.length !== 0){
        location.href="/";
    }
});


exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;
exports.getPizzaInCart = getPizzaInCart;
exports.clear = clear;