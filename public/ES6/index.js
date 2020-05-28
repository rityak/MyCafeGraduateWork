$(document).ready(function () {
    $(window).on("scroll", initOdometer);
    $(window).on("resize", function () {
        $('.face').parallax({imageSrc: '/images/face__background.jpg'});
    });
    $('.face').parallax({imageSrc: '/images/face__background.jpg'});
    $('#store_button').on("mouseenter", function () {
        $('#storeFill').attr("fill", "#fff");
    }).on("mouseleave", function () {
        $('#storeFill').attr("fill", "#28a745");
    });
    $(".anchor").on("click", function (event) {
        event.preventDefault();
        $($(event.target).attr("href")).get(0).scrollIntoView({
            behavior: "smooth",
            block: "start",
        })
    });
    /* Date Picker */
    $('#formDate')
        .attr('placeholder', new Date().toLocaleString("ru", {
            month: 'numeric',
            day: 'numeric'
        }).split(".").join("/"))
        .datepicker({
            format: 'dd/mm',
            language: 'ru'
        });

    /* DISH change value fix */
    $(".bar__input").val('0').on("change", function () {
        const counter = $(this);
        const value = parseInt(counter.val());
        if (!isNaN(value)) {
            if (value >= 99) counter.val(99);
            else if (value < 0) counter.val(0);
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
    $("#closeStore").on("click", () => $("#store_button").click());

    /* store */
    $(".container__dish, .container__hall").hide();

    /* store hall */
    $(".set__hall").on("click", function () {
        const halls = $(".hall__item");
        const self = $(this);
        const id = self.attr("data-id");
        const clone = $(halls.get(id)).html();
        if (!$(this).hasClass("btn-success")) {
            $(".set__hall").removeClass("btn-success").text("Заказать");
            self.addClass("btn-success").text("Заказанно");
            $("#hall__push").html(clone);
            $(".container__hall .set__hall").addClass("btn-danger remove__hall").text("Удалить").removeClass("set__hall");
            $(".remove__hall").on("click", function () {
                const self = $(this);
                const id = self.attr("data-id");
                const hall = $($('.hall__item').get(id));
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
        let cheak_dish = $("#dish__push .dish__item");
        let cheak_hall = $("#hall__push .container");
        if (!cheak_hall.length <= 0 || !cheak_dish.length <= 0) {
            $(".result").show();
        } else {
            $(".result").hide();
        }
        priceCalculate();
    });
    $(".result").hide();
    $("#notification").on("change", function () {
        let notification = $("#notification");
        let checked = notification.prop("checked");
        notification.val(checked.toString());
    }).change();
    formCheak();
    $("#formContinue").attr("disabled", true).on("click", function () {
        if(!$(this).attr("disabled")) {
            const hall = $("#hall__push .container[data-hall-id]").attr("data-hall-id");
            const dishes = [];
            for (let dish of $("#dish__push button[data-remove-dish-id]")){
                let count = parseInt($(dish).siblings().val()), i = 0;
                do {
                    i++;
                    dishes.push($(dish).attr("data-remove-dish-id"));
                } while (count > i);
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
    const inputs = $(".bar__input[data-id]");
    const dish = $(".dish__push");
    const trace = [];
    for (let input of inputs){
        input = $(input);
        if (input.val() > 0) {
            const id = input.attr("data-id");
            trace.push($($(".dish__item[data-dish-id]").get(id)).attr("data-dish-id"));
        }
    }
    $("#dish__push").html("");
    for (let item of trace) {
        const dish_item = $( $(".dish__item[data-dish-id]").get(item) );
        const template = document.createElement("div");
        template.classList.add("dish__item");
        template.innerHTML = dish_item.html();
        template.setAttribute("data-dish-store-id", dish_item.attr("data-dish-id"));
        let bar = $(template).find(".bar__input");
        let id = bar.attr("data-id");
        let __dish = $($(".dish .dish__item").get(id));
        let value = __dish.find(".bar__input[data-id]").val();
        bar.removeAttr("data-id");
        // bar.attr("readonly", true);
        bar.val(value);
        $(template).find(".bar__button[data-counter-type='decrement']").remove();
        $(template).find(".bar__button[data-counter-type='increment']")
            .removeAttr("data-counter-type")
            .removeAttr("onclick")
            .attr("onclick", "removeDish(this)")
            .addClass("btn-danger")
            .attr("data-remove-dish-id", `${item}`)
            .text("Удалить");
        dish.append( template );
    }
    let cheak_dish = $("#dish__push .dish__item");
    let cheak_hall = $("#hall__push .container");
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

function initOdometer () {
    if (pageYOffset >= window.innerHeight / 1.4) {
        $(".odometer.first").html("6");
        $(".odometer.second").html("24");
        $(".odometer.three").html("7");
        $(window).off("scroll", initOdometer);
    }
}

/* DISH counter */
window.count = function count(self) {
    const parent    = $(self.parentNode);
    const type      = $(self).attr("data-counter-type");
    const counter   = parent.find(".bar__input");
    const value     = counter.val();
    if (type === "increment")
        if (value < 0)
            counter.val(0);
        else
            if (value >= 99)
                counter.val(99);
            else
                counter.val(parseInt(value) + 1);
    else
        if (value > 0)
            counter.val(parseInt(value) - 1);
        else
            counter.val(0);
    counter.change();
};

window.removeDish = function removeDish (self) {
    self = $(self);
    const id = self.attr("data-remove-dish-id");
    $($(".dishes__container .bar__input[data-id]").get(id)).val(0).change();
};

window.updateValue = function updateValue () {
    self = $(this);
    const value = self.val();
    const id = self.parent().find(".bar__button").attr("data-remove-dish-id");
    $($("#dishes .bar__input").get(id)).val(value).change();
};

function priceCalculate() {
    const Int = (nonInt) => {
        let int = parseInt (nonInt);
        return isNaN (int) ? 0 : int;
    };
    const hall = $("#hall__push span.info__new-price");
    const amounts = $("#dish__push .bar__input");
    const cost = $("#dish__push .dish__subtitle");
    let price = 0;
    price += Int(hall.text());
    let i = 0;
    for (let amount of amounts) {
        let a = Int($(cost.get(i)).text());
        let b = Int($(amount).val());
        price += a * b;
        i++;
    }
    $("#result__price").text(priceFormat(price));
    function priceFormat(unformat) {
        let unformatReverse = unformat.toString().split("").reverse(),
            formatReverse = [];
        for (let [i, item] of unformatReverse.entries()) {
            if (i !== 0 && (i) % 3 === 0 ) formatReverse.push(" ");
            formatReverse.push(item);
        }
        return formatReverse.reverse().join("");
    }
}
function formCheak() {
    $("#formName, #formEmail, #formPlace, #formDate").on("change", function () {
        let accessing = true;
        for (let item of $("#formName, #formEmail, #formPlace, #formDate")) {
            const self = $(item);
            let regular, value;
            switch (self.attr("id")) {
                case "formName":
                    regular = /^[А-ЯA-Z][а-яa-zА-ЯA-Z\-]{0,}\s[А-ЯA-Z][а-яa-zА-ЯA-Z\-]{1,}(\s[А-ЯA-Z][а-яa-zА-ЯA-Z\-]{1,})?$/ig;
                    value = self.val();
                    if (!regular.test(value)) {
                        self.addClass("border-danger");
                        accessing = false;
                    } else {
                        self.removeClass("border-danger");
                    }
                    break;
                case "formEmail":
                    regular = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;
                    value = self.val();
                    if (!regular.test(value)) {
                        self.addClass("border-danger");
                        accessing = false;
                    } else {
                        self.removeClass("border-danger");
                    }
                    break;
                case "formPlace":
                case "formDate":
                    value = self.val();
                    if (!value) {
                        accessing = false;
                    }
                    break;
                default:
                    break;
            }
        }
        $("#formContinue").attr("disabled", !accessing);
    });
}