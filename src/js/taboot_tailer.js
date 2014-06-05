// taboot_tailer.js - Populates available log menu, handles direct
// linking (query params)

if ($.QueryString("site")) {
    // Clear out any anchors (#) from the site parameter
    CURRENT_SITE = $.QueryString("site").replace(/#.*$/,"");
} else {
    CURRENT_SITE = DEFAULT_SITE;
}

$(document).ready(function(){
    setup_autoscroll();
    build_tabs();

    // Fade in the 'please wait' message
    $('#logsloading').fadeIn(500, function() {
        $.ajax({
            url: SITES[CURRENT_SITE] + SORT_STRING,
            cache: false,
            dataType: 'text',
            success: function(data) {
                build_log_list(data);
            },
        }).done(function(jq, ts) {
            // handle direct links to logs via query parameters
            if ($.QueryString("log")) {
                // Strip off any anchors
                var log = $.QueryString("log").replace(/#.*$/,"");
                start_following(log);
                highlight_named_log(log);
            }
            click_handlers();
        });
    });

    $('#sites li a').click(function(obj) {
        var old_site = CURRENT_SITE;
        CURRENT_SITE = $(this).text();
        highlight_current_site();
        clear_site_logs(old_site);

        $('#logsloading').fadeIn(500, function() {
            $.ajax({
                url: SITES[CURRENT_SITE] + SORT_STRING,
                cache: false,
                dataType: 'text',
                success: function(data) {
                    build_log_list(data);
                },
            }).done(function(jq, ts) {
                click_handlers();
            });
        });
    });
});
