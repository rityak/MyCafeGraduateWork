$(document).ready(function () {
    /* HTML editor render */
    $("#halls .nav-link").on("shown.bs.tab", function () {
        let i = Number($(this).attr("id").split("-")[1]);
        if (!$(`#hall-${i} .editor__html .CodeMirror`).get(0)) {
            let Tab = CodeMirror ($(`#hall-${i} .editor__html`).get(0), {
                value: $(`#hall-${i} .hallBody`).html().trim(),
                mode: "text/paint",
                lineNumbers: true,
                lineWrapping: true,
                theme: "darcula",
            });
            $(`#hall-${i} .CodeMirror`)
                .height($(`#hall-${i} .editor__visual`).height() + 25)
                .on ("keyup", function () {
                    const html = Tab.doc.getValue();
                    $(".tab-pane.active .hallBody").html(html)
                });
            $(`#hall-${i} .hallBody`).on("input", function () {
                const html = $(this).html();
                Tab.doc.setValue(html);
            });
        }
    });
    $("#tab-0").tab("show");

    /* help func, change alert */
    function _changeAlert (id = "", error) {
        if (!error) {
            $(`#${id} .alert-submit`).attr("style", "display: block;");
            $(`#${id} .alert-error`).attr("style", "display: none;");
            setTimeout(function () {
                $(`#${id} .alert-submit`).attr("style", "display: none;");
            }, 5000);
        } else {
            $(`#${id} .alert-submit`).attr("style", "display: none;");
            $(`#${id} .alert-error`).attr("style", "display: block;")
                .html(`<h3>Error!</h3><p>${error}</p>`);
            setTimeout(function () {
                $(`#${id} .alert-error`).attr("style", "display: none;");
            }, 5000);
        }
    }

    /* Save change hall */
    $("#hallsContent .hall__submit").on("click", function () {
        const id        = Number($("#hallsContent .tab-pane.active").attr("id").split("-")[1]) + 1;
        const title     = $("#hallsContent .tab-pane.active .info__title").text();
        const body      = $("#hallsContent .tab-pane.active .hallBody").html();
        const oldPrice  = $("#hallsContent .tab-pane.active .info__old-price").text();
        const newPrice  = $("#hallsContent .tab-pane.active .info__new-price").text();
        const request = new XMLHttpRequest();
        const url = "/admin/hall/";
        const params = `id=${id}&title=${title}&body=${body}&old=${oldPrice}&new=${newPrice}`;
        try {
            request.open("POST", url, true);
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.addEventListener("readystatechange", () => {
                if(request.readyState === 4 && request.status === 200) {
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
        const dishes = $(".dishes__container .dish__item");
        const xhr = new XMLHttpRequest();
        const url = "/admin/dishes/";
        let request = [];
        dishes.each(function () {
            const id = $(this).attr("data-dish-id")
                .replace(/'/gi, "")
                .replace(/"/gi, "")
                .replace(/`/gi, "")
                .replace(/&/gi, "");
            const title = $(this).find(".dish__title").text()
                .replace(/'/gi, "")
                .replace(/"/gi, "")
                .replace(/`/gi, "")
                .replace(/&/gi, "");
            const price = $(this).find(".dish__subtitle").text()
                .replace(/'/gi, "")
                .replace(/"/gi, "")
                .replace(/`/gi, "")
                .replace(/&/gi, "");
            request.push(`id='${(parseInt(id) + 1)}'`);
            request.push(`title='${title}'`);
            request.push(`price='${price}'`);
            // console.log(id, title, price);
        });
        request = request.join("&");
        try {
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.addEventListener("readystatechange", () => {
                if(xhr.readyState === 4 && xhr.status === 200) {
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
