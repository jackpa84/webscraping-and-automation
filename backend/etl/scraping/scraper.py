from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import chromedriver_autoinstaller
import time

from .utils import extract_link_from_onclick


class Scraper:
    BASE_URL = "https://dje.tjsp.jus.br/cdje/consultaAvancada.do#buscaavancada"
    BASE_URL_DJE = "https://dje.tjsp.jus.br/"
    DATE_FORMAT = "%d/%m/%Y"
    SEARCH_KEYWORDS = '"RPV" E "pagamento pelo INSS"'
    JOURNAL_NAME = "caderno 3 - Judicial - 1ª Instância - Capital - Parte I"
    MAX_WAIT_TIME = 10

    def __init__(self):
        self.driver = self._setup_driver()
        self.links = set()

    def _setup_driver(self):
        chromedriver_autoinstaller.install()

        options = Options()
        options.add_argument('--headless')
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)
        options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--remote-debugging-port=9222')
        options.add_argument('--no-sandbox')
        options.add_argument('--disable-gpu')
        options.add_argument('--disable-setuid-sandbox')

        driver = webdriver.Chrome(options=options)
        return driver

    def open_page(self):
        self.driver.get(self.BASE_URL)

    def setup_filters(self):
        wait = WebDriverWait(self.driver, self.MAX_WAIT_TIME)

        # current_date = datetime.now().strftime(self.DATE_FORMAT)
        current_date = "14/11/2024"
        for date_field in ["dtInicioString", "dtFimString"]:
            date_input = wait.until(EC.presence_of_element_located((By.ID, date_field)))
            self.driver.execute_script("arguments[0].removeAttribute('readonly')", date_input)
            date_input.clear()
            date_input.send_keys(current_date)

        journal_dropdown = wait.until(EC.presence_of_element_located((By.NAME, "dadosConsulta.cdCaderno")))
        select = Select(journal_dropdown)
        select.select_by_visible_text(self.JOURNAL_NAME)

        keyword_input = self.driver.find_element(By.ID, "procura")
        keyword_input.clear()
        keyword_input.send_keys(self.SEARCH_KEYWORDS)

        search_button = self.driver.find_element(By.XPATH, "//input[@value='Pesquisar']")
        search_button.click()

    def scrape_links(self):
        wait = WebDriverWait(self.driver, self.MAX_WAIT_TIME)
        page = 1

        while True:
            rows = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "table tr.fundocinza1")))

            for idx, row in enumerate(rows, start=1):
                try:
                    link_element = row.find_element(By.CSS_SELECTOR, "a[onclick]")
                    onclick_attr = link_element.get_attribute("onclick")
                    link = extract_link_from_onclick(onclick_attr)
                    if link and link not in self.links:
                        full_link = f"{self.BASE_URL_DJE}{link}"
                        self.links.add(full_link)
                        print(f"Captured (page {page}, line {idx}): {full_link}")
                except Exception as e:
                    print(f"Error processing line {idx} on page {page}: {e}")

            try:
                next_button = self.driver.find_element(By.XPATH, "//a[contains(text(), 'Próximo')]")
                if next_button.is_displayed() and next_button.is_enabled():
                    self.driver.execute_script("arguments[0].click();", next_button)
                    page += 1
                    time.sleep(5)  # Considerar substituir por uma espera explícita
                else:
                    break
            except Exception:
                break

        if self.links:
            print(f"Total links captured: {len(self.links)}")
            self.driver.quit()
            return self.links
        else:
            print("No links captured.")
            return set()

    def close(self):
        self.driver.quit()