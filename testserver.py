#!/usr/bin/env python

import os
import SimpleHTTPServer
import SocketServer


def main():
    os.chdir('src')
    SocketServer.TCPServer.allow_reuse_address = True
    httpd = SocketServer.TCPServer((
        "127.0.0.1", 5000),
        SimpleHTTPServer.SimpleHTTPRequestHandler)
    print "Do not use this server for anything but testing!"
    print "Serving on 127.0.0.1:5000. Hit ctrl+c to exit."
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.shutdown()


if __name__ == '__main__':
    main()
