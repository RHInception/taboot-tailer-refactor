Name: taboot-tailer
Summary: Log tailer for taboot and Release Engine
Version: 0.0.0
Release: 1%{?dist}

Group: Applications/System
License: AGPLv3
Source0: %{name}-%{version}.tar.gz
Url: https://github.com/RHInception/taboot-tailer-refactor/

BuildArch: noarch
Requires: httpd

%description
Taboot-Tailer provides a nice web UI to watch logs as they are written
to disk.

%prep
%setup -q -n %{name}-%{version}

%build
# No building

%install
mkdir -p  $RPM_BUILD_ROOT/%{_sysconfdir}/httpd/conf.d/
cp -r conf/* $RPM_BUILD_ROOT/%{_sysconfdir}/httpd/conf.d/
mkdir -p $RPM_BUILD_ROOT/%{_localstatedir}/www/html/taboot/
cp -r src/* $RPM_BUILD_ROOT/%{_localstatedir}/www/html/taboot/


%files
%doc README.md THIRDPARTY
%{_localstatedir}/www/html/taboot/*
%config(noreplace) %{_sysconfdir}/httpd/conf.d/*

%changelog
* Thu Jun  5 2014 Steve Milner <stevem@gnulinux.net> - 0.0.0-1
- Initial spec.
