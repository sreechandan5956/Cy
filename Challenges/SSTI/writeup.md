### 1. Test if template code runs
Enter this into the text box:
{{ 5 + 5 }}

If the output shows:
10

then the input is being evaluated → SSTI vulnerability exists.

try:{{ h }}
The output will show something like:
<main.Helper object at 0x...>

This means a Python object named **h** is available for us to use.

Check if the object has useful functions:
{{ h.read_flag() }}
This will directly print the flag.

