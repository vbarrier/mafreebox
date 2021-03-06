$(document).ready(function() {
    $(":checkbox").checkbox();
    $(":checkbox[name=enabled]").bind("check", function() {
        $("#div_cfg_dhcp").show()
    });
    $(":checkbox[name=enabled]").bind("uncheck", function() {
        $("#div_cfg_dhcp").hide()
    });
    $("input").tipTip();
    $("#form_config").rpcform({
        beforeSubmit: function(d, b) {
            var c = b[0];
            if (ejs.trim(c.ip_start.value) || ejs.trim(c.ip_end.value)) {
                if (!check_ipv4(c.ip_start.value)) {
                    sbar.error(null, "Début de la plage incorrecte");
                    return false
                }
                if (!check_ipv4(c.ip_end.value)) {
                    sbar.error(null, "Fin de la plage incorrecte");
                    return false
                }
            }
            for (var a = 1; a <= 5; a++) {
                if (ejs.trim(c["dns" + a].value) && !check_ipv4(c["dns" + a].value)) {
                    sbar.error(null, "DNS " + a + " incorrect");
                    return false
                }
            }
            return true
        },
        success: function(a) {
            sbar.text("Modifications effectuées")
        },
        error: function(a) {
            $(this).resetForm();
            sbar.error(null, a.error)
        }
    })
});
