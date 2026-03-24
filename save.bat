@echo off
REM Quick-save for MotionCalc — wraps save.ps1
REM Usage:  save                     (will prompt for message)
REM         save "fix belt ratio"    (inline message)
powershell -ExecutionPolicy Bypass -File "%~dp0save.ps1" %*
