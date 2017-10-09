from lib.bibtex import BibTex
import json
from collections import defaultdict

bib = BibTex('data/SeGePae.bib', jfile='data/journals.csv', tfile='data/templates')
jsn = {}
html = ''
def write_bibtex(entry):
    if entry['ENTRYTYPE'] == 'booklet':
        entry['ENTRYTYPE'] = 'collection'
        
    out = '@'+entry['ENTRYTYPE']+'{'+entry['ID']+',\n'
    keys = []
    for k in entry:
        if k not in ['ID', 'ENTRYTYPE']:
            keys += ['    '+k+' = {'+entry[k]+'}']
    out += ',\n'.join(keys)+'\n}'
    return out

csv = {}
with open('data/SeGePae.csv') as f:
    for line in f:
        tmp = line.split('\t')
        key = tmp[3]
        kat = tmp[7]
        csv[key] = kat

all_keywords = defaultdict(int)
for key in bib:
    jsn[key] = {}
    jsn[key]['author'] = bib[key]['author_str'] or bib[key]['editor_str']
    if not bib[key]['author']:
        bib[key]['author'] = bib[key]['editor']
    jsn[key]['data'] = bib[key]
    jsn[key]['year'] = bib[key]['year']
    jsn[key]['category'] = csv[key]
    keywords_, keywords, keywordsen = bib[key]['keyword'].split(';'), [], []
    for k in keywords_:
        if ' // ' in k:
            keywords += [k.split(' // ')[0]]
            keywordsen += [k.split(' // ')[1]]
        else:
            keywords += [k]
    
    jsn[key]['keyword'] = sorted(set(keywords))
    jsn[key]['keywords_en'] = sorted(set(keywords))
    for k in keywords_:
        all_keywords[k] += 1
    jsn[key]['freetext'] = ' '.join(list(bib[key].values())).lower()
    jsn[key]['html'] = bib.format(key, template='html')
    jsn[key]['bibtex'] = write_bibtex(bib.bdb.entries_dict[key])
    print(bib[key]['keyword'])
jsn['ACTIVE'] = {}

jsn['keys'] = [key for key in bib]

with open('website/data.js', 'w') as f:
    f.write('var BIB = '+json.dumps(jsn, indent=2)+';\n')
    f.write('var KAT = '+json.dumps(csv, indent=2)+';\n')

with open('data/keywords.tsv', 'w') as f:
    f.write('KeywordDE\tKeywordEN\tOccurrence\n')
    for k, fr in sorted(all_keywords.items(), key=lambda x: x[1], reverse=True):
        if ' // ' in k:
            kd, ke = k.split(' // ')
        else:
            kd, ke = k, ''
        f.write(kd+'\t'+ke+'\t'+str(fr)+'\n')
