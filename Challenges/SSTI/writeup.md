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










# SSTI Vulnerability Testing Guide

This guide helps you quickly determine whether a web application is vulnerable to **Server-Side Template Injection (SSTI)** and how to leverage exposed objects for exploitation.

---

## 📌 1. Test if the template engine evaluates expressions

In any input field (search bar, textbox, comment box, etc.), enter:

{{ 5 + 5 }}


### ✅ Expected Output (if SSTI exists):


If you see the result evaluated instead of being treated as plain text, the application is vulnerable to SSTI.

---

## 📌 2. Check for exposed Python objects

Next, try inspecting available objects:

{{ h }}

### ✅ Expected Output Example:

<main.Helper object at 0x...>


This confirms that a Python object named **h** is accessible inside the template environment.

---

## 📌 3. Attempt to use exposed methods

If the object has useful functions, try calling them:

{{ h.read_flag() }}


### 🔥 If vulnerable, this will directly output the flag or sensitive data.

---

## ⚠️ Disclaimer  
This guide is for **educational and authorized security testing only**.  
Do **NOT** test any system without explicit permission.

---

## 🛠️ Author  
Security testing helper guide for identifying SSTI vulnerabilities.



