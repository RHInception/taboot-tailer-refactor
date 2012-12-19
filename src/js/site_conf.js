////////////////////////////////////////////////////////////////////////////////
// CONFIGURE THESE
////////////////////////////////////////////////////////////////////////////////

// SITES - Key-Value data structure which maps names->directory
// indexes. These URLs are what Taboot Tailer uses to fetch lists of
// available log files from.
SITES = {
    'FOO': 'http://foo.megafrobber.com/frob/logs',
    'BAR': 'http://bar.megafrobber.com/frob/logs',
};


// DEFAULT_SITE - String which is the key of the default site to list
// logs from.
DEFAULT_SITE = 'FOO';


////////////////////////////////////////////////////////////////////////////////
// THINGS YOU SHOULD CONSIDER CUSTOMIZING
////////////////////////////////////////////////////////////////////////////////

// REFRESH_INTERVAL - An integer which defines the time in
// milliseconds to wait before checking for new content.
REFRESH_INTERVAL = 5000;


// MAX_DISPLAY_LOGS - An integer which defines the maximum number of
// log files to display in the menu before hiding the rest under "xyz
// more available"
MAX_DISPLAY_LOGS = 15;


// AUTOSCROLL - A boolean (true/false) which toggles the initial state
// of the autoscroll button. Setting to true means the page will
// always automatically scroll to new content.
AUTOSCROLL = false;


////////////////////////////////////////////////////////////////////////////////
// CUSTOMIZE IF YOU WISH
////////////////////////////////////////////////////////////////////////////////

// SORT_STRING - Used to control the sort order of log files retrieved
// from a SITE. This value is appended to a site location (SITES[foo])
// to build a full URL. The examples below work for Apache HTTPD
// directory listings
//
// Most recently modified first:    /?C=M;O=D
//
// Most recently modified last:     /?C=M;O=A
//
// Alphabetically (a->z):           /?C=N;O=A
//
// Reverse alphabetically (z->a):   /?C=N;O=D
SORT_STRING = "/?C=M;O=D";
