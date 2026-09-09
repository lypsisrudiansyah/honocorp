@echo off
setlocal enabledelayedexpansion

:: ==========================================
:: Configuration Variables
:: ==========================================
set "TARGET_DIR=docs\tasks"
set "FILE_PREFIX=task"
set "FILE_EXT=.txt"

if not exist "%TARGET_DIR%" mkdir "%TARGET_DIR%"

set "P1=%~1"
set "P2=%~2"

if "%P1%"=="" (
    :: Auto-detect next available number
    set /a MAX_NUM=0
    for %%F in ("%TARGET_DIR%\%FILE_PREFIX%*%FILE_EXT%") do (
        set "fname=%%~nF"
        set "num=!fname:%FILE_PREFIX%=!"
        for /f "delims=0123456789" %%A in ("!num!") do set "num="
        if defined num (
            if !num! GTR !MAX_NUM! set /a MAX_NUM=!num!
        )
    )
    set /a START_NUM=MAX_NUM+1
    set /a END_NUM=START_NUM
    goto :PROCESS
)

:: Convert hyphens to commas for range parsing (e.g., 3-15 -> 3,15)
set "P1_CLEAN=%P1:-=,%"

:: Check if range format with comma exists (e.g. 3,15)
echo %P1_CLEAN% | findstr "," >nul
if %errorlevel%==0 (
    for /f "tokens=1,2 delims=," %%A in ("%P1_CLEAN%") do (
        set "START_NUM=%%A"
        set "END_NUM=%%B"
    )
    goto :PROCESS
)

:: Check if 2 separate arguments were provided (e.g., createTask 3 15)
if not "%P2%"=="" (
    set "START_NUM=%P1%"
    set "END_NUM=%P2%"
    goto :PROCESS
)

:: Single number parameter (e.g., createTask 3)
set "START_NUM=%P1%"
set "END_NUM=%P1%"

:PROCESS
for /L %%I in (%START_NUM%, 1, %END_NUM%) do (
    set "TARGET_FILE=%TARGET_DIR%\%FILE_PREFIX%%%I%FILE_EXT%"
    if exist "!TARGET_FILE!" (
        echo [!] Warning: File '!TARGET_FILE!' already exists.
    ) else (
        type nul > "!TARGET_FILE!"
        echo [+] Fresh file created: !TARGET_FILE!
    )
)

endlocal
