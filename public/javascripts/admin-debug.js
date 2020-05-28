"use strict";

$(document).ready(function () {
  /* HTML editor render */
  $("#halls .nav-link").on("shown.bs.tab", function () {
    var i = Number($(this).attr("id").split("-")[1]);

    if (!$("#hall-".concat(i, " .editor__html .CodeMirror")).get(0)) {
      var Tab = CodeMirror($("#hall-".concat(i, " .editor__html")).get(0), {
        value: $("#hall-".concat(i, " .hallBody")).html().trim(),
        mode: "text/paint",
        lineNumbers: true,
        lineWrapping: true,
        theme: "darcula"
      });
      $("#hall-".concat(i, " .CodeMirror")).height($("#hall-".concat(i, " .editor__visual")).height() + 25).on("keyup", function () {
        var html = Tab.doc.getValue();
        $(".tab-pane.active .hallBody").html(html);
      });
      $("#hall-".concat(i, " .hallBody")).on("input", function () {
        var html = $(this).html();
        Tab.doc.setValue(html);
      });
    }
  });
  $("#tab-0").tab("show");
  /* help func, change alert */

  function _changeAlert() {
    var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var error = arguments.length > 1 ? arguments[1] : undefined;

    if (!error) {
      $("#".concat(id, " .alert-submit")).attr("style", "display: block;");
      $("#".concat(id, " .alert-error")).attr("style", "display: none;");
      setTimeout(function () {
        $("#".concat(id, " .alert-submit")).attr("style", "display: none;");
      }, 5000);
    } else {
      $("#".concat(id, " .alert-submit")).attr("style", "display: none;");
      $("#".concat(id, " .alert-error")).attr("style", "display: block;").html("<h3>Error!</h3><p>".concat(error, "</p>"));
      setTimeout(function () {
        $("#".concat(id, " .alert-error")).attr("style", "display: none;");
      }, 5000);
    }
  }
  /* Save change hall */


  $("#hallsContent .hall__submit").on("click", function () {
    var id = Number($("#hallsContent .tab-pane.active").attr("id").split("-")[1]) + 1;
    var title = $("#hallsContent .tab-pane.active .info__title").text();
    var body = $("#hallsContent .tab-pane.active .hallBody").html();
    var oldPrice = $("#hallsContent .tab-pane.active .info__old-price").text();
    var newPrice = $("#hallsContent .tab-pane.active .info__new-price").text();
    var request = new XMLHttpRequest();
    var url = "/admin/hall/";
    var params = "id=".concat(id, "&title=").concat(title, "&body=").concat(body, "&old=").concat(oldPrice, "&new=").concat(newPrice);

    try {
      request.open("POST", url, true);
      request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      request.addEventListener("readystatechange", function () {
        if (request.readyState === 4 && request.status === 200) {
          console.log(request.responseText);
        }
      });
      request.send(params);

      _changeAlert("hallsContent");
    } catch (e) {
      _changeAlert("hallsContent", e);
    }
  });
  /* Save change dishes */

  $("#dishes .hall__submit").on("click", function () {
    var dishes = $(".dishes__container .dish__item");
    var xhr = new XMLHttpRequest();
    var url = "/admin/dishes/";
    var request = [];
    dishes.each(function () {
      var id = $(this).attr("data-dish-id").replace(/'/gi, "").replace(/"/gi, "").replace(/`/gi, "").replace(/&/gi, "");
      var title = $(this).find(".dish__title").text().replace(/'/gi, "").replace(/"/gi, "").replace(/`/gi, "").replace(/&/gi, "");
      var price = $(this).find(".dish__subtitle").text().replace(/'/gi, "").replace(/"/gi, "").replace(/`/gi, "").replace(/&/gi, "");
      request.push("id='".concat(parseInt(id) + 1, "'"));
      request.push("title='".concat(title, "'"));
      request.push("price='".concat(price, "'")); // console.log(id, title, price);
    });
    request = request.join("&");

    try {
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.addEventListener("readystatechange", function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          console.log(xhr.responseText);
        }
      });
      xhr.send(request);

      _changeAlert("dishes");
    } catch (e) {
      _changeAlert("dishes", e);
    }
  });
});