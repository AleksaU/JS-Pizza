var API_URL = "http://localhost:5050";

function backendGet(url, callback) { // отримуємо запити з серверу
    $.ajax({
        url: API_URL + url,
        type: 'GET',
        success: function(data){
            callback(null, data);
        },
        error: function() {
            callback(new Error("Error"));
        }
    });
}

function backendPost(url, data, callback) {   // відправляємо запити на сервер
    $.ajax({
        url: API_URL + url,
        type: 'POST',
        contentType : 'application/json',
        data: JSON.stringify(data),
        success: function(data){
            callback(null, data);
        },
        error: function() {
            callback(new Error("Error"));
        }
    })
}

exports.getPizzaList = function(callback) {
    backendGet("/api/get-pizza-list/", callback);
};

exports.createOrder = function(order_info, callback) {
    backendPost("/api/create-order/", order_info, callback);
};