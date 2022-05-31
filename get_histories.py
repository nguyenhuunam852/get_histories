import time
import sys
import selenium.webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
import re

import warnings
warnings.filterwarnings("ignore")

if(sys.argv is None):
    raise Exception("Provide Information Please!")

if(sys.argv[2] is None or sys.argv[3] is None):
    raise Exception("Provide Username and Password Information Please!")

options = Options()
options.headless = True
#options=options
driver = selenium.webdriver.Firefox(executable_path='geckodriver.exe',options=options)



def no_accent_vietnamese(s):
    s = re.sub('[áàảãạăắằẳẵặâấầẩẫậ]', 'a', s)
    s = re.sub('[ÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬ]', 'A', s)
    s = re.sub('[éèẻẽẹêếềểễệ]', 'e', s)
    s = re.sub('[ÉÈẺẼẸÊẾỀỂỄỆ]', 'E', s)
    s = re.sub('[óòỏõọôốồổỗộơớờởỡợ]', 'o', s)
    s = re.sub('[ÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢ]', 'O', s)
    s = re.sub('[íìỉĩị]', 'i', s)
    s = re.sub('[ÍÌỈĨỊ]', 'I', s)
    s = re.sub('[úùủũụưứừửữự]', 'u', s)
    s = re.sub('[ÚÙỦŨỤƯỨỪỬỮỰ]', 'U', s)
    s = re.sub('[ýỳỷỹỵ]', 'y', s)
    s = re.sub('[ÝỲỶỸỴ]', 'Y', s)
    s = re.sub('đ', 'd', s)
    s = re.sub('Đ', 'D', s)
    return s

# print(sys.argv[4])
# print(sys.argv[5])
try:    
    #"https://ib.techcombank.com.vn/servlet/BrowserServlet"
    driver.get(sys.argv[1])     
    username = driver.find_element(by=By.XPATH, value='//*[@id="signOnName"]').send_keys(sys.argv[2])
    password = driver.find_element(by=By.XPATH, value='//*[@id="password"]').send_keys(sys.argv[3])
    click = driver.find_element(by=By.XPATH, value='/html/body/div/div[2]/div[1]/form/div/div[1]/div[3]/input').submit()
    time.sleep(5)
    
    driver.find_element(by=By.XPATH, value="/html/body/div/table/tbody/tr[1]/td/div[2]/ul/li[2]/a").click()
    driver.find_element(by=By.XPATH, value="/html/body/div/table/tbody/tr[1]/td/div[2]/ul/li[2]/a").click()
    
    time.sleep(2)
    
    click3 = driver.find_element(by=By.XPATH, value="/html/body/div/table/tbody/tr[2]/td/table/tbody/tr/td[1]/table/tbody/tr/td/div/table/tbody/tr/td[2]/table/tbody/tr/td/div/table/tbody/tr[2]/td/div[2]/div[2]/div/div[2]/form[1]/div[4]/table[2]/tbody/tr/td/table/tbody/tr/td/table/tbody/tr/td[1]/a").click()
    time.sleep(4)
    
    table = driver.find_element(by=By.XPATH, value="/html/body/div/table/tbody/tr[2]/td/table/tbody/tr/td[1]/table/tbody/tr/td/div/table/tbody/tr/td[2]/table/tbody/tr/td/div[3]/div[2]/div[1]/div/form/div/table/tbody/tr[2]/td[2]").text
    print(no_accent_vietnamese(table))
     
    driver.close()

except Exception as e:
    driver.close()
    print(e)

