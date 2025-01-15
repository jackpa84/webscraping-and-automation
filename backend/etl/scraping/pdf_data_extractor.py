import locale
import os
import re
from typing import Optional, Match
from datetime import datetime
from PyPDF2 import PdfReader
from databases.mongodb import add_process


class PDFDataExtractor:
    STATUS_NEW = "new"
    DEFENDANT = "Instituto Nacional do Seguro Social - INSS"
    MONTHS_PT = {
        "janeiro": "January", "fevereiro": "February", "março": "March", "abril": "April",
        "maio": "May", "junho": "June", "julho": "July", "agosto": "August",
        "setembro": "September", "outubro": "October", "novembro": "November", "dezembro": "December"
    }
    WEEKDAYS_PT = {
        "segunda-feira": "Monday", "terça-feira": "Tuesday", "quarta-feira": "Wednesday",
        "quinta-feira": "Thursday", "sexta-feira": "Friday", "sábado": "Saturday", "domingo": "Sunday"
    }

    def __init__(self, pdf_path):
        self.pdf_path = pdf_path
        self.content = self._extract_text()
        self.availability_date = self.extract_availability_date()
        self.processes = self.extract_processes()

    def _extract_text(self):
        try:
            reader = PdfReader(self.pdf_path)
            text = ""
            for page in reader.pages:
                extracted_text = page.extract_text()
                if extracted_text:
                    text += extracted_text
            return text
        except Exception as e:
            print(f"An error occurred while extracting text from {self.pdf_path}: {e}")
            return ""

    def extract_availability_date(self):
        match = re.search(r"Disponibilização:\s+([\w-]+, \d{1,2} de \w+ de \d{4})", self.content)
        if match:
            raw_date = match.group(1)
            try:
                for pt, en in self.MONTHS_PT.items():
                    raw_date = raw_date.replace(pt, en)
                for pt, en in self.WEEKDAYS_PT.items():
                    raw_date = raw_date.replace(pt, en)

                parsed_date = datetime.strptime(raw_date, '%A, %d de %B de %Y')
                return parsed_date
            except ValueError as e:
                print(f"Error parsing data '{raw_date}': {e}")
        return None

    def extract_processes(self):
        normalized_content = re.sub(r"\s+", " ", self.content)
        process_pattern = re.compile(
            r"(Processo\s[\d\.\-\/]+.*?)(?=Processo|\Z)",
            re.DOTALL
        )
        matches = process_pattern.findall(normalized_content)

        processes = []
        for match in matches:
            process_data = self._extract_details(match)
            process_data["availability_date"] = self.availability_date

            required_fields = [
                "process_number",
                "authors",
                "lawyers",
                "gross_net_principal_amount",
                "late_interest_amount",
                "attorney_fees"
            ]

            if all(process_data.get(field) not in [None, ""] for field in required_fields):
                processes.append(process_data)
                add_process(process_data)
                print("Processo inserido:", process_data)
                os.remove(self.pdf_path)

        return processes

    def extract_decimal(self, pattern: str, process_text: str) -> Optional[float]:
        match: Optional[Match[str]] = re.search(pattern, process_text)
        if match:
            value = match.group(1).replace('.', '').replace(',', '.')
            try:
                return float(value)
            except ValueError as e:
                print(f"Erro ao converter valor '{value}' para float: {e}")
        return None

    def _extract_details(self, process_text):
        data = {}

        process_number_match = re.search(r"Processo\s([\d\.\-\/]+)", process_text)
        data["process_number"] = process_number_match.group(1) if process_number_match else None

        # Ajuste na regex conforme o formato esperado, garantindo que não retorne string vazia.
        author_match = re.search(r"- Auxílio-Acidente.*?-\s([\w\s]+?)(?=\s-\sVistos)", process_text)
        data["authors"] = author_match.group(1).strip() if author_match and author_match.group(1).strip() else None

        line_pattern = r"-\s*ADV:\s+(.+?)(?=$|\n-\s*ADV:|-\s*ADV:)"
        adv_blocks = re.findall(line_pattern, process_text, flags=re.DOTALL)

        all_attorneys = []
        for block in adv_blocks:
            attorneys_found = re.findall(r"([^,;]+?)\(\s*OAB\s*([^)]*)\)", block)
            for name, oab in attorneys_found:
                name = name.strip()
                all_attorneys.append(name)

        data["lawyers"] = ", ".join(all_attorneys).strip() if all_attorneys else None

        data["gross_net_principal_amount"] = self.extract_decimal(
            r"R\$ (\d{1,3}(?:\.\d{3})*,\d{2})\s*-\s*principal\s+bruto/\s+líquido", process_text)
        data["late_interest_amount"] = self.extract_decimal(
            r"R\$ (\d{1,3}(?:\.\d{3})*,\d{2})\s*-\s*juros\s+moratórios", process_text)
        data["attorney_fees"] = self.extract_decimal(
            r"R\$ (\d{1,3}(?:\.\d{3})*,\d{2})\s*-\s*honorários.*?advocatícios", process_text)

        data["status"] = self.STATUS_NEW
        data["defendant"] = self.DEFENDANT
        data["content"] = process_text.strip()

        return data
