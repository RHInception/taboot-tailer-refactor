// main.js - Does all the grunt work required for most view updates,
// click handlers, and the actual loading and refreshing content.

currently_following = "";
bytes_fetched = -1;

function scroll_to_new_content() {
    if (AUTOSCROLL) {
        // do foo
    }
}

function add_new_content_marker() {
    // First, remove any existing markers
    $("#new_content_marker").remove();
    // Then add a new marker
    var new_content_marker = $("<div id='new_content_marker'></div>");
    $("#fillme").append(new_content_marker);
}

function setup_autoscroll() {
    // Autoscroll can be set to default to true, reflect that
    // preference below:
    if (AUTOSCROLL) {
        $('#li-toggle_autoscroll').addClass('active');
    }

    // Autoscroll button is in the navbar. By default the tool tip
    // apears ABOVE the element its bound to.
    $('[rel=tooltip]').tooltip({placement: 'bottom'});
}

function hide_loading_msg() {
    $('#logsloading').hide();
}

function show_rest_button() {
    // poorly named function. Also creates the show less link
    var rest_icon = "<i class='icon-chevron-down' id='show_rest_icon'></i> ";
    var rest_count = $('.log_display-false').length;
    var show_rest = $("<a id='show_rest'><span id='rest_text'/></a>");

    $('#loglist').append(show_rest);
    show_rest.wrap("<li id='li-show_rest'/>");
    $('#rest_text').text(rest_count.toString() + ' more available');
    show_rest.prepend(rest_icon);

    var less_icon = "<i class='icon-chevron-up' id='hide_rest_icon'></i> ";
    var hide_rest = $("<a id='hide_rest'><span id='less_text'/></a>");
    $('#loglist').append(hide_rest);
    hide_rest.wrap("<li id='li-hide_rest'/>");
    $('#less_text').text('show less');
    hide_rest.prepend(less_icon);
    $('#li-hide_rest').hide();
}

function add_logs(log_items, show) {
    // Called by build_log_list to fill the log list for the selected
    // site. 'show' is a boolean which indicates if these items are
    // visible or hidden under the 'xyz more available' menu.
    $.each(log_items, function(j, item) {
        var link = make_link($(this));
        $("#loglist").append(link);
        link.wrap('<li class="log_display-' + show.toString() + ' site-' + CURRENT_SITE + '-log"></li>');
        link.prepend("<i class='icon-book'></i> ");
    });
}

function click_handlers() {
    // Toggle the display state of the autoscroll button
    $("#li-toggle_autoscroll a").click(function(obj) {
        $("#li-toggle_autoscroll").toggleClass("active");
        AUTOSCROLL = !AUTOSCROLL;
    });

    // Instead of going away, load the link in the fillme frame
    $(".linkloader").click(function(obj) {
        var target = $(this).attr('id');
        highlight_current_log($(this));
        start_following(target);
    });

    // don't show everything all at once
    $('#show_rest').click(function(obj) {
        $('.log_display-false').show();
        $('#li-show_rest').hide();
        $('#li-hide_rest').show();
    });

    // but let us hide those things later if we want
    $('#hide_rest').click(function(obj) {
        $('.log_display-false').hide();
        $('#li-hide_rest').hide();
        $('#li-show_rest').show();
    });
}

function clear_site_logs(site) {
    // Handler invoked when a site tab is clicked. Clears out the
    // previous sites hidden and displayed log items from the list.
    $('.site-' + site + '-log').remove();
    $('#li-show_rest').remove();
    $('#li-hide_rest').remove();
}

function build_log_list(data) {
    // clear away the 'loading' message
    hide_loading_msg();

    // Extract all the links to file types in formats (not index sorters)
    var links = [];
    var formats = ['html', 'log'];
    for (index = 0; index < formats.length; index++) {
        var new_links = $(data).find('a[href$="'+formats[index]+'"]');
        for (i = 0; i < new_links.length; i++) {
            links.push(new_links[i]);
        }
    };

    // Add each link to the list and fix its pathing
    // But not all at once. There's too many!
    if (links.length > MAX_DISPLAY_LOGS) {
        add_logs(links.slice(0, MAX_DISPLAY_LOGS), true);
        add_logs(links.slice(MAX_DISPLAY_LOGS), false);
        show_rest_button();
    } else {
        add_logs(links, true);
    }
}

function highlight_current_site() {
    // Select the current site in the sites tab
    $('#sites li').removeClass('active');
    $('#site-' + CURRENT_SITE).addClass('active');
}

function build_tabs() {
    // Add a tab for each site in SITES
    var site_names = Object.keys(SITES);
    for (var site in SITES) {
        var site_tab = $('<li id="site-' + site + '"><a>' + site + '</a></li>');
        $('#sites').append(site_tab);
    }
    highlight_current_site();
}

function highlight_current_log(log) {
    // Visual indicator of which log file is selected in the log list
    $("#loglist").children().removeClass('active');
    log.parent().addClass('active');
    log.parent().show();
}

function highlight_named_log(log) {
    // Highlight a specific log file by name
    var menu_item = $("#loglist li").has("a[id='" + log + "']");
    $("#loglist").children().removeClass('active');
    menu_item.addClass('active');
}

function flash_new_content_alert() {
    $("#new_content_alert").fadeIn(1000, function(jq, ts) {
        $("#new_content_alert").fadeOut(1250);
    });
}

function start_following(log) {
    // Update the view with a visual indicator of what log is being
    // followed. Fetch new log content and give visual feedback when
    // it has been loaded. Kick off a timer to continue refreshing the
    // view with new content. Update the location bar with query
    // parameters that allow direct linking to this log file.

    $("#fillme").html("");
    currently_following = log;

    $.ajax({
        url: SITES[CURRENT_SITE] + "/" + log,
        cache: false,
        type: "GET",
        'success': function(data, t, j) {
            $("#fillme").html("<pre>"+data+"</pre>"); // Put it all in pre
            flash_new_content_alert();
            add_new_content_marker();
            scroll_to_new_content();
            bytes_fetched = j.responseText.length;
        }
    });

    start_refresh_timer();

    // Update the browser 'location' so people can provide direct
    // links to logs
    window.history.replaceState('log', 'Taboot Tailer', '?site=' + CURRENT_SITE + '&log=' + log);
}

function start_refresh_timer() {
    // Stop the timer if it's already running (this happens when you
    // switch between selected log files) and then toggle it back to
    // running.
    timer.stop();
    timer.toggle();
}

// Create an actual timer
var timer = $.timer(function() {
    refresh_log_file(currently_following, bytes_fetched);
});

timer.set({ time : REFRESH_INTERVAL, autostart : false });

function refresh_log_file(log, offset) {
    // Sends HTTP GET requests for a range sequence starting after the
    // total amount of content already fetched ending at an
    // unspecified point. Meaning "give me everything from $THIS_POINT
    // to the end of the file"

    var range = 'bytes=' + offset.toString() + '-';
    // uncomment this next line for debugging
    // console.log("Sending header - Range: " + range);
    var opts = {
        url: SITES[CURRENT_SITE] + "/" + log,
        cache: false,
        crossDomain: true,
        type: "GET",
        // Only fetch any new content
        'headers': {
            'Range': range,
        },
        'success': function(data, txstat, jqXHR) {
            flash_new_content_alert();
            bytes_fetched = bytes_fetched + jqXHR.responseText.length;
            // The content marker is how we keep track of where the
            // last fetched content ends and new content begins. Used
            // for autoscroll functionality.
            add_new_content_marker();
            // Add new content to the view
            $("#fillme").append(data);
            scroll_to_new_content();
        },
    };
    var httpreq = $.ajax(opts);
}

function make_link(item) {
    // Create link for item to place into the list of log files
    var link_id = item.text().split('/').reverse()[0];
    var link = $('<a/>', {
        // This should be customizable in the future
        text: item.text().replace(/taboot-/, '').replace(/.html/,'').replace(/.log/,'').replace(/(\.[0-9]+)/, ''),
        "class": 'linkloader',
        "id": link_id,
    });
    return link;
}
