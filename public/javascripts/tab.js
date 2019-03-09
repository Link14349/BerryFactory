var tab_namespace = {};

tab_namespace.show = false;
tab_namespace.menu_jq = $("#menu");
tab_namespace.menu_c_jq = $(".menu_");

tab();

function tab() {
    if (tab_namespace.show) {
        tab_namespace.menu_c_jq.css({
            "display": "block"
        });
        tab_namespace.menu_jq.animate({
            "width": "180px"
        }, 400);
    } else {
        tab_namespace.menu_c_jq.css({
            "display": "none"
        });
        tab_namespace.menu_jq.animate({
            "width": "0",
        }, 400);
    }
    tab_namespace.show = !tab_namespace.show;
}