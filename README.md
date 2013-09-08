LYNTEST
=======

Minimal assistant for executing test suites.
You get everything you need in one (1) browser tab!
Uses only local storage in your browser.

By "test suite" we mean a collection of tests that are defined somewhere else (URL to test description / instructions).
Each test has a short ID, a title and a description (see "Getting started" for more info).



What LYNTEST does for you:
=========================
- Imports test suites from file by drag-and-drop
- Creates multiple instances (executions) from the test suite
- Assists you on the execution of your tests. Shows current execution status and description of current test in the same browser tab.
- Creates detailed reports for one test execution.
- Creates test suite report comparing several executions in one grid.



What LYNTEST does NOT do for you:
================================
Please note that ALL DATA is stored in your browser's local storage!
The imported suites and executed test result ARE NOT stored anywhere online!

It is recommended to backup the test results, for example by using "save as html" or similar function in your browser, 
or by manually copying the html contents to another document or system.




Getting started:
================
1. Open fileimport.html in your browser
2. Import jstest/my_test_suite.txt (*)
3. Click on the new suite
4. Create a new execution, and then click on it.
5. Go through all tests
5. Go back to the test suite and create a report

(*) In this demo file the URL is the object to be tested, but this could be the definition of the test to be executed in another system instead.
