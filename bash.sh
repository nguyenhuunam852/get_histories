sudo apt-get install firefox

sudo apt update
sudo apt install software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt install python3.9
sudo apt install python3-pip

wget https://github.com/mozilla/geckodriver/releases/download/v0.31.0/geckodriver-v0.31.0-linux64.tar.gz
sudo sh -c 'tar -x geckodriver -zf geckodriver-v0.31.0-linux64.tar.gz -O > /usr/bin/geckodriver'
sudo chmod +x /usr/bin/geckodriver
rm geckodriver-v0.23.0-linux64.tar.gz


pip3 install selenium

snap install chronium
sudo apt install --assume-yes chromium-browser