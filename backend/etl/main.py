# import schedule
# import time
#
# def minha_tarefa():
#     print("Executando tarefa...")
#
# # Agenda a tarefa para executar a cada 15 minutos
# schedule.every(15).minutes.do(minha_tarefa)
#
# print("Agendamento iniciado. Pressione Ctrl+C para encerrar.")
#
# # Loop infinito para manter o agendamento rodando
# while True:
#     schedule.run_pending()
#     time.sleep(1)

from scraping.scraper import Scraper

def main():
    scraper = Scraper()
    try:
        scraper.open_page()
        scraper.setup_filters()
        scraper.scrape_links()
    finally:
        input("Pressione Enter para fechar o navegador...")
        scraper.close()

if __name__ == "__main__":
    main()
