# sudo chroot

## Difficulty: Medium

---

## Overview

A concise, containerized CTF challenge that ships a vulnerable `sudo` build (1.9.16p2). The environment provides SSH access as an unprivileged user; participants must analyze the legacy `sudo` binary and escalate privileges to retrieve the flag.

---

## Quick-run steps

1. **Build the image**

```bash
docker build -t sudo-chroot .
```

2. **Run the container with SSH exposed**

```bash
docker run -d -p {port}:22 sudo-chroot
```

3. **Connect via SSH**

```bash
ssh ctfuser@localhost -p {port}
# password: ctfuser@123
```

---

## Objective

Locate and retrieve the flag at `/root/fl4g.txt` by leveraging the environment and the vulnerable `sudo` binary to escalate privileges.

---
