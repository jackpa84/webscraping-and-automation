import re

def extract_link_from_onclick(onclick_text):
    match = re.search(r"popup\('(.*?)'\)", onclick_text)
    return match.group(1) if match else None
