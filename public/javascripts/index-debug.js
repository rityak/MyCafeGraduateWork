"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

$(document).ready(function () {
  $(window).on("scroll", initOdometer);
  $(window).on("resize", function () {
    $('.face').parallax({
      imageSrc: '/images/face__background.jpg'
    });
  });
  $('.face').parallax({
    imageSrc: '/images/face__background.jpg'
  });
  $('#store_button').on("mouseenter", function () {
    $('#storeFill').attr("fill", "#fff");
  }).on("mouseleave", function () {
    $('#storeFill').attr("fill", "#28a745");
  });
  $(".anchor").on("click", function (event) {
    event.preventDefault();
    $($(event.target).attr("href")).get(0).scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
  /* Date Picker */

  $('#formDate').attr('placeholder', new Date().toLocaleString("ru", {
    month: 'numeric',
    day: 'numeric'
  }).split(".").join("/")).datepicker({
    format: 'dd/mm',
    language: 'ru'
  });
  /* DISH change value fix */

  $(".bar__input").val('0').on("change", function () {
    var counter = $(this);
    var value = parseInt(counter.val());

    if (!isNaN(value)) {
      if (value >= 99) counter.val(99);else if (value < 0) counter.val(0);
    } else counter.val(0);

    storeDish(counter);
  });
  /* Open store */

  $("#store_button").on("click", function () {
    $(".body__main").toggleClass("active");
    $(".body__shop").toggleClass("active");
    $("#header").toggleClass("active");
    $("body").toggleClass("overflow");
  });
  $("#closeStore").on("click", function () {
    return $("#store_button").click();
  });
  /* store */

  $(".container__dish, .container__hall").hide();
  /* store hall */

  $(".set__hall").on("click", function () {
    var halls = $(".hall__item");
    var self = $(this);
    var id = self.attr("data-id");
    var clone = $(halls.get(id)).html();

    if (!$(this).hasClass("btn-success")) {
      $(".set__hall").removeClass("btn-success").text("Заказать");
      self.addClass("btn-success").text("Заказанно");
      $("#hall__push").html(clone);
      $(".container__hall .set__hall").addClass("btn-danger remove__hall").text("Удалить").removeClass("set__hall");
      $(".remove__hall").on("click", function () {
        var self = $(this);
        var id = self.attr("data-id");
        var hall = $($('.hall__item').get(id));
        hall.find(".set__hall").click();
      });
      $(".container__hall").show();
      $("#stub__hall").hide();
      $("#store__submit_button").show();
    } else {
      $(".set__hall").removeClass("btn-success").text("Заказать");
      $("#hall__push").html("");
      $(".container__hall").hide();
      $("#stub__hall").show();
      $("#store__submit_button").hide();
    }

    var cheak_dish = $("#dish__push .dish__item");
    var cheak_hall = $("#hall__push .container");

    if (!cheak_hall.length <= 0 || !cheak_dish.length <= 0) {
      $(".result").show();
    } else {
      $(".result").hide();
    }

    priceCalculate();
  });
  $(".result").hide();
  $("#notification").on("change", function () {
    var notification = $("#notification");
    var checked = notification.prop("checked");
    notification.val(checked.toString());
  }).change();
  formCheak();
  $("#formContinue").attr("disabled", true).on("click", function () {
    if (!$(this).attr("disabled")) {
      var hall = $("#hall__push .container[data-hall-id]").attr("data-hall-id");
      var dishes = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = $("#dish__push button[data-remove-dish-id]")[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var dish = _step.value;
          var count = parseInt($(dish).siblings().val()),
              i = 0;

          do {
            i++;
            dishes.push($(dish).attr("data-remove-dish-id"));
          } while (count > i);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      $("#formHall").val(hall);
      $("#formDishes").val(dishes.join(";"));
      $("#storeForm").submit();
    }
  });
  $("#store__submit_button").hide();
  /* document ready end */
});
/* store dish */

function storeDish(self) {
  var inputs = $(".bar__input[data-id]");
  var dish = $(".dish__push");
  var trace = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = inputs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var input = _step2.value;
      input = $(input);

      if (input.val() > 0) {
        var id = input.attr("data-id");
        trace.push($($(".dish__item[data-dish-id]").get(id)).attr("data-dish-id"));
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
        _iterator2["return"]();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  $("#dish__push").html("");

  for (var _i = 0, _trace = trace; _i < _trace.length; _i++) {
    var item = _trace[_i];
    var dish_item = $($(".dish__item[data-dish-id]").get(item));
    var template = document.createElement("div");
    template.classList.add("dish__item");
    template.innerHTML = dish_item.html();
    template.setAttribute("data-dish-store-id", dish_item.attr("data-dish-id"));
    var bar = $(template).find(".bar__input");

    var _id = bar.attr("data-id");

    var __dish = $($(".dish .dish__item").get(_id));

    var value = __dish.find(".bar__input[data-id]").val();

    bar.removeAttr("data-id"); // bar.attr("readonly", true);

    bar.val(value);
    $(template).find(".bar__button[data-counter-type='decrement']").remove();
    $(template).find(".bar__button[data-counter-type='increment']").removeAttr("data-counter-type").removeAttr("onclick").attr("onclick", "removeDish(this)").addClass("btn-danger").attr("data-remove-dish-id", "".concat(item)).text("Удалить");
    dish.append(template);
  }

  var cheak_dish = $("#dish__push .dish__item");
  var cheak_hall = $("#hall__push .container");

  if (cheak_dish.length <= 0) {
    $("#dish__push").hide();
    $(".container__dish").hide();
    $("#stub__dish").show();
  } else {
    $("#stub__dish").hide();
    $("#dish__push").show();
    $(".container__dish").show();
  }

  if (!cheak_hall.length <= 0 || !cheak_dish.length <= 0) {
    $(".result").show();
  } else {
    $(".result").hide();
  }

  $("#dish__push .dish__item[data-dish-store-id] .bar__input").on("change", updateValue);
  priceCalculate();
}

function initOdometer() {
  if (pageYOffset >= window.innerHeight / 1.4) {
    $(".odometer.first").html("6");
    $(".odometer.second").html("24");
    $(".odometer.three").html("7");
    $(window).off("scroll", initOdometer);
  }
}
/* DISH counter */


window.count = function count(self) {
  var parent = $(self.parentNode);
  var type = $(self).attr("data-counter-type");
  var counter = parent.find(".bar__input");
  var value = counter.val();
  if (type === "increment") {
    if (value < 0) counter.val(0);else if (value >= 99) counter.val(99);else counter.val(parseInt(value) + 1);
  } else if (value > 0) counter.val(parseInt(value) - 1);else counter.val(0);
  counter.change();
};

window.removeDish = function removeDish(self) {
  self = $(self);
  var id = self.attr("data-remove-dish-id");
  $($(".dishes__container .bar__input[data-id]").get(id)).val(0).change();
};

window.updateValue = function updateValue() {
  self = $(this);
  var value = self.val();
  var id = self.parent().find(".bar__button").attr("data-remove-dish-id");
  $($("#dishes .bar__input").get(id)).val(value).change();
};

function priceCalculate() {
  var Int = function Int(nonInt) {
    var _int = parseInt(nonInt);

    return isNaN(_int) ? 0 : _int;
  };

  var hall = $("#hall__push span.info__new-price");
  var amounts = $("#dish__push .bar__input");
  var cost = $("#dish__push .dish__subtitle");
  var price = 0;
  price += Int(hall.text());
  var i = 0;
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = amounts[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var amount = _step3.value;
      var a = Int($(cost.get(i)).text());
      var b = Int($(amount).val());
      price += a * b;
      i++;
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
        _iterator3["return"]();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  $("#result__price").text(priceFormat(price));

  function priceFormat(unformat) {
    var unformatReverse = unformat.toString().split("").reverse(),
        formatReverse = [];
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
      for (var _iterator4 = unformatReverse.entries()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
        var _step4$value = _slicedToArray(_step4.value, 2),
            _i2 = _step4$value[0],
            item = _step4$value[1];

        if (_i2 !== 0 && _i2 % 3 === 0) formatReverse.push(" ");
        formatReverse.push(item);
      }
    } catch (err) {
      _didIteratorError4 = true;
      _iteratorError4 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
          _iterator4["return"]();
        }
      } finally {
        if (_didIteratorError4) {
          throw _iteratorError4;
        }
      }
    }

    return formatReverse.reverse().join("");
  }
}

function formCheak() {
  $("#formName, #formEmail, #formPlace, #formDate").on("change", function () {
    var accessing = true;
    var _iteratorNormalCompletion5 = true;
    var _didIteratorError5 = false;
    var _iteratorError5 = undefined;

    try {
      for (var _iterator5 = $("#formName, #formEmail, #formPlace, #formDate")[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
        var item = _step5.value;

        var _self = $(item);

        var regular = void 0,
            value = void 0;

        switch (_self.attr("id")) {
          case "formName":
            regular = /^[А-ЯA-Z][а-яa-zА-ЯA-Z\-]{0,}\s[А-ЯA-Z][а-яa-zА-ЯA-Z\-]{1,}(\s[А-ЯA-Z][а-яa-zА-ЯA-Z\-]{1,})?$/ig;
            value = _self.val();

            if (!regular.test(value)) {
              _self.addClass("border-danger");

              accessing = false;
            } else {
              _self.removeClass("border-danger");
            }

            break;

          case "formEmail":
            regular = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;
            value = _self.val();

            if (!regular.test(value)) {
              _self.addClass("border-danger");

              accessing = false;
            } else {
              _self.removeClass("border-danger");
            }

            break;

          case "formPlace":
          case "formDate":
            value = _self.val();

            if (!value) {
              accessing = false;
            }

            break;

          default:
            break;
        }
      }
    } catch (err) {
      _didIteratorError5 = true;
      _iteratorError5 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
          _iterator5["return"]();
        }
      } finally {
        if (_didIteratorError5) {
          throw _iteratorError5;
        }
      }
    }

    $("#formContinue").attr("disabled", !accessing);
  });
}