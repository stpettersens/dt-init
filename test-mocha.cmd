@if exist shortid rmdir /q /s shortid
@npm test && type shortid\shortid.d.ts && echo. && echo. && type shortid\shortid-tests.ts && echo @npm test > shortid\test-tsc.cmd && @cd shortid && call test-tsc.cmd && cd.. && rmdir /q /s shortid
