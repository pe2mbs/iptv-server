# Release information

# General
This information shows the release ans status of the current application.

# Release 2021-01 - Beta
This is the release is a major rebuild of the web application core.
This includes the following new and updated features;
* Upgrade to Python 3.8.
* Upgrade to Angular 10.
* Single page handing where everything stays in the browser window.  
* Authentication and role access of users configurable through the database
* Multi theme support
* Multi language support configurable through the database
* News bar (ticker)
* Locking of records to avoid overwriting of changes by other users.
* Tracking of changes of any standard CRUD data record changes (insert, update 
  and delete). Including rollback of changes upup the initial insert of the record.
* Standardized help pages in the application.
* Display of table overviews are backend paged, therefore only the number of visible
  records is loaded to the frontend. To speedup the application and save memory on 
  the client side.
* Table overviews have customizable filters ansd sorting.
* User preferences are stored on the user database for a better user experience.
* Support for Flask-MonitoringDashboard is now included

# Release 2020-01
This is first release of the web application core. This was derived from an application
which is build with gencrud (generator for both frontend (Angular) and backend). 