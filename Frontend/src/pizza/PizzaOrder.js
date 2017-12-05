var api = require('../API');
var Storage = require('../LocalStorage');
var MAP = require('../Maps');
var Cart = require('./PizzaCart');
var LiqPay = require("../liqpay");

/* Name validation */
var nameInput = $("#inputName");
var nameLabel = $(".label-name");
var nameHint = $(".nameHint");
function checkName() {
    //$("#inputName").val()
    if (nameInput.val()) {
        nameLabel.addClass("valid");
        nameLabel.removeClass("invalid");
        nameInput.addClass("valid");
        nameInput.removeClass("invalid");
        nameHint.addClass("none");
        return true;
    } else {
        nameLabel.removeClass("valid");
        nameLabel.addClass("invalid");
        nameInput.addClass("invalid");
        nameInput.removeClass("valid");
        nameHint.removeClass("none");
        return false;
    }
}

/* Phone validation */
var phoneREGEX = /(\+38)?0\d{9}/;
var phoneInput = $("#inputPhone");
var phoneLabel = $(".label-phone");
var phoneHint = $(".phoneHint");
function checkPhone() {
    /*alert("check!");*/
    if (phoneInput.val().match(phoneREGEX)) {
        phoneLabel.addClass("valid");
        phoneLabel.removeClass("invalid");
        phoneInput.addClass("valid");
        phoneInput.removeClass("invalid");
        phoneHint.addClass("none");
        return true;
    } else {
        phoneLabel.removeClass("valid");
        phoneLabel.addClass("invalid");
        phoneInput.addClass("invalid");
        phoneInput.removeClass("valid");
        phoneHint.removeClass("none");
        return false;
    }
}

/* Adress validation */
var adressInput = $("#inputAdress");
var adressLabel = $(".label-adress");
var adressHint = $(".adressHint");
function checkAdress() {

    if (adressInput.val()) {
        adressInput.addClass("valid");
        adressInput.removeClass("invalid");
        adressLabel.addClass("valid");
        adressLabel.removeClass("invalid");
        adressHint.addClass("none");
        return true;
    } else {
        adressInput.removeClass("valid");
        adressInput.addClass("invalid");
        adressLabel.addClass("invalid");
        adressLabel.removeClass("valid");
        adressHint.removeClass("none");
        return false;
    }
}


function initialise() {

    $("#inputAdress").bind("input", function () {
        //console.log(adressInput.val());
        MAP.geocodeAddress(adressInput.val(), function (err, coordinates) {
            if (err) {
                console.log("Can't find adress")
            } else {
                MAP.setMarker(coordinates);
                MAP.calculateRoute(new google.maps.LatLng(50.464379, 30.519131), coordinates, function (err, res) {
                    if (res) {
                        $(".order-summery-time").html("<b>Приблизний час доставки:</b> " + res);
                        MAP.getFullAddress(adressInput.val(), function (err, adress) {
                            if (!err) {
                                console.log(adress);
                                $(".order-summery-adress").html("<b>Адреса доставки:</b> " + adress);
                            }
                        });
                    } else {
                        $(".order-summery-time").html("<b>Приблизний час доставки:</b> -/-");
                        $(".order-summery-adress").html("<b>Адреса доставки:</b> -/-");
                    }
                });
            }
        });
    });

    $("#submitButt").click(function () {

        checkName();
        checkPhone();
        checkAdress();
        if (checkName() && checkPhone() && checkAdress()) {
            console.log("Creating order!");
            api.createOrder({
                name: nameInput.val(),
                phone: phoneInput.val(),
                adress: adressInput.val(),
                pizzas: Cart.getPizzaInCart()
            }, function (err, res) {

                if (err) {
                    console.log("There is an error")
                } else {
                    window.LiqPayCheckoutCallback = LiqPay.initialize(res.data, res.signature);
                }
            });
        } else {
            $("#inputName").bind("input", function () {
                checkName();
            });

            $("#inputPhone").bind("input", function () {
                /*alert("check!@!");*/
                checkPhone();
            });

            $("#inputAdress").bind("input", function () {
                checkAdress();
            });
        }

    });
}

function setAdress(value) {
    adressInput.val(value);
}

exports.initialise = initialise;
exports.setAdress = setAdress;
exports.checkAdress = checkAdress;
