@if "%SCM_TRACE_LEVEL%" NEQ "4" @echo off

:: ----------------------
:: KUDU Deployment Script
:: Version: 1.0.6
:: ----------------------

:: Prerequisites
:: -------------

:: Verify node.js installed
where node 2>nul >nul
IF %ERRORLEVEL% NEQ 0 (
  echo Missing node.js executable, please install node.js, if already installed make sure it can be reached from current environment.
  goto error
)

:: Setup
:: -----

setlocal enabledelayedexpansion

SET ARTIFACTS=%~dp0%..\artifacts

IF NOT DEFINED DEPLOYMENT_SOURCE (
  SET DEPLOYMENT_SOURCE=%~dp0%.
)

IF NOT DEFINED DEPLOYMENT_TARGET (
  SET DEPLOYMENT_TARGET=%ARTIFACTS%\wwwroot
)

IF NOT DEFINED NEXT_MANIFEST_PATH (
  SET NEXT_MANIFEST_PATH=%ARTIFACTS%\manifest

  IF NOT DEFINED PREVIOUS_MANIFEST_PATH (
    SET PREVIOUS_MANIFEST_PATH=%ARTIFACTS%\manifest
  )
)

IF NOT DEFINED KUDU_SYNC_CMD (
  :: Install kudu sync
  echo Installing Kudu Sync
  call npm install kudusync -g --silent
  IF !ERRORLEVEL! NEQ 0 goto error

  :: Locally just running "kuduSync" would also work
  SET KUDU_SYNC_CMD=%appdata%\npm\kuduSync.cmd
)

IF NOT DEFINED BOWER_CMD (
  :: Install bower
  echo Installing Bower
  call npm --registry "http://registry.npmjs.org/" install bower -g
  IF !ERRORLEVEL! NEQ 0 goto error

  :: Locally just running "bower" would also work
  SET BOWER_CMD=node "%appdata%\npm\node_modules\bower\bin\bower"
)

IF NOT DEFINED GRUNT_CMD (
  :: Install grunt
  echo Installing Grunt
  call npm --registry "http://registry.npmjs.org/" install grunt-cli -g
  IF !ERRORLEVEL! NEQ 0 goto error

  :: Locally just running "grunt" would also work
  SET GRUNT_CMD=node "%appdata%\npm\node_modules\grunt-cli\bin\grunt"
)
goto Deployment

:: Utility Functions
:: -----------------

:SelectNodeVersion

IF DEFINED KUDU_SELECT_NODE_VERSION_CMD (
  :: The following are done only on Windows Azure Websites environment
  call %KUDU_SELECT_NODE_VERSION_CMD% "%DEPLOYMENT_SOURCE%" "%DEPLOYMENT_TARGET%" "%DEPLOYMENT_TEMP%"
  IF !ERRORLEVEL! NEQ 0 goto error

  IF EXIST "%DEPLOYMENT_TEMP%\__nodeVersion.tmp" (
    SET /p NODE_EXE=<"%DEPLOYMENT_TEMP%\__nodeVersion.tmp"
    IF !ERRORLEVEL! NEQ 0 goto error
  )
  
  IF EXIST "%DEPLOYMENT_TEMP%\__npmVersion.tmp" (
    SET /p NPM_JS_PATH=<"%DEPLOYMENT_TEMP%\__npmVersion.tmp"
    IF !ERRORLEVEL! NEQ 0 goto error
  )

  IF NOT DEFINED NODE_EXE (
    SET NODE_EXE=node
  )

  SET NPM_CMD="!NODE_EXE!" "!NPM_JS_PATH!"
) ELSE (
  SET NPM_CMD=npm
  SET NODE_EXE=node
)

goto :EOF

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
:: Deployment
:: ----------

:Deployment
echo Handling node.js deployment.

:: 1. Select node version
call :SelectNodeVersion

:: 2. Install npm packages
echo Installing npm dev dependendencies
if EXIST "%DEPLOYMENT_SOURCE%\package.json" (
  pushd %DEPLOYMENT_SOURCE%
  call !NPM_CMD! install --development
  IF !ERRORLEVEL! NEQ 0 goto error
  popd
)

:: 3. Install bower packages
echo Installing bower dev dependendencies
if EXIST "%DEPLOYMENT_SOURCE%\bower.json" (
  pushd %DEPLOYMENT_SOURCE%
  call !BOWER_CMD! install
  IF !ERRORLEVEL! NEQ 0 goto error
  popd
)

:: 4. Run grunt build task
echo Running grunt build
if EXIST "%DEPLOYMENT_SOURCE%\Gruntfile.js" (
    :: Hotfix for grunt and npm dependencies http://stackoverflow.com/a/35153955
    pushd "%DEPLOYMENT_SOURCE%\node_modules\grunt"
    call !NPM_CMD! install glob@6.0.4 --save
    IF !ERRORLEVEL! NEQ 0 goto error
    popd
    
    pushd %DEPLOYMENT_SOURCE%
    call !GRUNT_CMD! build
    IF !ERRORLEVEL! NEQ 0 goto error
    popd
)


:: 4. KuduSync
IF /I "%IN_PLACE_DEPLOYMENT%" NEQ "1" (
  call :ExecuteCmd "%KUDU_SYNC_CMD%" -v 50 -f "%DEPLOYMENT_SOURCE%" -t "%DEPLOYMENT_TARGET%" -n "%NEXT_MANIFEST_PATH%" -p "%PREVIOUS_MANIFEST_PATH%" -i ".git;.hg;.deployment;deploy.cmd"
  IF !ERRORLEVEL! NEQ 0 goto error
)

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

:: Post deployment stub
IF DEFINED POST_DEPLOYMENT_ACTION call "%POST_DEPLOYMENT_ACTION%"
IF !ERRORLEVEL! NEQ 0 goto error

goto end

:: Execute command routine that will echo out when error
:ExecuteCmd
setlocal
set _CMD_=%*
call %_CMD_%
if "%ERRORLEVEL%" NEQ "0" echo Failed exitCode=%ERRORLEVEL%, command=%_CMD_%
exit /b %ERRORLEVEL%

:error
endlocal
echo An error has occurred during web site deployment.
call :exitSetErrorLevel
call :exitFromFunction 2>nul

:exitSetErrorLevel
exit /b 1

:exitFromFunction
()

:end
endlocal
echo Finished successfully.
