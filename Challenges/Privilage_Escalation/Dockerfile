FROM ubuntu:24.04

# Install dependencies including OpenSSH server
RUN apt-get update && \
    apt-get install -y build-essential wget libpam0g-dev libselinux1-dev zlib1g-dev \
        pkg-config libssl-dev git ca-certificates openssh-server && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /opt

# Download and build sudo
RUN wget https://www.sudo.ws/dist/sudo-1.9.16p2.tar.gz && \
    tar xzf sudo-1.9.16p2.tar.gz && \
    cd sudo-1.9.16p2 && \
    ./configure --disable-gcrypt --prefix=/usr && \
    make && \
    make install

# Create the flag file
RUN echo 'CTF{F1nd_M3}' > /root/fl4g.txt && chmod 600 /root/fl4g.txt

# Create CTF user with password
RUN useradd -m -s /bin/sh ctfuser && \
    echo "ctfuser:ctfuser@123" | chpasswd

# (Optional) Set root password if you want root login enabled
RUN echo "root:rootpassword" | chpasswd

# Prepare SSH
RUN mkdir /run/sshd && \
    sed -i 's/^#\?PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config && \
    sed -i 's/^#\?PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
    echo "AllowUsers ctfuser" >> /etc/ssh/sshd_config

# Expose SSH port
EXPOSE 22

# Run SSH daemon
CMD ["/usr/sbin/sshd", "-D"]
