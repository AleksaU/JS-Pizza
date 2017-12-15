

var Cart = require("./pizza/PizzaCart");

function initialize(data, signature) {
    LiqPayCheckout.init({
        data: data,
        signature: signature,
        embedTo: "#liqpay",
        mode: "popup"
    }).on("liqpay.callback", function(data){
        console.log(data.status);
        if(data.result == "success")
            Cart.clear();
        console.log(data);
    }).on("liqpay.ready", function(data){ // ready
        console.log(data);
    }).on("liqpay.close", function(data){
        console.log(data);
        location.href="/";
    });
}

exports.initialize = initialize;