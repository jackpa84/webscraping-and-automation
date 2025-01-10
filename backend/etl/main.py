import os

import schedule
import time

from scraping.pdf_data_extractor import PDFDataExtractor
from scraping.pdf_downloader import PDFDownloader
from scraping.scraper import Scraper


def main():
    scraper = Scraper()

    pdf_downloader = PDFDownloader()
    try:
        scraper.open_page()
        scraper.setup_filters()
        links = scraper.scrape_links()
        if len(links) > 0:
            print(f"Total de links para download: {len(links)}")
            for idx, link in enumerate(links):
                path = f"tmp/downloaded_document_{idx}.pdf"
                save_path = os.path.join(os.getcwd(), path)
                pdf_downloader.download_pdf(link, save_path)
                PDFDataExtractor(path)
                pdf_downloader.remove_file(save_path)

        else:
            print("Nenhum link encontrado para download.")
    finally:
        scraper.close()
        pdf_downloader.close()

    print("Processo concluido.")


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


# links = {'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3824',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3792',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3873',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3771',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3773',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3859',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3804',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3869',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3828',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3770',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3870',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3795',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3798',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3756',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3799',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3802',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3772',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3871',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3821',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3774',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3872',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3829',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3794',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3800',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3765',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3793',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3861',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3801',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3805',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3876',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3796',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3797',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3791',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3803',
#  'https://dje.tjsp.jus.br//cdje/consultaSimples.do?cdVolume=19&nuDiario=4093&cdCaderno=12&nuSeqpagina=3860'}

if __name__ == "__main__":
    main()
