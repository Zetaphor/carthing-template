# Updating the bootloader logo

Create an 800x480 image and rotate it 90 degrees clockwise.

Export it as a 16bit BMP with the "16bits R5 G6 B5" color depth. (GIMP->Export->BMP->Advanced options)

Copy the existing `logo.dump` file from the target firmware package.

Dump the images from the `logo.dump` file:

```sh
python aml-imgpack.py --unpack logo.dump
```

Overwrite the target images.

Repack the images into an `.img` file:

```sh
python aml-imgpack.py --pack out.img *.bmp
```

Convert the `.img` file to a `.dump` file:

```sh
dd if=out.img of=logo.dump bs=1M
```

Replace the `logo.dump` file in the target firmware package with the new one.

# Updating the boot splash

Create a PNG image with the dimensions 800x480.

First remount the filesystem as writable:

```sh
adb shell "su -c 'mount -o remount,rw /'"
```

Then push the new boot splash image to the device:

```sh
adb push image.png /usr/share/qt-superbird-app/webapp/images/appstart.png
```

Reboot the device.

```sh
adb shell "reboot"
```

# Updating the web app

Remove the existing app directory:

```sh
adb shell "su -c 'rm -rf /usr/share/qt-superbird-app/webapp'"
```

Push the new app to the device:

```sh
adb push ./appdir /usr/share/qt-superbird-app/webapp
```

Reboot the device.

```sh
adb shell "reboot"
```

# Setup SOCKS5 proxy

Forward the SOCKS5 proxy port from the device to the host:

```sh
adb reverse tcp:1080 tcp:1080
```

Configure the proxy in the browser to use `127.0.0.1:1080` by editing `/etc/supervisord.conf` and adding `--proxy-server=socks5://127.0.0.1:1080`.

# Setup system-wide socks proxy

Add the following to the `/etc/profile` file on the device:
```sh
echo 'export http_proxy=socks5h://127.0.0.1:1080
export https_proxy=socks5h://127.0.0.1:1080
export all_proxy=socks5h://127.0.0.1:1080
export SOCKS_PROXY=socks5h://127.0.0.1:1080' | tee -a /etc/profile
```

Reboot the device.

# Setup time server

Forward the time server port from the device to the host:

```sh
adb reverse tcp:8037 tcp:8037
```

# Allow Chrome to access other URLs

Edit `/etc/supervisord.conf` and modify the `--app` to be `--start-url`.

# Set the time

This is required for connecting to sites with HTTPS.

```sh
adb shell "su -c 'date $(date +%m%d%H%M%Y.%S)'"
```


# Disable superbird

If you disable superbird in `/etc/supervisord.conf`, you need to add

```sh
[program:mark_boot_success]
autostart=true
command=phb -r 1
numprocs=1
```

Otherwise the device will think it's failing to boot and will switch boot slots after 7 reboots.

# USB Terminal

If you need a terminal over something other than USB, you can drop this into a file in /etc/init.d (either make your own or drop it in an empty file like S42wifi) and it'll spawn a shell over rfcomm:

```sh
#!/bin/sh

sdptool add --channel=3 SP
mknod -m 666 /dev/rfcomm0 c 216 0
rfcomm watch /dev/rfcomm0 3 /sbin/getty 115200 rfcomm0 linux &
```

Then you can connect with `sudo rfcomm connect /dev/rfcomm0 <mac address of thing> 3` and finally open a terminal like minicom or gtk term and point it at /dev/rfcomm0.

At the login you can just put root no password