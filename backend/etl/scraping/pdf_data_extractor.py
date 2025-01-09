import re
from PyPDF2 import PdfReader

class PDFDataExtractor:
    def __init__(self, pdf_path):
        self.content = self._extract_text(pdf_path)

    def _extract_text(self, pdf_path):
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text

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
            if all(value is not None for value in process_data.values()):
                processes.append(process_data)

        return processes

    def _extract_details(self, process_text):
        data = {}

        process_number_match = re.search(r"Processo\s([\d\.\-\/]+)", process_text)
        data["Número do processo"] = process_number_match.group(1) if process_number_match else None

        author_match = re.search(r"- Auxílio-Acidente.*?-\s([\w\s]+?)(?=\s-\sVistos)", process_text)
        data["Autor(es)"] = author_match.group(1).strip() if author_match else None

        lawyer_match = re.search(r"- ADV:\s([^\(]+)\s\(OAB", process_text)
        data["Advogado(s)"] = lawyer_match.group(1).strip() if lawyer_match else None

        principal_match = re.search(r"R\$ (\d{1,3}(?:\.\d{3})*,\d{2}) - principal bruto/ líquido", process_text)
        data["Valor principal bruto/líquido"] = principal_match.group(1) if principal_match else None

        juros_match = re.search(r"R\$ (\d{1,3}(?:\.\d{3})*,\d{2}) - juros moratórios", process_text)
        data["Valor dos Juros moratórios"] = juros_match.group(1) if juros_match else None

        honorarios_match = re.search(r"R\$ (\d{1,3}(?:\.\d{3})*,\d{2}) - honorários a dvocatícios", process_text)
        data["Honorários advocatícios"] = honorarios_match.group(1) if honorarios_match else None

        data["Conteúdo"] = process_text.strip()

        return data


if __name__ == "__main__":
    pdf_path = "downloaded_document.pdf"

    extractor = PDFDataExtractor(pdf_path)
    extracted_processes = extractor.extract_processes()

    print("\nProcesses without None values:")
    for idx, process in enumerate(extracted_processes, start=1):
        print(f"\nProcess {idx}:")
        for key, value in process.items():
            print(f"  {key}: {value}")
