from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select
from datetime import datetime
import time

from backend.etl.scraping.utils import extract_link_from_onclick
from backend.etl.config.setting import (
    BASE_URL,
    BASE_URL_DJE,
    DATE_FORMAT,
    SEARCH_KEYWORDS,
    JOURNAL_NAME,
    MAX_WAIT_TIME
)


class Scraper:
    def __init__(self):
        self.driver = self._setup_driver()
        self.links = set()

    def _setup_driver(self):
        options = Options()
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)
        return webdriver.Chrome(options=options)

    def open_page(self):
        self.driver.get(BASE_URL)

    def setup_filters(self):
        wait = WebDriverWait(self.driver, MAX_WAIT_TIME)

        current_date = datetime.now().strftime(DATE_FORMAT)
        for date_field in ["dtInicioString", "dtFimString"]:
            date_input = wait.until(EC.presence_of_element_located((By.ID, date_field)))
            self.driver.execute_script("arguments[0].removeAttribute('readonly')", date_input)
            date_input.clear()
            date_input.send_keys(current_date)

        journal_dropdown = wait.until(EC.presence_of_element_located((By.NAME, "dadosConsulta.cdCaderno")))
        select = Select(journal_dropdown)
        select.select_by_visible_text(JOURNAL_NAME)

        keyword_input = self.driver.find_element(By.ID, "procura")
        keyword_input.clear()
        keyword_input.send_keys(SEARCH_KEYWORDS)

        search_button = self.driver.find_element(By.XPATH, "//input[@value='Pesquisar']")
        search_button.click()

    def scrape_links(self):
        wait = WebDriverWait(self.driver, MAX_WAIT_TIME)
        page = 1
        first_link = None

        while True:
            rows = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "table tr.fundocinza1")))

            for idx, row in enumerate(rows, start=1):
                try:
                    link_element = row.find_element(By.CSS_SELECTOR, "a[onclick]")
                    onclick_attr = link_element.get_attribute("onclick")
                    link = extract_link_from_onclick(onclick_attr)
                    if link and link not in self.links:
                        self.links.add(link)
                        if not first_link:
                            first_link = f"{BASE_URL_DJE}{link}"
                        print(f"Captured (page {page}, line {idx}): {link}")
                except Exception as e:
                    print(f"Error processing line {idx} on page {page}: {e}")

            try:
                next_button = self.driver.find_element(By.XPATH, "//a[contains(text(), 'Próximo')]")
                if next_button.is_displayed() and next_button.is_enabled():
                    self.driver.execute_script("arguments[0].click();", next_button)
                    page += 1
                    time.sleep(5)
                else:
                    break
            except Exception:
                break

        if first_link:
            self.driver.get(first_link)
            print(f"Accessing first link: {first_link}")
        else:
            print("No links captured.")

    def close(self):
        self.driver.quit()
