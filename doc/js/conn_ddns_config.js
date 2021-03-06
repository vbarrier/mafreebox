$(document).ready(function() {
    $("input:checkbox").checkbox();
    $(".ddns_provider_enabled").click(function(d) {
        var f = d.target;
        var c = !f.checked;
        var b = $(f).attr("provider_name");
        var g = $("#div_provider_config_data_" + b);
        if (c) {
            g.show()
        } else {
            g.hide()
        }
    });

    function a(b, c) {
        if (b == null || b == "") {
            sbar.error(null, c + " ne doit pas être vide");
            return false
        }
        return true
    }
    $(".form_config").rpcform({
        beforeSubmit: function(h, f) {
            var g = f[0];
            var i = $(g).attr("provider");
            var e = $("#ddns_provider_enabled_" + i).is(":checked");
            var c = $("#ddns_provider_user_" + i).val();
            var d = $("#ddns_provider_password_" + i).val();
            var b = $("#ddns_provider_hostname_" + i).val();
            if (e && (!a(c, "Le nom d'utilisateur") || !a(d, "Le mot de passe") || !a(b, "Le nom d'hôte"))) {
                return false
            }
            return true
        },
        success: function(b) {
            sbar.text("Configuration appliquée")
        },
        error: function(b) {
            sbar.error(null, "Impossible d'appliquer la configuration")
        }
    })
});
