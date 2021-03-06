$(document).ready(function() {
    $("#form_config").rpcform({
        beforeSubmit: function(c, a) {
            var b = a[0];
            if (!check_ipv4(b.lan_ip.value)) {
                sbar.error(null, "Adresse IP incorrecte");
                return false
            }
            return true
        },
        success: function(a) {
            sbar.text("Modifications effectuées")
        },
        error: function(a) {
            sbar.error(null, a.error)
        }
    })
});
