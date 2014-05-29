Installation & Configuration
============================

Taboot Tailer
-------------

* Install under a path reachable by your webserver, such as `/var/www/html/taboot/`
* Configure the `js/site_conf.js` file, specifically the `SITES` and `DEFAULT_SITE` variables


Web Server
----------

Do the following on each server you are exposing logs from:

* Place `conf/taboot_tailer.conf` and `taboot_tailer_site.conf` into your apache configuration directory, usually `/etc/httpd/conf.d/`
* Do any necessary configuration in `taboot_tailer.conf`
* Configure `taboot_tailer_site.conf` to point to the location you deployed the taboot-tailer code to
* Reload your server configs (e.g., `service httpd reload` or `systemctl reload httpd.service`)
