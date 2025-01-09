from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import Select
from datetime import datetime
import re
import time


def setup_driver():
    """Configura o driver Selenium com ajustes anti-detecção."""
    options = Options()
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option('useAutomationExtension', False)
    return webdriver.Chrome(options=options)


def extract_link_from_onclick(onclick_text):
    """Extrai o link do atributo 'onclick'."""
    match = re.search(r"popup\('(.*?)'\)", onclick_text)
    return match.group(1) if match else None


def main():
    driver = setup_driver()
    try:
        driver.get("https://dje.tjsp.jus.br/cdje/consultaAvancada.do#buscaavancada")
        wait = WebDriverWait(driver, 10)

        # Configurar as datas
        current_date = datetime.now().strftime("%d/%m/%Y")
        for date_field in ["dtInicioString", "dtFimString"]:
            date_input = wait.until(EC.presence_of_element_located((By.ID, date_field)))
            driver.execute_script("arguments[0].removeAttribute('readonly')", date_input)
            date_input.clear()
            date_input.send_keys(current_date)

        # Selecionar o caderno desejado
        journal_dropdown = wait.until(EC.presence_of_element_located((By.NAME, "dadosConsulta.cdCaderno")))
        select = Select(journal_dropdown)
        select.select_by_visible_text("caderno 3 - Judicial - 1ª Instância - Capital - Parte I")

        # Inserir palavras-chave no campo de busca
        keyword_input = driver.find_element(By.ID, "procura")
        keyword_input.clear()
        keyword_input.send_keys('"RPV" E "pagamento pelo INSS"')

        # Clicar no botão Pesquisar
        search_button = driver.find_element(By.XPATH, "//input[@value='Pesquisar']")
        search_button.click()
        time.sleep(5)

        # Capturar os resultados com paginação
        links = set()
        page = 1

        while True:
            print(f"\nCapturando links na página {page}...")
            rows = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "table tr.fundocinza1")))

            for idx, row in enumerate(rows, start=1):
                try:
                    link_element = row.find_element(By.CSS_SELECTOR, "a[onclick]")
                    onclick_attr = link_element.get_attribute("onclick")
                    link = extract_link_from_onclick(onclick_attr)
                    if link and link not in links:
                        links.add(link)
                        print(f"Resultado capturado (página {page}, linha {idx}): {link}")
                except Exception as e:
                    print(f"Erro ao processar a linha {idx} na página {page}: {e}")

            # Verificar botão "Próximo"
            try:
                next_button = driver.find_element(By.XPATH, "//a[contains(text(), 'Próximo')]")
                if next_button.is_displayed() and next_button.is_enabled():
                    driver.execute_script("arguments[0].click();", next_button)
                    page += 1
                    time.sleep(5)
                else:
                    print("Botão de próxima página desativado ou não encontrado. Fim da paginação.")
                    break
            except Exception:
                print("Botão de próxima página não encontrado. Fim da paginação.")
                break

        # Exibir resultados finais
        print(f"\nTotal de links capturados: {len(links)}")
        for link in links:
            print(link)

    finally:
        input("Pressione Enter para fechar o navegador...")
        driver.quit()


if __name__ == "__main__":
    main()
